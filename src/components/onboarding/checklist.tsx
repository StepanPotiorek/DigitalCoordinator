"use client"

import { useState } from "react"
import { ProgressBadge } from "./progress-badge"

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
  IMMIGRATION: "Employer Card & Immigration",
}

const categoryOrder = [
  "IMMIGRATION",
  "BEFORE_ARRIVAL",
  "AFTER_ARRIVAL",
  "FIRST_DAY",
  "SIM_CARD",
  "BANK_ACCOUNT",
  "ACCOMMODATION",
  "EMERGENCY",
  "LANGUAGE",
  "ADAPTATION",
]

type OnboardingItem = {
  id: number
  label: string
  category: string
  completed: boolean
}

export function Checklist({
  workerId,
  initialItems,
}: {
  workerId: number
  initialItems: OnboardingItem[]
}) {
  const [items, setItems] = useState(initialItems)
  const [toggling, setToggling] = useState<number | null>(null)

  const completed = items.filter((i) => i.completed).length
  const total = items.length

  async function toggle(item: OnboardingItem) {
    setToggling(item.id)
    try {
      const res = await fetch(`/api/onboarding/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !item.completed }),
      })
      if (res.ok) {
        const updated = await res.json()
        setItems((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i))
        )
      }
    } finally {
      setToggling(null)
    }
  }

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat] || cat,
      items: items.filter((i) => i.category === cat),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          {completed} of {total} completed
        </div>
        <ProgressBadge completed={completed} total={total} />
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${total === 0 ? 0 : (completed / total) * 100}%` }}
        />
      </div>

      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              {group.label}
            </h3>
            <div className="space-y-2">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggle(item)}
                  disabled={toggling === item.id}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                    item.completed
                      ? "border-green-800/50 bg-green-900/20 text-green-300"
                      : "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                  } ${toggling === item.id ? "opacity-50" : ""}`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      item.completed
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-slate-600"
                    }`}
                  >
                    {item.completed ? "✓" : ""}
                  </span>
                  <span className="flex-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
