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

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalWorkers,
      completedOnboarding,
      pendingOnboarding,
      inProgressOnboarding,
      openIssues,
      accommodationIssues,
      employeeCardStatus,
      escalatedIssues,
      totalFeedback,
      helpedFeedback,
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
      prisma.issue.count({
        where: {
          situationId: { not: null },
          status: { not: "RESOLVED" },
        },
      }),
      prisma.situationFeedback.count(),
      prisma.situationFeedback.count({ where: { helped: true } }),
    ])

    const employeeCardBreakdown: Record<string, number> = {}
    for (const row of employeeCardStatus) {
      employeeCardBreakdown[row.employeeCardStatus] = row._count
    }

    const selfServiceRate = totalFeedback === 0 ? null : Math.round((helpedFeedback / totalFeedback) * 100)

    // Workers stuck on onboarding (PENDING or IN_PROGRESS with no progress in 7+ days)
    const stuckWorkers = await prisma.worker.findMany({
      where: {
        onboardingStatus: { in: ["PENDING", "IN_PROGRESS"] },
        updatedAt: { lt: sevenDaysAgo },
      },
      select: { id: true, name: true, onboardingStatus: true, updatedAt: true },
      orderBy: { updatedAt: "asc" },
      take: 10,
    })

    // Escalated issues (from help flow, not resolved)
    const escalatedIssuesList = await prisma.issue.findMany({
      where: {
        situationId: { not: null },
        status: { not: "RESOLVED" },
      },
      orderBy: { createdAt: "asc" },
      take: 10,
      include: { worker: { select: { name: true } } },
    })

    // Recent all unresolved issues (for general view)
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
      escalatedIssues,
      escalatedIssuesList,
      stuckWorkers,
      selfServiceRate,
      totalFeedback,
      helpedFeedback,
    }
  })
}
