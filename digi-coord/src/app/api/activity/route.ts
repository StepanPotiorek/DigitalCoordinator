import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiHandler } from "@/lib/api-utils"
import { getToken } from "next-auth/jwt"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (!token) return new Response("Unauthorized", { status: 401 })

  return apiHandler(async () => {
    const url = new URL(req.url)
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50)

    const [auditLogs, recentIssues, recentNotifications] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.issue.findMany({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { worker: { select: { name: true } } },
      }),
      prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    return {
      auditLogs,
      openIssues: recentIssues,
      notifications: recentNotifications,
    }
  })
}
