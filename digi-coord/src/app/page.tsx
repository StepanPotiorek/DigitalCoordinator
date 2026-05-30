import Link from "next/link"
import { type Lang, t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, InfoBox } from "@/components/public/page-layout"

interface Props {
  searchParams: Promise<{ lang?: string }>
}

const steps = [
  { key: "register", href: "/register", icon: "📝", color: "bg-blue-500/10 border-blue-700/30 hover:border-blue-500/50" },
  { key: "before", href: "/before-arrival", icon: "✈️", color: "bg-purple-500/10 border-purple-700/30 hover:border-purple-500/50" },
  { key: "employer", href: "/employer-card", icon: "🛂", color: "bg-red-500/10 border-red-700/30 hover:border-red-500/50" },
  { key: "after", href: "/after-arrival", icon: "🏠", color: "bg-green-500/10 border-green-700/30 hover:border-green-500/50" },
  { key: "firstday", href: "/first-day", icon: "💼", color: "bg-amber-500/10 border-amber-700/30 hover:border-amber-500/50" },
]

export default async function Home({ searchParams }: Props) {
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "tl" ? "tl" : langParam === "cz" ? "cz" : "en"

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />

      <PageContainer>
        {/* Welcome hero */}
        <section className="mb-14 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-600/30 bg-yellow-500/10 px-4 py-1.5">
            <span className="text-lg">🇵🇭</span>
            <span className="text-xs font-medium text-yellow-400">{t("home.tag", lang)}</span>
            <span className="text-lg">🇨🇿</span>
          </div>
          <h2 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-yellow-400 via-blue-400 to-red-400 bg-clip-text text-transparent">
              {t("home.welcome", lang)}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            {t("home.subtitle", lang)}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-700/30"
            >
              {t("step.register", lang)} →
            </Link>
            <Link
              href="/guide"
              className="rounded-xl border border-slate-600 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
            >
              {t("nav.guide", lang)}
            </Link>
          </div>
        </section>

        {/* Onboarding steps */}
        <section className="mb-12">
          <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-slate-500">
            {t("home.steps.title", lang)}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <Link
                key={step.key}
                href={step.href}
                className={`group rounded-xl border p-5 backdrop-blur-sm transition ${step.color}`}
              >
                <div className="mb-3 text-2xl">{step.icon}</div>
                <h4 className="mb-1 font-semibold text-white group-hover:text-blue-300">
                  {t(`step.${step.key}`, lang)}
                </h4>
                <p className="text-xs leading-relaxed text-slate-400">
                  {t(`step.${step.key}.desc`, lang)}
                </p>
              </Link>
            ))}
            <Link
              href="/faq"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/30 p-5 backdrop-blur-sm transition hover:border-slate-600"
            >
              <div className="mb-3 text-2xl">❓</div>
              <h4 className="mb-1 font-semibold text-white group-hover:text-blue-300">
                {t("faq.label", lang)}
              </h4>
              <p className="text-xs leading-relaxed text-slate-400">
                {t("faq.subtitle", lang)}
              </p>
            </Link>
            <Link
              href="/report"
              className="group rounded-xl border border-slate-700/50 bg-slate-800/30 p-5 backdrop-blur-sm transition hover:border-slate-600"
            >
              <div className="mb-3 text-2xl">⚠️</div>
              <h4 className="mb-1 font-semibold text-white group-hover:text-blue-300">
                {t("report.problem", lang)}
              </h4>
              <p className="text-xs leading-relaxed text-slate-400">
                {t("report.subtitle", lang)}
              </p>
            </Link>
          </div>
        </section>

        {/* Emergency reminder */}
        <InfoBox color="red" title={t("contact.emergency", lang)}>
          <p className="text-sm text-slate-300">
            {t("contact.emergency.desc", lang)}
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-block text-xs font-medium text-red-400 underline underline-offset-2 hover:text-red-300"
          >
            {t("nav.contact", lang)} →
          </Link>
        </InfoBox>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
