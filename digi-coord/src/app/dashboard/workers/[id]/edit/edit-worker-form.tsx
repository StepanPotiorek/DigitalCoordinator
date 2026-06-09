"use client"

import { TextField, SelectField } from "@/components/ui/text-field"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface WorkerForm {
  name: string
  whatsapp: string
  email: string
  employer: string
  city: string
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
      city: data.city || "",
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
        <TextField id="name" label="Full name" value={formData.name} onChange={handleChange} required />
        <TextField id="whatsapp" label="WhatsApp number" value={formData.whatsapp} onChange={handleChange} required />
        <TextField id="email" label="Email" value={formData.email} onChange={handleChange} type="email" />
        <TextField id="employer" label="Employer" value={formData.employer} onChange={handleChange} />
        <TextField id="city" label="City" value={formData.city} onChange={handleChange} />
        <TextField id="accommodation" label="Accommodation" value={formData.accommodation} onChange={handleChange} />
        <TextField id="arrivalDate" label="Arrival date" value={formData.arrivalDate} onChange={handleChange} type="date" />
        <TextField id="emergencyContactName" label="Emergency contact name" value={formData.emergencyContactName} onChange={handleChange} />
        <TextField id="emergencyContactPhone" label="Emergency contact phone" value={formData.emergencyContactPhone} onChange={handleChange} />

        {isAdmin && (
          <SelectField
            id="onboardingStatus"
            label="Onboarding Status"
            value={formData.onboardingStatus}
            onChange={handleChange}
            options={[
              { value: "PENDING", label: "PENDING" },
              { value: "IN_PROGRESS", label: "IN PROGRESS" },
              { value: "COMPLETED", label: "COMPLETED" },
            ]}
          />
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
