"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LanguageToggle } from "@/components/public/language-toggle"
import { PasswordInput } from "@/components/ui/password-input"
import { type Lang, t } from "@/lib/translations"

export function LoginForm({ lang }: { lang: Lang }) {
  const [error, setError] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("error")) {
      setError("Invalid email or password")
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="absolute right-4 top-4">
        <LanguageToggle lang={lang} />
      </div>

      <div className="w-full max-w-sm">
        <Link href={`/?lang=${lang}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("nav.home", lang)}
        </Link>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm">
          <div className="mb-2 text-center">
            <span className="text-3xl">🇵🇭</span>
          </div>
          <h1 className="mb-2 text-center text-2xl font-bold text-white">
            Sign In
          </h1>
          <p className="mb-6 text-center text-sm text-slate-400">
            {t("site.tagline", lang)}
          </p>

          <form action="/api/auth/login" method="POST" className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
              <PasswordInput
                id="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                containerClassName="mt-1"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-slate-500 hover:text-slate-400">
                Forgot password?
              </Link>
            </div>

            <button type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
