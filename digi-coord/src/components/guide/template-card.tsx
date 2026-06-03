"use client"

import { useState, useEffect } from "react"

interface TemplateCardProps {
  icon: string
  titleEn: string
  titleCz: string
  messageEn: string
  messageCz: string
}

export function TemplateCard({ icon, titleEn, titleCz, messageEn, messageCz }: TemplateCardProps) {
  const [toast, setToast] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 2000)
      return () => clearTimeout(t)
    }
  }, [toast])

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setToast("✅ Copied!")
  }

  if (!mounted) {
    return (
      <div className="rounded-xl border border-emerald-800/30 bg-emerald-950/10 p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <div className="text-base font-semibold text-white">{titleEn}</div>
            <div className="text-sm text-slate-500">{titleCz}</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-5">
            <p className="text-base leading-relaxed text-slate-200">{messageEn}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-5">
            <p className="text-base leading-relaxed text-slate-200">{messageCz}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/20 p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <div className="text-base font-semibold text-white">{titleEn}</div>
            <div className="text-sm text-slate-500">{titleCz}</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-5">
            <p className="mb-3 text-base leading-relaxed text-slate-200">{messageEn}</p>
            <button
              onClick={() => copy(messageEn)}
              className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              <span>📋</span>
              <span>Copy English</span>
            </button>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-5">
            <p className="mb-3 text-base leading-relaxed text-slate-200">{messageCz}</p>
            <button
              onClick={() => copy(messageCz)}
              className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              <span>📋</span>
              <span>Copy Czech</span>
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur-xl">
            {toast}
          </div>
        </div>
      )}
    </>
  )
}
