import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, forbidden, parseId } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COMPANY")) {
      return unauthorized()
    }

    const { id } = await params
    const companyId = parseId(id)
    if (!companyId) return notFound("Company")

    if (session.user.role === "COMPANY") {
      const companyRecord = await prisma.company.findUnique({ where: { userId: session.user.id } })
      if (!companyRecord || companyRecord.id !== companyId) return forbidden()
    }

    const company = await prisma.company.findUnique({ where: { id: companyId }, select: { name: true } })
    if (!company) return notFound("Company")

    const workers = await prisma.worker.findMany({
      where: { employer: company.name },
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
