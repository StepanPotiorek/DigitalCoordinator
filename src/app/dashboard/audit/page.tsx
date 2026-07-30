"use client"

import { useEffect, useState } from "react"

interface AuditRow {
  id: number
  action: string
  entity: string
  entityId: number | null
  details: string | null
  createdAt: string
}

function formatAction(action: string): string {
  const map: Record<string, string> = {
    "worker.create": "Worker created",
    "worker.update": "Worker updated",
    "worker.approved": "Approved",
    "worker.rejected": "Rejected",
    "worker.pending": "Set pending",
    "issue.create": "Issue created",
    "issue.update": "Issue updated",
    "onboarding.create": "Onboarding created",
    "onboarding.toggle": "Onboarding toggled",
    "accommodation.create": "Accommodation created",
    "accommodation.update": "Accommodation updated",
    "accommodation.delete": "Accommodation deleted",
    "company.create": "Company created",
    "company.update": "Company updated",
    "company.delete": "Company deleted",
    "communication.create": "Communication sent",
    "note.create": "Note added",
    "note.delete": "Note deleted",
  }
  return map[action] || action
}

export default function AuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/audit?limit=100")
      .then((res) => (res.ok ? res.json() : { rows: [] }))
      .then((data) => setRows(data.rows))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Audit Log</h1>

      {loading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500">No audit entries found.</div>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3"
            >
              <span className="mt-0.5 shrink-0 text-xs text-slate-500">
                {new Date(row.createdAt).toLocaleString()}
              </span>
              <span className="shrink-0 rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                {formatAction(row.action)}
              </span>
              <span className="text-sm text-slate-400">
                {row.entity}
                {row.entityId ? ` #${row.entityId}` : ""}
              </span>
              {row.details && (
                <span className="truncate text-sm text-slate-500">
                  — {row.details}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
