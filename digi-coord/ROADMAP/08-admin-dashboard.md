# Task 08: Admin Dashboard

## Description

Comprehensive admin dashboard with overview statistics, worker management, issue tracking, and follow-up task management.

## Prompt for AI

```
Build the admin dashboard for the Filipino Workforce Coordination System.

## What to build

Admin overview page at `/dashboard/admin` showing key metrics, recent activity, and quick actions.

## API Routes

### `src/app/api/admin/stats/route.ts`
- GET /api/admin/stats - returns aggregate statistics:
  - totalWorkers
  - workersByStatus (pending, in_progress, completed)
  - totalIssues
  - issuesByStatus (open, in_progress, resolved)
  - urgentIssues count
  - newWorkersThisMonth count
  - recentIssues (last 10 issues with worker name)
  - recentWorkers (last 5 registered workers)
  - onboardingCompletionRate (average % across all workers)

## Pages

### `src/app/dashboard/admin/page.tsx`
Admin dashboard with:

1. **Top Stats Row** (4 stat cards)
   - Total Workers
   - Open Issues
   - Urgent Issues (red)
   - Onboarding Rate (%)

2. **Workers Overview** section
   - Bar/pie showing PENDING / IN_PROGRESS / COMPLETED distribution
   - Recent workers list (last 5)

3. **Issues Overview** section
   - Issues by priority/status
   - Recent issues table (last 10): Worker, Type, Priority, Status, Date
   - Quick actions: Mark as In Progress, Resolve

4. **Quick Actions** section
   - Register new worker button → /dashboard/workers (with new form)
   - View all issues → /dashboard/issues
   - View all workers → /dashboard/workers
   - Create client → /dashboard/clients

5. **System Status** section
   - Database status (connected)
   - Worker count
   - Issue resolution rate

## Components

### `src/components/admin/stat-card.tsx`
Reusable stat card:
- Props: title, value, icon, color (for accent), onClick (optional)
- Glass-morphism background with colored accent border

### `src/components/admin/recent-issues-table.tsx`
Compact table of issues with color-coded priority badges and status badges.

### `src/components/admin/workers-overview-chart.tsx`
Simple visual bar showing worker distribution by status. Can be CSS-based (no chart library needed).

## Important

- Only ADMIN role can access /dashboard/admin
- COORDINATOR role can access workers and issues but not admin overview
- Cache stats or use server components for performance
- Dark theme
- No code comments
