#!/bin/sh
set -e

echo "Waiting for database to connect..."

# Optional: Add a simple loop to wait for postgres to be ready (requires pg_isready)
# But standard npx prisma db push will fail if db is not up, so Next.js's restart: always handles retries naturally

echo "Applying Prisma Schema migrations..."
npx prisma db push --accept-data-loss

echo "Seeding the database..."
npx ts-node --compiler-options="{\"module\":\"CommonJS\"}" prisma/seed.ts || echo "Seed script skipped or failed."

echo "Starting Next.js..."
exec node server.js
