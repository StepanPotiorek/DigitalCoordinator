import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest } from "@/lib/api-utils"
import { sendWorkerMessageAlert } from "@/lib/email"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })
    if (!worker) return unauthorized()

    const messages = await prisma.communicationLog.findMany({
      where: { workerId: worker.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, message: true, createdAt: true },
    })

    return messages
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
      select: { id: true, name: true },
    })
    if (!worker) return unauthorized()

    const { message } = await request.json()
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return badRequest("Message is required")
    }

    const comm = await prisma.communicationLog.create({
      data: {
        workerId: worker.id,
        type: "GENERAL",
        message: `📩 Worker message: ${message.trim()}`,
        createdBy: `${worker.name} (worker)`,
      },
    })

    sendWorkerMessageAlert("gleestepan@gmail.com", worker.name, message.trim(), worker.id)

    return { success: true, id: comm.id }
  })
}
