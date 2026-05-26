import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const [totalWorkers, workersByStatus, totalIssues, issuesByStatus, urgentIssues, recentWorkers, recentIssues, onboardingItems] =
      await Promise.all([
        prisma.worker.count(),
        prisma.worker.groupBy({ by: ["onboardingStatus"], _count: true }),
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

    return {
      totalWorkers,
      workersByStatus: workersByStatusMap,
      totalIssues,
      issuesByStatus: issuesByStatusMap,
      urgentIssues,
      newWorkersThisMonth,
      recentWorkers,
      recentIssues,
      onboardingCompletionRate:
        totalOnboarding === 0 ? 0 : Math.round((completedOnboarding / totalOnboarding) * 100),
    }
  })
}
