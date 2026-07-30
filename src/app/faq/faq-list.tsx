"use client"

import { useMemo, useState, useCallback, useRef } from "react"

type FAQ = {
  id: number
  question: string
  answer: string
  category: string | null
}

export function FAQList({
  grouped,
}: {
  grouped: Record<string, FAQ[]>
}) {
  const [openId, setOpenId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const allFaqs = useMemo(() => Object.values(grouped).flat(), [grouped])
  const categories = Object.keys(grouped)

  const filtered = useMemo(() => {
    let result = activeCategory ? (grouped[activeCategory] || []) : allFaqs
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeCategory, search, grouped, allFaqs])

  const groupedFiltered = useMemo(() => {
    const map: Record<string, FAQ[]> = {}
    for (const faq of filtered) {
      const cat = faq.category || "General"
      if (!map[cat]) map[cat] = []
      map[cat].push(faq)
    }
    return map
  }, [filtered])

  const flatFaqs = useMemo(
    () => Object.values(groupedFiltered).flat(),
    [groupedFiltered]
  )

  const matchCount = filtered.length

  const focusItem = useCallback((index: number) => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-faq-index="${index}"]`
    )
    el?.focus()
    el?.scrollIntoView({ block: "nearest" })
  }, [])

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (flatFaqs.length === 0) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        const next =
          focusedIndex === null
            ? 0
            : Math.min(focusedIndex + 1, flatFaqs.length - 1)
        setFocusedIndex(next)
        focusItem(next)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev =
          focusedIndex === null
            ? flatFaqs.length - 1
            : Math.max(focusedIndex - 1, 0)
        setFocusedIndex(prev)
        focusItem(prev)
      }
    },
    [flatFaqs.length, focusedIndex, focusItem]
  )

  const handleItemKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        const next = Math.min(idx + 1, flatFaqs.length - 1)
        setFocusedIndex(next)
        focusItem(next)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prev = Math.max(idx - 1, 0)
        setFocusedIndex(prev)
        focusItem(prev)
      }
    },
    [flatFaqs.length, focusItem]
  )

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setFocusedIndex(null)
          }}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search FAQ..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-sm focus:border-blue-500"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveCategory(null)
            setFocusedIndex(null)
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            activeCategory === null
              ? "bg-blue-600 text-white"
              : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat)
              setFocusedIndex(null)
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {search && (
        <p className="text-xs text-slate-500">
          {matchCount} result{matchCount !== 1 ? "s" : ""}
        </p>
      )}

      {/* FAQ items */}
      <div className="space-y-8" ref={listRef}>
        {Object.entries(groupedFiltered).map(
          ([cat, faqs]) =>
            faqs.length > 0 && (
              <div key={cat}>
                <h2 className="mb-4 text-lg font-semibold capitalize text-blue-400">
                  {cat}
                </h2>
                <div className="space-y-2">
                  {faqs.map((faq) => {
                    const idx = flatFaqs.findIndex((f) => f.id === faq.id)
                    return (
                      <div
                        key={faq.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                      >
                        <button
                          onClick={() =>
                            setOpenId(openId === faq.id ? null : faq.id)
                          }
                          onKeyDown={(e) => handleItemKeyDown(e, idx)}
                          onFocus={() => setFocusedIndex(idx)}
                          data-faq-index={idx}
                          className="flex w-full items-center justify-between px-5 py-4 text-left"
                        >
                          <span className="pr-4 text-sm font-medium text-white">
                            {faq.question}
                          </span>
                          <span
                            className={`shrink-0 text-slate-500 transition ${
                              openId === faq.id ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                        {openId === faq.id && (
                          <div className="border-t border-slate-800 px-5 py-4">
                            <p className="text-sm leading-relaxed text-slate-400">
                              {faq.answer}
                            </p>
                            <FaqHelpful faqId={faq.id} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
        )}

        {Object.keys(groupedFiltered).length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
            <p className="text-slate-400">No FAQ items match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FaqHelpful({ faqId }: { faqId: number }) {
  const [voted, setVoted] = useState<boolean | null>(null)
  const [sending, setSending] = useState(false)

  const send = useCallback(async (helpful: boolean) => {
    setSending(true)
    try {
      await fetch("/api/faq/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqId, helpful }),
      })
      setVoted(helpful)
    } catch {}
    setSending(false)
  }, [faqId])

  if (voted !== null) {
    return (
      <div className="mt-3 text-xs text-slate-500">
        {voted ? "Glad it helped!" : "Thanks for your feedback."}
      </div>
    )
  }

  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
      <span>Was this helpful?</span>
      <button
        onClick={() => send(true)}
        disabled={sending}
        className="rounded px-2 py-0.5 text-green-400 transition hover:bg-green-900/30 disabled:opacity-50"
      >
        Yes
      </button>
      <button
        onClick={() => send(false)}
        disabled={sending}
        className="rounded px-2 py-0.5 text-red-400 transition hover:bg-red-900/30 disabled:opacity-50"
      >
        No
      </button>
    </div>
  )
}
