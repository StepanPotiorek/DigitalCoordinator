import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, forbidden, parseId } from "@/lib/api-utils"
import { validate, updateWorkerSchema } from "@/lib/validation"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { id } = await params
    const workerId = parseId(id)
    if (!workerId) return notFound("Worker")

    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      include: { onboardingItems: true, accommodationDetail: true, issues: { take: 5, orderBy: { createdAt: "desc" } } },
    })

    return worker ?? notFound("Worker")
  })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { id } = await params
    const workerId = parseId(id)
    if (!workerId) return notFound("Worker")

    const existing = await prisma.worker.findUnique({ where: { id: workerId } })
    if (!existing) return notFound("Worker")

    const body = await request.json()
    const data = validate(updateWorkerSchema, body)

    const worker = await prisma.worker.update({
      where: { id: workerId },
      data: {
        name: data.name ?? existing.name,
        whatsapp: data.whatsapp ?? existing.whatsapp,
        email: data.email !== undefined ? data.email : existing.email,
        employer: data.employer !== undefined ? data.employer : existing.employer,
        accommodation: data.accommodation !== undefined ? data.accommodation : existing.accommodation,
        arrivalDate: data.arrivalDate !== undefined ? (data.arrivalDate ? new Date(data.arrivalDate) : null) : existing.arrivalDate,
        emergencyContactName: data.emergencyContactName !== undefined ? data.emergencyContactName : existing.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone !== undefined ? data.emergencyContactPhone : existing.emergencyContactPhone,
        onboardingStatus: data.onboardingStatus ?? existing.onboardingStatus,
      },
    })

    return worker
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return forbidden()

    const { id } = await params
    const workerId = parseId(id)
    if (!workerId) return notFound("Worker")

    const existing = await prisma.worker.findUnique({ where: { id: workerId } })
    if (!existing) return notFound("Worker")

    await prisma.worker.delete({ where: { id: workerId } })
    return null
  })
}
