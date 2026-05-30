"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
  faq: { id: number; question: string }[]
  situations: { id: string; icon: string; title: { en: string; cz: string }; categoryId: string; category?: string }[]
  guides: { href: string; title: { en: string; tl: string } }[]
}

export function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((p) => !p)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults(null)
    } else {
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        setResults(await res.json())
      } catch {
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

  function navigate(href: string) {
    setOpen(false)
    router.push(href)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQ, situations, guides..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <kbd className="hidden rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500 sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}

          {!loading && results && (
            <div className="space-y-1">
              {results.faq.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">FAQ</div>
                  {results.faq.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate("/faq")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                    >
                      <span className="text-blue-400">❓</span>
                      <span className="line-clamp-1">{item.question}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.situations.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Situations</div>
                  {results.situations.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/dashboard/worker/help?category=${item.categoryId}`)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                    >
                      <span>{item.icon}</span>
                      <span className="line-clamp-1">{item.title.en}</span>
                      {item.category && <span className="ml-auto text-[10px] text-slate-600">{item.category}</span>}
                    </button>
                  ))}
                </div>
              )}

              {results.guides.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Guide Pages</div>
                  {results.guides.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-slate-800"
                    >
                      <span className="text-slate-400">📄</span>
                      <span>{item.title.en}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.faq.length === 0 && results.situations.length === 0 && results.guides.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">No results for &ldquo;{query}&rdquo;</div>
              )}
            </div>
          )}

          {!loading && !results && query && (
            <div className="py-8 text-center text-sm text-slate-500">Searching...</div>
          )}

          {!query && (
            <div className="py-8 text-center text-sm text-slate-500">
              <div className="mb-2 text-2xl">🔍</div>
              Type to search across FAQ, situations, and guides
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
