# Task 05: Issue Reporting

## Description

Issue reporting system. Workers can report problems (work, accommodation, health, communication, urgent). Admin/coordinator can view, prioritize, and resolve issues.

## Prompt for AI

```
Build the issue reporting module for the Filipino Workforce Coordination System.

## What to build

1. Issue reporting form (public, for workers)
2. Issue list (protected, for admin/coordinator)
3. Issue detail page (protected)
4. Issue status management (open → in_progress → resolved)

## API Routes

### `src/app/api/issues/route.ts`
- GET /api/issues - list all issues (admin/coordinator). Query params: status, priority, workerId
- POST /api/issues - create new issue (public - workers can report without auth)

### `src/app/api/issues/[id]/route.ts`
- GET /api/issues/[id] - get issue detail
- PUT /api/issues/[id] - update issue (status, priority, notes) - admin only
- DELETE /api/issues/[id] - delete issue (admin only)

## Pages

### `src/app/dashboard/issues/page.tsx`
Issue list page with:
- Table: ID, Worker Name, Issue Type, Priority, Status, Created Date
- Color coding: URGENT=red, HIGH=amber, MEDIUM=blue, LOW=gray
- Status badges: OPEN, IN_PROGRESS, RESOLVED
- Filter by status, priority
- Click row → issue detail

### `src/app/dashboard/issues/[id]/page.tsx`
Issue detail page with:
- Full description
- Priority badge + status badge
- Worker info (name + link to worker detail)
- Action buttons: Mark In Progress, Mark Resolved, Reopen
- Admin can change priority

### Public Issue Report Form

#### `src/app/report/page.tsx`
Public page (no auth required) with issue reporting form:
- Select issue type (Work, Accommodation, Health, Communication, Documents, Urgent)
- Description textarea (what, when, where, who)
- Worker name
- WhatsApp number (for follow-up)
- Submit button

OR create it as a component:

#### `src/components/forms/issue-report-form.tsx`
Same form, reusable. Can be embedded in contact page or quick help section.

Include emergency reminder: call 112 for immediate danger.

## Important

- Issues from unknown workers (no matching name in DB) still accepted - mark as "unregistered"
- No code comments
- Dark theme
- Priority determines visual urgency
