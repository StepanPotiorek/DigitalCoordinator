"use client"

import Link from "next/link"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div className="text-4xl">⚠️</div>
      <h2 className="text-xl font-bold text-white">Dashboard error</h2>
      <p className="text-sm text-slate-400">{error.message}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg bg-slate-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
