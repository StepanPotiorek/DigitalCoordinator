import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (!token || (token.role !== "ADMIN" && token.role !== "COORDINATOR")) {
    return new Response("Unauthorized", { status: 401 })
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
}
