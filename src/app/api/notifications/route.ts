import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound } from "@/lib/api-utils"
import { NextRequest } from "next/server"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const userId = session.user.id

    const whereFilter = {
      OR: [
        { userId: null },
        { userId },
      ],
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereFilter,
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.notification.count({
        where: { ...whereFilter, read: false },
      }),
    ])

    return { notifications, unreadCount }
  })
}

export async function PATCH(request: NextRequest) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const userId = session.user.id
    const body = await request.json()

    const whereFilter = {
      OR: [
        { userId: null },
        { userId },
      ],
    }

    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: { ...whereFilter, read: false },
        data: { read: true },
      })
      return { success: true }
    }

    const id = body.id
    if (!id) return notFound("Notification")

    const notification = await prisma.notification.findUnique({ where: { id } })
    if (!notification) return notFound("Notification")

    if (notification.userId !== null && notification.userId !== userId) {
      return unauthorized()
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return { success: true }
  })
}
