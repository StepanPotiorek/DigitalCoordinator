import Link from "next/link"
import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"

export default async function EmployeeCardPage() {
  const lang = await getLang()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("dashboard.employeeCardTitle", lang)}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {t("dashboard.trackEmployeeCard", lang)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold text-white">About Your Employee Card</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          The Employee Card (Zaměstnanecká karta) is your legal document for living and working in the Czech Republic. It combines a work permit and residence permit into one card.
        </p>
      </div>

      <div className="rounded-xl border border-emerald-800/30 bg-emerald-950/20 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <span className="mt-1 text-2xl">🤝</span>
          <div>
            <h3 className="text-lg font-semibold text-emerald-300">Handled by Your Coordinator</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Your coordinator from the agency manages the entire Employee Card process for you — from application through biometrics to collection. You will be notified when your presence is needed.
            </p>
            <div className="mt-4 space-y-2">
              {[
                { icon: "📋", text: "Application — coordinator prepares and submits" },
                { icon: "🛂", text: "Visa — coordinator guides you through the process" },
                { icon: "✋", text: "Biometrics — you will be informed when and where to go" },
                { icon: "🪪", text: "Collection — coordinator will tell you when your card is ready" },
              ].map((item) => (
                <div key={item.icon} className="flex items-center gap-2 text-sm text-slate-400">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/employer-card"
        className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-white">{t("dashboard.viewFullGuide", lang)}</div>
            <p className="mt-0.5 text-xs text-slate-400">{t("dashboard.detailedInfo", lang)}</p>
          </div>
          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      <Link
        href="/dashboard/worker"
        className="inline-block text-sm text-blue-400 hover:text-blue-300 transition"
      >
        {t("dashboard.backToDashboard", lang)}
      </Link>
    </div>
  )
}
