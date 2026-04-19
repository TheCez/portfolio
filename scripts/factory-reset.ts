import "dotenv/config";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for factory reset.");
}

async function resetDatabase() {
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    await client.query("DROP SCHEMA IF EXISTS public CASCADE;");
    await client.query("CREATE SCHEMA public;");
    console.log("Database schema reset.");
  } finally {
    client.release();
    await pool.end();
  }
}

async function resetStorage() {
  const endpoint = process.env.STORAGE_ENDPOINT;
  const region = process.env.STORAGE_REGION;
  const bucket = process.env.STORAGE_BUCKET;
  const accessKeyId = process.env.STORAGE_ACCESS_KEY;
  const secretAccessKey = process.env.STORAGE_SECRET_KEY;

  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
    console.log("Storage env vars missing. Skipping media reset.");
    return;
  }

  const s3 = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  try {
    await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        MaxKeys: 1,
      }),
    );
  } catch (error) {
    const code = typeof error === "object" && error && "name" in error ? String(error.name) : "";
    if (code === "NoSuchBucket" || code === "NotFound") {
      console.log("Storage bucket does not exist yet. Skipping media reset.");
      return;
    }
    throw error;
  }

  let continuationToken: string | undefined;

  do {
    const page = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
      }),
    );

    const objects = (page.Contents ?? [])
      .map((item) => item.Key)
      .filter((key): key is string => Boolean(key))
      .map((key) => ({ Key: key }));

    if (objects.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objects },
        }),
      );
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  console.log("Storage bucket cleared.");
}

async function verifyConnection() {
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$queryRaw`SELECT 1`;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

async function main() {
  await verifyConnection();
  await resetDatabase();
  await resetStorage();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
