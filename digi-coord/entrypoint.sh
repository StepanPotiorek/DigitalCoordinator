#!/bin/sh
set -e

# If the mounted volume is empty, seed it with the pre-initialized database
if [ ! -f /app/data/prod.db ]; then
  echo "→ Initializing database from seed..."
  cp /app/initial-data/prod.db /app/data/prod.db
  echo "→ Database ready."
fi

echo "→ Starting app..."
exec node server.js
