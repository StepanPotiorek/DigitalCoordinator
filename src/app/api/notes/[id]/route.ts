import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, forbidden, parseId } from "@/lib/api-utils"
import { logAction } from "@/lib/audit"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return forbidden()

    const { id } = await params
    const noteId = parseId(id)
    if (!noteId) return notFound("Note")

    const existing = await prisma.note.findUnique({ where: { id: noteId } })
    if (!existing) return notFound("Note")

    await prisma.note.delete({ where: { id: noteId } })
    void logAction(session.user.id, "note.delete", "Note", noteId)

    return null
  })
}
