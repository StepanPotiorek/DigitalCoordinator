import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, forbidden, parseId } from "@/lib/api-utils"
import { validate, updateCompanySchema } from "@/lib/validation"
import { logAction } from "@/lib/audit"

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

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        user: { select: { email: true, name: true } },
        communications: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { worker: { select: { name: true } } },
        },
      },
    })

    return company ?? notFound("Company")
  })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const { id } = await params
    const companyId = parseId(id)
    if (!companyId) return notFound("Company")

    const existing = await prisma.company.findUnique({ where: { id: companyId } })
    if (!existing) return notFound("Company")

    const body = await request.json()
    const data = validate(updateCompanySchema, body)

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: data.name ?? existing.name,
        contactEmail: data.contactEmail !== undefined ? data.contactEmail : existing.contactEmail,
        contactPhone: data.contactPhone !== undefined ? data.contactPhone : existing.contactPhone,
        notes: data.notes !== undefined ? data.notes : existing.notes,
        userId: data.userId !== undefined ? data.userId : existing.userId,
      },
    })
    void logAction(session.user.id, "company.update", "Company", companyId)

    return company
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return forbidden()

    const { id } = await params
    const companyId = parseId(id)
    if (!companyId) return notFound("Company")

    const existing = await prisma.company.findUnique({ where: { id: companyId } })
    if (!existing) return notFound("Company")

    await prisma.company.delete({ where: { id: companyId } })
    void logAction(session.user.id, "company.delete", "Company", companyId)
    return null
  })
}
