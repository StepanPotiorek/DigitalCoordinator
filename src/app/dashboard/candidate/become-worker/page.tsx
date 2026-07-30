"use client"

import { useState } from "react"
import { TextField } from "@/components/ui/text-field"
import { useRouter } from "next/navigation"

export default function BecomeWorkerPage() {
  const router = useRouter()
  const [employer, setEmployer] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [city, setCity] = useState("")
  const [contract, setContract] = useState<File | null>(null)
  const [employeeCard, setEmployeeCard] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!whatsapp) { setError("WhatsApp number is required"); setLoading(false); return }
    if (!contract) { setError("Employment contract is required"); setLoading(false); return }
    if (!employeeCard) { setError("Employee card photo is required"); setLoading(false); return }

    const formData = new FormData()
    formData.append("employer", employer)
    formData.append("whatsapp", whatsapp)
    formData.append("city", city)
    formData.append("contract", contract)
    formData.append("employeeCard", employeeCard)

    const res = await fetch("/api/user/become-worker", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/dashboard/pending")
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-white">Request to become a Worker</h1>
      <p className="mt-1 text-sm text-slate-400">
        Submit your employment contract and employee card for admin approval.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-900/50 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          id="employer"
          label="Employer / Company"
          value={employer}
          onChange={(e) => setEmployer(e.target.value)}
          placeholder="Company name"
        />
        <TextField
          id="whatsapp"
          label="WhatsApp number"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
          placeholder="+639123456789"
        />
        <TextField
          id="city"
          label="City in Czech Republic"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Prague"
        />

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Employment Contract <span className="text-red-400">*</span>
          </label>
          <p className="mb-2 text-xs text-slate-500">
            Upload a copy of your signed employment contract (PDF or image, max 20MB)
          </p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={(e) => setContract(e.target.files?.[0] || null)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Employee Card Photo <span className="text-red-400">*</span>
          </label>
          <p className="mb-2 text-xs text-slate-500">
            Upload a photo of your employee card (PDF or image, max 20MB)
          </p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={(e) => setEmployeeCard(e.target.files?.[0] || null)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  )
}
