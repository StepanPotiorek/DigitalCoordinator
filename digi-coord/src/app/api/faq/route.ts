import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  })
  return NextResponse.json(faqs)
}
