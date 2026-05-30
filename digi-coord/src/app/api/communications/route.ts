import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, created, badRequest, parseId } from "@/lib/api-utils"
import { validate, createCommunicationSchema } from "@/lib/validation"
import { logAction } from "@/lib/audit"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const workerIdStr = searchParams.get("workerId")
    const companyIdStr = searchParams.get("companyId")

    const where: Prisma.CommunicationLogWhereInput = {}
    if (workerIdStr) {
      const wid = parseId(workerIdStr)
      if (wid) where.workerId = wid
    }
    if (companyIdStr) {
      const cid = parseId(companyIdStr)
      if (cid) where.companyId = cid
    }

    const communications = await prisma.communicationLog.findMany({
      where,
      include: { worker: { select: { name: true } }, company: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return communications
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR" && session.user.role !== "COMPANY")) {
      return unauthorized()
    }

    const body = await request.json()
    const data = validate(createCommunicationSchema, body)

    const communication = await prisma.communicationLog.create({
      data: {
        workerId: data.workerId,
        companyId: data.companyId ?? undefined,
        type: data.type || "GENERAL",
        message: data.message,
        createdBy: session.user.name || session.user.email || "Unknown",
      },
    })
    void logAction(session.user.id, "communication.create", "CommunicationLog", communication.id)

    return created(communication)
  })
}
