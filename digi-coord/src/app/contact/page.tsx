import Link from "next/link"
import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader, InfoBox } from "@/components/public/page-layout"
import { IssueReportForm } from "@/components/forms/issue-report-form"

const coordinator = {
  name: "Štěpán Potiorek",
  whatsapp: "+420777654279",
  phone: "+420777654279",
  email: "gleestepan@gmail.com",
}

const quickHelp = [
  { title: "Lost or Need Directions", text: "Message your coordinator on WhatsApp or use Google Maps.", icon: "📍" },
  { title: "Accommodation Issue", text: "Contact your coordinator first — they can help resolve it.", icon: "🏠" },
  { title: "Problem at Work", text: "Talk to your supervisor. If unresolved, message your coordinator.", icon: "💼" },
  { title: "Medical Emergency", text: "Call 112 immediately. Then inform your coordinator.", icon: "🚑" },
  { title: "SIM Card / Phone", text: "Visit any O2, T-Mobile, or Vodafone store with your passport.", icon: "📱" },
  { title: "Bank Account Help", text: "Visit your bank with passport and contract.", icon: "🏦" },
]

export default async function ContactPage() {
  const lang = await getLang()

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} showBack />

      <PageContainer>
        <PageHeader
          title={t("contact.title", lang)}
          subtitle={t("contact.subtitle", lang)}
        />

        {/* Coordinator card */}
        <div className="mb-8 rounded-xl border border-blue-800 bg-gradient-to-br from-blue-900/30 to-slate-900 p-6 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-800/50 text-lg font-bold text-blue-300">
              ŠP
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{coordinator.name}</h2>
              <p className="text-xs text-blue-300">{t("contact.subtitle", lang)}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <a href={`https://wa.me/${coordinator.whatsapp.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg bg-green-800/30 px-4 py-3 text-green-200 transition hover:bg-green-800/50">
              <span className="text-xl">💬</span>
              <div>
                <p className="font-medium text-white">{t("contact.whatsapp", lang)}</p>
                <p className="text-xs text-green-300">{coordinator.whatsapp}</p>
              </div>
              <span className="ml-auto text-xs text-green-400">{t("contact.tap.chat", lang)}</span>
            </a>
            <a href={`tel:${coordinator.phone}`}
              className="flex items-center gap-3 rounded-lg bg-blue-900/30 px-4 py-3 text-blue-200 transition hover:bg-blue-900/50">
              <span className="text-xl">📞</span>
              <div>
                <p className="font-medium text-white">{t("contact.phone", lang)}</p>
                <p className="text-xs text-blue-300">{coordinator.phone}</p>
              </div>
              <span className="ml-auto text-xs text-blue-400">{t("contact.tap.call", lang)}</span>
            </a>
            <a href={`mailto:${coordinator.email}`}
              className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-3 text-slate-200 transition hover:bg-slate-700">
              <span className="text-xl">📧</span>
              <div>
                <p className="font-medium text-white">{t("contact.email", lang)}</p>
                <p className="text-xs text-slate-300">{coordinator.email}</p>
              </div>
              <span className="ml-auto text-xs text-slate-400">{t("contact.tap.email", lang)}</span>
            </a>
          </div>
        </div>

        {/* Emergency */}
        <InfoBox color="red" title={t("contact.emergency", lang)} className="mb-8 text-center">
          <p className="text-sm text-slate-300">{t("contact.emergency.desc", lang)}</p>
        </InfoBox>

        {/* Quick help */}
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickHelp.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
              <div className="mb-2 text-xl">{item.icon}</div>
              <h3 className="mb-1 font-semibold text-white text-sm">{item.title}</h3>
              <p className="text-xs leading-relaxed text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Report form */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <h2 className="mb-3 text-lg font-semibold text-white">{t("contact.report.title", lang)}</h2>
          <p className="mb-4 text-sm text-slate-400">{t("contact.report.desc", lang)}</p>
          <IssueReportForm />
        </div>
      </PageContainer>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      </footer>
    </div>
  )
}
