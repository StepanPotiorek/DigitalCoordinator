import { auth } from "@/lib/auth"
import { prisma, createNotificationForAdmins } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })
    if (!worker) return notFound("Worker")

    const items = await prisma.onboardingItem.findMany({
      where: { workerId: worker.id },
      orderBy: [{ category: "asc" }, { id: "asc" }],
    })

    return items
  })
}

export async function PUT(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })
    if (!worker) return notFound("Worker")

    const body = await request.json()
    const { itemId, completed } = body

    await prisma.onboardingItem.updateMany({
      where: { id: itemId, workerId: worker.id },
      data: { completed, completedAt: completed ? new Date() : null },
    })

    const allItems = await prisma.onboardingItem.findMany({
      where: { workerId: worker.id },
    })
    const allDone = allItems.every((i) => i.completed)

    if (allDone) {
      const updated = await prisma.worker.update({
        where: { id: worker.id },
        data: { onboardingStatus: "COMPLETED" },
      })
      await createNotificationForAdmins(
        "ONBOARDING_COMPLETE",
        `${updated.name} completed all onboarding steps!`,
        `/dashboard/workers/${worker.id}`,
        "Onboarding Complete",
      )
    } else {
      const anyDone = allItems.some((i) => i.completed)
      if (anyDone) {
        await prisma.worker.update({
          where: { id: worker.id },
          data: { onboardingStatus: "IN_PROGRESS" },
        })
      }
    }

    return { success: true }
  })
}
