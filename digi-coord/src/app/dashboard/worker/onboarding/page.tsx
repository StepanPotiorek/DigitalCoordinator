"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface OnboardingItem {
  id: number
  label: string
  category: string
  completed: boolean
  completedAt: string | null
}

interface FaqItem {
  id: number
  question: string
  answer: string
  category: string | null
}

const faqToOnboardingCategory: Record<string, string> = {
  Communication: "SIM_CARD",
  Banking: "BANK_ACCOUNT",
  Emergency: "EMERGENCY",
  Workplace: "FIRST_DAY",
  Legal: "IMMIGRATION",
  Accommodation: "ACCOMMODATION",
  Adaptation: "ADAPTATION",
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
  const [faqTips, setFaqTips] = useState<FaqItem[]>([])
  const [faqLoading, setFaqLoading] = useState(true)

  async function loadItems() {
    const res = await fetch("/api/worker/me/onboarding")
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { loadItems() }, [])

  useEffect(() => {
    async function loadFaqTips() {
      try {
        const [faqRes, onbRes] = await Promise.all([
          fetch("/api/faq"),
          fetch("/api/worker/me/onboarding"),
        ])
        const faqs: FaqItem[] = await faqRes.json()
        const onboarding: OnboardingItem[] = await onbRes.json()

        const incompleteCategories = new Set(
          onboarding.filter((item) => !item.completed).map((item) => item.category),
        )

        const relevant = faqs.filter((faq) => {
          if (!faq.category) return false
          const mapped = faqToOnboardingCategory[faq.category]
          return mapped && incompleteCategories.has(mapped)
        })

        setFaqTips(relevant)
      } catch {
        setFaqTips([])
      } finally {
        setFaqLoading(false)
      }
    }

    loadFaqTips()
  }, [])

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

      {!faqLoading && faqTips.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              Onboarding tips
            </h2>
            <Link href="/faq" className="text-xs text-blue-400 hover:text-blue-300">
              View all FAQ →
            </Link>
          </div>
          <div className="space-y-2">
            {faqTips.map((faq) => (
              <Link
                key={faq.id}
                href="/faq"
                className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-3 transition hover:border-slate-700 hover:bg-slate-800/50"
              >
                <span className="mt-0.5 text-sm text-blue-400">💡</span>
                <div>
                  <div className="text-sm font-medium text-white">{faq.question}</div>
                  <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">{faq.answer}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
