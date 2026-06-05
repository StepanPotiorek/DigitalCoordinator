import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound } from "@/lib/api-utils"

import { hash } from "bcryptjs"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
      include: {
        _count: { select: { issues: { where: { status: { not: "RESOLVED" } } } } },
        onboardingItems: { orderBy: [{ category: "asc" }, { id: "asc" }] },
        accommodationDetail: true,
      },
    })

    if (!worker) return notFound("Worker")

    const totalItems = worker.onboardingItems.length
    const completedItems = worker.onboardingItems.filter((i) => i.completed).length
    const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100)

    return {
      ...worker,
      progress,
      openIssues: worker._count.issues,
    }
  })
}

export async function PUT(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const body = await request.json()
    const { name, whatsapp, city, emergencyContactName, emergencyContactPhone, password } = body

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
    })
    if (!worker) return notFound("Worker")

    const updateData: Record<string, any> = {}
    if (name) updateData.name = name
    if (whatsapp) updateData.whatsapp = whatsapp
    if (city !== undefined) updateData.city = city
    if (emergencyContactName !== undefined) updateData.emergencyContactName = emergencyContactName
    if (emergencyContactPhone !== undefined) updateData.emergencyContactPhone = emergencyContactPhone

    if (Object.keys(updateData).length > 0) {
      await prisma.worker.update({ where: { id: worker.id }, data: updateData })
    }

    if (password && password.length >= 6) {
      const passwordHash = await hash(password, 12)
      await prisma.user.update({
        where: { email: session.user.email! },
        data: { name: name || undefined, passwordHash },
      })
    } else if (name) {
      await prisma.user.update({
        where: { email: session.user.email! },
        data: { name },
      })
    }

    return { success: true }
  })
}
