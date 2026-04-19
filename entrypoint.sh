#!/bin/sh
set -e

# Parse the DB URL to extract connection details for psql
DB_URL=${DATABASE_URL}
DB_HOST=$(echo "$DB_URL" | sed 's|.*@\([^:/]*\).*|\1|')
DB_PORT=$(echo "$DB_URL" | sed 's|.*:\([0-9]*\)/.*|\1|')
DB_NAME=$(echo "$DB_URL" | sed 's|.*/\([^?]*\).*|\1|')
DB_USER=$(echo "$DB_URL" | sed 's|.*://\([^:]*\):.*|\1|')
DB_PASS=$(echo "$DB_URL" | sed 's|.*://[^:]*:\([^@]*\)@.*|\1|')

# Wait for postgres to actually be ready before doing anything
until PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; do
  echo "Waiting for database to accept connections..."
  sleep 2
done
echo "Database is ready."

# ── FACTORY RESET ────────────────────────────────────────────────────────────
# Set FACTORY_RESET=true in docker-compose.yml environment to wipe all data
# and start completely fresh. Remove or set to false after reset.
case "$(echo "${FACTORY_RESET:-}" | tr '[:upper:]' '[:lower:]')" in
  1|true|yes|y|on)
    echo "⚠️  FACTORY_RESET detected. Dropping and recreating public schema..."
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
      -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;" 2>/dev/null || true
    echo "All data wiped. Schema will be recreated fresh."
    ;;
  *)
    ;;
esac
# ─────────────────────────────────────────────────────────────────────────────

# Check if admin user exists using psql directly (silently fails if no tables yet)
USER_COUNT=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c 'SELECT COUNT(*) FROM "User";' 2>/dev/null | tr -d ' \n' || echo "0")

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
  echo "No admin found. Pushing schema and seeding database..."
  npx prisma db push --accept-data-loss
  npx ts-node --compiler-options="{\"module\":\"CommonJS\"}" prisma/seed.ts || echo "Seed script skipped or failed."
else
  echo "Admin account exists ($USER_COUNT user(s)). Skipping schema push and seed."
fi

echo "Starting Next.js..."
exec node server.js
