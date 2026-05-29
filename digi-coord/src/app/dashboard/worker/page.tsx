"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { categories } from "@/lib/situations"

interface WorkerData {
  id: number
  name: string
  whatsapp: string
  email: string | null
  employer: string | null
  onboardingStatus: string
  progress: number
  openIssues: number
  createdAt: string
}

export default function WorkerDashboardPage() {
  const { data: session } = useSession()
  const [worker, setWorker] = useState<WorkerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/worker/me")
      .then((r) => r.json())
      .then((data) => setWorker(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-sm text-slate-400">Loading...</div>
  }

  if (!worker) {
    return <div className="text-sm text-slate-400">Worker profile not found.</div>
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-900/50 text-yellow-400",
    IN_PROGRESS: "bg-blue-900/50 text-blue-400",
    COMPLETED: "bg-green-900/50 text-green-400",
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome, {worker.name}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {worker.progress < 100 ? "Let&apos;s continue your journey" : "You have completed onboarding"}
        </p>
      </div>

      {/* Primary CTA: I need help */}
      <Link
        href="/dashboard/worker/help"
        className="block rounded-xl border border-blue-800 bg-gradient-to-r from-blue-900/50 to-slate-900/50 p-6 backdrop-blur-sm transition hover:from-blue-800/50 hover:to-slate-800/50"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">🆘</span>
          <div>
            <h2 className="text-lg font-bold text-white">I need help</h2>
            <p className="text-sm text-slate-400">
              Find answers, prepared messages, and step-by-step guidance
            </p>
          </div>
          <svg className="ml-auto h-5 w-5 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      {/* Quick situation buttons */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Common situations</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-7">
          {categories.slice(0, 7).map((cat) => (
            <Link
              key={cat.id}
              href={`/dashboard/worker/help?category=${cat.id}`}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-center backdrop-blur-sm transition hover:border-slate-700 hover:bg-slate-800/50"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] leading-tight text-slate-400">{cat.title.en}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">{worker.progress}%</div>
          <div className="text-sm text-slate-400">Onboarding Progress</div>
        </div>
        <Link
          href="/dashboard/worker/issues"
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <div className="text-2xl font-bold text-blue-400">{worker.openIssues}</div>
          <div className="text-sm text-slate-400">Open Issues</div>
        </Link>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusColors[worker.onboardingStatus]}`}>
            {worker.onboardingStatus.replace("_", " ")}
          </span>
          <div className="mt-1 text-sm text-slate-400">Status</div>
        </div>
      </div>

      {/* Onboarding progress bar */}
      {worker.progress < 100 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <Link href="/dashboard/worker/onboarding" className="block">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Onboarding Progress</h2>
              <span className="text-sm font-medium text-white">{worker.progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                style={{ width: `${worker.progress}%` }}
              />
            </div>
          </Link>
        </div>
      )}

      {/* Secondary quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/worker/issues"
          className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <span className="text-2xl">🔍</span>
          <span className="text-sm font-medium text-white">My Issues</span>
          <span className="text-xs text-slate-400">View reported issues</span>
        </Link>
        <Link
          href="/dashboard/worker/documents"
          className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <span className="text-2xl">📄</span>
          <span className="text-sm font-medium text-white">Documents</span>
          <span className="text-xs text-slate-400">Uploaded files</span>
        </Link>
        <Link
          href="/dashboard/worker/profile"
          className="flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-center backdrop-blur-sm transition hover:bg-slate-800/50"
        >
          <span className="text-2xl">👤</span>
          <span className="text-sm font-medium text-white">Profile</span>
          <span className="text-xs text-slate-400">Your information</span>
        </Link>
      </div>
    </div>
  )
}
