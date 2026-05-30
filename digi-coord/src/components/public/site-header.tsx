import Link from "next/link"
import { type Lang, t } from "@/lib/translations"
import { LanguageToggle } from "./language-toggle"

interface SiteHeaderProps {
  lang: Lang
  showBack?: boolean
}

export function SiteHeader({ lang, showBack }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={showBack ? "/guide" : "/"} className="group flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-800/50 bg-gradient-to-br from-blue-600/20 to-red-600/20 text-sm">
            🇵🇭
          </div>
          {showBack && (
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          )}
          <div>
            <h1 className="text-lg font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent">
                {t("site.title", lang)}
              </span>
            </h1>
            <p className="text-[11px] font-medium leading-tight uppercase tracking-wide text-slate-400">
              {t("site.tagline", lang)}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {showBack ? (
            <Link
              href="/guide"
              className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-600"
            >
              ← {t("nav.back", lang)}
            </Link>
          ) : (
            <>
              <Link
                href="/guide"
                className="rounded-full bg-slate-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 hover:scale-105 active:scale-95"
              >
                📘 {t("nav.guide", lang)}
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-slate-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 hover:scale-105 active:scale-95"
              >
                📞 {t("nav.contact", lang)}
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:scale-105 hover:shadow-blue-500/30 active:scale-95"
              >
                🔐 {t("nav.login", lang)}
              </Link>
            </>
          )}
          <LanguageToggle lang={lang} />
        </div>
      </div>
    </header>
  )
}
