"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

const types = [
  { value: "GENERAL", label: "General" },
  { value: "NOTE", label: "Note" },
  { value: "ISSUE_UPDATE", label: "Issue Update" },
  { value: "ONBOARDING_UPDATE", label: "Onboarding Update" },
]

export function CommunicationForm({
  workerId,
  companyId,
}: {
  workerId?: number
  companyId?: number
}) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [type, setType] = useState("GENERAL")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          type,
          workerId: workerId || null,
          companyId: companyId || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save")
        return
      }

      setMessage("")
      setType("GENERAL")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        placeholder="Add a note..."
      />

      <button
        type="submit"
        disabled={saving || !message.trim()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add Note"}
      </button>
    </form>
  )
}
