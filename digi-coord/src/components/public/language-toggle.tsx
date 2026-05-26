"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { type Lang, t, langLabels } from "@/lib/translations"

export function LanguageToggle({ lang }: { lang: Lang }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toggle = useCallback(() => {
    const newLang = lang === "en" ? "tl" : "en"
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", newLang)
    window.location.href = `${pathname}?${params.toString()}`
  }, [lang, pathname, searchParams])

  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-slate-600 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
      aria-label={t("lang.toggle", lang)}
    >
      {langLabels[lang === "en" ? "tl" : "en"].short}
    </button>
  )
}
