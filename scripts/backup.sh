#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/digi-coord"
DB_DIR="/opt/digi-coord/data"

mkdir -p "$BACKUP_DIR"

if [ -f "$DB_DIR/prod.db" ]; then
  cp "$DB_DIR/prod.db" "$BACKUP_DIR/prod.db.$TIMESTAMP"
  echo "Backup created: $BACKUP_DIR/prod.db.$TIMESTAMP"
else
  echo "No database found at $DB_DIR/prod.db"
  exit 1
fi

ls -t "$BACKUP_DIR/prod.db.*" 2>/dev/null | tail -n +31 | xargs -r rm
echo "Cleaned up old backups (kept last 30)"
