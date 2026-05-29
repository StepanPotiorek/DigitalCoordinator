"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface WorkerName {
  name: string | null
}

interface RecentIssue {
  id: number
  issueType: string
  description: string
  priority: string
  status: string
  createdAt: string
  worker: WorkerName | null
}

interface Stats {
  totalWorkers: number
  completedOnboarding: number
  pendingOnboarding: number
  inProgressOnboarding: number
  openIssues: number
  accommodationIssues: number
  employeeCardBreakdown: Record<string, number>
  recentIssues: RecentIssue[]
}

export default function OperationsPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/operations/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-sm text-slate-400">Loading...</div>
  }

  if (!stats) {
    return <div className="text-sm text-slate-400">Failed to load data.</div>
  }

  const ecLabels: Record<string, string> = {
    NOT_STARTED: "Not started",
    IN_PROGRESS: "In progress",
    BIOMETRICS_DONE: "Biometrics done",
    CARD_READY: "Card ready",
    ISSUED: "Issued",
  }

  const ecColors: Record<string, string> = {
    NOT_STARTED: "text-yellow-400",
    IN_PROGRESS: "text-blue-400",
    BIOMETRICS_DONE: "text-purple-400",
    CARD_READY: "text-emerald-400",
    ISSUED: "text-green-400",
  }

  const ecBgs: Record<string, string> = {
    NOT_STARTED: "bg-yellow-900/50",
    IN_PROGRESS: "bg-blue-900/50",
    BIOMETRICS_DONE: "bg-purple-900/50",
    CARD_READY: "bg-emerald-900/50",
    ISSUED: "bg-green-900/50",
  }

  const priorityColors: Record<string, string> = {
    URGENT: "text-red-400",
    HIGH: "text-orange-400",
    MEDIUM: "text-blue-400",
    LOW: "text-slate-400",
  }

  const statusColors: Record<string, string> = {
    OPEN: "text-yellow-400",
    IN_PROGRESS: "text-blue-400",
    RESOLVED: "text-green-400",
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Real-time overview of all workers and issues
        </p>
      </div>

      {/* Onboarding stats */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Onboarding</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <div className="text-3xl font-bold text-white">{stats.totalWorkers}</div>
            <div className="text-sm text-slate-400">Total workers</div>
          </div>
          <Link
            href="/dashboard/workers"
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition hover:bg-slate-800/50"
          >
            <div className="text-3xl font-bold text-emerald-400">{stats.completedOnboarding}</div>
            <div className="text-sm text-slate-400">Onboarding completed</div>
          </Link>
          <Link
            href="/dashboard/workers"
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition hover:bg-slate-800/50"
          >
            <div className="text-3xl font-bold text-blue-400">{stats.inProgressOnboarding}</div>
            <div className="text-sm text-slate-400">In progress</div>
          </Link>
          <Link
            href="/dashboard/workers"
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition hover:bg-slate-800/50"
          >
            <div className="text-3xl font-bold text-yellow-400">{stats.pendingOnboarding}</div>
            <div className="text-sm text-slate-400">Pending</div>
          </Link>
        </div>
      </div>

      {/* Issues stats */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Issues</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/issues"
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition hover:bg-slate-800/50"
          >
            <div className="text-3xl font-bold text-red-400">{stats.openIssues}</div>
            <div className="text-sm text-slate-400">Open issues</div>
          </Link>
          <Link
            href="/dashboard/issues"
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition hover:bg-slate-800/50"
          >
            <div className="text-3xl font-bold text-amber-400">{stats.accommodationIssues}</div>
            <div className="text-sm text-slate-400">Accommodation issues (open)</div>
          </Link>
        </div>
      </div>

      {/* Employee card status */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Employee Card</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          {Object.entries(ecLabels).map(([key, label]) => (
            <div key={key} className={`rounded-xl border border-slate-800 ${ecBgs[key] || "bg-slate-900/50"} p-4 backdrop-blur-sm`}>
              <div className={`text-2xl font-bold ${ecColors[key] || "text-white"}`}>
                {stats.employeeCardBreakdown[key] || 0}
              </div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent open issues */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Recent Open Issues</h2>
        <div className="space-y-3">
          {stats.recentIssues.length === 0 && (
            <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
              No open issues. Everything is under control.
            </p>
          )}
          {stats.recentIssues.map((issue) => (
            <Link
              key={issue.id}
              href={`/dashboard/issues/${issue.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {issue.issueType}
                    </span>
                    <span className={`text-[10px] font-medium uppercase ${priorityColors[issue.priority] || "text-slate-400"}`}>
                      {issue.priority}
                    </span>
                    <span className={`text-[10px] font-medium uppercase ${statusColors[issue.status] || "text-slate-400"}`}>
                      {issue.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400 line-clamp-1">
                    {issue.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {issue.worker?.name || "Unknown worker"} &middot; {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <svg className="h-4 w-4 shrink-0 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
