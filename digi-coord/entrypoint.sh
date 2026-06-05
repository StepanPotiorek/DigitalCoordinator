#!/bin/sh
set -e

# Ensure data directory is writable by the nextjs user
chown nextjs:nodejs /app/data
chmod 755 /app/data
chown -R nextjs:nodejs /app/public/uploads

# If the mounted volume is empty, seed it with the pre-initialized database
if [ ! -f /app/data/prod.db ]; then
  echo "→ Initializing database from seed..."
  cp /app/initial-data/prod.db /app/data/prod.db
  chown nextjs:nodejs /app/data/prod.db
  echo "→ Database ready."
fi

# Always ensure schema is up-to-date (adds missing columns/tables from new deployments)
echo "→ Running schema migration..."
su -s /bin/sh nextjs -c 'node /app/node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate'
echo "→ Database schema up-to-date."

echo "→ Starting app..."
exec su -s /bin/sh nextjs -c 'exec node /app/server.js'
