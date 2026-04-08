#!/usr/bin/env sh
set -eu

docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
