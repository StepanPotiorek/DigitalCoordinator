import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { apiHandler, unauthorized, badRequest } from "@/lib/api-utils"
import crypto from "crypto"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } })
    return keys.map((k) => ({ id: k.id, name: k.name, scopes: k.scopes, active: k.active, lastUsedAt: k.lastUsedAt, createdAt: k.createdAt }))
  })
}

export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") return unauthorized()

    const { name, scopes } = await req.json()
    if (!name) return badRequest("Name is required")

    const rawKey = `dc_${crypto.randomBytes(32).toString("hex")}`
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex")

    await prisma.apiKey.create({
      data: { name, keyHash, scopes: scopes || "read", active: true },
    })

    return { key: rawKey, message: "Save this key — it will not be shown again." }
  })
}
