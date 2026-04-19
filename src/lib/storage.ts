import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function getStorageConfig() {
  const endpoint = process.env.STORAGE_ENDPOINT;
  const region = process.env.STORAGE_REGION || "us-east-1";
  const accessKeyId = process.env.STORAGE_ACCESS_KEY;
  const secretAccessKey = process.env.STORAGE_SECRET_KEY;
  const bucket = process.env.STORAGE_BUCKET || "portfolio-media";

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
  };
}

export function isStorageConfigured() {
  return Boolean(getStorageConfig());
}

function getClient() {
  const config = getStorageConfig();
  if (!config) {
    throw new Error("Storage is not configured.");
  }

  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

async function ensureBucket() {
  const config = getStorageConfig();
  if (!config) {
    throw new Error("Storage is not configured.");
  }

  const client = getClient();

  try {
    await client.send(new HeadBucketCommand({ Bucket: config.bucket }));
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: config.bucket }));
  }
}

function sanitizeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
}

export async function uploadFileToStorage(file: File, folder: string) {
  const config = getStorageConfig();
  if (!config) {
    throw new Error("Storage is not configured.");
  }

  await ensureBucket();

  const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const key = `${folder}/${crypto.randomUUID()}-${sanitizeFileName(file.name.replace(ext, ""))}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    }),
  );

  return `/api/media/${key}`;
}

export async function getMediaObject(key: string) {
  const config = getStorageConfig();
  if (!config) {
    throw new Error("Storage is not configured.");
  }

  const client = getClient();
  return client.send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
}
