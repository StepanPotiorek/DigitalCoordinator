import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, created, badRequest } from "@/lib/api-utils"
import { validate, createClientSchema } from "@/lib/validation"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const clients = await prisma.client.findMany({
      include: { _count: { select: { communications: true } }, user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    })

    const workers = await prisma.worker.groupBy({ by: ["employer"], _count: true })
    const workerCountMap = new Map(workers.map((w) => [w.employer, w._count]))

    return clients.map((c) => ({ ...c, workerCount: c.name ? workerCountMap.get(c.name) || 0 : 0 }))
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const body = await request.json()
    const data = validate(createClientSchema, body)

    const client = await prisma.client.create({
      data: {
        name: data.name,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        notes: data.notes || null,
        userId: data.userId ?? null,
      },
    })

    return created(client)
  })
}
