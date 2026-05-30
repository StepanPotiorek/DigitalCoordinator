"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { type Lang, t, langLabels } from "@/lib/translations"

const CYCLE: Lang[] = ["en", "tl", "cz"]

export function LanguageToggle({ lang }: { lang: Lang }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toggle = useCallback(() => {
    const currentIdx = CYCLE.indexOf(lang)
    const newLang = CYCLE[(currentIdx + 1) % CYCLE.length]
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", newLang)
    window.location.href = `${pathname}?${params.toString()}`
  }, [lang, pathname, searchParams])

  const currentIdx = CYCLE.indexOf(lang)
  const nextLang = CYCLE[(currentIdx + 1) % CYCLE.length]

  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-slate-600 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
      aria-label={t("lang.toggle", lang)}
    >
      {langLabels[nextLang].short}
    </button>
  )
}
