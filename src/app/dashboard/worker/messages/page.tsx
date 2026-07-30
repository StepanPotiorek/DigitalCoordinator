"use client"

import { useEffect, useState } from "react"
import { useLang } from "@/lib/use-lang"
import { t } from "@/lib/translations"

interface Message {
  id: number
  message: string
  createdAt: string
}

export default function MessagesPage() {
  const lang = useLang()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function loadMessages() {
    const res = await fetch("/api/worker/me/messages")
    const data = await res.json()
    if (Array.isArray(data)) setMessages(data)
  }

  useEffect(() => { loadMessages() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/worker/me/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to send")
        return
      }
      setSent(true)
      setMessage("")
      loadMessages()
    } catch {
      setError("Failed to send message")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg pt-4">
      <h1 className="mb-1 text-xl font-bold text-white">{t("dashboard.messageCoordinator", lang)}</h1>
      <p className="mb-6 text-sm text-slate-400">{t("dashboard.sendMessage", lang)}</p>

      {sent && (
        <div className="mb-4 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4 text-center text-sm text-emerald-400">
          {t("dashboard.messageSent", lang)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("dashboard.messagePlaceholder", lang)}
          rows={5}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
          required
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !message.trim()}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
        >
          {submitting ? t("dashboard.sending", lang) : t("dashboard.send", lang)}
        </button>
      </form>

      {/* Sent messages */}
      {messages.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-medium text-slate-400">{t("dashboard.letterHistory", lang)}</h2>
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
                <p className="whitespace-pre-wrap text-sm text-slate-200">
                  {msg.message.replace(/^📩 Worker message: /, "")}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
