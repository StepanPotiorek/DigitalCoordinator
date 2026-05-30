import { prisma } from "./prisma"

export async function logAction(
  userId: string | undefined | null,
  action: string,
  entity: string,
  entityId?: number | null,
  details?: Record<string, unknown> | null,
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entity,
        entityId: entityId ?? null,
        details: details ? JSON.stringify(details) : null,
      },
    })
  } catch {
    // audit failures should never break the main operation
  }
}

export function auditAction(
  userId: string | undefined | null,
  action: string,
  entity: string,
  entityId?: number | null,
  details?: Record<string, unknown> | null,
) {
  logAction(userId, action, entity, entityId, details)
}
