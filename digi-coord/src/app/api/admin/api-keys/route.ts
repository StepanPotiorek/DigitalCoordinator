import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"
import { apiHandler } from "@/lib/api-utils"
import crypto from "crypto"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (!token || token.role !== "ADMIN") return new Response("Unauthorized", { status: 401 })

  return apiHandler(async () => {
    const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } })
    return keys.map((k) => ({ id: k.id, name: k.name, scopes: k.scopes, active: k.active, lastUsedAt: k.lastUsedAt, createdAt: k.createdAt }))
  })
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  if (!token || token.role !== "ADMIN") return new Response("Unauthorized", { status: 401 })

  return apiHandler(async () => {
    const { name, scopes } = await req.json()
    if (!name) return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 })

    const rawKey = `dc_${crypto.randomBytes(32).toString("hex")}`
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex")

    await prisma.apiKey.create({
      data: { name, keyHash, scopes: scopes || "read", active: true },
    })

    return { key: rawKey, message: "Save this key — it will not be shown again." }
  })
}
