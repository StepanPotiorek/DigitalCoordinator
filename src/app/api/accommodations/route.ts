import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest, notFound, conflict, created, parseId } from "@/lib/api-utils"
import { validate, createAccommodationSchema } from "@/lib/validation"
import { logAction } from "@/lib/audit"

export async function GET(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const workerIdStr = searchParams.get("workerId")

    if (workerIdStr) {
      const workerId = parseId(workerIdStr)
      if (!workerId) return badRequest("Invalid workerId")
      const accommodation = await prisma.accommodation.findUnique({ where: { workerId } })
      return accommodation ?? null
    }

    const accommodations = await prisma.accommodation.findMany({
      include: { worker: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    })
    return accommodations
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const body = await request.json()
    const data = validate(createAccommodationSchema, body)

    const worker = await prisma.worker.findUnique({ where: { id: data.workerId } })
    if (!worker) return notFound("Worker")

    const existing = await prisma.accommodation.findUnique({ where: { workerId: data.workerId } })
    if (existing) return conflict("Accommodation already exists for this worker")

    const accommodation = await prisma.accommodation.create({ data })
    void logAction(session.user.id, "accommodation.create", "Accommodation", accommodation.id)
    return created(accommodation)
  })
}
