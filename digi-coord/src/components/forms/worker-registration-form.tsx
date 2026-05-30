"use client"

import { useState } from "react"
import { PasswordInput } from "@/components/ui/password-input"

interface FormData {
  name: string
  whatsapp: string
  email: string
  password: string
  confirmPassword: string
  employer: string
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
  accommodation: "",
  arrivalDate: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
}

function validatePasswords(password: string, confirmPassword: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters"
  if (password !== confirmPassword) return "Passwords do not match"
  return null
}

export function WorkerRegistrationForm() {
  const [formData, setFormData] = useState<FormData>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
        <h3 className="text-xl font-bold text-white">Registration Submitted</h3>
        <p className="mt-2 text-slate-400">
          Registration successful! You can now{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300">
            sign in
          </a>{" "}
          with your email and password.
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
            Full name <span className="text-red-400">*</span>
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
            WhatsApp number <span className="text-red-400">*</span>
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
            Email address <span className="text-red-400">*</span>
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
              Password <span className="text-red-400">*</span>
            </label>
            <PasswordInput
              id="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              containerClassName="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300"
            >
              Confirm password <span className="text-red-400">*</span>
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              containerClassName="mt-1"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="employer"
            className="block text-sm font-medium text-slate-300"
          >
            Employer / Company
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
            htmlFor="accommodation"
            className="block text-sm font-medium text-slate-300"
          >
            Accommodation address
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
            Arrival date
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
            Emergency contact name
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
            Emergency contact phone
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
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  )
}
