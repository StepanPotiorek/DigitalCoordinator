"use client"

import { useEffect, useState } from "react"

interface Issue {
  id: number
  issueType: string
  description: string
  priority: string
  status: string
  mediaUrls: string[]
  createdAt: string
}

const statusColors: Record<string, string> = {
  OPEN: "bg-red-900/50 text-red-400",
  IN_PROGRESS: "bg-blue-900/50 text-blue-400",
  RESOLVED: "bg-green-900/50 text-green-400",
}

const priorityColors: Record<string, string> = {
  URGENT: "text-red-400 font-bold",
  HIGH: "text-amber-400",
  MEDIUM: "text-blue-400",
  LOW: "text-slate-400",
}

export default function WorkerIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/worker/me/issues")
      .then((r) => r.json())
      .then(setIssues)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Issues</h1>
        <p className="mt-1 text-sm text-slate-400">
          Issues you have reported
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : issues.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
          <p className="text-slate-400">No issues reported yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <span className="font-medium text-white">
                    {issue.issueType}
                  </span>
                  <span className={`ml-2 text-xs font-medium ${priorityColors[issue.priority]}`}>
                    {issue.priority}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[issue.status]}`}
                >
                  {issue.status.replace("_", " ")}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-300">
                {issue.description.length > 200
                  ? issue.description.slice(0, 200) + "..."
                  : issue.description}
              </p>
              {issue.mediaUrls && issue.mediaUrls.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  {issue.mediaUrls.length} attachment(s)
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {new Date(issue.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <a
          href="/report"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Report New Issue
        </a>
      </div>
    </div>
  )
}
