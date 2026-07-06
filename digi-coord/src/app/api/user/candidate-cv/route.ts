import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, badRequest, unauthorized, notFound } from "@/lib/api-utils"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const ALLOWED = ["pdf", "doc", "docx", "jpg", "jpeg", "png"]
const MAX_SIZE = 10 * 1024 * 1024

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const formData = await request.formData()
    const file = formData.get("cv") as File | null
    if (!file) return badRequest("No file provided")

    const ext = file.name.split(".").pop()?.toLowerCase() || ""
    if (!ALLOWED.includes(ext)) return badRequest("Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG")
    if (file.size > MAX_SIZE) return badRequest("File too large. Max 10MB")

    const uuid = randomUUID()
    const filename = `${uuid}.${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads", "cv")
    const filePath = path.join(uploadDir, filename)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const cvPath = `/uploads/cv/${filename}`

    const existing = await prisma.candidateProfile.findUnique({
      where: { userId: session.user.id! },
    })

    if (existing?.cvPath) {
      const oldPath = path.join(process.cwd(), "public", existing.cvPath)
      try { await unlink(oldPath) } catch { /* ignore */ }
    }

    const profile = await prisma.candidateProfile.upsert({
      where: { userId: session.user.id! },
      update: { cvPath },
      create: { userId: session.user.id!, cvPath },
    })

    return { cvPath: profile.cvPath }
  })
}

export async function DELETE() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: session.user.id! },
    })

    if (!profile?.cvPath) return notFound("No CV to delete")

    const oldPath = path.join(process.cwd(), "public", profile.cvPath)
    try { await unlink(oldPath) } catch { /* ignore */ }

    await prisma.candidateProfile.update({
      where: { userId: session.user.id! },
      data: { cvPath: null },
    })

    return { deleted: true }
  })
}
