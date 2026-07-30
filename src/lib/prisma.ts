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
  title?: string,
  userId?: string,
) {
  await prisma.notification.create({
    data: { type, message, link, title: title ?? "", userId: userId ?? null },
  })
}

export async function createNotificationForAdmins(
  type: string,
  message: string,
  link?: string,
  title?: string,
) {
  const admins = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "COORDINATOR"] } },
    select: { id: true },
  })
  if (admins.length === 0) return
  await prisma.notification.createMany({
    data: admins.map((a) => ({
      type,
      message,
      link,
      title: title ?? "",
      userId: a.id,
    })),
  })
}
