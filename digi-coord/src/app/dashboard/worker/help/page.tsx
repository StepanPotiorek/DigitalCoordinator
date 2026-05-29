"use client"

import { useState } from "react"
import Link from "next/link"
import { categories, situations, type Situation } from "@/lib/situations"

type Step = "category" | "situation" | "detail"

export default function WorkerHelpPage() {
  const [step, setStep] = useState<Step>("category")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null)

  const filteredSituations = selectedCategory
    ? situations.filter((s) => s.categoryId === selectedCategory)
    : []

  function handleCategoryClick(categoryId: string) {
    setSelectedCategory(categoryId)
    setStep("situation")
  }

  function handleSituationClick(situation: Situation) {
    setSelectedSituation(situation)
    setStep("detail")
  }

  function handleBack() {
    if (step === "detail") {
      setSelectedSituation(null)
      setStep("situation")
    } else if (step === "situation") {
      setSelectedCategory(null)
      setStep("category")
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      {step !== "category" && (
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

      {step === "category" && (
        <>
          <div>
            <h1 className="text-2xl font-bold text-white">What do you need?</h1>
            <p className="mt-1 text-sm text-slate-400">
              Select what best describes your situation
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm transition hover:border-slate-700 hover:bg-slate-800/50"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-base font-medium text-white">{cat.title.en}</span>
                <span className="text-xs text-slate-500">{cat.title.cz}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "situation" && (
        <>
          <div>
            {categories.find((c) => c.id === selectedCategory) && (
              <h1 className="text-2xl font-bold text-white">
                {categories.find((c) => c.id === selectedCategory)!.icon}{" "}
                {categories.find((c) => c.id === selectedCategory)!.title.en}
              </h1>
            )}
            <p className="mt-1 text-sm text-slate-400">
              Choose the specific situation
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filteredSituations.map((sit) => (
              <button
                key={sit.id}
                onClick={() => handleSituationClick(sit)}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left backdrop-blur-sm transition hover:border-slate-700 hover:bg-slate-800/50"
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
              No situations in this category yet.
            </p>
          )}
        </>
      )}

      {step === "detail" && selectedSituation && (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">{selectedSituation.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{selectedSituation.title.en}</h1>
              <p className="text-sm text-slate-500">{selectedSituation.title.cz}</p>
            </div>
          </div>

          {/* What should I do? */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-400">What should I do?</h2>
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

          {/* Prepared message */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-400">Prepared message</h2>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">🇬🇧 English</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedSituation.message.en)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    Copy
                  </button>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-slate-200">
                  {selectedSituation.message.en}
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">🇨🇿 Czech</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedSituation.message.cz)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    Copy
                  </button>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-slate-200">
                  {selectedSituation.message.cz}
                </div>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="rounded-xl border border-slate-800 bg-slate-700/30 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-300">
              {selectedSituation.contactTo === "employer"
                ? "Contact your employer directly using the message above."
                : selectedSituation.contactTo === "emergency"
                  ? "If this is an emergency, call 112 immediately."
                  : "Contact your coordinator if you need further help."}
            </p>
          </div>

          {/* Still need help? */}
          <div className="rounded-xl border border-amber-800/50 bg-amber-950/30 p-5 backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-400">
              Still need help?
            </h3>
            <p className="mb-4 text-sm text-slate-300">
              If the steps above did not solve your problem, create a report and your coordinator will help.
            </p>
            <Link
              href={`/report?situation=${selectedSituation.id}`}
              className="inline-block rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700"
            >
              Create Report
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
