import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const [totalWorkers, workersByStatus, pendingApprovals, totalIssues, issuesByStatus, urgentIssues, recentWorkers, recentIssues, onboardingItems, totalFeedback, helpedFeedback, issuesFromHelp] =
      await Promise.all([
        prisma.worker.count(),
        prisma.worker.groupBy({ by: ["onboardingStatus"], _count: true }),
        prisma.worker.count({ where: { status: "PENDING_APPROVAL" } }),
        prisma.issue.count(),
        prisma.issue.groupBy({ by: ["status"], _count: true }),
        prisma.issue.count({ where: { priority: "URGENT", status: { not: "RESOLVED" } } }),
        prisma.worker.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
        prisma.issue.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { worker: { select: { name: true } } },
        }),
        prisma.onboardingItem.findMany({ select: { completed: true } }),
        prisma.situationFeedback.count(),
        prisma.situationFeedback.count({ where: { helped: true } }),
        prisma.issue.count({ where: { situationId: { not: null } } }),
      ])

    const workersByStatusMap: Record<string, number> = {}
    for (const w of workersByStatus) workersByStatusMap[w.onboardingStatus] = w._count

    const issuesByStatusMap: Record<string, number> = {}
    for (const i of issuesByStatus) issuesByStatusMap[i.status] = i._count

    const totalOnboarding = onboardingItems.length
    const completedOnboarding = onboardingItems.filter((i) => i.completed).length

    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const newWorkersThisMonth = await prisma.worker.count({
      where: { createdAt: { gte: firstOfMonth } },
    })

    const resolvedIssues = issuesByStatusMap["RESOLVED"] || 0
    const resolutionRate =
      totalIssues === 0
        ? 0
        : Math.round((resolvedIssues / totalIssues) * 100)

    const selfServiceRate =
      totalFeedback === 0
        ? null
        : Math.round((helpedFeedback / totalFeedback) * 100)
    const issuesAvoided =
      totalFeedback > 0
        ? Math.round(helpedFeedback * (totalFeedback / (issuesFromHelp || 1)))
        : 0

    return {
      totalWorkers,
      workersByStatus: workersByStatusMap,
      pendingApprovals,
      totalIssues,
      issuesByStatus: issuesByStatusMap,
      urgentIssues,
      newWorkersThisMonth,
      recentWorkers,
      recentIssues,
      onboardingCompletionRate:
        totalOnboarding === 0 ? 0 : Math.round((completedOnboarding / totalOnboarding) * 100),
      totalFeedback,
      helpedFeedback,
      issuesFromHelp,
      resolutionRate,
      selfServiceRate,
      issuesAvoided,
    }
  })
}
