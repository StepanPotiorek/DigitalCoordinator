import { auth } from "@/lib/auth"
import { prisma, createNotification } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, forbidden, parseId } from "@/lib/api-utils"
import { validate, updateIssueSchema } from "@/lib/validation"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { id } = await params
    const issueId = parseId(id)
    if (!issueId) return notFound("Issue")

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: { worker: { select: { name: true, whatsapp: true } } },
    })

    return issue ?? notFound("Issue")
  })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { id } = await params
    const issueId = parseId(id)
    if (!issueId) return notFound("Issue")

    const existing = await prisma.issue.findUnique({ where: { id: issueId } })
    if (!existing) return notFound("Issue")

    const body = await request.json()
    const data = validate(updateIssueSchema, body)

    if (session.user.role !== "ADMIN" && data.priority) {
      return forbidden()
    }

    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: data.status ?? existing.status,
        priority: data.priority ?? existing.priority,
        description: data.description ?? existing.description,
        issueType: data.issueType ?? existing.issueType,
      },
    })

    if (data.status === "RESOLVED" && existing.status !== "RESOLVED") {
      await createNotification(
        "ISSUE_RESOLVED",
        `Issue resolved: ${issue.issueType}`,
        `/dashboard/issues/${issue.id}`,
      )
    }
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return forbidden()

    const { id } = await params
    const issueId = parseId(id)
    if (!issueId) return notFound("Issue")

    const existing = await prisma.issue.findUnique({ where: { id: issueId } })
    if (!existing) return notFound("Issue")

    await prisma.issue.delete({ where: { id: issueId } })
    return null
  })
}
