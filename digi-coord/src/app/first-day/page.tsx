import Link from "next/link"
import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader, InfoBox, ChecklistItem } from "@/components/public/page-layout"

const sections = [
  {
    title: "The Night Before",
    items: [
      "Prepare your clothes — follow the dress code",
      "Charge your phone and set an alarm",
      "Check the transport route to work",
      "Prepare your documents (passport copy, work permit, contract)",
      "Go to bed early — being rested is important",
      "Pack a small bag with water, snacks, and any needed items",
    ],
  },
  {
    title: "What to Bring",
    items: [
      "Passport or ID card copy",
      "Employment contract copy",
      "Your phone with WhatsApp active",
      "Comfortable shoes (you may be standing or walking)",
      "Lunch or money to buy food",
      "Any required personal protective equipment (PPE)",
    ],
  },
  {
    title: "Getting to Work",
    items: [
      "Leave with plenty of time — arrive 15 minutes early",
      "Use PID Lítačka app for public transport tickets",
      "Check Google Maps for the best route",
      "If you get lost, contact your supervisor or coordinator immediately",
    ],
  },
  {
    title: "What to Expect",
    items: [
      "Introduction to your supervisor and team members",
      "Workplace tour and safety orientation",
      "Explanation of your tasks and responsibilities",
      "Information about break times and lunch arrangements",
      "Training on any equipment or software you will use",
      "Discussion about salary, schedule, and expectations",
    ],
  },
]

const phrases = [
  { english: "Hello / Good day", czech: "Dobrý den", pronunciation: "DOB-ree den" },
  { english: "Thank you", czech: "Děkuji", pronunciation: "DYE-ku-yi" },
  { english: "Please", czech: "Prosím", pronunciation: "PRO-seem" },
  { english: "Yes / No", czech: "Ano / Ne", pronunciation: "A-no / Ne" },
  { english: "I don't understand", czech: "Nerozumím", pronunciation: "NE-ro-zu-meem" },
  { english: "Can you repeat please?", czech: "Můžete zopakovat?", pronunciation: "MOO-zhe-te zo-pa-ko-vat" },
  { english: "Good morning", czech: "Dobré ráno", pronunciation: "DO-breh RAH-no" },
  { english: "See you tomorrow", czech: "Na shledanou zítra", pronunciation: "Na-SHLE-da-no ZEE-tra" },
]

export default async function FirstDayPage() {
  const lang = await getLang()

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} showBack />

      <PageContainer>
        <PageHeader
          title={t("firstday.title", lang)}
          subtitle={t("firstday.subtitle", lang)}
          badge="STEP 3"
          badgeColor="amber"
        />

        <div className="relative space-y-6 before:absolute before:left-5 before:top-0 before:h-full before:w-0.5 before:bg-slate-800">
          {sections.map((section, i) => (
            <div key={section.title} className="relative pl-14">
              <div className="absolute left-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-900/50 text-xs font-bold text-blue-400 ring-4 ring-slate-950">
                {i + 1}
              </div>
              <h2 className="mb-3 text-lg font-semibold text-white">{section.title}</h2>
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <ChecklistItem key={item}>{item}</ChecklistItem>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-white">{t("firstday.phrases", lang)}</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="px-4 py-3 font-medium text-slate-400">English</th>
                  <th className="px-4 py-3 font-medium text-slate-400">Czech</th>
                  <th className="px-4 py-3 font-medium text-slate-400">Pronunciation</th>
                </tr>
              </thead>
              <tbody>
                {phrases.map((p) => (
                  <tr key={p.english} className="border-b border-slate-800 last:border-0">
                    <td className="px-4 py-3 text-white">{p.english}</td>
                    <td className="px-4 py-3 text-blue-300">{p.czech}</td>
                    <td className="px-4 py-3 text-slate-400">{p.pronunciation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <InfoBox title={t("firstday.contacts", lang)} color="blue" className="mt-8">
          <p className="mb-3 text-sm text-slate-300">
            Make sure you have these numbers saved in your phone before your first day:
          </p>
          <ul className="space-y-1.5 text-sm text-slate-300">
            <li className="flex gap-3"><span className="font-medium text-blue-400">Supervisor:</span><span>Your direct supervisor at work</span></li>
            <li className="flex gap-3"><span className="font-medium text-blue-400">Coordinator:</span><span>Your Digital Coordinator</span></li>
            <li className="flex gap-3"><span className="font-medium text-blue-400">Employer HR:</span><span>Human resources department</span></li>
            <li className="flex gap-3"><span className="font-medium text-blue-400">Emergency:</span><span>112 for police, ambulance, or fire</span></li>
          </ul>
        </InfoBox>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
