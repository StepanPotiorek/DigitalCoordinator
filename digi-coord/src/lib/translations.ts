import en from "@/i18n/en.json"
import tl from "@/i18n/tl.json"
import cz from "@/i18n/cz.json"

export type Lang = "en" | "tl" | "cz"

const dicts: Record<Lang, Record<string, string>> = { en, tl, cz }

export function t(key: string, lang: Lang): string {
  return dicts[lang]?.[key] || dicts.en?.[key] || key
}

export function getNextLang(currentLang: Lang): Lang {
  const cycle: Lang[] = ["en", "tl", "cz"]
  return cycle[(cycle.indexOf(currentLang) + 1) % cycle.length]
}

export const langLabels: Record<Lang, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  tl: { short: "TL", full: "Tagalog" },
  cz: { short: "CZ", full: "Čeština" },
}
