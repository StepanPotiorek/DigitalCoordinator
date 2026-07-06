import Link from "next/link"
import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader, InfoBox } from "@/components/public/page-layout"
import { SiteFooter } from "@/components/public/site-footer"

export default async function EmployerCardPage() {
  const lang = await getLang()

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} showBack />

      <PageContainer>
        <PageHeader
          title={t("employer.title", lang)}
          subtitle={t("employer.subtitle", lang)}
        />

        <InfoBox title="What is an Employee Card?" color="blue" className="mb-6">
          <p className="text-sm leading-relaxed text-slate-300">
            {t("employer.important", lang)}
          </p>
        </InfoBox>

        {/* Coordinator handles everything */}
        <div className="mb-8 rounded-xl border border-emerald-800/50 bg-emerald-950/20 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-2xl">🤝</span>
            <div>
              <h2 className="mb-2 text-lg font-semibold text-emerald-300">
                Your Coordinator Handles Everything
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                Your coordinator from the agency manages the entire Employee Card process on your behalf — from document preparation to scheduling appointments. You will be informed when your physical presence is needed (biometrics, card collection). Just follow their instructions.
              </p>
            </div>
          </div>
        </div>

        {/* What you'll need */}
        <h2 className="mb-4 text-lg font-semibold text-white">What You Will Need</h2>
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🛂", text: "Valid passport (valid 90+ days beyond the card validity)" },
            { icon: "📝", text: "Signed employment contract (min. 15 hrs/week)" },
            { icon: "🏠", text: "Proof of accommodation" },
            { icon: "📸", text: "Passport photo" },
            { icon: "🎓", text: "Proof of education / qualification" },
            { icon: "📄", text: "Official PH documents may need an Apostille from DFA" },
          ].map((item) => (
            <div key={item.icon} className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3">
              <span className="mt-0.5 text-lg">{item.icon}</span>
              <span className="text-sm text-slate-300">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Process overview */}
        <h2 className="mb-4 text-lg font-semibold text-white">The Process at a Glance</h2>
        <div className="mb-8 space-y-4">
          {[
            { phase: "1. Application", text: "Your coordinator prepares and submits your application through the proper channels." },
            { phase: "2. Visa (D/VR)", text: "Once approved, a long-term entry visa is issued. Your coordinator will guide you on next steps." },
            { phase: "3. Biometrics", text: "You will be invited to visit the OAMP office for fingerprints and photo. Your coordinator will arrange the appointment and tell you what to bring." },
            { phase: "4. Collection", text: "Your card is ready for pickup within ~30 days after biometrics. You must collect it in person at OAMP." },
          ].map((step) => (
            <div key={step.phase} className="rounded-lg border border-slate-700 bg-slate-800/30 px-5 py-4">
              <h3 className="mb-1 text-sm font-semibold text-blue-400">{step.phase}</h3>
              <p className="text-sm text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>

        <InfoBox title={t("employer.help", lang)} color="blue" className="mt-4">
          <p className="mb-4 text-sm text-slate-300">{t("employer.help.desc", lang)}</p>
          <Link href="/contact" className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            {t("nav.contact", lang)}
          </Link>
        </InfoBox>
      </PageContainer>

      <SiteFooter />
    </div>
  )
}
