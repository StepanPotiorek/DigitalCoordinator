import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound } from "@/lib/api-utils"
import { NextRequest } from "next/server"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.notification.count({ where: { read: false } }),
    ])

    return { notifications, unreadCount }
  })
}

export async function PATCH(request: NextRequest) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const body = await request.json()

    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      })
      return { success: true }
    }

    const id = body.id
    if (!id) return notFound("Notification")

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return { success: true }
  })
}
