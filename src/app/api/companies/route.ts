import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, created, badRequest } from "@/lib/api-utils"
import { validate, createCompanySchema } from "@/lib/validation"
import { logAction } from "@/lib/audit"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const companies = await prisma.company.findMany({
      include: { _count: { select: { communications: true } }, user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    })

    const workers = await prisma.worker.groupBy({ by: ["employer"], _count: true })
    const workerCountMap = new Map(workers.map((w) => [w.employer, w._count]))

    return companies.map((c) => ({ ...c, workerCount: c.name ? workerCountMap.get(c.name) || 0 : 0 }))
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const body = await request.json()
    const data = validate(createCompanySchema, body)

    const company = await prisma.company.create({
      data: {
        name: data.name,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        notes: data.notes || null,
        userId: data.userId ?? null,
      },
    })
    void logAction(session.user.id, "company.create", "Company", company.id)

    return created(company)
  })
}
