"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { JourneyCard } from "./journey-card"
import { useLang } from "@/lib/use-lang"
import { t } from "@/lib/translations"

interface WorkerData {
  id: number
  name: string
  onboardingStatus: string
  progress: number
  openIssues: number
  arrivalDate: string | null
  accommodation: string | null
  employeeCardStatus: string
  accommodationDetail: {
    address: string
    room: string | null
    rules: string | null
    contactName: string | null
    contactPhone: string | null
    mapUrl: string | null
  } | null
}

interface OnboardingItem {
  id: number
  label: string
  category: string
  completed: boolean
  completedAt: string | null
}

interface IssueItem {
  id: number
  issueType: string
  status: string
  priority: string
  createdAt: string
}

const EMPLOYEE_CARD_SUBTASKS: Record<string, { label: string; doneKey: string }[]> = {
  NOT_STARTED: [
    { label: "Appointment booked", doneKey: "NOT_STARTED" },
  ],
  IN_PROGRESS: [
    { label: "Appointment booked", doneKey: "IN_PROGRESS" },
    { label: "Documents prepared", doneKey: "IN_PROGRESS" },
  ],
  BIOMETRICS_DONE: [
    { label: "Appointment booked", doneKey: "BIOMETRICS_DONE" },
    { label: "Documents prepared", doneKey: "BIOMETRICS_DONE" },
    { label: "Biometrics completed", doneKey: "BIOMETRICS_DONE" },
  ],
  CARD_READY: [
    { label: "Appointment booked", doneKey: "CARD_READY" },
    { label: "Documents prepared", doneKey: "CARD_READY" },
    { label: "Biometrics completed", doneKey: "CARD_READY" },
    { label: "Card ready for pickup", doneKey: "CARD_READY" },
  ],
  ISSUED: [
    { label: "Employee card issued", doneKey: "ISSUED" },
  ],
}

const EMPLOYEE_CARD_NEXT_ACTION: Record<string, { label: string; href: string } | null> = {
  NOT_STARTED: { label: "Book biometrics appointment", href: "/dashboard/worker/employee-card" },
  IN_PROGRESS: { label: "Complete biometrics", href: "/dashboard/worker/employee-card" },
  BIOMETRICS_DONE: { label: "Wait for card to be ready", href: "/dashboard/worker/employee-card" },
  CARD_READY: { label: "Collect your employee card", href: "/dashboard/worker/employee-card" },
  ISSUED: null,
}

export default function WorkerDashboardPage() {
  const { data: session } = useSession()
  const lang = useLang()
  const [worker, setWorker] = useState<WorkerData | null>(null)
  const [onboarding, setOnboarding] = useState<OnboardingItem[]>([])
  const [issues, setIssues] = useState<IssueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/worker/me").then((r) => r.json()),
      fetch("/api/worker/me/issues").then((r) => r.json()),
    ])
      .then(([workerData, issuesData]) => {
        setWorker(workerData)
        setOnboarding(workerData.onboardingItems || [])
        setIssues(issuesData || [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-sm text-slate-400">{t("dashboard.loading", lang)}</div>
  }

  if (!worker) {
    return <div className="text-sm text-slate-400">{t("dashboard.notFound", lang)}</div>
  }

  function itemsForCategory(cat: string) {
    return onboarding.filter((i) => i.category === cat)
  }

  function categoryStatus(cat: string): "completed" | "in-progress" | "not-started" {
    const items = itemsForCategory(cat)
    if (items.length === 0) return "not-started"
    const allDone = items.every((i) => i.completed)
    const anyDone = items.some((i) => i.completed)
    if (allDone) return "completed"
    if (anyDone) return "in-progress"
    return "not-started"
  }

  const arrivalDone = !!worker.arrivalDate
  const totalSteps = 7
  const completedSteps = [
    arrivalDone,
    categoryStatus("ACCOMMODATION") === "completed",
    worker.employeeCardStatus === "ISSUED",
    categoryStatus("SIM_CARD") === "completed",
    categoryStatus("BANK_ACCOUNT") === "completed",
    categoryStatus("FIRST_DAY") === "completed",
    categoryStatus("ADAPTATION") === "completed",
  ].filter(Boolean).length

  const progress = Math.round((completedSteps / totalSteps) * 100)
  const openIssues = issues.filter((i) => i.status === "OPEN" || i.status === "IN_PROGRESS")

  const ecSubtasks = EMPLOYEE_CARD_SUBTASKS[worker.employeeCardStatus] || []
  const ecNextAction = EMPLOYEE_CARD_NEXT_ACTION[worker.employeeCardStatus]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {progress < 100 ? t("dashboard.whatsNext", lang).replace("{name}", worker.name) : t("dashboard.goodJob", lang).replace("{name}", worker.name)}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {t("dashboard.stepsCompleted", lang).replace("{done}", String(completedSteps)).replace("{total}", String(totalSteps))}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{progress}%</span>
          </div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Active issues alert */}
      {openIssues.length > 0 && (
        <Link
          href="/dashboard/worker/issues"
          className="block rounded-xl border border-amber-800/50 bg-amber-950/30 p-4 backdrop-blur-sm transition hover:bg-amber-950/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-amber-400">
                {t("dashboard.openIssues", lang).replace("{count}", String(openIssues.length))}
              </div>
              <div className="line-clamp-1 text-xs text-slate-400">
                {openIssues[0].issueType} &middot; {openIssues[0].priority}
              </div>
            </div>
            <svg className="h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      )}

      {/* Journey Steps */}
      <div className="space-y-3">
        <JourneyCard
          icon="✈️"
          title={t("dashboard.arrival", lang)}
          status={arrivalDone ? "completed" : "not-started"}
          items={[
            { label: t("dashboard.arrivedInCz", lang), done: arrivalDone },
          ]}
          nextAction={arrivalDone ? undefined : t("dashboard.trackArrival", lang)}
          nextActionHref={arrivalDone ? undefined : "/after-arrival"}
        />

        <JourneyCard
          icon="🏠"
          title={t("dashboard.accommodation", lang)}
          status={categoryStatus("ACCOMMODATION")}
          items={itemsForCategory("ACCOMMODATION").map((i) => ({
            label: i.label,
            done: i.completed,
          }))}
          nextAction={categoryStatus("ACCOMMODATION") === "completed" ? undefined : t("dashboard.viewAccommodation", lang)}
          nextActionHref={categoryStatus("ACCOMMODATION") === "completed" ? undefined : "/dashboard/worker/help?category=accommodation"}
        />

        <JourneyCard
          icon="🪪"
          title={t("dashboard.employeeCardTitle", lang)}
          status={
            worker.employeeCardStatus === "ISSUED"
              ? "completed"
              : worker.employeeCardStatus === "NOT_STARTED"
                ? "not-started"
                : "in-progress"
          }
          items={ecSubtasks.map((t) => ({ label: t.label, done: true }))}
          nextAction={ecNextAction?.label}
          nextActionHref={ecNextAction?.href}
        />

        <JourneyCard
          icon="📱"
          title={t("dashboard.simCard", lang)}
          status={categoryStatus("SIM_CARD")}
          items={itemsForCategory("SIM_CARD").map((i) => ({
            label: i.label,
            done: i.completed,
          }))}
        />

        <JourneyCard
          icon="🏦"
          title={t("dashboard.bankAccount", lang)}
          status={categoryStatus("BANK_ACCOUNT")}
          items={itemsForCategory("BANK_ACCOUNT").map((i) => ({
            label: i.label,
            done: i.completed,
          }))}
        />

        <JourneyCard
          icon="👷"
          title={t("dashboard.firstDayWork", lang)}
          status={categoryStatus("FIRST_DAY")}
          items={itemsForCategory("FIRST_DAY").map((i) => ({
            label: i.label,
            done: i.completed,
          }))}
        />

        <JourneyCard
          icon="🌦️"
          title={t("dashboard.adaptation", lang)}
          status={categoryStatus("ADAPTATION")}
          items={itemsForCategory("ADAPTATION").map((i) => ({
            label: i.label,
            done: i.completed,
          }))}
        />
      </div>

      {/* Need help */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/worker/help"
          className="rounded-xl border border-blue-800 bg-gradient-to-br from-blue-900/30 to-slate-900/50 p-4 backdrop-blur-sm transition hover:from-blue-800/40 hover:to-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🆘</span>
            <div>
              <div className="font-medium text-white">{t("dashboard.needHelpTitle", lang)}</div>
              <div className="text-xs text-slate-400">{t("dashboard.needHelpDesc", lang)}</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/worker/letters"
          className="rounded-xl border border-emerald-800/50 bg-gradient-to-br from-emerald-900/20 to-slate-900/50 p-4 backdrop-blur-sm transition hover:from-emerald-800/30 hover:to-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📬</span>
            <div>
              <div className="font-medium text-white">{t("dashboard.myLettersTitle", lang)}</div>
              <div className="text-xs text-slate-400">{t("dashboard.myLettersDesc", lang)}</div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/worker/onboarding"
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <div>
              <div className="font-medium text-white">{t("dashboard.onboardingDetails", lang)}</div>
              <div className="text-xs text-slate-400">{t("dashboard.onboardingDetailsDesc", lang)}</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom links */}
      <div className="flex gap-4 text-xs text-slate-500">
        <Link href="/dashboard/worker/letters" className="hover:text-white transition">{t("dashboard.myLettersTitle", lang)}</Link>
        <Link href="/dashboard/worker/documents" className="hover:text-white transition">{t("dashboard.documents", lang)}</Link>
        <Link href="/dashboard/worker/profile" className="hover:text-white transition">{t("dashboard.profile", lang)}</Link>
        <Link href="/faq" className="hover:text-white transition">{t("faq.label", lang)}</Link>
        <a href="https://wa.me/420777654279" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
          {t("contact.whatsapp", lang)}
        </a>
      </div>
    </div>
  )
}
