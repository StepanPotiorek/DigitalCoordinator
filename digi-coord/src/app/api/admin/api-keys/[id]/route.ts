import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"
import { apiHandler, parseId, notFound } from "@/lib/api-utils"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (!token || token.role !== "ADMIN") return new Response("Unauthorized", { status: 401 })

  return apiHandler(async () => {
    const { id } = await params
    const keyId = parseId(id)
    if (!keyId) return notFound("ApiKey")

    await prisma.apiKey.delete({ where: { id: keyId } })
    return { success: true }
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (!token || token.role !== "ADMIN") return new Response("Unauthorized", { status: 401 })

  return apiHandler(async () => {
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
