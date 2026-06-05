import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound, parseId } from "@/lib/api-utils"
import { unlink } from "fs/promises"
import path from "path"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
    })
    if (!worker) return unauthorized()

    const letterId = parseId((await params).id)
    if (!letterId) return notFound("Letter")

    const letter = await prisma.letter.findFirst({
      where: { id: letterId, workerId: worker.id },
    })
    return letter ?? notFound("Letter")
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const worker = await prisma.worker.findUnique({
      where: { email: session.user.email! },
    })
    if (!worker) return unauthorized()

    const letterId = parseId((await params).id)
    if (!letterId) return notFound("Letter")

    const letter = await prisma.letter.findFirst({
      where: { id: letterId, workerId: worker.id },
    })
    if (!letter) return notFound("Letter")

    // Delete file
    try {
      const filePath = path.join(process.cwd(), "public", letter.photoPath)
      await unlink(filePath)
    } catch { /* file may not exist */ }

    await prisma.letter.delete({ where: { id: letter.id } })
    return { success: true }
  })
}
