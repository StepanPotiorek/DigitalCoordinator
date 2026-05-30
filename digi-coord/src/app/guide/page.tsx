import Link from "next/link"
import { type Lang, t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader } from "@/components/public/page-layout"

interface Props {
  searchParams: Promise<{ lang?: string }>
}

const guides = [
  {
    key: "employer", href: "/employer-card", icon: "🛂",
    color: "bg-red-500/10 border-red-700/30 hover:border-red-500/50",
  },
  {
    key: "before", href: "/before-arrival", icon: "✈️",
    color: "bg-purple-500/10 border-purple-700/30 hover:border-purple-500/50",
  },
  {
    key: "after", href: "/after-arrival", icon: "🏠",
    color: "bg-green-500/10 border-green-700/30 hover:border-green-500/50",
  },
  {
    key: "firstday", href: "/first-day", icon: "💼",
    color: "bg-amber-500/10 border-amber-700/30 hover:border-amber-500/50",
  },
  {
    key: "faq", href: "/faq", icon: "❓",
    color: "bg-blue-500/10 border-blue-700/30 hover:border-blue-500/50",
  },
  {
    key: "contact", href: "/contact", icon: "📞",
    color: "bg-slate-500/10 border-slate-700/30 hover:border-slate-500/50",
  },
]

export default async function GuidePage({ searchParams }: Props) {
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "tl" ? "tl" : langParam === "cz" ? "cz" : "en"

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />

      <PageContainer>
        <PageHeader
          title={t("guide.title", lang)}
          subtitle={t("guide.subtitle", lang)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((g) => (
            <Link
              key={g.href}
              href={`${g.href}?lang=${lang}`}
              className={`group rounded-xl border p-5 backdrop-blur-sm transition ${g.color}`}
            >
              <div className="mb-3 text-2xl">{g.icon}</div>
              <h2 className="mb-1 font-semibold text-white group-hover:text-blue-300">
                {t(`step.${g.key}`, lang)}
              </h2>
              <p className="text-xs leading-relaxed text-slate-400">
                {t(`step.${g.key}.desc`, lang)}
              </p>
            </Link>
          ))}
        </div>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
