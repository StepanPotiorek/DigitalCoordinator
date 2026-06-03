import Link from "next/link"
import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader } from "@/components/public/page-layout"
import { prisma } from "@/lib/prisma"
import { FAQList } from "./faq-list"

export const dynamic = "force-dynamic"

export default async function FAQPage() {
  const lang = await getLang()

  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  })

  const grouped = faqs.reduce(
    (acc, faq) => {
      const cat = faq.category || "General"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(faq)
      return acc
    },
    {} as Record<string, typeof faqs>
  )

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} showBack />

      <PageContainer>
        <PageHeader
          title={t("faq.title", lang)}
          subtitle={t("faq.subtitle", lang)}
        />

        <FAQList grouped={grouped} />
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
