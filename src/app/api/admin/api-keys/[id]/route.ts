import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { apiHandler, parseId, notFound, unauthorized } from "@/lib/api-utils"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const { id } = await params
    const keyId = parseId(id)
    if (!keyId) return notFound("ApiKey")

    await prisma.apiKey.delete({ where: { id: keyId } })
    return { success: true }
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const { id } = await params
    const keyId = parseId(id)
    if (!keyId) return notFound("ApiKey")

    const body = await req.json()
    const data: Record<string, unknown> = {}
    if (typeof body.active === "boolean") data.active = body.active

    await prisma.apiKey.update({ where: { id: keyId }, data })
    return { success: true }
  })
}
