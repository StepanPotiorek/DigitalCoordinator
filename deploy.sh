#!/bin/sh
set -e

SSH_HOST="root@rdev.buq.cz"
REMOTE_DIR="/opt/digi-coord/"
SSH_KEY="$HOME/.ssh/id_ed25519_github"

# Start ssh-agent and load key
eval $(ssh-agent -s) > /dev/null
ssh-add "$SSH_KEY" < /dev/null

echo "→ Building..."
npm run build

echo "→ Syncing files to server..."
rsync -avz --delete \
  -e "ssh -o StrictHostKeyChecking=accept-new" \
  --exclude .git \
  --exclude node_modules \
  --exclude .next \
  --exclude prisma/dev.db \
  --exclude backups \
  --exclude .env \
  --exclude .env.local \
  ./ "$SSH_HOST:$REMOTE_DIR"

echo "→ Rebuilding and restarting Docker container..."
ssh -o StrictHostKeyChecking=accept-new "$SSH_HOST" "cd $REMOTE_DIR && docker compose up --build -d"

echo "→ Deploy complete!"
