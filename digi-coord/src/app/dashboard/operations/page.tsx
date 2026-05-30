"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

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
  situationId: string | null
  contacted: string | null
  worker: WorkerName | null
}

interface StuckWorker {
  id: number
  name: string
  onboardingStatus: string
  updatedAt: string
}

interface Stats {
  totalWorkers: number
  completedOnboarding: number
  pendingOnboarding: number
  inProgressOnboarding: number
  openIssues: number
  escalatedIssues: number
  escalatedIssuesList: RecentIssue[]
  stuckWorkers: StuckWorker[]
  recentIssues: RecentIssue[]
  selfServiceRate: number | null
  totalFeedback: number
  helpedFeedback: number
  employeeCardBreakdown: Record<string, number>
}

export default function OperationsPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"escalated" | "stuck" | "all">("escalated")
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/operations/stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setLastRefresh(new Date())
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [fetchStats])

  if (loading) {
    return <div className="text-sm text-slate-400">Loading...</div>
  }

  if (!stats) {
    return <div className="text-sm text-slate-400">Failed to load data.</div>
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

  const statusBgs: Record<string, string> = {
    PENDING: "bg-yellow-900/50 text-yellow-400",
    IN_PROGRESS: "bg-blue-900/50 text-blue-400",
    COMPLETED: "bg-green-900/50 text-green-400",
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Operations</h1>
            <p className="mt-1 text-sm text-slate-400">
              Focus on what needs your attention
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600">
              {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : "Loading..."}
            </span>
            <button
              onClick={fetchStats}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">{stats.totalWorkers}</div>
          <div className="text-xs text-slate-400">Total workers</div>
        </div>

        <Link
          href="/dashboard/issues"
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-400">{stats.openIssues}</span>
            {stats.escalatedIssues > 0 && (
              <span className="rounded-full bg-red-900/50 px-2 py-0.5 text-[10px] font-medium text-red-400">
                {stats.escalatedIssues} escalated
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400">Unresolved issues</div>
        </Link>

        <Link
          href="/dashboard/workers"
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <div className="text-2xl font-bold text-blue-400">{stats.inProgressOnboarding + stats.pendingOnboarding}</div>
          <div className="text-xs text-slate-400">Onboarding not completed</div>
        </Link>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="text-2xl font-bold text-emerald-400">
            {stats.selfServiceRate !== null ? `${stats.selfServiceRate}%` : "—"}
          </div>
          <div className="text-xs text-slate-400">
            Self-service rate
            {stats.totalFeedback > 0 && (
              <span className="ml-1 text-[10px] text-slate-600">
                ({stats.helpedFeedback}/{stats.totalFeedback})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 rounded-xl border border-slate-800 bg-slate-900/50 p-1 backdrop-blur-sm">
        {[
          { key: "escalated", label: "Escalated", count: stats.escalatedIssuesList.length },
          { key: "stuck", label: "Stuck Workers", count: stats.stuckWorkers.length },
          { key: "all", label: "All Open", count: 0 },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                tab === t.key ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Escalated issues */}
      {tab === "escalated" && (
        <div>
          {stats.escalatedIssuesList.length === 0 ? (
            <div className="rounded-xl border border-green-800 bg-green-950/30 p-8 text-center backdrop-blur-sm">
              <div className="mb-2 text-3xl">✅</div>
              <p className="text-sm text-green-400">No escalated issues. Workers are resolving situations on their own.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.escalatedIssuesList.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/dashboard/issues/${issue.id}`}
                  className="block rounded-xl border border-red-900/30 bg-red-950/20 p-4 backdrop-blur-sm transition hover:bg-red-950/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-red-900/50 px-2 py-0.5 text-[10px] font-medium text-red-400">
                          ESCALATED
                        </span>
                        <span className="text-sm font-medium text-white">
                          {issue.issueType}
                        </span>
                        <span className={`text-[10px] font-medium uppercase ${priorityColors[issue.priority] || "text-slate-400"}`}>
                          {issue.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                        {issue.description}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-slate-500">
                        <span>🧑 {issue.worker?.name || "Unknown"}</span>
                        {issue.situationId && <span>🆘 Situation: {issue.situationId}</span>}
                        {issue.contacted && <span>📞 Contacted: {issue.contacted}</span>}
                        <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stuck workers */}
      {tab === "stuck" && (
        <div>
          {stats.stuckWorkers.length === 0 ? (
            <div className="rounded-xl border border-green-800 bg-green-950/30 p-8 text-center backdrop-blur-sm">
              <div className="mb-2 text-3xl">🎉</div>
              <p className="text-sm text-green-400">All workers are making progress on onboarding.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Workers who haven&apos;t updated their onboarding in 7+ days
              </p>
              {stats.stuckWorkers.map((w) => (
                <Link
                  key={w.id}
                  href={`/dashboard/workers/${w.id}`}
                  className="block rounded-xl border border-amber-900/30 bg-amber-950/20 p-4 backdrop-blur-sm transition hover:bg-amber-950/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{w.name}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBgs[w.onboardingStatus] || ""}`}>
                          {w.onboardingStatus.replace("_", " ")}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span>Last activity: {new Date(w.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All open issues */}
      {tab === "all" && (
        <div>
          <Link
            href="/dashboard/issues"
            className="mb-3 inline-block text-xs text-blue-400 hover:text-blue-300"
          >
            View full issue list →
          </Link>
          <div className="space-y-3">
            {stats.recentIssues.length === 0 ? (
              <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
                No open issues.
              </p>
            ) : (
              stats.recentIssues.map((issue) => (
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
              ))
            )}
          </div>
        </div>
      )}

      {/* Employee Card Breakdown with bar chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Employee Card Status</h3>
        {(() => {
          const maxCount = Math.max(1, ...Object.values(stats.employeeCardBreakdown || {}))
          const steps = [
            { key: "NOT_STARTED", label: "Not Started", barColor: "bg-slate-600", textColor: "text-slate-400" },
            { key: "IN_PROGRESS", label: "In Progress", barColor: "bg-blue-600", textColor: "text-blue-400" },
            { key: "BIOMETRICS_DONE", label: "Biometrics", barColor: "bg-amber-600", textColor: "text-amber-400" },
            { key: "CARD_READY", label: "Card Ready", barColor: "bg-emerald-600", textColor: "text-emerald-400" },
            { key: "ISSUED", label: "Issued", barColor: "bg-green-600", textColor: "text-green-400" },
          ]
          return (
            <div className="space-y-2">
              {steps.map((s) => {
                const count = stats.employeeCardBreakdown?.[s.key] || 0
                const pct = Math.round((count / maxCount) * 100)
                return (
                  <div key={s.key} className="flex items-center gap-3 text-xs">
                    <span className={`w-20 text-right ${s.textColor}`}>{s.label}</span>
                    <div className="flex-1">
                      <div className="h-5 overflow-hidden rounded-md bg-slate-800">
                        <div
                          className={`h-full rounded-md ${s.barColor} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-6 text-right font-medium text-white">{count}</span>
                  </div>
                )
              })}
            </div>
          )
        })()}
      </div>

      {/* Summary footer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Snapshot</h3>
        <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
          <div>
            <span className="text-slate-500">Completed onboarding</span>
            <div className="font-medium text-white">{stats.completedOnboarding}</div>
          </div>
          <div>
            <span className="text-slate-500">In progress</span>
            <div className="font-medium text-white">{stats.inProgressOnboarding}</div>
          </div>
          <div>
            <span className="text-slate-500">Pending</span>
            <div className="font-medium text-white">{stats.pendingOnboarding}</div>
          </div>
          <div>
            <span className="text-slate-500">Total feedback</span>
            <div className="font-medium text-white">{stats.totalFeedback}</div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Recent Activity</h3>
        <ActivityFeed />
      </div>
    </div>
  )
}
