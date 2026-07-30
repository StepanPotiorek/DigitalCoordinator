# Task 03: Onboarding Checklist

## Description

Per-worker onboarding checklist with categorized items, progress tracking, and completion status. Workers and coordinators can mark items as completed.

## Prompt for AI

```
Build the onboarding checklist module for the Filipino Workforce Coordination System.

## What to build

Each worker has a set of onboarding items across categories. Items are created when a worker is registered (or can be pre-defined). Users can check/uncheck items to track progress.

## API Routes

### `src/app/api/onboarding/route.ts`
- GET /api/onboarding?workerId=X - get all onboarding items for a worker
- POST /api/onboarding - create onboarding items for a worker (typically called when worker is created)

### `src/app/api/onboarding/[id]/route.ts`
- PUT /api/onboarding/[id] - toggle completion status of an item
- Also accepts body: { completed: boolean }

## What to create

### Default onboarding items (create these when a worker is registered)

#### BEFORE_ARRIVAL
- Worker registration completed
- Documents checklist reviewed
- Basic Czech Republic info shared
- Airport/arrival instructions sent

#### AFTER_ARRIVAL
- First day at accommodation confirmed
- Accommodation rules explained
- Contact information saved

#### FIRST_DAY
- Workplace address confirmed
- Start time confirmed
- Supervisor contact saved
- Transport route checked

#### SIM_CARD
- SIM card received
- WhatsApp active
- Coordinator contact saved

#### BANK_ACCOUNT
- Documents prepared
- Bank appointment confirmed
- Safety instructions understood

#### ACCOMMODATION
- Address confirmed
- Room/bed confirmed
- Keys received
- Wi-Fi information received
- House rules explained
- Accommodation contact saved

#### EMERGENCY
- Emergency number 112 saved
- Coordinator contact saved
- Employer contact saved
- Worker can share location

#### LANGUAGE
- Basic English phrases reviewed
- Basic Czech phrases reviewed

#### ADAPTATION
- Weather adaptation tips shared
- Cultural norms explained

### Page

#### `src/app/dashboard/workers/[id]/onboarding/page.tsx`
Onboarding detail page for a worker. Shows items grouped by category. Each item has a checkbox. Progress bar at top showing percentage complete. Auto-saves on toggle (PUT API).

### Shared Component

#### `src/components/onboarding/checklist.tsx`
Reusable checklist component:
- Props: workerId (number), initialItems (array)
- Groups items by category with category headers
- Each item is a clickable row with checkbox + label
- Shows completion percentage
- On toggle, calls PUT API and updates state

#### `src/components/onboarding/progress-badge.tsx`
Small badge showing "X% completed" with a color:
- 0-33%: red
- 34-66%: amber
- 67-99%: blue
- 100%: green

## Important

- When a new worker is registered via POST /api/workers, automatically create all default onboarding items
- Onboarding items are per-worker (not shared)
- Categories are defined in the Prisma schema as OnboardingCategory enum
- No code comments
- Dark theme
```

## Verification

1. Register a new worker
2. Visit `/dashboard/workers/[id]/onboarding`
3. See all categories with items
4. Check items - progress bar updates
5. Uncheck items - progress decreases
6. Progress badge reflects correct percentage
