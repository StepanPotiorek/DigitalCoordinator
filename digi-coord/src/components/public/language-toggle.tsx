import { type Lang, t, langLabels, getNextLang } from "@/lib/translations"

export function LanguageToggle({ lang }: { lang: Lang }) {
  const nextLang = getNextLang(lang)

  return (
    <form action="/api/lang" method="POST" className="inline">
      <input type="hidden" name="lang" value={nextLang} />
      <button
        type="submit"
        className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-fg-muted transition hover:bg-surface-hover hover:text-fg"
        aria-label={t("lang.toggle", lang)}
      >
        {langLabels[nextLang].short}
      </button>
    </form>
  )
}
