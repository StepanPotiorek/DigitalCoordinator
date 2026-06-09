"use client"

import { useState } from "react"
import { TextField } from "@/components/ui/text-field"
import { PasswordInput } from "@/components/ui/password-input"
import { type Lang, t } from "@/lib/translations"

interface FormData {
  name: string
  whatsapp: string
  email: string
  password: string
  confirmPassword: string
  employer: string
  city: string
  accommodation: string
  arrivalDate: string
  emergencyContactName: string
  emergencyContactPhone: string
}

const initialState: FormData = {
  name: "",
  whatsapp: "",
  email: "",
  password: "",
  confirmPassword: "",
  employer: "",
  city: "",
  accommodation: "",
  arrivalDate: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
}

export function WorkerRegistrationForm({ lang }: { lang: Lang }) {
  const [formData, setFormData] = useState<FormData>(initialState)
  const [submitted, setSubmitted] = useState(false)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const pwError = validatePasswords(formData.password, formData.confirmPassword)
    if (pwError) {
      setError(pwError)
      return
    }

    setLoading(true)

    const res = await fetch("/api/workers", {
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

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
        <div className="mb-4 text-4xl">✓</div>
        <h3 className="text-xl font-bold text-white">{t("register.success.title", lang)}</h3>
        <p className="mt-2 text-slate-400">
          {t("register.success.desc", lang)}
        </p>
      </div>
    )
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
        <TextField id="whatsapp" label={t("form.whatsapp", lang)} value={formData.whatsapp} onChange={handleChange} required placeholder="+639123456789" />
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

        <TextField id="employer" label={t("form.employer", lang)} value={formData.employer} onChange={handleChange} placeholder="Company name" />
        <TextField id="city" label={t("form.city", lang)} value={formData.city} onChange={handleChange} placeholder="Prague" />
        <TextField id="accommodation" label={t("form.accommodation", lang)} value={formData.accommodation} onChange={handleChange} placeholder="Address in Czech Republic" />
        <TextField id="arrivalDate" label={t("form.arrivalDate", lang)} value={formData.arrivalDate} onChange={handleChange} type="date" />
        <TextField id="emergencyContactName" label={t("form.emergencyName", lang)} value={formData.emergencyContactName} onChange={handleChange} placeholder="Next of kin" />
        <TextField id="emergencyContactPhone" label={t("form.emergencyPhone", lang)} value={formData.emergencyContactPhone} onChange={handleChange} placeholder="+639123456789" />

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
