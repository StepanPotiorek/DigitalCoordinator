"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLang } from "@/lib/use-lang"
import { t } from "@/lib/translations"

export default function ChangePasswordPage() {
  const lang = useLang()
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError(t("form.passwordMatch", lang))
      return
    }
    if (newPassword.length < 6) {
      setError(t("form.passwordMin", lang))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t("dashboard.passwordError", lang))
        return
      }
      setSuccess(true)
      setTimeout(() => router.push("/dashboard/worker"), 2000)
    } catch {
      setError(t("dashboard.passwordError", lang))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md pt-12 text-center">
        <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-8 backdrop-blur-sm">
          <div className="text-4xl">✅</div>
          <h2 className="mt-4 text-lg font-bold text-white">{t("dashboard.passwordChanged", lang)}</h2>
          <p className="mt-2 text-sm text-slate-400">{t("dashboard.overview", lang)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md pt-4">
      <h1 className="mb-1 text-xl font-bold text-white">{t("dashboard.changePassword", lang)}</h1>
      <p className="mb-6 text-sm text-slate-400">{t("dashboard.changePassword", lang)}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            {t("dashboard.currentPassword", lang)}
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            {t("dashboard.newPassword", lang)}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            {t("dashboard.confirmNewPassword", lang)}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
        >
          {submitting ? t("form.submitting", lang) : t("dashboard.changePassword", lang)}
        </button>
      </form>
    </div>
  )
}
