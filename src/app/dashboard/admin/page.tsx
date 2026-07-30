import { auth } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/server-fetch"
import { redirect } from "next/navigation"
import Link from "next/link"
import { StatCard } from "@/components/admin/stat-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { RecentIssuesTable } from "@/components/admin/recent-issues-table"
import { WorkersOverviewChart } from "@/components/admin/workers-overview-chart"

interface StatsResponse {
  totalWorkers: number
  workersByStatus: Record<string, number>
  pendingApprovals: number
  totalIssues: number
  issuesByStatus: Record<string, number>
  urgentIssues: number
  recentWorkers: { id: number; name: string; createdAt: string }[]
  recentIssues: { id: number; issueType: string; priority: string; status: string; createdAt: string; worker: { name: string } | null }[]
  onboardingCompletionRate: number
  totalFeedback: number
  helpedFeedback: number
  issuesFromHelp: number
  resolutionRate: number
  selfServiceRate: number | null
  issuesAvoided: number
}

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`
  const res = await fetchWithAuth(`${baseUrl}/api/admin/stats`, { cache: "no-store" })
  const stats: StatsResponse = await res.json()

  const {
    totalWorkers,
    workersByStatus,
    pendingApprovals,
    totalIssues,
    issuesByStatus,
    urgentIssues,
    recentWorkers,
    recentIssues,
    onboardingCompletionRate,
    totalFeedback,
    helpedFeedback,
    issuesFromHelp,
    resolutionRate,
    selfServiceRate,
    issuesAvoided,
  } = stats

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          System overview and key metrics
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard
          title="Total Workers"
          value={totalWorkers}
          accent="blue"
        />
        <StatCard
          title="Pending Approval"
          value={pendingApprovals}
          accent="yellow"
        />
        <StatCard
          title="Open Issues"
          value={totalIssues}
          accent="amber"
        />
        <StatCard
          title="Urgent Issues"
          value={urgentIssues}
          accent="red"
        />
        <StatCard
          title="Self-Service Rate"
          value={selfServiceRate !== null ? `${selfServiceRate}%` : "—"}
          accent="emerald"
        />
        <StatCard
          title="Onboarding Rate"
          value={`${onboardingCompletionRate}%`}
          accent="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Workers Overview
          </h2>
          <WorkersOverviewChart workersByStatus={workersByStatus} />

          <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-400">
            Recent Workers
          </h3>
          <div className="space-y-2">
            {recentWorkers.map((w) => (
              <Link
                key={w.id}
                href={`/dashboard/workers/${w.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 transition hover:bg-slate-700/50"
              >
                <span className="text-sm text-white">{w.name}</span>
                <span className="text-xs text-slate-500">
                  {new Date(w.createdAt).toISOString().split("T")[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Issues Overview
          </h2>
          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            {["OPEN", "IN_PROGRESS", "RESOLVED"].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="text-slate-400">
                  {s.replace("_", " ")}
                </span>
                <span className="font-medium text-white">
                  {issuesByStatus[s] || 0}
                </span>
              </div>
            ))}
          </div>

          <h3 className="mb-3 text-sm font-semibold text-slate-400">
            Recent Issues
          </h3>
          <RecentIssuesTable issues={recentIssues} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pendingApprovals > 0 && (
              <Link
                href="/dashboard/admin/pending-workers"
                className="rounded-lg border border-yellow-700 bg-yellow-900/30 px-4 py-3 text-center text-sm font-medium text-yellow-300 transition hover:bg-yellow-800/40"
              >
                Review Approvals ({pendingApprovals})
              </Link>
            )}
            <Link
              href="/dashboard/workers"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700/50"
            >
              View All Workers
            </Link>
            <Link
              href="/dashboard/issues"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700/50"
            >
              View All Issues
            </Link>
            <Link
              href="/dashboard/companies"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700/50"
            >
              Manage Companies
            </Link>
            <Link
              href="/dashboard/accommodations"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700/50"
            >
              Accommodations
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-lg font-semibold text-white">
            System Status
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database</span>
              <span className="flex items-center gap-1.5 font-medium text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Workers</span>
              <span className="font-medium text-white">{totalWorkers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Issues</span>
              <span className="font-medium text-white">{totalIssues}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Issue Resolution Rate</span>
              <span className="font-medium text-white">{resolutionRate}%</span>
            </div>
            <div className="border-t border-slate-800 pt-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400">Self-Service</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Help Flow Interactions</span>
                  <span className="font-medium text-white">{totalFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Resolved via Self-Service</span>
                  <span className="font-medium text-green-400">{helpedFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Issues Escalated (from help)</span>
                  <span className="font-medium text-amber-400">{issuesFromHelp}</span>
                </div>
                {selfServiceRate !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Self-Service Rate</span>
                    <span className="font-medium text-emerald-400">{selfServiceRate}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Onboarding Completion</span>
                <span className="font-medium text-white">{onboardingCompletionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
        <ActivityFeed />
      </div>
    </div>
  )
}
