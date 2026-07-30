"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TextField } from "@/components/ui/text-field"

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
    city: "",
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
                  employer: "", city: "", accommodation: "", arrivalDate: "",
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
        <TextField id="name" label="Full name" value={form.name} onChange={handleChange} required placeholder="Juan Dela Cruz" />
        <TextField id="whatsapp" label="WhatsApp number" value={form.whatsapp} onChange={handleChange} required placeholder="+639123456789" />
        <TextField id="email" label="Email address" value={form.email} onChange={handleChange} type="email" required placeholder="juan@example.com" />
        <TextField id="password" label="Password" value={form.password} onChange={handleChange} type="password" required minLength={6} placeholder="Min 6 characters" />
        <TextField id="employer" label="Employer / Company" value={form.employer} onChange={handleChange} placeholder="Company name" />
        <TextField id="city" label="City" value={form.city} onChange={handleChange} placeholder="Prague" />
        <TextField id="accommodation" label="Accommodation address" value={form.accommodation} onChange={handleChange} placeholder="Address in Czech Republic" />
        <TextField id="arrivalDate" label="Arrival date" value={form.arrivalDate} onChange={handleChange} type="date" />
        <TextField id="emergencyContactName" label="Emergency contact name" value={form.emergencyContactName} onChange={handleChange} placeholder="Next of kin" />
        <TextField id="emergencyContactPhone" label="Emergency contact phone" value={form.emergencyContactPhone} onChange={handleChange} placeholder="+639123456789" />

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
