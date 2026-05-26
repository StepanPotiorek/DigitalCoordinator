import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, forbidden, parseId } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "CLIENT")) {
      return unauthorized()
    }

    const { id } = await params
    const clientId = parseId(id)
    if (!clientId) return notFound("Client")

    if (session.user.role === "CLIENT") {
      const clientRecord = await prisma.client.findUnique({ where: { userId: session.user.id } })
      if (!clientRecord || clientRecord.id !== clientId) return forbidden()
    }

    const client = await prisma.client.findUnique({ where: { id: clientId }, select: { name: true } })
    if (!client) return notFound("Client")

    const workers = await prisma.worker.findMany({
      where: { employer: client.name },
      include: {
        _count: { select: { issues: { where: { status: { not: "RESOLVED" } } } } },
        onboardingItems: { select: { completed: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return workers.map((w) => ({
      id: w.id,
      name: w.name,
      whatsapp: w.whatsapp,
      employer: w.employer,
      arrivalDate: w.arrivalDate,
      onboardingStatus: w.onboardingStatus,
      openIssues: w._count.issues,
      onboardingCompleted: w.onboardingItems.filter((i) => i.completed).length,
      onboardingTotal: w.onboardingItems.length,
    }))
  })
}
