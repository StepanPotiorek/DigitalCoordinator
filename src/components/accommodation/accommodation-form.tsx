"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type FormData = {
  address: string
  room: string
  rules: string
  contactName: string
  contactPhone: string
  mapUrl: string
}

export function AccommodationForm({
  workerId,
  initialData,
}: {
  workerId: number
  initialData?: FormData
}) {
  const router = useRouter()
  const isEdit = !!initialData

  const [form, setForm] = useState<FormData>(
    initialData ?? {
      address: "",
      room: "",
      rules: "",
      contactName: "",
      contactPhone: "",
      mapUrl: "",
    }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const url = isEdit
      ? `/api/accommodations/${workerId}`
      : "/api/accommodations"
    const method = isEdit ? "PUT" : "POST"
    const body = isEdit
      ? { ...form, workerId }
      : { ...form, workerId }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save")
        return
      }

      router.push(`/dashboard/workers/${workerId}`)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Address *
        </label>
        <input
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Street, city, postal code"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Room
        </label>
        <input
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Room number or name"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          House Rules (one per line)
        </label>
        <textarea
          value={form.rules}
          onChange={(e) => setForm({ ...form, rules: e.target.value })}
          rows={4}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="No smoking inside&#10;Quiet hours after 10pm&#10;..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Contact Name
          </label>
          <input
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            placeholder="Landlord or manager"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Contact Phone
          </label>
          <input
            value={form.contactPhone}
            onChange={(e) =>
              setForm({ ...form, contactPhone: e.target.value })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            placeholder="+420..."
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Map URL
        </label>
        <input
          value={form.mapUrl}
          onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="https://maps.google.com/..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg bg-slate-700 px-6 py-2 text-sm font-medium text-white hover:bg-slate-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
