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

# ----------- INPUT VALIDATION -----------
if [ -z "$1" ]; then
    echo "Usage: $0 <absolute-path-to-dump.sql.gz>"
    echo "Example: $0 /var/backups/db/dump_2025_11_21_120000.sql.gz"
    exit 1
fi

DUMP_ARCHIVE="$1"

if [ ! -f "$DUMP_ARCHIVE" ]; then
    echo "Error: Dump file not found at: $DUMP_ARCHIVE"
    exit 1
fi

if [[ ! "$DUMP_ARCHIVE" == *.gz ]]; then
    echo "Error: Dump file must be a .gz archive"
    exit 1
fi

# ----------- BUILD VARIABLES -----------
CONTAINER="bb-${ENV}-postgres"
TEMP_DIR="/tmp/db_restore_$$"
DUMP_FILE="${DUMP_ARCHIVE%.gz}"
DUMP_BASENAME=$(basename "$DUMP_FILE")

echo "----- LOAD DUMP STARTED -----"
echo "Environment:    $ENV"
echo "Container:      $CONTAINER"
echo "DB User:        $POSTGRES_USER"
echo "DB Name:        $POSTGRES_DB"
echo "Dump Archive:   $DUMP_ARCHIVE"
echo "----------------------------------------"

# ----------- CREATE TEMP DIRECTORY -----------
echo "Creating temporary directory..."
mkdir -p "$TEMP_DIR"

# ----------- UNZIP ARCHIVE -----------
echo "Unzipping dump archive..."
gunzip -c "$DUMP_ARCHIVE" > "$TEMP_DIR/$DUMP_BASENAME"

# ----------- DROP DATABASE -----------
echo "Dropping database '$POSTGRES_DB'..."
docker exec "$CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DROP DATABASE IF EXISTS $POSTGRES_DB;"

# ----------- CREATE DATABASE -----------
echo "Creating database '$POSTGRES_DB'..."
docker exec "$CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE $POSTGRES_DB;"

# ----------- LOAD DUMP -----------
echo "Loading dump into database..."
docker exec -i "$CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$TEMP_DIR/$DUMP_BASENAME"

# ----------- CLEANUP -----------
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "----------------------------------------"
echo "----- LOAD DUMP FINISHED -----"
echo "Database '$POSTGRES_DB' has been successfully restored from dump."
