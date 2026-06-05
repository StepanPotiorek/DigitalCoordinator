import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest } from "@/lib/api-utils"
import { analyzeLetterWithAI } from "@/lib/openai"
import { writeFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
    })
    if (!worker) return unauthorized()

    const letters = await prisma.letter.findMany({
      where: { workerId: worker.id },
      orderBy: { createdAt: "desc" },
    })

    return letters
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
    })
    if (!worker) return unauthorized()

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return badRequest("No file provided")

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const allowed = ["jpg", "jpeg", "png", "gif", "webp", "pdf"]
    if (!allowed.includes(ext)) return badRequest("Invalid file type. Accepted: jpg, jpeg, png, gif, webp, pdf")

    if (file.size > 20 * 1024 * 1024) return badRequest("File too large. Max 20MB")

    const uuid = randomUUID()
    const filename = `${uuid}.${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads", "letters")
    const filePath = path.join(uploadDir, filename)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const mimeType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`

    const letter = await prisma.letter.create({
      data: {
        workerId: worker.id,
        photoPath: `/uploads/letters/${filename}`,
        mimeType,
      },
    })

    // Try AI analysis in the background
    const isImage = mimeType.startsWith("image/")
    if (isImage) {
      const base64 = Buffer.from(bytes).toString("base64")
      const aiResult = await analyzeLetterWithAI(base64, mimeType)

      if (aiResult) {
        const deadline = aiResult.deadline ? new Date(aiResult.deadline) : null

        const updated = await prisma.letter.update({
          where: { id: letter.id },
          data: {
            sender: aiResult.sender,
            purpose: aiResult.purpose,
            actionRequired: aiResult.actionRequired,
            deadline,
            explanation: aiResult.explanation,
            aiRaw: JSON.stringify(aiResult),
            aiConfidence: 1.0,
          },
        })
        return updated
      }
    }

    return letter
  })
}
