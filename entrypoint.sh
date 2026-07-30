#!/bin/sh
set -e

# Ensure data directory is writable
chmod 777 /app/data
chmod -R 777 /app/public/uploads

# If the mounted volume is empty, seed it with the pre-initialized database
if [ ! -f /app/data/prod.db ]; then
  echo "→ Initializing database from seed..."
  cp /app/initial-data/prod.db /app/data/prod.db
  echo "→ Database ready."
fi

# Always ensure schema is up-to-date (adds missing columns/tables from new deployments)
echo "→ Running schema migration..."
npx prisma db push --accept-data-loss --skip-generate
echo "→ Database schema up-to-date."

echo "→ Starting app..."
exec node server.js
