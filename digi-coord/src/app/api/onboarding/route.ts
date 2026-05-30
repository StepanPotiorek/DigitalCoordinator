import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest, notFound, conflict, created, parseId } from "@/lib/api-utils"
import { defaultOnboardingItems } from "@/lib/onboarding-items"
import { logAction } from "@/lib/audit"

export async function GET(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const workerIdStr = searchParams.get("workerId")
    if (!workerIdStr) return badRequest("workerId is required")

    const workerId = parseId(workerIdStr)
    if (!workerId) return badRequest("Invalid workerId")

    const items = await prisma.onboardingItem.findMany({
      where: { workerId },
      orderBy: { createdAt: "asc" },
    })

    return items
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const body = await request.json()
    const workerId = parseId(body.workerId)
    if (!workerId) return badRequest("Valid workerId is required")

    const worker = await prisma.worker.findUnique({ where: { id: workerId } })
    if (!worker) return notFound("Worker")

    const existing = await prisma.onboardingItem.count({ where: { workerId } })
    if (existing > 0) return conflict("Onboarding items already exist for this worker")

    const items = await prisma.onboardingItem.createMany({
      data: defaultOnboardingItems.map((item) => ({
        workerId,
        label: item.label,
        category: item.category,
      })),
    })
    void logAction(session.user.id, "onboarding.create", "OnboardingItem", workerId)

    return created({ count: items.count })
  })
}
