# Task 09: Deployment

## Description

Prepare the application for production deployment on a VPS. Configure Next.js standalone build, set up PM2 process manager, implement database backup strategy.

## Prompt for AI

```
Prepare the Filipino Workforce Coordination System for production deployment on a VPS.

## What to do

1. Configure Next.js for standalone output
2. Create production environment config
3. Set up PM2 ecosystem file
4. Create backup script

## Files to create/modify

### `next.config.ts` (update)

Enable standalone output:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

### `ecosystem.config.js`
PM2 ecosystem configuration:

```javascript
module.exports = {
  apps: [
    {
      name: "digi-coord",
      script: "server.js",
      cwd: "./.next/standalone",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

### `.env.production`
Production environment template:

```
DATABASE_URL="file:./data/prod.db"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="https://your-domain.com"
```

### `scripts/backup.sh`
Backup script:

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/digi-coord"
mkdir -p "$BACKUP_DIR"
cp /path/to/prod.db "$BACKUP_DIR/prod.db.$TIMESTAMP"
# Keep last 30 backups
ls -t "$BACKUP_DIR/prod.db.*" | tail -n +31 | xargs -r rm
echo "Backup created: $BACKUP_DIR/prod.db.$TIMESTAMP"
```

### `scripts/deploy.sh`
Deployment script (for use on VPS):

```bash
#!/bin/bash
set -e

echo "=== DigiCoord Deploy ==="

cd /opt/digi-coord

# Pull latest (if using git)
# git pull origin main

# Install dependencies
npm ci --production

# Generate Prisma client
npx prisma generate

# Push database schema (safe - won't delete data)
npx prisma db push

# Build
npm run build

# Restart
pm2 restart ecosystem.config.js

echo "Deploy complete!"
```

## Production README notes

### Prerequisites
- Node.js 20+
- npm
- PM2 (`npm install -g pm2`)

### First-time setup on VPS

```bash
# Clone/copy project to /opt/digi-coord
cd /opt/digi-coord
make setup

# Set production env
cp .env.production .env
# Edit .env with real values

# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Database Backup

```bash
# Add to crontab for daily backup
0 2 * * * /opt/digi-coord/scripts/backup.sh
```
