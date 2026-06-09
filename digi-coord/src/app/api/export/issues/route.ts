import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { apiHandler, unauthorized } from "@/lib/api-utils"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
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
  })
}
