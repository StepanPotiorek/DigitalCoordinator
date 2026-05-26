# Task 00: Project Initialization

## Description

Initialize the Prisma database, create the `.env` configuration, and set up the basic project structure. This task must be completed before any other task.

## Prompt for AI

```
Run the following commands in the digi-coord directory:

1. Generate Prisma client:
   npx prisma generate

2. Push schema to create SQLite database:
   npx prisma db push

3. Seed the database:
   npx tsx prisma/seed.ts

Also create the following files:
- src/lib/prisma.ts - Prisma client singleton
```

## Files to Create

### `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## Verification

1. Run `npx prisma generate` - should succeed
2. Run `npx prisma db push` - should create `prisma/dev.db`
3. Run `npx tsx prisma/seed.ts` - should output confirmation
4. Run `npm run dev` - the app should start on port 3000

## Dependencies

- Prisma schema already exists at `prisma/schema.prisma`
- Seed file exists at `prisma/seed.ts`
- `.env` file exists with `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
