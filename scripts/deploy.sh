#!/bin/bash
set -euo pipefail

SERVER="ubuntu@89.168.123.99"
SSH_KEY="/home/stepan/.ssh/oracle-server"
APP_DIR="/home/ubuntu/DigitalCoordinator/digi-coord"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no"

if [ ! -f "$SSH_KEY" ]; then
  echo "SSH key not found at $SSH_KEY"
  exit 1
fi

# Ensure we are in project root
if [ ! -f "package.json" ] || [ ! -d ".next" ]; then
  echo "Run this script from the project root (digi-coord/)"
  exit 1
fi

echo "=== DigiCoord Deploy ==="

echo "1/6 Build (auto-SW-version + static verification)..."
npm run build

echo "2/6 Rsync standalone output..."
rsync -avz --delete -e "ssh $SSH_OPTS" \
  .next/standalone/ "$SERVER:$APP_DIR/.next/standalone/"

echo "3/6 Sync prisma schema..."
rsync -avz --delete -e "ssh $SSH_OPTS" \
  prisma/ "$SERVER:$APP_DIR/prisma/"

echo "4/6 Copy static files into standalone structure..."
rsync -avz --delete -e "ssh $SSH_OPTS" \
  .next/static/ "$SERVER:$APP_DIR/.next/standalone/.next/static/"

echo "5/6 Prisma push (production DB)..."
ssh $SSH_OPTS "$SERVER" "cd $APP_DIR && DATABASE_URL='file:$APP_DIR/data/prod.db' npx prisma db push --skip-generate"

echo "6/6 Restart service..."
ssh $SSH_OPTS "$SERVER" "sudo systemctl restart digi-coord.service"

# Verify service is running
sleep 3
if ssh $SSH_OPTS "$SERVER" "systemctl is-active --quiet digi-coord.service"; then
  echo "=== Deploy complete — service running ==="
else
  echo "=== WARNING: service not active after restart ==="
  ssh $SSH_OPTS "$SERVER" "systemctl status digi-coord.service --no-pager -l | tail -20"
  exit 1
fi
