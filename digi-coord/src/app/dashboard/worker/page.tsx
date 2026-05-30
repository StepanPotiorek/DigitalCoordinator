"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { categories, situations, type Situation } from "@/lib/situations"

interface WorkerData {
  id: number
  name: string
  onboardingStatus: string
  progress: number
  openIssues: number
}

interface IssueItem {
  id: number
  issueType: string
  status: string
  priority: string
  createdAt: string
}

interface OnboardingItem {
  id: number
  label: string
  category: string
  completed: boolean
}

const HISTORY_KEY = "help-history"

function triggerConfetti() {
  const container = document.createElement("div")
  container.className = "fixed inset-0 pointer-events-none z-50"
  document.body.appendChild(container)

  const colors = ["#22c55e", "#3b82f6", "#eab308", "#ec4899", "#a855f7", "#f97316"]
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div")
    const color = colors[Math.floor(Math.random() * colors.length)]
    const left = Math.random() * 100
    const size = 6 + Math.random() * 6
    const rotation = Math.random() * 720
    const drift = (Math.random() - 0.5) * 200
    piece.style.cssText = `
      position: absolute; top: -10px; left: ${left}%;
      width: ${size}px; height: ${size * 0.6}px;
      background: ${color}; border-radius: 2px;
      animation: confettiFall ${0.8 + Math.random() * 0.6}s ease-out forwards;
      --drift: ${drift}px;
      transform: rotate(${rotation}deg);
    `
    container.appendChild(piece)
  }
  setTimeout(() => container.remove(), 1500)
}
const CATEGORY_MAP: Record<string, string> = {
  BEFORE_ARRIVAL: "📋 Before Arrival",
  AFTER_ARRIVAL: "📋 After Arrival",
  FIRST_DAY: "💼 First Day",
  SIM_CARD: "📱 SIM Card",
  BANK_ACCOUNT: "🏦 Bank Account",
  ACCOMMODATION: "🏠 Accommodation",
  EMERGENCY: "🚨 Emergency",
  LANGUAGE: "💬 Language",
  ADAPTATION: "🌍 Adaptation",
  IMMIGRATION: "🛂 Immigration",
}

export default function WorkerDashboardPage() {
  const { data: session } = useSession()
  const [worker, setWorker] = useState<WorkerData | null>(null)
  const [issues, setIssues] = useState<IssueItem[]>([])
  const [onboarding, setOnboarding] = useState<OnboardingItem[]>([])
  const [history, setHistory] = useState<Situation[]>([])
  const [loading, setLoading] = useState(true)
  const [hasCelebrated, setHasCelebrated] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/worker/me").then((r) => r.json()),
      fetch("/api/worker/me/issues").then((r) => r.json()),
      fetch("/api/worker/me/onboarding").then((r) => r.json()),
    ])
      .then(([workerData, issuesData, onboardingData]) => {
        setWorker(workerData)
        setIssues(issuesData || [])
        setOnboarding(onboardingData || [])
      })
      .finally(() => setLoading(false))

    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[]
        setHistory(ids.map((id) => situations.find((s) => s.id === id)).filter(Boolean) as Situation[])
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (worker?.progress === 100 && !hasCelebrated) {
      setHasCelebrated(true)
      triggerConfetti()
    }
  }, [worker?.progress, hasCelebrated])

  if (loading) {
    return <div className="text-sm text-slate-400">Loading...</div>
  }

  if (!worker) {
    return <div className="text-sm text-slate-400">Worker profile not found.</div>
  }

  const openIssues = issues.filter((i) => i.status === "OPEN" || i.status === "IN_PROGRESS")
  const nextStep = onboarding.find((i) => !i.completed)
  const uncompletedCount = onboarding.filter((i) => !i.completed).length

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0.3) translateX(var(--drift)); opacity: 0; }
        }
      `}</style>
      {/* Welcome + summary */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {worker.progress < 100 ? `What's next, ${worker.name}?` : `Good job, ${worker.name}!`}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {worker.progress < 100
              ? `${uncompletedCount} onboarding steps remaining`
              : "Onboarding complete"}
          </p>
        </div>
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1e293b" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.5"
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="3"
              strokeDasharray={`${worker.progress * 0.97} 97`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-sm font-bold text-white">{worker.progress}%</span>
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
                {openIssues.length} open {openIssues.length === 1 ? "issue" : "issues"}
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

      {/* Main action buttons */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* I need help */}
        <Link
          href="/dashboard/worker/help"
          className="group rounded-xl border border-blue-800 bg-gradient-to-br from-blue-900/30 to-slate-900/50 p-5 backdrop-blur-sm transition hover:from-blue-800/40 hover:to-slate-800/50"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900/50 text-2xl">
              🆘
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-white group-hover:text-blue-300 transition">I need help</h2>
              <p className="mt-0.5 text-xs text-slate-400">Step-by-step guidance for any situation</p>
            </div>
          </div>
        </Link>

        {/* Next onboarding step */}
        {nextStep && (
          <Link
            href="/dashboard/worker/onboarding"
            className="group rounded-xl border border-emerald-800 bg-gradient-to-br from-emerald-900/30 to-slate-900/50 p-5 backdrop-blur-sm transition hover:from-emerald-800/40 hover:to-slate-800/50"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-900/50 text-2xl">
                📋
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-white group-hover:text-emerald-300 transition">
                  {nextStep.label}
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  {CATEGORY_MAP[nextStep.category] || nextStep.category}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* All done - show stats instead */}
        {!nextStep && worker.progress >= 100 && (
          <div className="rounded-xl border border-green-800 bg-green-950/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <div className="font-bold text-green-400">Onboarding Complete</div>
                <p className="text-xs text-slate-400">All steps finished</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick help + history */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Quick Help</h2>
          <Link href="/dashboard/worker/help" className="text-xs text-blue-400 hover:text-blue-300 transition">
            Browse all →
          </Link>
        </div>

        {history.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {history.map((sit) => (
              <Link
                key={sit.id}
                href={`/dashboard/worker/help?category=${sit.categoryId}`}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/50"
              >
                <span>{sit.icon}</span>
                <span>{sit.title.en}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {categories.slice(0, 7).map((cat) => (
            <Link
              key={cat.id}
              href={`/dashboard/worker/help?category=${cat.id}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-center backdrop-blur-sm transition hover:border-blue-800 hover:bg-slate-800/50"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[9px] leading-tight text-slate-400">{cat.title.en}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/dashboard/worker/onboarding"
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Onboarding</span>
            <span className="text-xs text-slate-600">
              {onboarding.filter((i) => i.completed).length}/{onboarding.length}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all"
              style={{ width: `${worker.progress}%` }}
            />
          </div>
        </Link>

        <Link
          href="/dashboard/worker/issues"
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <div className="text-sm text-slate-400">Issues</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${openIssues.length > 0 ? "text-amber-400" : "text-green-400"}`}>
              {worker.openIssues}
            </span>
            <span className="text-xs text-slate-500">open</span>
          </div>
        </Link>

        <Link
          href="/dashboard/worker/profile"
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <div className="text-sm text-slate-400">Documents</div>
          <div className="mt-1 text-xs text-blue-400">View & upload →</div>
        </Link>
      </div>

      {/* Bottom utility links */}
      <div className="flex gap-4 text-xs text-slate-500">
        <Link href="/dashboard/worker/documents" className="hover:text-white transition">📄 Documents</Link>
        <Link href="/dashboard/worker/profile" className="hover:text-white transition">👤 Profile</Link>
        <Link href="/faq" className="hover:text-white transition">❓ FAQ</Link>
        <a href="https://wa.me/420777654279" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
          💬 WhatsApp
        </a>
      </div>
    </div>
  )
}
