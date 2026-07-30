import { prisma } from "@/lib/prisma"
import { situations, categories } from "@/lib/situations"
import { NextRequest, NextResponse } from "next/server"

const guidePages = [
  { title: { en: "Worker Guide", tl: "Gabay ng Manggagawa" }, href: "/guide" },
  { title: { en: "Before Arrival", tl: "Bago Dumating" }, href: "/before-arrival" },
  { title: { en: "After Arrival", tl: "Pagkatapos Dumating" }, href: "/after-arrival" },
  { title: { en: "First Day at Work", tl: "Unang Araw sa Trabaho" }, href: "/first-day" },
  { title: { en: "Employer Card & Immigration", tl: "Employer Card at Immigration" }, href: "/employer-card" },
  { title: { en: "Contact", tl: "Kontak" }, href: "/contact" },
  { title: { en: "Report an Issue", tl: "Mag-ulat ng Problema" }, href: "/report" },
  { title: { en: "Register", tl: "Magparehistro" }, href: "/register" },
]

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || ""
  if (!q.trim()) {
    return NextResponse.json({ faq: [], situations: [], guides: [] })
  }

  const query = q.toLowerCase()

  const faq = await prisma.faq.findMany({
    where: {
      OR: [
        { question: { contains: query } },
        { answer: { contains: query } },
      ],
    },
    take: 5,
  })

  const sitResults = situations
    .filter(
      (s) =>
        s.title.en.toLowerCase().includes(query) ||
        s.title.cz.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query),
    )
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      icon: s.icon,
      title: s.title,
      categoryId: s.categoryId,
      category: categories.find((c) => c.id === s.categoryId)?.title.en,
    }))

  const guideResults = guidePages
    .filter(
      (g) =>
        g.title.en.toLowerCase().includes(query) ||
        g.title.tl.toLowerCase().includes(query),
    )
    .slice(0, 3)
    .map((g) => ({
      href: g.href,
      title: g.title,
    }))

  return NextResponse.json({ faq, situations: sitResults, guides: guideResults })
}
