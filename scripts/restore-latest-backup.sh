#!/bin/sh
set -e

LATEST_BACKUP="$(ls -1 /backups/portfolio_db_*.sql 2>/dev/null | sort | tail -n 1 || true)"

if [ -z "$LATEST_BACKUP" ]; then
  echo "No SQL backup found in /backups. Starting with a fresh database."
  exit 0
fi

echo "Restoring database from backup: $LATEST_BACKUP"
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$LATEST_BACKUP"
echo "Database restore finished."
