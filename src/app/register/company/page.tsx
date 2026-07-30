"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PasswordInput } from "@/components/ui/password-input"

export default function RegisterCompanyPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
      contactPhone: form.get("contactPhone"),
      privacyConsent: form.get("privacyConsent") === "on",
    }

    const res = await fetch("/api/auth/register/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Registration failed")
      setLoading(false)
      return
    }

    // Auto-login
    const formEl = document.createElement("form")
    formEl.method = "POST"
    formEl.action = "/api/auth/login"
    const emailInput = document.createElement("input")
    emailInput.name = "email"
    emailInput.value = body.email as string
    const passInput = document.createElement("input")
    passInput.name = "password"
    passInput.value = body.password as string
    formEl.appendChild(emailInput)
    formEl.appendChild(passInput)
    document.body.appendChild(formEl)
    formEl.submit()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm">
          <div className="mb-2 text-center">
            <span className="text-3xl">🏢</span>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-white">Register as Company</h1>
          <p className="mb-6 text-center text-sm text-slate-400">Create an account for your company</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">Company Name</label>
              <input id="name" name="name" type="text" required
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Your Company s.r.o." />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="company@example.com" />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-300">Contact Phone</label>
              <input id="contactPhone" name="contactPhone" type="tel"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="+420 777 654 279" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
              <PasswordInput
                id="password" name="password" required autoComplete="new-password"
                placeholder="••••••••"
                containerClassName="mt-1"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">Confirm Password</label>
              <PasswordInput
                id="confirmPassword" name="confirmPassword" required autoComplete="new-password"
                placeholder="••••••••"
                containerClassName="mt-1"
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-400">
              <input type="checkbox" name="privacyConsent" required
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-600 bg-slate-800 text-blue-600 outline-none" />
              <span>
                I agree to the{" "}
                <Link href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
              </span>
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Registering..." : "Register as Company"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
