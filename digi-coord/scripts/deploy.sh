#!/bin/bash
set -e

SERVER="ubuntu@89.168.123.99"
SSH_KEY="/home/stepan/.ssh/oracle-server"
APP_DIR="/home/ubuntu/DigitalCoordinator/digi-coord"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no"

if [ ! -f "$SSH_KEY" ]; then
  echo "SSH key not found at $SSH_KEY"
  exit 1
fi

echo "=== DigiCoord Deploy ==="

echo "1/5 Build..."
npm run build

echo "2/5 Rsync standalone output..."
rsync -avz --delete -e "ssh $SSH_OPTS" \
  .next/standalone/ "$SERVER:$APP_DIR/.next/standalone/"

echo "3/5 Copy static files into standalone structure..."
rsync -avz --delete -e "ssh $SSH_OPTS" \
  .next/static/ "$SERVER:$APP_DIR/.next/standalone/.next/static/"

echo "4/5 Prisma push (production DB)..."
ssh $SSH_OPTS "$SERVER" "cd $APP_DIR && DATABASE_URL='file:$APP_DIR/data/prod.db' npx prisma db push --skip-generate"

echo "5/5 Restart service..."
ssh $SSH_OPTS "$SERVER" "sudo systemctl restart digi-coord.service"

echo "=== Deploy complete ==="
