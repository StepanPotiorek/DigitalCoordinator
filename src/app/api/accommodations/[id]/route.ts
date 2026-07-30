import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, forbidden, parseId } from "@/lib/api-utils"
import { validate, updateAccommodationSchema } from "@/lib/validation"
import { logAction } from "@/lib/audit"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { id } = await params
    const accommodationId = parseId(id)
    if (!accommodationId) return notFound("Accommodation")

    const accommodation = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
      include: { worker: { select: { name: true, whatsapp: true } } },
    })

    return accommodation ?? notFound("Accommodation")
  })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { id } = await params
    const accommodationId = parseId(id)
    if (!accommodationId) return notFound("Accommodation")

    const existing = await prisma.accommodation.findUnique({ where: { id: accommodationId } })
    if (!existing) return notFound("Accommodation")

    const body = await request.json()
    const data = validate(updateAccommodationSchema, body)

    const accommodation = await prisma.accommodation.update({
      where: { id: accommodationId },
      data: {
        address: data.address ?? existing.address,
        room: data.room !== undefined ? data.room : existing.room,
        rules: data.rules !== undefined ? data.rules : existing.rules,
        contactName: data.contactName !== undefined ? data.contactName : existing.contactName,
        contactPhone: data.contactPhone !== undefined ? data.contactPhone : existing.contactPhone,
        mapUrl: data.mapUrl !== undefined ? data.mapUrl : existing.mapUrl,
      },
    })
    void logAction(session.user.id, "accommodation.update", "Accommodation", accommodationId)

    return accommodation
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return forbidden()

    const { id } = await params
    const accommodationId = parseId(id)
    if (!accommodationId) return notFound("Accommodation")

    const existing = await prisma.accommodation.findUnique({ where: { id: accommodationId } })
    if (!existing) return notFound("Accommodation")

    await prisma.accommodation.delete({ where: { id: accommodationId } })
    void logAction(session.user.id, "accommodation.delete", "Accommodation", accommodationId)
    return null
  })
}
