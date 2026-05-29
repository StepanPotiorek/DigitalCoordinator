import { PrismaClient } from "@prisma/client";

function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.__prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.__prisma = prisma;

export async function createNotification(
  type: string,
  message: string,
  link?: string,
) {
  await prisma.notification.create({
    data: { type, message, link },
  })
}
