import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (!token || (token.role !== "ADMIN" && token.role !== "COORDINATOR")) {
    return new Response("Unauthorized", { status: 401 })
  }

  const issues = await prisma.issue.findMany({
    include: { worker: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  const header = "ID,Worker,Type,Description,Priority,Status,Created"
  const rows = issues.map((i) =>
    [
      i.id,
      `"${(i.worker?.name || "unknown").replace(/"/g, '""')}"`,
      `"${i.issueType.replace(/"/g, '""')}"`,
      `"${i.description.replace(/"/g, '""').slice(0, 200)}"`,
      i.priority,
      i.status,
      i.createdAt.toISOString().split("T")[0],
    ].join(","),
  )

  return new Response([header, ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=issues-${new Date().toISOString().split("T")[0]}.csv`,
    },
  })
}
