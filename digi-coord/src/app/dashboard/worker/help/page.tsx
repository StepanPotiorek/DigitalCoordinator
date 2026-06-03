"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { categories, situations, type Situation } from "@/lib/situations"

type FlowStep = "category" | "situation" | "detail" | "feedback-yes" | "feedback-no"

const contactedOptions = [
  { value: "employer", label: "My employer" },
  { value: "coordinator", label: "My coordinator" },
  { value: "agency", label: "My agency" },
  { value: "doctor", label: "A doctor" },
  { value: "police", label: "The police" },
  { value: "no-one", label: "No one yet" },
]

const stepLabels = [
  { key: "category", number: 1, label: "Category" },
  { key: "situation", number: 2, label: "Situation" },
  { key: "detail", number: 3, label: "Solution" },
]

const HISTORY_KEY = "help-history"

function triggerConfetti() {
  const container = document.createElement("div")
  container.className = "fixed inset-0 pointer-events-none z-50"
  document.body.appendChild(container)

  const colors = ["#22c55e", "#3b82f6", "#eab308", "#ec4899", "#a855f7", "#f97316"]
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div")
    const color = colors[Math.floor(Math.random() * colors.length)]
    const left = Math.random() * 100
    const size = 6 + Math.random() * 6
    const rotation = Math.random() * 720
    const drift = (Math.random() - 0.5) * 200
    piece.style.cssText = `
      position: absolute; top: -10px; left: ${left}%;
      width: ${size}px; height: ${size * 0.6}px;
      background: ${color}; border-radius: 2px;
      animation: confettiFall ${0.8 + Math.random() * 0.6}s ease-out forwards;
      --drift: ${drift}px;
      transform: rotate(${rotation}deg);
    `
    container.appendChild(piece)
  }

  setTimeout(() => container.remove(), 1500)
}

function RippleButton({
  onClick,
  className,
  children,
}: {
  onClick: () => void
  className: string
  children: React.ReactNode
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
  }

  return (
    <button
      onClick={onClick}
      onPointerDown={handlePointerDown}
      className={`relative overflow-hidden ${className}`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/20 animate-ripple pointer-events-none"
          style={{
            left: r.x - 10,
            top: r.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      {children}
    </button>
  )
}

function SkeletonCard() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-slate-800" />
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-slate-800" />
          <div className="h-3 w-32 rounded bg-slate-800/50" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <div className="mb-3 h-4 w-40 rounded bg-slate-800" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-800/50" />
            <div className="h-4 w-3/4 rounded bg-slate-800/50" />
            <div className="h-4 w-1/2 rounded bg-slate-800/50" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function WorkerHelpPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [flowStep, setFlowStep] = useState<FlowStep>("category")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [contacted, setContacted] = useState("")
  const [toastMessage, setToastMessage] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [creatingIssue, setCreatingIssue] = useState(false)
  const [issueCreated, setIssueCreated] = useState(false)
  const [history, setHistory] = useState<Situation[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[]
        setHistory(ids.map((id) => situations.find((s) => s.id === id)).filter(Boolean) as Situation[])
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(""), 2000)
      return () => clearTimeout(t)
    }
  }, [toastMessage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [flowStep])

  const filteredSituations = useMemo(() => {
    let list = situations
    if (selectedCategory) {
      list = list.filter((s) => s.categoryId === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (s) =>
          s.title.en.toLowerCase().includes(q) ||
          s.title.cz.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q),
      )
    }
    return list
  }, [selectedCategory, searchQuery])

  const searchedSituations = useMemo(() => {
    if (!searchQuery.trim()) return []
    return situations.filter(
      (s) =>
        s.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.cz.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  const relatedSituations = useMemo(() => {
    if (!selectedSituation) return []
    return situations.filter(
      (s) => s.categoryId === selectedSituation.categoryId && s.id !== selectedSituation.id,
    ).slice(0, 3)
  }, [selectedSituation])

  function addToHistory(situation: Situation) {
    const stored = localStorage.getItem(HISTORY_KEY)
    let ids: string[] = stored ? JSON.parse(stored) : []
    ids = [situation.id, ...ids.filter((id) => id !== situation.id)].slice(0, 3)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(ids))
    setHistory(ids.map((id) => situations.find((s) => s.id === id)).filter(Boolean) as Situation[])
  }

  function handleCategoryClick(categoryId: string) {
    setSelectedCategory(categoryId)
    setSearchQuery("")
    setFlowStep("situation")
  }

  function handleSituationClick(situation: Situation) {
    setIsTransitioning(true)
    addToHistory(situation)
    setTimeout(() => {
      setSelectedSituation(situation)
      setFlowStep("detail")
      setIsTransitioning(false)
    }, 300)
  }

  function handleSearchSelect(situation: Situation) {
    setSearchQuery("")
    setSelectedCategory(situation.categoryId)
    addToHistory(situation)
    setSelectedSituation(situation)
    setFlowStep("detail")
  }

  function handleBack() {
    if (flowStep === "feedback-no" || flowStep === "feedback-yes") {
      setFlowStep("detail")
    } else if (flowStep === "detail") {
      setSelectedSituation(null)
      setFlowStep("situation")
    } else if (flowStep === "situation") {
      setSelectedCategory(null)
      setFlowStep("category")
    }
  }

  function handleDidHelp(helped: boolean) {
    if (selectedSituation) {
      fetch("/api/help/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situationId: selectedSituation.id, helped }),
      }).catch(() => {})
    }
    if (helped) {
      triggerConfetti()
      setFlowStep("feedback-yes")
    } else {
      setContacted("")
      setFlowStep("feedback-no")
    }
  }

  async function handleCreateIssue() {
    if (!selectedSituation) return
    setCreatingIssue(true)
    try {
      await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueType: selectedSituation.reportCategory,
          description: `Situation: ${selectedSituation.id}\nSteps tried:\n${selectedSituation.steps.en.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nContacted: ${contactedOptions.find((o) => o.value === contacted)?.label || contacted}\n\nStill needs help after following the guidance.`,
          situationId: selectedSituation.id,
          contacted,
          priority: "MEDIUM",
        }),
      })
      setIssueCreated(true)
    } catch {
      setToastMessage("⚠ Failed to create report. Please try again.")
    } finally {
      setCreatingIssue(false)
    }
  }

  function handleStartOver() {
    setSelectedCategory(null)
    setSelectedSituation(null)
    setSearchQuery("")
    setContacted("")
    setFlowStep("category")
  }

  const currentCategory = categories.find((c) => c.id === selectedCategory)

  function renderProgress() {
    const steps = stepLabels
    const currentIdx = steps.findIndex((s) => s.key === flowStep)
    const currentStep = currentIdx >= 0 ? currentIdx + 1 : 3

    return (
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition ${
                i <= currentIdx
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-500"
              } ${i === currentIdx ? "animate-pulse" : ""}`}
            >
              {s.number}
            </div>
            <span
              className={`hidden text-[10px] font-medium sm:inline ${
                i <= currentIdx ? "text-blue-400" : "text-slate-600"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`h-px w-4 ${i < currentIdx ? "bg-blue-600" : "bg-slate-800"}`} />
            )}
          </div>
        ))}
        <div className="ml-auto text-[10px] text-slate-500">
          {currentStep} / {steps.length}
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(12px); }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0.3) translateX(var(--drift)); opacity: 0; }
        }
        @keyframes ripple {
          to { transform: scale(8); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-ripple { animation: ripple 0.6s ease-out; }
        .animate-fade-in { animation: fadeSlideUp 0.35s ease-out; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.08) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="space-y-6">
        {/* Back button + progress */}
        <div className="space-y-3">
          {flowStep !== "category" && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          {flowStep !== "category" && flowStep !== "feedback-yes" && renderProgress()}
        </div>

        {/* Step: Category selection */}
        {flowStep === "category" && (
          <div className="animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-white">What do you need?</h1>
              <p className="mt-1 text-sm text-slate-400">
                Search or select a category to find help
              </p>
            </div>

            {/* Search bar */}
            <div className="relative mt-4">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search situations..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-sm transition focus:border-blue-700 focus:outline-none"
              />
              {searchQuery && searchedSituations.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 py-2 shadow-xl">
                  {searchedSituations.slice(0, 8).map((sit) => (
                    <button
                      key={sit.id}
                      onClick={() => handleSearchSelect(sit)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-slate-800"
                    >
                      <span className="text-lg">{sit.icon}</span>
                      <div>
                        <div className="text-sm text-white">{sit.title.en}</div>
                        <div className="text-xs text-slate-500">{sit.title.cz}</div>
                      </div>
                    </button>
                  ))}
                  {searchedSituations.length > 8 && (
                    <div className="border-t border-slate-800 px-4 py-2 text-center text-[10px] text-slate-500">
                      {searchedSituations.length - 8} more results — select a category
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recently viewed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {history.map((sit) => (
                    <button
                      key={sit.id}
                      onClick={() => {
                        setSelectedCategory(sit.categoryId)
                        setSelectedSituation(sit)
                        setFlowStep("detail")
                      }}
                      className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-300 transition hover:border-blue-700 hover:bg-slate-800/50"
                    >
                      <span>{sit.icon}</span>
                      <span>{sit.title.en}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category grid */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm transition hover:scale-[1.02] hover:border-blue-700 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="text-base font-medium text-white">{cat.title.en}</span>
                  <span className="text-xs text-slate-500">{cat.title.cz}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Situation selection */}
        {flowStep === "situation" && currentCategory && (
          <div className="animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentCategory.icon} {currentCategory.title.en}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Choose the specific situation
              </p>
            </div>

            <div className="mt-4 space-y-3">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${currentCategory.title.en}...`}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-sm transition focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {filteredSituations.map((sit) => (
                  <button
                    key={sit.id}
                    onClick={() => handleSituationClick(sit)}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left backdrop-blur-sm transition hover:scale-[1.02] hover:border-blue-700 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <span className="mt-0.5 text-xl">{sit.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{sit.title.en}</div>
                      <div className="text-xs text-slate-500">{sit.title.cz}</div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredSituations.length === 0 && (
                <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
                  {searchQuery
                    ? `No situations match "${searchQuery}"`
                    : "No situations in this category yet."}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step: Detail */}
        {flowStep === "detail" && selectedSituation && !isTransitioning && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{selectedSituation.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-white">{selectedSituation.title.en}</h1>
                <p className="text-sm text-slate-500">{selectedSituation.title.cz}</p>
              </div>
            </div>

            {/* What should I do? */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                What should I do?
              </h2>
              <ol className="space-y-2">
                {selectedSituation.steps.en.map((stepText, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-900/50 text-xs font-medium text-blue-400">
                      {i + 1}
                    </span>
                    <span>{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Contact info */}
            <div className="rounded-xl border border-slate-800 bg-slate-700/30 p-5 backdrop-blur-sm">
              <p className="flex items-start gap-2 text-sm text-slate-300">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {selectedSituation.contactTo === "employer" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  ) : selectedSituation.contactTo === "emergency" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  )}
                </svg>
                <span>
                  {selectedSituation.contactTo === "employer"
                    ? "Contact your employer directly using the message above."
                    : selectedSituation.contactTo === "emergency"
                      ? "If this is an emergency, call 112 immediately."
                      : "Contact your coordinator if you need further help."}
                </span>
              </p>
            </div>

            {/* Did this help? */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-slate-400">
                Did this help?
              </h3>
              <div className="flex justify-center gap-4">
                <RippleButton
                  onClick={() => handleDidHelp(true)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-900/20 px-8 py-4 transition hover:bg-emerald-900/40 hover:scale-[1.02]"
                >
                  <span className="text-2xl">✅</span>
                  <span className="text-sm font-medium text-emerald-400">Yes, it helped</span>
                </RippleButton>
                <RippleButton
                  onClick={() => handleDidHelp(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-amber-800 bg-amber-900/20 px-8 py-4 transition hover:bg-amber-900/40 hover:scale-[1.02]"
                >
                  <span className="text-2xl">❌</span>
                  <span className="text-sm font-medium text-amber-400">No, still need help</span>
                </RippleButton>
              </div>
            </div>
          </div>
        )}

        {/* Skeleton loading */}
        {flowStep === "detail" && isTransitioning && <SkeletonCard />}

        {/* Step: Feedback Yes */}
        {flowStep === "feedback-yes" && selectedSituation && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <span className="text-6xl">🌟</span>
            <h2 className="mt-4 text-xl font-bold text-white">Glad it helped!</h2>
            <p className="mt-2 text-sm text-slate-400">
              We hope everything works out well.
            </p>

            {/* Related situations */}
            {relatedSituations.length > 0 && (
              <div className="mt-8 w-full max-w-md">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  You might also need:
                </h3>
                <div className="space-y-2">
                  {relatedSituations.map((sit) => (
                    <button
                      key={sit.id}
                      onClick={() => {
                        setSelectedSituation(sit)
                        setFlowStep("detail")
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left transition hover:border-blue-700 hover:bg-slate-800/50"
                    >
                      <span className="text-xl">{sit.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-white">{sit.title.en}</div>
                        <div className="text-xs text-slate-500">{sit.title.cz}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleStartOver}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700/50"
              >
                Find another solution
              </button>
              <Link
                href="/dashboard/worker"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Step: Feedback No */}
        {flowStep === "feedback-no" && selectedSituation && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col items-center py-4 text-center">
              <span className="text-4xl">🤝</span>
              <h2 className="mt-3 text-xl font-bold text-white">
                We&apos;re here to help
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Before creating a report, who have you contacted so far?
              </p>
            </div>

            {/* Who have you contacted? */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                Who have you contacted about this problem?
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {contactedOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setContacted(opt.value)}
                    className={`rounded-xl border p-3 text-left text-sm transition ${
                      contacted === opt.value
                        ? "border-blue-700 bg-blue-900/30 text-blue-300"
                        : "border-slate-800 bg-slate-800/30 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Create report */}
            {issueCreated ? (
              <div className="rounded-xl border border-green-800 bg-green-950/30 p-6 backdrop-blur-sm text-center">
                <div className="mb-2 text-3xl">✅</div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-green-400">
                  Report Created
                </h3>
                <p className="mb-4 text-sm text-slate-300">
                  Your coordinator has been notified. They will follow up with you.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-center">
                  <Link
                    href="/dashboard/worker/issues"
                    className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    View My Issues
                  </Link>
                  <button
                    onClick={handleStartOver}
                    className="rounded-lg border border-slate-700 px-6 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:bg-slate-800/50"
                  >
                    Back to help
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-800/50 bg-amber-950/30 p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                  Still need help?
                </h3>
                <p className="mb-4 text-sm text-slate-300">
                  Your report will include the situation, the steps you tried, and who you contacted. Your coordinator will have full context.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={handleCreateIssue}
                    disabled={creatingIssue}
                    className="inline-block rounded-lg bg-amber-600 px-6 py-2.5 text-center text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
                  >
                    {creatingIssue ? "Creating report..." : "Create Report for Coordinator"}
                  </button>
                  <Link
                    href={`/report?situation=${selectedSituation?.id}${contacted ? `&contacted=${contacted}` : ""}`}
                    className="text-center text-xs text-slate-500 underline hover:text-slate-400"
                  >
                    Full report form instead
                  </Link>
                  <button
                    onClick={handleStartOver}
                    className="rounded-lg border border-slate-700 px-6 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:bg-slate-800/50"
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur-xl">
            {toastMessage}
          </div>
        </div>
      )}
    </>
  )
}
