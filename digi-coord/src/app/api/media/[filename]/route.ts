import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params

    const safe = filename.replace(/\.\./g, "").replace(/\//g, "")
    const ext = path.extname(safe).toLowerCase()
    const contentType = MIME_MAP[ext] || "application/octet-stream"

    const dirs = ["issues", "documents", "letters"]
    for (const dir of dirs) {
      try {
        const filePath = path.join(process.cwd(), "public", "uploads", dir, safe)
        const file = await readFile(filePath)
        return new NextResponse(file, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        })
      } catch { /* try next dir */ }
    }

    return new NextResponse("File not found", { status: 404 })
  } catch {
    return new NextResponse("File not found", { status: 404 })
  }
}
