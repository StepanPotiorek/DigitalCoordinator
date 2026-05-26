.PHONY: dev build start lint db-generate db-push db-seed db-reset db-init setup clean deploy backup

# ─── Development ───────────────────────────────────────────────

dev:
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

# Build for production
deploy: build
	@echo "Build complete. Start with: make start"
	@echo "For production: pm2 start npm --name digi-coord -- start"

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
