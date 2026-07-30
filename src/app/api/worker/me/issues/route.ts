import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findFirst({
      where: { OR: [{ userId: session.user.id! }, { email: session.user.email! }] },
      select: { id: true },
    })
    if (!worker) return []

    const issues = await prisma.issue.findMany({
      where: { workerId: worker.id },
      orderBy: { createdAt: "desc" },
    })

    const parsed = issues.map((i) => {
      let mediaUrls: string[] = []
      try { mediaUrls = JSON.parse(i.mediaUrls) } catch { /* ignore */ }
      return { ...i, mediaUrls }
    })

    return parsed
  })
}
