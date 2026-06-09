"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLang } from "@/lib/use-lang"
import { t } from "@/lib/translations"

interface WorkerData {
  id: number
  name: string
  employeeCardStatus: string
}

const STEPS = [
  { status: "NOT_STARTED", labelKey: "dashboard.notStarted", icon: "📄", descKey: "dashboard.notStartedDesc" },
  { status: "IN_PROGRESS", labelKey: "dashboard.inProgress", icon: "📋", descKey: "dashboard.inProgressDesc" },
  { status: "BIOMETRICS_DONE", labelKey: "dashboard.biometricsDone", icon: "✋", descKey: "dashboard.biometricsDoneDesc" },
  { status: "CARD_READY", labelKey: "dashboard.cardReady", icon: "✅", descKey: "dashboard.cardReadyDesc" },
  { status: "ISSUED", labelKey: "dashboard.issued", icon: "🪪", descKey: "dashboard.issuedDesc" },
]

const STATUS_ORDER = ["NOT_STARTED", "IN_PROGRESS", "BIOMETRICS_DONE", "CARD_READY", "ISSUED"]

export default function EmployeeCardPage() {
  const lang = useLang()
  const [worker, setWorker] = useState<WorkerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/worker/me")
      .then((r) => r.json())
      .then((data) => {
        setWorker(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-sm text-slate-400">{t("dashboard.loading", lang)}</div>
  }

  if (!worker) {
    return <div className="text-sm text-slate-400">{t("dashboard.notFound", lang)}</div>
  }

  const currentIdx = STATUS_ORDER.indexOf(worker.employeeCardStatus)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t("dashboard.employeeCardTitle", lang)}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {t("dashboard.trackEmployeeCard", lang)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
        <h2 className="mb-6 text-lg font-semibold text-white">{t("dashboard.yourProgress", lang)}</h2>

        {/* Visual stepper */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-800">
            <div
              className="w-full bg-gradient-to-b from-blue-600 to-emerald-500 transition-all"
              style={{ height: `${Math.max(0, (currentIdx / (STATUS_ORDER.length - 1)) * 100)}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-8">
              {STEPS.map((step, idx) => {
              const isActive = idx <= currentIdx
              const isCurrent = idx === currentIdx
              const stepLabel = t(step.labelKey, lang)
              const stepDesc = t(step.descKey, lang)

              return (
                <div key={step.status} className="relative flex items-start gap-4 pl-14">
                  {/* Circle indicator */}
                  <div
                    className={`absolute left-3.5 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 transition ${
                      isCurrent
                        ? "border-emerald-500 bg-emerald-900/50 shadow-lg shadow-emerald-500/20"
                        : isActive
                          ? "border-blue-600 bg-blue-900/50"
                          : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isActive && (
                      <div className={`h-2 w-2 rounded-full ${isCurrent ? "bg-emerald-400" : "bg-blue-400"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-lg border p-4 transition ${
                    isCurrent
                      ? "border-emerald-800/50 bg-emerald-950/20"
                      : isActive
                        ? "border-blue-800/30 bg-blue-950/10"
                        : "border-slate-800 bg-slate-900/30 opacity-50"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{step.icon}</span>
                      <div>
                        <span className={`text-sm font-medium ${isCurrent ? "text-emerald-300" : isActive ? "text-blue-300" : "text-slate-500"}`}>
                          {stepLabel}
                        </span>
                        <p className="mt-0.5 text-xs text-slate-500">{stepDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current status badge */}
        <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="text-xs text-slate-500">{t("dashboard.currentStatus", lang)}</div>
          <div className="mt-1 text-lg font-bold text-white">
            {STEPS.find((s) => s.status === worker.employeeCardStatus)?.icon}{" "}
            {t(STEPS.find((s) => s.status === worker.employeeCardStatus)?.labelKey || "", lang) || worker.employeeCardStatus}
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-amber-800/30 bg-amber-950/20 p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h3 className="text-sm font-bold text-amber-400">{t("dashboard.employeeCardHelp", lang)}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {t("dashboard.employeeCardHelpDesc", lang)}
            </p>
            <Link
              href="/dashboard/worker/help?category=immigration"
              className="mt-2 inline-block text-xs font-medium text-blue-400 hover:text-blue-300 transition"
            >
              {t("dashboard.goToImmigrationHelp", lang)}
            </Link>
          </div>
        </div>
      </div>

      {/* Link to guide */}
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
