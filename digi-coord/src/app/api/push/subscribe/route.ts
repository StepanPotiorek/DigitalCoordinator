import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { endpoint, keys, userAgent } = await request.json()

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, userAgent: userAgent ?? null },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent: userAgent ?? null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Push subscribe error:", error)
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json()
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 })
    }

    await prisma.pushSubscription.delete({ where: { endpoint } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
