.PHONY: dev build start lint db-generate db-push db-seed db-reset db-init setup clean deploy deploy-rsync backup

# ─── Development ───────────────────────────────────────────────

dev:
	npm run dev

run:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

# ─── Database ──────────────────────────────────────────────────

db-generate:
	npx prisma generate

db-push:
	npx prisma db push

db-seed:
	npx tsx prisma/seed.ts

db-reset:
	npx prisma migrate reset --force

db-studio:
	npx prisma studio

# Init database: push schema + seed
db-init: db-push db-seed

# ─── Project Setup ─────────────────────────────────────────────

# Full first-time setup: install deps + init db
setup:
	npm install
	npx prisma generate
	npx prisma db push
	npx tsx prisma/seed.ts
	@echo "Setup complete. Run 'make dev' to start."

# Reliable dev server restart (kills, cleans Turbopack cache, restarts)
dev-restart:
	@echo "Killing old server..."
	@-kill $$(lsof -ti:3000) 2>/dev/null || true
	@echo "Cleaning Turbopack cache..."
	@rm -rf .next
	@echo "Starting dev server (background)..."
	setsid sh -c 'exec npx next dev -H 127.0.0.1 > /tmp/digicoord-dev.log 2>&1' &
	@echo "Waiting for server..."
	@for i in 1 2 3 4 5 6 7 8 9 10; do fuser 3000/tcp 2>/dev/null && echo "OK ($${i}s)" && break; sleep 1; done

# ─── Deployment ────────────────────────────────────────────────

# Deploy to production server via rsync + docker compose
SSH_HOST = root@rdev.buq.cz
REMOTE_DIR = /opt/digi-coord/

deploy: build
	rsync -avz --delete \
	  --exclude .git \
	  --exclude node_modules \
	  --exclude .next \
	  --exclude prisma/dev.db \
	  --exclude backups \
	  --exclude .env \
	  --exclude .env.local \
	  ./ $(SSH_HOST):$(REMOTE_DIR)
	ssh $(SSH_HOST) "cd $(REMOTE_DIR) && docker compose up --build -d"
	@echo "Deploy complete."

deploy-rsync:
	rsync -avz --delete \
	  --exclude .git \
	  --exclude node_modules \
	  --exclude .next \
	  --exclude prisma/dev.db \
	  --exclude backups \
	  --exclude .env \
	  --exclude .env.local \
	  ./ $(SSH_HOST):$(REMOTE_DIR)
	ssh $(SSH_HOST) "cd $(REMOTE_DIR) && docker compose up --build -d"
	@echo "Deploy complete (rsync only, no build)."

# ─── Cleanup ───────────────────────────────────────────────────

clean:
	rm -rf .next
	rm -rf node_modules
	rm -f prisma/dev.db
	@echo "Cleaned."

# ─── Backup ────────────────────────────────────────────────────

backup:
	@mkdir -p backups
	@cp prisma/dev.db backups/dev.db.$$(date +%Y%m%d_%H%M%S)
	@echo "Database backed up to backups/"
