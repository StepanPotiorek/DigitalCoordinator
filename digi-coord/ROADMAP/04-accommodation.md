# Task 04: Accommodation Section

## Description

Per-worker accommodation information: address, room, rules, contacts, map. Workers can view their accommodation info. Admins can manage it.

## Prompt for AI

```
Build the accommodation module for the Filipino Workforce Coordination System.

## What to build

1. Accommodation API (CRUD)
2. Accommodation detail view (public for worker, full for admin)
3. Accommodation edit form (admin)
4. Accommodation rules display
5. Map/address section

## API Routes

### `src/app/api/accommodations/route.ts`
- GET /api/accommodations?workerId=X - get accommodation for a worker
- POST /api/accommodations - create accommodation record

### `src/app/api/accommodations/[id]/route.ts`
- GET /api/accommodations/[id] - get accommodation detail
- PUT /api/accommodations/[id] - update accommodation
- DELETE /api/accommodations/[id] - delete accommodation

## Pages

### `src/app/dashboard/workers/[id]/accommodation/page.tsx`
Accommodation detail page. Shows:
- Address (large, prominent)
- Room number
- House rules (formatted list)
- Contact person name + phone
- Map link/embed
- Link to edit (if admin)
- If no accommodation set: "No accommodation information yet" with button to add

### `src/app/dashboard/accommodations/page.tsx`
List of all accommodations with worker names, addresses, quick status.

## Components

### `src/components/accommodation/accommodation-card.tsx`
Card component showing accommodation info. Used in worker detail view.

### `src/components/accommodation/accommodation-form.tsx`
Form for creating/editing accommodation. Fields:
- Address (required)
- Room
- House Rules (textarea, one per line)
- Contact Name
- Contact Phone
- Map URL

## Integration

From worker detail page, show accommodation section. If exists, show card. If not, show "Add accommodation" button.

## Important

- Each worker can have at most ONE accommodation (unique constraint in schema)
- No code comments
- Dark theme
