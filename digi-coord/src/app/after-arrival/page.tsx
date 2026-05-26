import Link from "next/link"
import { type Lang, t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader, InfoBox, ChecklistItem } from "@/components/public/page-layout"
import { NearbySearchButton } from "@/components/location/nearby-search-button"

interface Props {
  searchParams: Promise<{ lang?: string }>
}

const steps = [
  {
    title: "Check into Accommodation",
    items: [
      "Confirm your address with the coordinator",
      "Collect keys and check your room",
      "Connect to Wi-Fi (ask your coordinator for the password)",
      "Check that everything works (water, electricity, heating)",
      "Read the house rules carefully",
    ],
  },
  {
    title: "Get a SIM Card",
    items: [
      "Visit any mobile operator store (O2, T-Mobile, or Vodafone)",
      "Bring your passport for registration",
      "Choose a prepaid or monthly plan",
      "Ask the staff to activate the SIM card",
      "Install WhatsApp and save your coordinator's number",
    ],
    nearby: [
      { query: "O2 prodejna", label: "O2 stores nearby" },
      { query: "T-Mobile prodejna", label: "T-Mobile stores nearby" },
      { query: "Vodafone prodejna", label: "Vodafone stores nearby" },
    ],
  },
  {
    title: "Open a Bank Account",
    items: [
      "Bring your passport and employment contract to a bank",
      "Popular banks: Česká spořitelna, ČSOB, KB, Moneta",
      "Some banks allow online application",
      "Request a debit card (will be sent by mail)",
      "Ask about mobile banking app setup",
    ],
    nearby: [
      { query: "Česká spořitelna", label: "Česká spořitelna nearby" },
      { query: "ČSOB banka", label: "ČSOB nearby" },
      { query: "Komerční banka KB", label: "KB nearby" },
    ],
  },
  {
    title: "Emergency Contacts",
    items: [
      "Save 112 for general emergencies",
      "Save your coordinator's number",
      "Save your employer's number",
      "Save your accommodation contact",
      "Share your location with your coordinator",
    ],
  },
  {
    title: "Adaptation Tips",
    items: [
      "Weather changes frequently — dress in layers",
      "A friendly 'Dobrý den' (hello) goes a long way",
      "Download PID Lítačka app for public transport tickets",
      "Try local food — Asian shops are available in bigger cities",
      "Join Filipino community groups on Facebook for support",
    ],
  },
]

export default async function AfterArrivalPage({ searchParams }: Props) {
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "tl" ? "tl" : "en"

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} showBack />

      <PageContainer>
        <PageHeader
          title={t("after.title", lang)}
          subtitle={t("after.subtitle", lang)}
          badge="STEP 2"
          badgeColor="green"
        />

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900/50 text-xs font-bold text-blue-400">
                  {i + 1}
                </span>
                <h2 className="text-lg font-semibold text-white">{step.title}</h2>
              </div>
              <div className="space-y-1.5">
                {step.items.map((item) => (
                  <ChecklistItem key={item}>{item}</ChecklistItem>
                ))}
              </div>
              {"nearby" in step && step.nearby && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {step.nearby.map((n: { query: string; label: string }) => (
                    <NearbySearchButton key={n.query} query={n.query} label={n.label} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <InfoBox title={t("after.safety", lang)} color="amber" className="mt-8">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-3"><span className="text-amber-400">→</span><span>Always carry your passport or ID card with you</span></li>
            <li className="flex gap-3"><span className="text-amber-400">→</span><span>Register your residence at the Foreign Police within 3 days of arrival</span></li>
            <li className="flex gap-3"><span className="text-amber-400">→</span><span>Health insurance is mandatory — confirm your coverage with your employer</span></li>
            <li className="flex gap-3"><span className="text-amber-400">→</span><span>Do not share personal or financial information with strangers</span></li>
            <li className="flex gap-3"><span className="text-amber-400">→</span><span>Call 112 for any emergency — operators speak English</span></li>
          </ul>
        </InfoBox>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
