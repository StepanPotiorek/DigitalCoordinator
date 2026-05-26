# Task 01: Authentication System

## Description

Implement authentication using NextAuth.js v5 with Credentials provider. Users can log in with email + password. Protected routes redirect to `/login`. Include role-based access for ADMIN, COORDINATOR, and CLIENT roles.

## Prompt for AI

```
Implement authentication for the Filipino Workforce Coordination System.

## What to build

1. NextAuth v5 configuration with Credentials provider
2. Login page at /login
3. Auth middleware for protected routes
4. Session provider for client components
5. Logout functionality
6. Role-based access (ADMIN, COORDINATOR, CLIENT)

## Files to create/modify

### `src/lib/auth.ts`
NextAuth configuration with Credentials provider. Verify email + passwordHash against the User model in Prisma. Use bcryptjs to compare passwords.

### `src/app/api/auth/[...nextauth]/route.ts`
NextAuth API route handler.

### `src/app/login/page.tsx`
Login page with email/password form. On success redirect to /dashboard. Show error message on invalid credentials. Keep the dark theme consistent with the app.

### `src/app/layout.tsx`
Wrap with SessionProvider.

### `src/middleware.ts`
Auth middleware - protect /dashboard/* routes. Redirect to /login if not authenticated. Allow public access to /, /guide, /before-arrival, /after-arrival, /first-day, /faq, /contact, /login, /api/auth/*.

### `src/app/dashboard/layout.tsx`
Dashboard layout with sidebar navigation. Show user name and role. Include logout button.

### `src/app/dashboard/page.tsx`
Simple dashboard home with role-based greeting. Redirect ADMIN to /dashboard/admin, COORDINATOR to /dashboard/workers, CLIENT to /dashboard/clients.

### `src/components/auth/logout-button.tsx`
Logout button component.

## Important

- Use bcryptjs (not bcrypt) for password comparison
- Session should include user id, email, name, and role
- Use JWT strategy (not database sessions)
- Do NOT add code comments
- Keep the dark theme (slate-950 background, etc.)
- All text in English

## Schema (already exists)

User model has: id (String, cuid), name (String?), email (String, unique), passwordHash (String), role (Role enum: ADMIN|COORDINATOR|CLIENT), createdAt, updatedAt

## Seed admin credentials

Email: admin@digicoord.cz
Password: admin123
```

## Verification

1. Visit `/login` - should see login form
2. Login with admin@digicoord.cz / admin123 - should redirect to /dashboard
3. Visit `/login` when already logged in - should redirect from middleware
4. Logout - should redirect to login
5. Visit `/dashboard` when not logged in - should redirect to login
