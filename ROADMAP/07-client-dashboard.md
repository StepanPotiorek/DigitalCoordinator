# Task 07: Client Dashboard

## Description

Dashboard for CLIENT role users. Clients can see their workers, onboarding status, open issues, and communication notes.

## Prompt for AI

```
Build the client dashboard for the Filipino Workforce Coordination System.

## What to build

The client role represents employers who hire workers through the coordinator. Each client can see their associated workers and their status.

## API Routes

### `src/app/api/clients/route.ts`
- GET /api/clients - list all clients (admin only)
- POST /api/clients - create client (admin)

### `src/app/api/clients/[id]/route.ts`
- GET /api/clients/[id] - get client detail with workers
- PUT /api/clients/[id] - update client (admin)
- DELETE /api/clients/[id] - delete client (admin)

### `src/app/api/clients/[id]/workers/route.ts`
- GET /api/clients/[id]/workers - list workers for a specific client (filter by employer matching client name)

## Pages

### `src/app/dashboard/clients/page.tsx`
Client list (admin view). Shows all clients with:
- Client name
- Contact email
- Number of workers
- Quick actions (view, edit)

### `src/app/dashboard/clients/[id]/page.tsx`
Client detail page. Shows:
- Client info (name, email, phone)
- Workers assigned to this client (matching employer name)
  - Each worker: name, onboarding status, arrival date, open issues count
  - Click to go to worker detail
- Communication notes section
  - Add note form (admin/coordinator)
  - Previous notes list

### For CLIENT role users:

#### `src/app/dashboard/page.tsx` (update)
Users with CLIENT role see their own dashboard:
- Welcome with client name
- Workers overview (how many, how many with completed onboarding)
- Open issues list (across their workers)
- Recent communications

## Components

### `src/components/clients/worker-status-card.tsx`
Card showing a single worker's status for client view:
- Worker name + avatar initial
- Onboarding badge (Pending / In Progress / Completed)
- Open issues count
- Last communication date

### `src/components/clients/communication-form.tsx`
Form to add a communication note:
- Type (NOTE, ISSUE_UPDATE, ONBOARDING_UPDATE, GENERAL)
- Message text
- Submit → POST to /api/communications

## Important

- Client-worker matching: workers have an "employer" field that should match the client's "name"
- The CLIENT user role links to a Client record via userId
- Only show data relevant to the logged-in client
- No code comments
- Dark theme
