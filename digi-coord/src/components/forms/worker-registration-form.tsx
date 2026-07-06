"use client"

import { useState } from "react"
import { TextField } from "@/components/ui/text-field"
import { PasswordInput } from "@/components/ui/password-input"
import { type Lang, t } from "@/lib/translations"
import { useRouter } from "next/navigation"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  privacyConsent: boolean
}

const initialState: FormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  privacyConsent: false,
}

export function WorkerRegistrationForm({ lang }: { lang: Lang }) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialState)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function validatePasswords(password: string, confirmPassword: string): string | null {
    if (password.length < 6) return t("form.passwordMin", lang)
    if (password !== confirmPassword) return t("form.passwordMatch", lang)
    return null
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, privacyConsent: e.target.checked }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!formData.privacyConsent) {
      setError(t("privacy.consentRequired", lang))
      return
    }

    const pwError = validatePasswords(formData.password, formData.confirmPassword)
    if (pwError) {
      setError(pwError)
      return
    }

    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    const f = document.createElement("form")
    f.method = "POST"
    f.action = "/api/auth/login"
    f.innerHTML = `<input name="email" value="${formData.email}" />
      <input name="password" value="${formData.password}" />`
    document.body.appendChild(f)
    f.submit()
  }

  return (
    <div className="mx-auto max-w-lg">
      {error && (
        <p className="mb-4 rounded-lg bg-red-900/50 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField id="name" label={t("form.name", lang)} value={formData.name} onChange={handleChange} required placeholder="Juan Dela Cruz" />
        <TextField id="email" label={t("form.email", lang)} value={formData.email} onChange={handleChange} type="email" required placeholder="juan@example.com" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              {t("form.password", lang)} <span className="text-red-400">*</span>
            </label>
            <PasswordInput
              id="password" name="password" required minLength={6}
              value={formData.password} onChange={handleChange}
              placeholder={t("form.passwordMin", lang)}
              containerClassName="mt-1"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
              {t("form.confirmPassword", lang)} <span className="text-red-400">*</span>
            </label>
            <PasswordInput
              id="confirmPassword" name="confirmPassword" required minLength={6}
              value={formData.confirmPassword} onChange={handleChange}
              placeholder={t("form.confirmPassword", lang)}
              containerClassName="mt-1"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 cursor-pointer hover:bg-slate-700/50 transition-colors">
          <input
            type="checkbox"
            checked={formData.privacyConsent}
            onChange={handleCheckbox}
            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-300">
            {t("privacy.consent", lang)}{" "}
            <a href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
              {t("privacy.title", lang)}
            </a>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t("form.submitting", lang) : t("form.submit", lang)}
        </button>
      </form>
    </div>
  )
}
