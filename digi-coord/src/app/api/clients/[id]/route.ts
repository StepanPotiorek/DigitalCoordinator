import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, forbidden, parseId } from "@/lib/api-utils"
import { validate, updateClientSchema } from "@/lib/validation"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "CLIENT")) {
      return unauthorized()
    }

    const { id } = await params
    const clientId = parseId(id)
    if (!clientId) return notFound("Client")

    if (session.user.role === "CLIENT") {
      const clientRecord = await prisma.client.findUnique({ where: { userId: session.user.id } })
      if (!clientRecord || clientRecord.id !== clientId) return forbidden()
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        user: { select: { email: true, name: true } },
        communications: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { worker: { select: { name: true } } },
        },
      },
    })

    return client ?? notFound("Client")
  })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const { id } = await params
    const clientId = parseId(id)
    if (!clientId) return notFound("Client")

    const existing = await prisma.client.findUnique({ where: { id: clientId } })
    if (!existing) return notFound("Client")

    const body = await request.json()
    const data = validate(updateClientSchema, body)

    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: data.name ?? existing.name,
        contactEmail: data.contactEmail !== undefined ? data.contactEmail : existing.contactEmail,
        contactPhone: data.contactPhone !== undefined ? data.contactPhone : existing.contactPhone,
        notes: data.notes !== undefined ? data.notes : existing.notes,
        userId: data.userId !== undefined ? data.userId : existing.userId,
      },
    })

    return client
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return forbidden()

    const { id } = await params
    const clientId = parseId(id)
    if (!clientId) return notFound("Client")

    const existing = await prisma.client.findUnique({ where: { id: clientId } })
    if (!existing) return notFound("Client")

    await prisma.client.delete({ where: { id: clientId } })
    return null
  })
}
