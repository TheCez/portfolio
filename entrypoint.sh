#!/bin/sh
set -e

RUNTIME_DIR=${APP_RUNTIME_DIR:-/app/runtime}
SECRET_FILE="$RUNTIME_DIR/nextauth_secret"

if [ "$(id -u)" = "0" ] && [ "${ENTRYPOINT_PRIV_DROPPED:-0}" != "1" ]; then
  mkdir -p "$RUNTIME_DIR"

  if [ -n "${NEXTAUTH_SECRET:-}" ]; then
    printf "%s" "$NEXTAUTH_SECRET" > "$SECRET_FILE"
    echo "NEXTAUTH_SECRET provided via environment and synced to runtime storage."
  elif [ -f "$SECRET_FILE" ]; then
    NEXTAUTH_SECRET="$(cat "$SECRET_FILE")"
    export NEXTAUTH_SECRET
    echo "Loaded NEXTAUTH_SECRET from runtime storage."
  else
    NEXTAUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
    export NEXTAUTH_SECRET
    printf "%s" "$NEXTAUTH_SECRET" > "$SECRET_FILE"
    echo "Generated persistent NEXTAUTH_SECRET in runtime storage."
  fi

  chmod 700 "$RUNTIME_DIR" || true
  chmod 600 "$SECRET_FILE" || true
  chown -R nextjs:nodejs "$RUNTIME_DIR" || true

  exec su-exec nextjs env ENTRYPOINT_PRIV_DROPPED=1 NEXTAUTH_SECRET="$NEXTAUTH_SECRET" sh ./entrypoint.sh
fi

if [ -z "${NEXTAUTH_SECRET:-}" ] && [ -f "$SECRET_FILE" ]; then
  export NEXTAUTH_SECRET="$(cat "$SECRET_FILE")"
fi

DB_URL=${DATABASE_URL}
DB_HOST=$(echo "$DB_URL" | sed 's|.*@\([^:/]*\).*|\1|')
DB_PORT=$(echo "$DB_URL" | sed 's|.*:\([0-9]*\)/.*|\1|')
DB_NAME=$(echo "$DB_URL" | sed 's|.*/\([^?]*\).*|\1|')
DB_USER=$(echo "$DB_URL" | sed 's|.*://\([^:]*\):.*|\1|')
DB_PASS=$(echo "$DB_URL" | sed 's|.*://[^:]*:\([^@]*\)@.*|\1|')

until PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; do
  echo "Waiting for database to accept connections..."
  sleep 2
done
echo "Database is ready."

RESET_MARKER="/tmp/factory-reset-complete"

case "$(echo "${FACTORY_RESET:-}" | tr '[:upper:]' '[:lower:]')" in
  1|true|yes|y|on)
    if [ -f "$RESET_MARKER" ]; then
      echo "FACTORY_RESET already completed for this container instance. Skipping repeated reset."
    else
      echo "FACTORY_RESET detected. Wiping database schema and uploaded media..."
      npx ts-node --compiler-options="{\"module\":\"CommonJS\"}" ./scripts/factory-reset.ts
      touch "$RESET_MARKER"
    fi
    ;;
  *)
    ;;
esac

echo "Applying Prisma schema..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
npx ts-node --compiler-options="{\"module\":\"CommonJS\"}" prisma/seed.ts || echo "Seed script skipped or failed."

echo "Starting Next.js..."
exec node server.js
