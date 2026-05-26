import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, created, badRequest, parseId } from "@/lib/api-utils"
import { validate, createCommunicationSchema } from "@/lib/validation"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const workerIdStr = searchParams.get("workerId")
    const clientIdStr = searchParams.get("clientId")

    const where: Prisma.CommunicationLogWhereInput = {}
    if (workerIdStr) {
      const wid = parseId(workerIdStr)
      if (wid) where.workerId = wid
    }
    if (clientIdStr) {
      const cid = parseId(clientIdStr)
      if (cid) where.clientId = cid
    }

    const communications = await prisma.communicationLog.findMany({
      where,
      include: { worker: { select: { name: true } }, client: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return communications
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR" && session.user.role !== "CLIENT")) {
      return unauthorized()
    }

    const body = await request.json()
    const data = validate(createCommunicationSchema, body)

    const communication = await prisma.communicationLog.create({
      data: {
        workerId: data.workerId,
        clientId: data.clientId ?? undefined,
        type: data.type || "GENERAL",
        message: data.message,
        createdBy: session.user.name || session.user.email || "Unknown",
      },
    })

    return created(communication)
  })
}
