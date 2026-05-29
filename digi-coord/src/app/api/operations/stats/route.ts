import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session) return unauthorized()
    if (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR") {
      return unauthorized()
    }

    const [
      totalWorkers,
      completedOnboarding,
      pendingOnboarding,
      inProgressOnboarding,
      openIssues,
      accommodationIssues,
      employeeCardStatus,
    ] = await Promise.all([
      prisma.worker.count(),
      prisma.worker.count({ where: { onboardingStatus: "COMPLETED" } }),
      prisma.worker.count({ where: { onboardingStatus: "PENDING" } }),
      prisma.worker.count({ where: { onboardingStatus: "IN_PROGRESS" } }),
      prisma.issue.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.issue.count({ where: { issueType: "Accommodation", status: { not: "RESOLVED" } } }),
      prisma.worker.groupBy({
        by: ["employeeCardStatus"],
        _count: true,
      }),
    ])

    const employeeCardBreakdown: Record<string, number> = {}
    for (const row of employeeCardStatus) {
      employeeCardBreakdown[row.employeeCardStatus] = row._count
    }

    const recentIssues = await prisma.issue.findMany({
      where: { status: { not: "RESOLVED" } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { worker: { select: { name: true } } },
    })

    return {
      totalWorkers,
      completedOnboarding,
      pendingOnboarding,
      inProgressOnboarding,
      openIssues,
      accommodationIssues,
      employeeCardBreakdown,
      recentIssues,
    }
  })
}
