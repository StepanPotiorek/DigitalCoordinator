import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest, parseId } from "@/lib/api-utils"
import { logAction } from "@/lib/audit"

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const { searchParams } = new URL(req.url)
    const workerIdStr = searchParams.get("workerId")
    if (!workerIdStr) return badRequest("workerId is required")

    const workerId = parseId(workerIdStr)
    if (!workerId) return badRequest("Invalid workerId")

    const notes = await prisma.note.findMany({
      where: { workerId },
      orderBy: { createdAt: "desc" },
    })

    return notes
  })
}

export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const body = await req.json()
    const workerId = parseId(body.workerId)
    if (!workerId) return badRequest("Valid workerId is required")
    if (!body.content?.trim()) return badRequest("Content is required")

    const note = await prisma.note.create({
      data: {
        workerId,
        content: body.content.trim(),
        createdBy: session.user.name || session.user.email || "Unknown",
      },
    })

    void logAction(session.user.id, "note.create", "Note", note.id)

    return new Response(JSON.stringify(note), { status: 201 })
  })
}
