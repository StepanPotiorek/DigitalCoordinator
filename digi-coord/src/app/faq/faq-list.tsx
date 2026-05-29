"use client"

import { useMemo, useState } from "react"

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

  const matchCount = filtered.length

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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search FAQ..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none backdrop-blur-sm focus:border-blue-500"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
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
            onClick={() => setActiveCategory(cat)}
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
      <div className="space-y-8">
        {Object.entries(groupedFiltered).map(
          ([cat, faqs]) =>
            faqs.length > 0 && (
              <div key={cat}>
                <h2 className="mb-4 text-lg font-semibold capitalize text-blue-400">
                  {cat}
                </h2>
                <div className="space-y-2">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                    >
                      <button
                        onClick={() =>
                          setOpenId(openId === faq.id ? null : faq.id)
                        }
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
                        </div>
                      )}
                    </div>
                  ))}
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
