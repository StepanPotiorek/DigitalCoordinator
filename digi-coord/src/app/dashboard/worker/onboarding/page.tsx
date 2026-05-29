"use client"

import { useEffect, useState } from "react"

interface OnboardingItem {
  id: number
  label: string
  category: string
  completed: boolean
  completedAt: string | null
}

const categoryLabels: Record<string, string> = {
  BEFORE_ARRIVAL: "Before Arrival",
  AFTER_ARRIVAL: "After Arrival",
  FIRST_DAY: "First Day",
  SIM_CARD: "SIM Card",
  BANK_ACCOUNT: "Bank Account",
  ACCOMMODATION: "Accommodation",
  EMERGENCY: "Emergency",
  LANGUAGE: "Language",
  ADAPTATION: "Adaptation",
  IMMIGRATION: "Immigration",
}

export default function WorkerOnboardingPage() {
  const [items, setItems] = useState<OnboardingItem[]>([])
  const [loading, setLoading] = useState(true)

  async function loadItems() {
    const res = await fetch("/api/worker/me/onboarding")
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { loadItems() }, [])

  async function toggleItem(item: OnboardingItem) {
    await fetch("/api/worker/me/onboarding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, completed: !item.completed }),
    })
    loadItems()
  }

  const grouped = items.reduce<Record<string, OnboardingItem[]>>((acc, item) => {
    const cat = categoryLabels[item.category] || item.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const completed = items.filter((i) => i.completed).length
  const total = items.length
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Onboarding</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track your onboarding progress
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            {completed} of {total} completed
          </span>
          <span className="text-lg font-bold text-white">{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <p className="text-sm text-slate-400">No onboarding items yet.</p>
      ) : (
        Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">{category}</h2>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                    item.completed
                      ? "border-emerald-800 bg-emerald-900/20 text-emerald-300"
                      : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    item.completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-500"
                  }`}>
                    {item.completed ? "✓" : ""}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
