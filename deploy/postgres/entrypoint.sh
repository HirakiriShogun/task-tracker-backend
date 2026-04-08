#!/usr/bin/env bash
set -Eeuo pipefail

export PGDATA="${PGDATA:-/var/lib/postgresql/data}"
export POSTGRES_DB="${POSTGRES_DB:-task_tracker}"
export POSTGRES_USER="${POSTGRES_USER:-task_tracker}"
export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-task_tracker}"

mkdir -p "$PGDATA"
chown -R postgres:postgres "$PGDATA"

ensure_pg_hba() {
  local pg_hba_file="$PGDATA/pg_hba.conf"

  touch "$pg_hba_file"

  if ! grep -q 'host all all 0.0.0.0/0 scram-sha-256' "$pg_hba_file"; then
    printf '\nhost all all 0.0.0.0/0 scram-sha-256\n' >>"$pg_hba_file"
  fi

  if ! grep -q 'host all all ::/0 scram-sha-256' "$pg_hba_file"; then
    printf 'host all all ::/0 scram-sha-256\n' >>"$pg_hba_file"
  fi
}

run_psql() {
  PGPASSWORD='' psql \
    -h 127.0.0.1 \
    -p 5432 \
    -U postgres \
    -d postgres \
    -v ON_ERROR_STOP=1 \
    "$@"
}

if [ ! -s "$PGDATA/PG_VERSION" ]; then
  su postgres -c "/usr/lib/postgresql/15/bin/initdb -D '$PGDATA' --username=postgres --auth-local=trust --auth-host=trust"
  ensure_pg_hba

  su postgres -c "/usr/lib/postgresql/15/bin/pg_ctl -D '$PGDATA' -w -o \"-c listen_addresses='127.0.0.1' -c unix_socket_directories=''\" start"

  run_psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${POSTGRES_USER}') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', '${POSTGRES_USER}', '${POSTGRES_PASSWORD}');
  ELSE
    EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', '${POSTGRES_USER}', '${POSTGRES_PASSWORD}');
  END IF;
END
\$\$;
SQL

  DB_EXISTS="$(run_psql -tAc "SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB}'")"

  if [ "$DB_EXISTS" != "1" ]; then
    run_psql -c "CREATE DATABASE \"${POSTGRES_DB}\" OWNER \"${POSTGRES_USER}\""
  fi

  su postgres -c "/usr/lib/postgresql/15/bin/pg_ctl -D '$PGDATA' -m fast -w stop"
fi

ensure_pg_hba

exec su postgres -c "/usr/lib/postgresql/15/bin/postgres -D '$PGDATA' -c listen_addresses='0.0.0.0' -c unix_socket_directories=''"
