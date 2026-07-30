# Task 02: Worker Management

## Description

Full CRUD for workers. Includes:
- Worker registration form (public, for workers to sign up)
- Worker list and detail pages (protected, for admin/coordinator)
- Worker API endpoints (protected)
- Onboarding status tracking

## Prompt for AI

```
Build the worker management module for the Filipino Workforce Coordination System.

## What to build

1. Worker registration form (public - accessible from home page)
2. Worker list page (protected - admin/coordinator only)
3. Worker detail page (protected)
4. Worker edit form (protected)
5. REST API for workers

## Files to create

### API Routes

#### `src/app/api/workers/route.ts`
- GET /api/workers - list all workers (admin/coordinator only)
- POST /api/workers - create new worker (public - for registration)

#### `src/app/api/workers/[id]/route.ts`
- GET /api/workers/[id] - get worker detail
- PUT /api/workers/[id] - update worker
- DELETE /api/workers/[id] - delete worker (admin only)

### Pages

#### `src/app/dashboard/workers/page.tsx`
Worker list page. Table with columns: Name, WhatsApp, Employer, Onboarding Status, Arrival Date, Actions (View, Edit, Delete). Search/filter by name or employer. Protected - requires authentication.

#### `src/app/dashboard/workers/[id]/page.tsx`
Worker detail page. Show all worker info, onboarding progress (summary from OnboardingItem), accommodation info (if exists), recent issues (if any). Link to edit.

#### `src/app/dashboard/workers/[id]/edit/page.tsx`
Worker edit form. Same fields as registration but pre-filled.

### Public Components

#### `src/components/forms/worker-registration-form.tsx`
Registration form with fields:
- Full name (required)
- WhatsApp number (required)
- Email address
- Employer / Client
- Accommodation address
- Arrival date
- Emergency contact name
- Emergency contact phone

Submit to POST /api/workers. On success show confirmation message. Dark theme styling.

## Important

- Validate required fields on server side
- Return proper HTTP status codes (201, 400, 401, 403, 404)
- Workers created via public form get status PENDING
- Workers created by admin can set status
- No code comments
- English text
- Dark theme consistent with app
```

## Verification

1. Visit `/dashboard/workers` as admin - see empty worker list
2. Submit public registration form - worker appears in list
3. Click worker detail - see all info
4. Edit worker - changes persist
5. Delete worker (admin) - worker removed
6. Visit `/dashboard/workers` without auth - redirect to login
