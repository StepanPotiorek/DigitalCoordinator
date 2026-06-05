# Stage 1: Install deps
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
COPY prisma/ ./prisma/
RUN npm ci

# Stage 2: Initialize database + generate Prisma client
FROM node:22-alpine AS db-init
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY prisma/ ./prisma/
COPY .env ./
ENV DATABASE_URL="file:/app/data/init.db"
RUN mkdir -p /app/data && \
    npx prisma generate && \
    npx prisma db push --accept-data-loss && \
    npx tsx prisma/seed.ts

# Stage 3: Build the app
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# Stage 4: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --shell /bin/sh nextjs

# Copy initialized database (will be used as seed for the volume)
COPY --from=db-init /app/data/init.db /app/initial-data/prod.db

# Copy standalone server
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma runtime + CLI (full node_modules needed for prisma db push transitive deps)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Create writable data dir for SQLite and uploads
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
RUN mkdir -p /app/public/uploads/issues && chown nextjs:nodejs /app/public/uploads

# Copy entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/prod.db"
ENV AUTH_TRUST_HOST=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
