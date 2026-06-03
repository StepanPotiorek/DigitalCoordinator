import Link from "next/link"
import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader, SiteFooter } from "@/components/public/page-layout"
import { categories, situations } from "@/lib/situations"
import { TemplateCard } from "@/components/guide/template-card"

export default async function TemplatesPage() {
  const lang = await getLang()

  const grouped = categories.map((cat) => ({
    ...cat,
    items: situations.filter((s) => s.categoryId === cat.id),
  }))

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />

      <PageContainer>
        <PageHeader
          title="Communication Templates"
          subtitle="Ready-to-use messages for common situations — just copy and send."
          badge="💬"
          badgeColor="emerald"
        />

        <div className="mb-6">
          <Link
            href="/guide"
            className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-slate-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("nav.back", lang)}
          </Link>
        </div>

        <div className="space-y-20">
          {grouped.map(
            (cat) =>
              cat.items.length > 0 && (
                <section key={cat.id}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <h2 className="text-2xl font-bold text-white">
                      {cat.title.en}
                    </h2>
                    <span className="text-sm text-slate-500">/ {cat.title.cz}</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {cat.items.map((sit) => (
                      <TemplateCard
                        key={sit.id}
                        icon={sit.icon}
                        titleEn={sit.title.en}
                        titleCz={sit.title.cz}
                        messageEn={sit.message.en}
                        messageCz={sit.message.cz}
                      />
                    ))}
                  </div>
                </section>
              ),
          )}
        </div>
      </PageContainer>

      <SiteFooter />
    </div>
  )
}
