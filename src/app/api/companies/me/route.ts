import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "COMPANY") {
      return unauthorized()
    }

    const companyRecord = await prisma.company.findUnique({
      where: { userId: session.user.id },
      include: {
        communications: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { worker: { select: { name: true } } },
        },
      },
    })

    if (!companyRecord) return notFound("Company")

    const workers = await prisma.worker.findMany({
      where: { employer: companyRecord.name },
      include: {
        _count: {
          select: { issues: { where: { status: { not: "RESOLVED" } } } },
        },
        onboardingItems: { select: { completed: true } },
        accommodationDetail: { select: { address: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const workersData = workers.map((w) => ({
      id: w.id,
      name: w.name,
      whatsapp: w.whatsapp,
      arrivalDate: w.arrivalDate,
      onboardingStatus: w.onboardingStatus,
      employeeCardStatus: w.employeeCardStatus,
      accommodationAddress: w.accommodationDetail?.address || null,
      openIssues: w._count.issues,
      onboardingCompleted: w.onboardingItems.filter((i) => i.completed).length,
      onboardingTotal: w.onboardingItems.length,
    }))

    return {
      company: companyRecord,
      workers: workersData,
    }
  })
}
