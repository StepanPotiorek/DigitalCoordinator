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
