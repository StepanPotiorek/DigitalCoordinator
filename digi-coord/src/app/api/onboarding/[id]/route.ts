import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, parseId } from "@/lib/api-utils"
import { validate, toggleOnboardingSchema } from "@/lib/validation"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { id } = await params
    const itemId = parseId(id)
    if (!itemId) return notFound("Item")

    const body = await request.json()
    const data = validate(toggleOnboardingSchema, body)

    const existing = await prisma.onboardingItem.findUnique({ where: { id: itemId } })
    if (!existing) return notFound("Item")

    const completed = data.completed !== undefined ? data.completed : !existing.completed

    const item = await prisma.onboardingItem.update({
      where: { id: itemId },
      data: { completed, completedAt: completed ? new Date() : null },
    })

    return item
  })
}
