#!/bin/bash
set -e

echo "=== DigiCoord Deploy ==="

cd /opt/digi-coord

echo "Installing dependencies..."
npm ci --production

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing database schema..."
npx prisma db push

echo "Building..."
npm run build

echo "Restarting application..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

echo "Deploy complete!"
