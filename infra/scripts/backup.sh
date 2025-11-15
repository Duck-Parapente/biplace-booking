#!/bin/bash
set -e

# ----------- PATH SETUP -----------
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$INFRA_DIR/.env"

# ----------- LOAD .env CONFIG -----------
if [ ! -f "$ENV_FILE" ]; then
    echo "Missing .env file at: $ENV_FILE"
    exit 1
fi

export $(grep -v '^#' "$ENV_FILE" | xargs)

if [ -z "$ENV" ] || [ -z "$POSTGRES_DB" ] || [ -z "$POSTGRES_USER" ]; then
    echo "Missing required variables in .env (ENV, POSTGRES_DB, POSTGRES_USER)"
    exit 1
fi

# ----------- BUILD VARIABLES -----------
DATE=$(date +%Y_%m_%d_%H%M%S)
BACKUP_DIR="/var/backups/db"

CONTAINER="bb-${ENV}-postgres"
REMOTE="gdrive:backup_biplace_${ENV}"

DUMP_NAME="dump_${DATE}.sql"
LOCAL_FILE="$BACKUP_DIR/$DUMP_NAME"
COMPRESSED_FILE="${LOCAL_FILE}.gz"

ENV_BACKUP_NAME="env_${DATE}.env"
LOCAL_ENV_FILE="$BACKUP_DIR/$ENV_BACKUP_NAME"
COMPRESSED_ENV_FILE="${LOCAL_ENV_FILE}.gz"

echo "----- BACKUP STARTED -----"
echo "Environment:   $ENV"
echo "Container:     $CONTAINER"
echo "DB User:       $POSTGRES_USER"
echo "DB Name:       $POSTGRES_DB"
echo "Remote Folder: $REMOTE"
echo "----------------------------------------"

# ----------- CLEAN LOCAL BACKUP DIR -----------
echo "Cleaning backup directory: $BACKUP_DIR"
rm -rf "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# ----------- DATABASE BACKUP -----------
echo "Running pg_dump..."
docker exec "$CONTAINER" pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$LOCAL_FILE"

echo "Compressing database backup..."
gzip -f "$LOCAL_FILE"

# ----------- .ENV BACKUP -----------
echo "Backing up .env file..."
cp "$ENV_FILE" "$LOCAL_ENV_FILE"
gzip -f "$LOCAL_ENV_FILE"

# ----------- UPLOAD TO GOOGLE DRIVE -----------
echo "Uploading database and .env backup to Google Drive..."
rclone copy "$COMPRESSED_FILE" "$REMOTE"
rclone copy "$COMPRESSED_ENV_FILE" "$REMOTE"

# ----------- DELETE OLD REMOTE FILES -----------
echo "Deleting remote backups older than 7 days..."
rclone delete "$REMOTE" --min-age 7d

echo "Backup completed successfully!"
echo "Database backup: $COMPRESSED_FILE"
echo ".env backup:     $COMPRESSED_ENV_FILE"
echo "----------------------------------------"
echo "----- BACKUP FINISHED -----"