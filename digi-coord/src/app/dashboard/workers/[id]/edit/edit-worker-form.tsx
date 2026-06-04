"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface WorkerForm {
  name: string
  whatsapp: string
  email: string
  employer: string
  accommodation: string
  arrivalDate: string
  emergencyContactName: string
  emergencyContactPhone: string
  onboardingStatus: string
}

interface SessionProp {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    role?: string
  }
}

export function EditWorkerForm({ session }: { session: SessionProp }) {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState<WorkerForm | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchWorker()
    }
  }, [params.id])

  async function fetchWorker() {
    const res = await fetch(`/api/workers/${params.id}`)
    if (!res.ok) {
      setError("Failed to load worker")
      setLoading(false)
      return
    }
    const data = await res.json()
    setFormData({
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email || "",
      employer: data.employer || "",
      accommodation: data.accommodation || "",
      arrivalDate: data.arrivalDate
        ? data.arrivalDate.split("T")[0]
        : "",
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
      onboardingStatus: data.onboardingStatus,
    })
    setLoading(false)
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : prev
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData) return
    setError("")

    const res = await fetch(`/api/workers/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to update")
      return
    }

    router.push(`/dashboard/workers/${params.id}`)
  }

  if (loading) {
    return <p className="text-slate-400">Loading...</p>
  }

  if (!formData) {
    return <p className="text-slate-400">{error || "Worker not found"}</p>
  }

  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Worker</h1>
        <Link
          href={`/dashboard/workers/${params.id}`}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-900/50 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
      >
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
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="employer"
            className="block text-sm font-medium text-slate-300"
          >
            Employer
          </label>
          <input
            id="employer"
            name="employer"
            type="text"
            value={formData.employer}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="accommodation"
            className="block text-sm font-medium text-slate-300"
          >
            Accommodation
          </label>
          <input
            id="accommodation"
            name="accommodation"
            type="text"
            value={formData.accommodation}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {isAdmin && (
          <div>
            <label
              htmlFor="onboardingStatus"
              className="block text-sm font-medium text-slate-300"
            >
              Onboarding Status
            </label>
            <select
              id="onboardingStatus"
              name="onboardingStatus"
              value={formData.onboardingStatus}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
