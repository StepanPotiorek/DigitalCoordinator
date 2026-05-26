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
        <Link href={showBack ? "/guide" : "/"} className="flex items-center gap-2">
          {showBack && (
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          )}
          <div>
            <h1 className="text-base font-bold leading-tight text-white">
              {t("site.title", lang)}
            </h1>
            <p className="text-[10px] leading-tight text-blue-300">
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
                className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-600"
              >
                {t("nav.guide", lang)}
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-600"
              >
                {t("nav.contact", lang)}
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                {t("nav.login", lang)}
              </Link>
            </>
          )}
          <LanguageToggle lang={lang} />
        </div>
      </div>
    </header>
  )
}
