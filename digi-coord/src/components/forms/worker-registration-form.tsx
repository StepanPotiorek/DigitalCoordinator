"use client"

import { useState } from "react"
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
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.name", lang)} <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Juan Dela Cruz"
          />
        </div>

        <div>
          <label
            htmlFor="whatsapp"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.whatsapp", lang)} <span className="text-red-400">*</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="text"
            required
            value={formData.whatsapp}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="+639123456789"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.email", lang)} <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="juan@example.com"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              {t("form.password", lang)} <span className="text-red-400">*</span>
            </label>
            <PasswordInput
              id="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder={t("form.passwordMin", lang)}
              containerClassName="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300"
            >
              {t("form.confirmPassword", lang)} <span className="text-red-400">*</span>
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t("form.confirmPassword", lang)}
              containerClassName="mt-1"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="employer"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.employer", lang)}
          </label>
          <input
            id="employer"
            name="employer"
            type="text"
            value={formData.employer}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Company name"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.city", lang)}
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Prague"
          />
        </div>

        <div>
          <label
            htmlFor="accommodation"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.accommodation", lang)}
          </label>
          <input
            id="accommodation"
            name="accommodation"
            type="text"
            value={formData.accommodation}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Address in Czech Republic"
          />
        </div>

        <div>
          <label
            htmlFor="arrivalDate"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.arrivalDate", lang)}
          </label>
          <input
            id="arrivalDate"
            name="arrivalDate"
            type="date"
            value={formData.arrivalDate}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="emergencyContactName"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.emergencyName", lang)}
          </label>
          <input
            id="emergencyContactName"
            name="emergencyContactName"
            type="text"
            value={formData.emergencyContactName}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Next of kin"
          />
        </div>

        <div>
          <label
            htmlFor="emergencyContactPhone"
            className="block text-sm font-medium text-slate-300"
          >
            {t("form.emergencyPhone", lang)}
          </label>
          <input
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            type="text"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="+639123456789"
          />
        </div>

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
