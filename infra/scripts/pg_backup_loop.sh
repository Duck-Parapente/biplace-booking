#!/usr/bin/env bash
# Run via: docker compose --profile prod exec postgres bash /usr/local/bin/pg_backup_loop.sh
set -euo pipefail

BACKUP_DIR=/backups
mkdir -p "$BACKUP_DIR"

# Basic env validation
: "${POSTGRES_USER:?POSTGRES_USER not set}"
: "${POSTGRES_DB:?POSTGRES_DB not set}"

TS=$(date +%Y-%m-%d_%H-%M-%S)
FILE="$BACKUP_DIR/backup_${TS}.dump"

echo "[Backup] $(date) Creating backup: $FILE"
pg_dump -h postgres -U "$POSTGRES_USER" "$POSTGRES_DB" -F c -b -v -f "$FILE"

echo "[Backup] Rotation: keeping last 7 backups"
ls -1t "$BACKUP_DIR"/backup_*.dump 2>/dev/null | tail -n +8 | xargs -r rm --

echo "[Backup] Completed single run"
