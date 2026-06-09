import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiHandler, badRequest } from "@/lib/api-utils"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    const { endpoint, keys, userAgent } = await request.json()

    if (!endpoint || !keys?.p256dh || !keys?.auth) return badRequest("Invalid subscription")

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, userAgent: userAgent ?? null },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent: userAgent ?? null },
    })

    return { success: true }
  })
}

export async function DELETE(request: NextRequest) {
  return apiHandler(async () => {
    const { endpoint } = await request.json()
    if (!endpoint) return badRequest("Missing endpoint")

    await prisma.pushSubscription.delete({ where: { endpoint } })
    return { success: true }
  })
}
