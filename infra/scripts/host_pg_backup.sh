#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/infra/backups"
mkdir -p "$BACKUP_DIR"

# Load .env if present (export variables)
if [[ -f "$PROJECT_ROOT/.env" ]]; then
  set -a
  . "$PROJECT_ROOT/.env"
  set +a
fi

: "${POSTGRES_USER:?POSTGRES_USER not set}"
: "${POSTGRES_DB:?POSTGRES_DB not set}"
: "${POSTGRES_PORT:?POSTGRES_PORT not set}"

TS="$(date +%Y-%m-%d_%H-%M-%S)"
FILE="$BACKUP_DIR/backup_${TS}.dump"

echo "[Host Backup] $(date) Creating backup: $FILE"
pg_dump -h 127.0.0.1 -p "${POSTGRES_PORT}" -U "${POSTGRES_USER}" "${POSTGRES_DB}" -F c -b -v -f "${FILE}"

echo "[Host Backup] Rotation: keeping last 7 backups"
ls -1t "$BACKUP_DIR"/backup_*.dump 2>/dev/null | tail -n +8 | xargs -r rm --

echo "[Host Backup] Done"
