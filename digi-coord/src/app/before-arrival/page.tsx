import Link from "next/link"
import { type Lang, t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader, InfoBox, ChecklistItem } from "@/components/public/page-layout"

interface Props {
  searchParams: Promise<{ lang?: string }>
}

const checklist = [
  "Valid passport (minimum 6 months validity)",
  "Employment visa / work permit",
  "Employment contract (signed copy)",
  "Travel insurance documents",
  "Medical records and prescriptions",
  "Passport-sized photos (5-10 pieces)",
  "Bank statements (last 3 months)",
  "Educational certificates (translated)",
]

const tips = [
  {
    title: "Currency",
    text: "Czech Republic uses Czech Koruna (CZK). Cards are widely accepted, but carry some cash for small shops.",
    fil: "Ang Czech Republic ay gumagamit ng Czech Koruna (CZK). Tanggap ang card, pero magdala ng konting cash.",
  },
  {
    title: "Time Zone",
    text: "Central European Time (CET, UTC+1). Summer time (CEST, UTC+2) from March to October.",
    fil: "Central European Time (CET, UTC+1). Summer time (CEST, UTC+2) mula Marso hanggang Oktubre.",
  },
  {
    title: "Emergency Numbers",
    text: "112 — General emergency. 155 — Medical emergency. 158 — Police.",
    fil: "112 — Pangkalahatang emergency. 155 — Medikal. 158 — Pulis.",
  },
  {
    title: "Weather",
    text: "Summer: 20-35°C. Winter: -5 to 5°C. Pack layers and a warm jacket.",
    fil: "Tag-init: 20-35°C. Taglamig: -5 hanggang 5°C. Magdala ng jacket at layers.",
  },
  {
    title: "Language",
    text: "Czech is the official language. Learning basic Czech phrases helps a lot.",
    fil: "Czech ang opisyal na wika. Makakatulong ang pag-aral ng basic Czech phrases.",
  },
  {
    title: "Transport",
    text: "Prague has metro, tram, and bus. Buy tickets via mobile app or at machines.",
    fil: "Ang Prague ay may metro, tram, at bus. Bumili ng ticket sa app o sa machines.",
  },
]

export default async function BeforeArrivalPage({ searchParams }: Props) {
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "tl" ? "tl" : "en"

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} showBack />

      <PageContainer>
        <PageHeader
          title={t("before.title", lang)}
          subtitle={t("before.subtitle", lang)}
          badge="STEP 1"
          badgeColor="purple"
        />

        <section className="mb-12">
          <h2 className="mb-5 text-xl font-semibold text-white">{t("before.checklist", lang)}</h2>
          <div className="space-y-2">
            {checklist.map((item) => (
              <ChecklistItem key={item}>{item}</ChecklistItem>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-xl font-semibold text-white">{t("before.tips", lang)}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {tips.map((tip) => (
              <div key={tip.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
                <h3 className="mb-1.5 font-semibold text-blue-400">{tip.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <InfoBox title={t("before.airport", lang)} color="blue">
          <ol className="space-y-2.5 text-sm text-slate-300">
            <li className="flex gap-3"><span className="font-bold text-blue-400">1.</span><span>After landing, follow signs to Passport Control. Have your passport and visa ready.</span></li>
            <li className="flex gap-3"><span className="font-bold text-blue-400">2.</span><span>Collect your baggage from the carousel. Check your luggage tag.</span></li>
            <li className="flex gap-3"><span className="font-bold text-blue-400">3.</span><span>Exit through the green "Nothing to Declare" customs channel (unless you have goods to declare).</span></li>
            <li className="flex gap-3"><span className="font-bold text-blue-400">4.</span><span>Your coordinator or driver will be waiting in the arrival hall with a sign with your name.</span></li>
            <li className="flex gap-3"><span className="font-bold text-blue-400">5.</span><span>Buy a prepaid SIM card at the airport if you don't have international roaming.</span></li>
          </ol>
        </InfoBox>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
