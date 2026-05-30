"use client"

import { signIn } from "next-auth/react"
import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LanguageToggle } from "@/components/public/language-toggle"
import { PasswordInput } from "@/components/ui/password-input"
import { type Lang, t } from "@/lib/translations"

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const router = useRouter()
  const { lang: langParam } = use(searchParams)
  const lang: Lang = langParam === "tl" ? "tl" : langParam === "cz" ? "cz" : "en"
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      {/* Language toggle */}
      <div className="absolute right-4 top-4">
        <LanguageToggle lang={lang} />
      </div>

      <div className="w-full max-w-sm">
        {/* Back link */}
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

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
