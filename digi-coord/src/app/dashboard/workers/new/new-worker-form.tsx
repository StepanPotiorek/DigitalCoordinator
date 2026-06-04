"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function NewWorkerForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    password: "",
    employer: "",
    accommodation: "",
    arrivalDate: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    const res = await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        confirmPassword: form.password,
      }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
          <div className="mb-4 text-4xl text-emerald-400">✓</div>
          <h3 className="text-xl font-bold text-white">Worker Created</h3>
          <p className="mt-2 text-slate-400">
            Worker has been created with PENDING_APPROVAL status.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/dashboard/workers"
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
            >
              Back to Workers
            </Link>
            <button
              onClick={() => {
                setSuccess(false)
                setForm({
                  name: "", whatsapp: "", email: "", password: "",
                  employer: "", accommodation: "", arrivalDate: "",
                  emergencyContactName: "", emergencyContactPhone: "",
                })
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link
          href="/dashboard/workers"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to Workers
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Add Worker</h1>
        <p className="mt-1 text-sm text-slate-400">
          Create a new worker account. They will receive PENDING_APPROVAL
          status.
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-900/50 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">
            Full name <span className="text-red-400">*</span>
          </label>
          <input
            id="name" name="name" type="text" required
            value={form.name} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Juan Dela Cruz"
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-300">
            WhatsApp number <span className="text-red-400">*</span>
          </label>
          <input
            id="whatsapp" name="whatsapp" type="text" required
            value={form.whatsapp} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="+639123456789"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email address <span className="text-red-400">*</span>
          </label>
          <input
            id="email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="juan@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            Password <span className="text-red-400">*</span>
          </label>
          <input
            id="password" name="password" type="password" required minLength={6}
            value={form.password} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Min 6 characters"
          />
        </div>

        <div>
          <label htmlFor="employer" className="block text-sm font-medium text-slate-300">
            Employer / Company
          </label>
          <input
            id="employer" name="employer" type="text"
            value={form.employer} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Company name"
          />
        </div>

        <div>
          <label htmlFor="accommodation" className="block text-sm font-medium text-slate-300">
            Accommodation address
          </label>
          <input
            id="accommodation" name="accommodation" type="text"
            value={form.accommodation} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Address in Czech Republic"
          />
        </div>

        <div>
          <label htmlFor="arrivalDate" className="block text-sm font-medium text-slate-300">
            Arrival date
          </label>
          <input
            id="arrivalDate" name="arrivalDate" type="date"
            value={form.arrivalDate} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="emergencyContactName" className="block text-sm font-medium text-slate-300">
            Emergency contact name
          </label>
          <input
            id="emergencyContactName" name="emergencyContactName" type="text"
            value={form.emergencyContactName} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Next of kin"
          />
        </div>

        <div>
          <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-slate-300">
            Emergency contact phone
          </label>
          <input
            id="emergencyContactPhone" name="emergencyContactPhone" type="text"
            value={form.emergencyContactPhone} onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="+639123456789"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Worker"}
          </button>
          <Link
            href="/dashboard/workers"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
