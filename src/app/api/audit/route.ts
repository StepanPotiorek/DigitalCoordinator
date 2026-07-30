import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiHandler } from "@/lib/api-utils"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const url = new URL(req.url)
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200)
    const offset = parseInt(url.searchParams.get("offset") || "0")
    const action = url.searchParams.get("action")
    const entity = url.searchParams.get("entity")

    const where: Record<string, unknown> = {}
    if (action) where.action = action
    if (entity) where.entity = entity

    const [rows, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: where as any,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where: where as any }),
    ])

    return { rows, total, limit, offset }
  })
}
