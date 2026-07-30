import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { faqId, helpful } = await req.json()
    if (typeof faqId !== "number" || typeof helpful !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    const faq = await prisma.faq.findUnique({ where: { id: faqId } })
    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }
    await prisma.faqFeedback.create({
      data: { faqId, helpful },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
