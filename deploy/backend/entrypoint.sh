#!/usr/bin/env bash
set -Eeuo pipefail

DATABASE_URL_VALUE="${DATABASE_URL:?DATABASE_URL is required}"

wait_for_database() {
  local attempts=0

  until pg_isready --dbname="$DATABASE_URL_VALUE" >/dev/null 2>&1; do
    attempts=$((attempts + 1))

    if [ "$attempts" -ge 30 ]; then
      echo "Database is not ready after multiple attempts" >&2
      exit 1
    fi

    sleep 2
  done
}

schema_initialized() {
  psql "$DATABASE_URL_VALUE" -tAc "SELECT to_regclass('public.\"User\"') IS NOT NULL" | tr -d '[:space:]'
}

apply_migrations() {
  for file in /app/prisma/migrations/*/migration.sql; do
    psql "$DATABASE_URL_VALUE" -v ON_ERROR_STOP=1 -f "$file"
  done
}

wait_for_database

if [ "$(schema_initialized)" != "t" ]; then
  apply_migrations
fi

exec node dist/main
