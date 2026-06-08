"use client"

import Link from "next/link"
import { useState } from "react"
import { type Lang, t } from "@/lib/translations"
import { LanguageToggle } from "./language-toggle"

interface SiteHeaderProps {
  lang: Lang
  showBack?: boolean
}

export function SiteHeader({ lang, showBack }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = (
    <>
      <Link
        href="/guide"
        onClick={() => setMenuOpen(false)}
        className="rounded-full bg-slate-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 hover:scale-105 active:scale-95"
      >
        📘 {t("nav.guide", lang)}
      </Link>
      <Link
        href="/contact"
        onClick={() => setMenuOpen(false)}
        className="rounded-full bg-slate-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 hover:scale-105 active:scale-95"
      >
        📞 {t("nav.contact", lang)}
      </Link>
      <Link
        href="/login"
        onClick={() => setMenuOpen(false)}
        className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:scale-105 hover:shadow-blue-500/30 active:scale-95"
      >
        🔐 {t("nav.login", lang)}
      </Link>
    </>
  )

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
              <div className="hidden sm:flex items-center gap-2">{navLinks}</div>
              <button
                onClick={() => setMenuOpen(true)}
                className="flex sm:hidden items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          )}
          <LanguageToggle lang={lang} />
        </div>
      </div>

      {!showBack && menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col gap-4 border-r border-white/10 bg-slate-950 p-6 shadow-xl transition-transform duration-200 sm:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-800/50 bg-gradient-to-br from-blue-600/20 to-red-600/20 text-sm">
            🇵🇭
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-3 pt-4">
          <Link
            href="/guide"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            📘 {t("nav.guide", lang)}
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            📞 {t("nav.contact", lang)}
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
          >
            🔐 {t("nav.login", lang)}
          </Link>
        </nav>
      </div>
    </header>
  )
}
