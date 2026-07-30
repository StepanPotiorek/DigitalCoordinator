import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import { apiHandler, badRequest, unauthorized } from "@/lib/api-utils"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"]
const MAX_SIZE = 50 * 1024 * 1024

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) return badRequest("No files provided")

    const urls: string[] = []

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return badRequest(`File type ${file.type} is not allowed`)
      }

      if (file.size > MAX_SIZE) {
        return badRequest("File too large (max 50MB)")
      }

      const ext = path.extname(file.name) || ".bin"
      const filename = `${randomUUID()}${ext}`
      const bytes = Buffer.from(await file.arrayBuffer())

      const uploadDir = path.join(process.cwd(), "public", "uploads", "issues")
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), bytes)

      urls.push(`/uploads/issues/${filename}`)
    }

    return { urls }
  })
}
