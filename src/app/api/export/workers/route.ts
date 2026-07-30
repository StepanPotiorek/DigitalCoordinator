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

    const workers = await prisma.worker.findMany({
      orderBy: { createdAt: "desc" },
    })

    const header = "ID,Name,WhatsApp,Email,Employer,OnboardingStatus,EmployeeCardStatus,Created"
    const rows = workers.map((w) =>
      [
        w.id,
        `"${w.name.replace(/"/g, '""')}"`,
        w.whatsapp,
        w.email || "",
        `"${(w.employer || "").replace(/"/g, '""')}"`,
        w.onboardingStatus,
        w.employeeCardStatus,
        w.createdAt.toISOString().split("T")[0],
      ].join(","),
    )

    return new Response([header, ...rows].join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=workers-${new Date().toISOString().split("T")[0]}.csv`,
      },
    })
  })
}
