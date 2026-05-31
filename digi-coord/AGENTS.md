# AGENT.md — Filipino Workforce Coordination System

## Project Overview

**Digital Coordinator** is a full-stack web application for coordinating Filipino workers in the Czech Republic. It replaces manual WhatsApp-based coordination with an automated system for onboarding, adaptation support, issue tracking, and communication.

### Core Value Proposition

> "I provide Czech-side Filipino workforce coordination supported by my own onboarding app."

### What the App Does

- Worker onboarding & adaptation support
- Self-service FAQ to reduce repeated questions
- Practical tool for Czech clients to see coordination in action
- Positions the role as "coordination + systems," not just personal support

### What the App Does NOT Handle

- Visas and immigration legal processing
- Legal documents and contracts
- Official fees
- Personal airport pickup

---

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **Next.js 16 (App Router)** | Full-stack React, API routes, SSR/static pages |
| Language | **TypeScript** | Type safety throughout |
| Styling | **Tailwind CSS v4** | Utility-first CSS (already in use) |
| Database | **SQLite** via **Prisma ORM** | Zero-config, file-based, ideal for VPS |
| Auth | **NextAuth.js v5 (Auth.js)** with Credentials provider | Admin/coordinator/client login |
| Hasher | **bcryptjs** | Password hashing |

### Project Structure

```
digi-coord/
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Seed data (admin user, FAQ items)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (nav, auth check)
│   │   ├── page.tsx           # Home (public / marketing)
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── guide/             # Worker Guide (public)
│   │   ├── before-arrival/    # Before Arrival guide (public)
│   │   ├── after-arrival/     # After Arrival guide (public)
│   │   ├── first-day/         # First Day at Work (public)
│   │   ├── faq/               # FAQ (public)
│   │   ├── contact/           # Contact Support (public)
│   │   ├── dashboard/         # Protected routes layout
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── workers/       # Worker management
│   │   │   ├── issues/        # Issue tracking
│   │   │   └── clients/       # Client dashboard
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── workers/
│   │       ├── issues/
│   │       ├── onboarding/
│   │       ├── accommodations/
│   │       ├── clients/
│   │       └── communications/
│   ├── components/            # Shared React components
│   │   ├── ui/                # Basic UI primitives
│   │   ├── forms/             # Form components
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── auth.ts            # NextAuth configuration
│   └── types/                 # Shared TypeScript types
├── ROADMAP/                   # Implementation task files
├── AGENT.md                   # This file
├── Makefile                   # Dev/build/deploy helpers
├── .env                       # Environment variables
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Database Schema (Prisma + SQLite)

### Models

```
User (id, name, email, passwordHash, role: ADMIN|COORDINATOR|CLIENT, createdAt, updatedAt)
Worker (id, name, whatsapp, email?, employer?, accommodation?, arrivalDate?, emergencyContactName?, emergencyContactPhone?, onboardingStatus: PENDING|IN_PROGRESS|COMPLETED, createdAt, updatedAt)
OnboardingItem (id, workerId FK, label, category: BEFORE_ARRIVAL|AFTER_ARRIVAL|FIRST_DAY|..., completed, completedAt?)
Issue (id, workerId FK, issueType, description, priority: LOW|MEDIUM|HIGH|URGENT, status: OPEN|IN_PROGRESS|RESOLVED, createdAt, updatedAt)
Accommodation (id, workerId FK unique, address, room?, rules?, contactName?, contactPhone?, mapUrl?, createdAt, updatedAt)
Client (id, name, contactEmail?, contactPhone?, notes?, userId FK? unique, createdAt, updatedAt)
CommunicationLog (id, workerId FK, clientId FK?, type: NOTE|ISSUE_UPDATE|ONBOARDING_UPDATE|GENERAL, message, createdBy, createdAt)
FAQ (id, question, answer, category?, order, createdAt, updatedAt)
```

### Relationships

- Worker has many OnboardingItems, Issues, CommunicationLogs
- Worker has one Accommodation
- Client has many CommunicationLogs
- User (auth) can be ADMIN, COORDINATOR, or linked to Client

---

## Authentication Strategy

- **NextAuth.js v5** with **Credentials** provider
- Roles: `ADMIN`, `COORDINATOR`, `CLIENT`
- Login page at `/login`
- Protected routes via middleware + `getServerSession`
- Seed default admin (change password on first deploy)

---

## Implementation Roadmap

Tasks are in `ROADMAP/` directory, numbered and independent. Each task file contains:

- **Description**: What to build
- **Prompt for AI**: Copy-paste ready instructions for an AI coding assistant
- **Files to create/modify**: Exact file paths
- **API endpoints**: Request/response format
- **UI components**: What to render
- **Database changes**: Prisma schema changes if needed

### Task Order

| # | File | Feature |
|---|------|---------|
| 00 | `ROADMAP/00-init.md` | Project setup, Prisma init, env config, seed |
| 01 | `ROADMAP/01-auth.md` | Authentication system (NextAuth, login, middleware) |
| 02 | `ROADMAP/02-workers.md` | Worker CRUD (API + pages + registration form) |
| 03 | `ROADMAP/03-onboarding.md` | Onboarding checklist (API + UI + progress) |
| 04 | `ROADMAP/04-accommodation.md` | Accommodation section (API + UI) |
| 05 | `ROADMAP/05-issues.md` | Issue reporting (API + form + admin view) |
| 06 | `ROADMAP/06-guide-pages.md` | Public guide pages (Before/After Arrival, First Day, FAQ, Contact, Worker Guide) |
| 07 | `ROADMAP/07-client-dashboard.md` | Client dashboard (worker status, issues, notes) |
| 08 | `ROADMAP/08-admin-dashboard.md` | Admin dashboard (overview, stats, follow-ups) |
| 09 | `ROADMAP/09-deployment.md` | Production build, PM2, backup strategy |

---

## Design Guidelines

- **Layout**: Dark background (slate-950), glass-morphism cards, gradient hero sections
- **Components**: Reusable, composable, server components where possible
- **Forms**: Client components with `useActionState` or controlled state
- **API**: RESTful, JSON responses, error handling with proper status codes
- **Auth**: Server-side session checks, redirect to `/login` if unauthenticated
- **Mobile**: Fully responsive, mobile-first design
- **Language**: UI in English (default), content supports English + Czech phrases

---

## Important Conventions

- NEVER add comments to code unless explicitly asked
- Use TypeScript strict mode
- Use Prisma for all database access
- Use Next.js App Router patterns (server components by default)
- Keep components small and focused
- Reuse existing UI patterns and color scheme from the old app
- All text content visible to the public needs no auth
- Dashboard/admin routes require authentication
- SQLite file stored at `prisma/dev.db` (dev) or configured via `DATABASE_URL` env (prod)

---

## Development Commands

```bash
# Production build
npx next build

# Tests
npm run test          # vitest unit tests
npm run test:e2e      # playwright e2e tests

# Seed database
npx tsx prisma/seed.ts

# === Dev Server Reliable Restart ===
# setsid is REQUIRED — nohup does NOT survive bash tool timeout/kill
# Use these exact commands every time you restart.

# One-liner (kill + clean + start):
kill $(lsof -ti:3000) 2>/dev/null; rm -rf .next; setsid sh -c 'cd /home/stepan/Documents/programming/digital-coordinator/digi-coord && exec npx next dev -H 127.0.0.1 > /tmp/digicoord-dev.log 2>&1' &

# Step by step:
kill $(lsof -ti:3000) 2>/dev/null   # kill old server
rm -rf /home/stepan/Documents/programming/digital-coordinator/digi-coord/.next  # clean turbopack cache
setsid sh -c 'cd /home/stepan/Documents/programming/digital-coordinator/digi-coord && exec npx next dev -H 127.0.0.1 > /tmp/digicoord-dev.log 2>&1' &  # start detached

# Verify (poll up to 10s):
for i in 1 2 3 4 5 6 7 8 9 10; do fuser 3000/tcp 2>/dev/null && echo "OK ($((i))s)" && break; sleep 1; done

# Check logs:
tail -20 /tmp/digicoord-dev.log
```

---

## Current Session Context

### Login flow — definitive version (all tests passing)

**Architecture:**
- Login page: `src/app/login/page.tsx` (server, reads `searchParams.error`)
- Login form: `src/app/login/login-form.tsx` (client, form `action="/api/auth/login" method="POST"`)
- Route handler: `src/app/api/auth/login/route.ts` — calls `signIn("credentials", { redirect: false })` then `NextResponse.redirect("/dashboard", 303)`
- Auth config: `src/lib/auth.ts` — explicit `secret: process.env.AUTH_SECRET`, JWT strategy, session maxAge 10 years

**Critical insight — proxy.ts was middleware:**
- `src/proxy.ts` had `export default function` + `export const config = { matcher: ... }` — Next.js 16 detected it as middleware (regardless of filename)
- `getToken()` in proxy.ts failed to decode the JWT (reason unclear, possibly edge runtime cookie handling), causing ALL dashboard requests to redirect to `/login` even with valid session cookie
- **Fix**: deleted `proxy.ts` (dashboard layout already calls `auth()` and redirects unauthenticated users)

**Key lessons:**
- **Never use 307 redirect after POST login** — 307 preserves POST method; browser POSTs to `/dashboard` which fails. Use **303 See Other** instead
- **Set-Cookie from fetch() or signIn() response is fragile in Playwright** — the proxy.ts middleware was the actual root cause, not cookie handling
- **Explicit `secret: process.env.AUTH_SECRET`** in NextAuth config prevents issues with auto-detection
- **`proxy.ts` with middleware signature is discovered by Next.js 16** — rename carefully

### Files changed this session:
- `src/app/api/auth/login/route.ts`: `NextResponse.redirect(url, 303)` (was 307)
- `src/lib/auth.ts`: added `secret: process.env.AUTH_SECRET`
- `src/proxy.ts`: **deleted** (was acting as middleware, blocking valid sessions)
- `tests/e2e/login.spec.ts`: 3 tests, all passing (page load, wrong password, success login)
- `tests/e2e/cookie-debug.spec.ts`: deleted (one-time debug)
- `src/app/api/auth/debug/route.ts`: deleted (one-time debug)

### Known issues:
- SMTP not configured — emails logged as "skipped" (needs App Password or Brevo)
- No middleware currently — dashboard layout protects routes, but unauthenticated users still load JS chunks
