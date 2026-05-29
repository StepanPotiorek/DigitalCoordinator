import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"]
const MAX_SIZE = 50 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const urls: string[] = []

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 },
        )
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "File too large (max 50MB)" },
          { status: 400 },
        )
      }

      const ext = path.extname(file.name) || ".bin"
      const filename = `${randomUUID()}${ext}`
      const bytes = Buffer.from(await file.arrayBuffer())

      const uploadDir = path.join(process.cwd(), "public", "uploads", "issues")
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), bytes)

      urls.push(`/uploads/issues/${filename}`)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
