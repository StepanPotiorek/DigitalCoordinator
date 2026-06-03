import { type Lang, t, langLabels, getNextLang } from "@/lib/translations"

export function LanguageToggle({ lang }: { lang: Lang }) {
  const nextLang = getNextLang(lang)

  return (
    <form action="/api/lang" method="POST" className="inline">
      <input type="hidden" name="lang" value={nextLang} />
      <button
        type="submit"
        className="rounded-lg border border-slate-600 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
        aria-label={t("lang.toggle", lang)}
      >
        {langLabels[nextLang].short}
      </button>
    </form>
  )
}
