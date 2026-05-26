"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const

export function IssueActions({
  issueId,
  currentStatus,
  currentPriority,
  isAdmin,
}: {
  issueId: number
  currentStatus: string
  currentPriority: string
  isAdmin: boolean
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function update(fields: Record<string, string>) {
    setSaving(true)
    try {
      await fetch(`/api/issues/${issueId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      })
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((s) =>
        s !== currentStatus ? (
          <button
            key={s}
            onClick={() => update({ status: s })}
            disabled={saving}
            className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-600 disabled:opacity-50"
          >
            {s === "OPEN"
              ? "Reopen"
              : s === "IN_PROGRESS"
                ? "Mark In Progress"
                : "Mark Resolved"}
          </button>
        ) : null
      )}
      {isAdmin && (
        <select
          value={currentPriority}
          onChange={(e) => update({ priority: e.target.value })}
          disabled={saving}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p} priority
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
