"use client"

import { useState } from "react"

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

  const categories = Object.entries(grouped)

  return (
    <div className="space-y-8">
      {categories.map(
        (cat) =>
          cat[1].length > 0 && (
            <div key={cat[0]}>
              <h2 className="mb-4 text-lg font-semibold capitalize text-blue-400">
                {cat[0]}
              </h2>
              <div className="space-y-2">
                {cat[1].map((faq: FAQ) => (
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
    </div>
  )
}
