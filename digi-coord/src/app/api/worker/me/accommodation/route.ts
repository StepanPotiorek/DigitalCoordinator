import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
      include: { accommodationDetail: true },
    })
    if (!worker) return notFound("Worker")

    return {
      accommodation: worker.accommodation,
      accommodationDetail: worker.accommodationDetail,
    }
  })
}
