import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, created, badRequest } from "@/lib/api-utils"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
const MAX_SIZE = 20 * 1024 * 1024

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })
    if (!worker) return notFound("Worker")

    const docs = await prisma.document.findMany({
      where: { workerId: worker.id },
      orderBy: { uploadedAt: "desc" },
    })

    return docs
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    })
    if (!worker) return notFound("Worker")

    const formData = await request.formData()
    const file = formData.get("file") as File
    const docType = formData.get("type") as string

    if (!file) return badRequest("No file provided")
    if (!docType || !["PASSPORT", "VISA", "CONTRACT", "OTHER"].includes(docType)) {
      return badRequest("Invalid document type")
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest(`File type ${file.type} not allowed`)
    }
    if (file.size > MAX_SIZE) {
      return badRequest("File too large (max 20MB)")
    }

    const ext = path.extname(file.name) || ".bin"
    const filename = `${randomUUID()}${ext}`
    const bytes = Buffer.from(await file.arrayBuffer())

    const uploadDir = path.join(process.cwd(), "public", "uploads", "documents")
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), bytes)

    const doc = await prisma.document.create({
      data: {
        workerId: worker.id,
        type: docType as any,
        filename,
        originalName: file.name,
      },
    })

    return created(doc)
  })
}
