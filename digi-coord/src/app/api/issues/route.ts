import { auth } from "@/lib/auth"
import { prisma, createNotificationForAdmins } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest, created, parseId, priorityOrder } from "@/lib/api-utils"
import { validate, createIssueSchema } from "@/lib/validation"
import { Prisma } from "@prisma/client"
import { notifyAdminsOfIssue } from "@/lib/email"
import { logAction } from "@/lib/audit"

export async function GET(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const workerIdStr = searchParams.get("workerId")

    const where: Prisma.IssueWhereInput = {}
    if (status) where.status = status as any
    if (priority) where.priority = priority as any
    if (workerIdStr) {
      const wid = parseId(workerIdStr)
      if (wid) where.workerId = wid
    }

    const issues = await prisma.issue.findMany({
      where,
      include: { worker: { select: { name: true, whatsapp: true } } },
      orderBy: { createdAt: "desc" },
    })

    issues.sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99))
    return issues
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const body = await request.json()
    const data = validate(createIssueSchema, body)

    let workerId = data.workerId ?? undefined

    let workerName = data.workerName || undefined
    if (!workerName || !workerId) {
      const session = await auth()
      if (session?.user?.email) {
        const w = await prisma.worker.findUnique({
          where: { email: session.user.email },
          select: { id: true, name: true },
        })
        if (w) {
          if (!workerName) workerName = w.name
          if (!workerId) workerId = w.id
        }
      }
    }
    workerName = workerName || "Anonymous"

    const issue = await prisma.issue.create({
      data: {
        workerId: workerId ?? undefined,
        issueType: data.issueType,
        description: data.description,
        priority: data.priority || "MEDIUM",
        status: "OPEN",
        mediaUrls: JSON.stringify(data.mediaUrls ?? []),
        situationId: data.situationId ?? undefined,
        contacted: data.contacted ?? undefined,
      },
    })

    const isUrgent = data.priority === "URGENT" || issue.priority === "URGENT"
    await createNotificationForAdmins(
      isUrgent ? "URGENT_ISSUE" : "NEW_ISSUE",
      isUrgent
        ? `URGENT issue reported: ${issue.issueType}`
        : `New issue reported: ${issue.issueType}`,
      `/dashboard/issues/${issue.id}`,
    )

    notifyAdminsOfIssue(workerName, issue.issueType, issue.id, issue.priority)

    const session = await auth()
    void logAction(session?.user?.id, "issue.create", "Issue", issue.id)

    return created(issue)
  })
}
