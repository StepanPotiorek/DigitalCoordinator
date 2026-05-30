import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest } from "@/lib/api-utils"

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
    })
    if (!worker) return badRequest("Worker not found")

    const body = await request.json()
    const { situationId, helped, contacted } = body

    if (!situationId || typeof helped !== "boolean") {
      return badRequest("situationId and helped are required")
    }

    await prisma.situationFeedback.create({
      data: {
        workerId: worker.id,
        situationId,
        helped,
        contacted: contacted ?? null,
      },
    })

    return { success: true }
  })
}
