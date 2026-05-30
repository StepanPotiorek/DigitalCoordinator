"use client"

import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Worker {
  id: number
  name: string
  whatsapp: string
  email: string | null
  employer: string | null
  accommodation: string | null
  arrivalDate: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  onboardingStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  status: "PENDING_APPROVAL" | "ACTIVE" | "REJECTED"
  createdAt: string
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-900/50 text-yellow-400",
  IN_PROGRESS: "bg-blue-900/50 text-blue-400",
  COMPLETED: "bg-green-900/50 text-green-400",
}

const accountStatusColors: Record<string, string> = {
  PENDING_APPROVAL: "bg-yellow-900/50 text-yellow-400",
  ACTIVE: "bg-green-900/50 text-green-400",
  REJECTED: "bg-red-900/50 text-red-400",
}

const accountStatusLabels: Record<string, string> = {
  PENDING_APPROVAL: "Pending",
  ACTIVE: "Active",
  REJECTED: "Rejected",
}

export default function WorkersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      fetchWorkers()
    }
  }, [status])

  async function fetchWorkers() {
    const res = await fetch("/api/workers")
    if (res.ok) {
      setWorkers(await res.json())
    }
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this worker?")) return
    const res = await fetch(`/api/workers/${id}`, { method: "DELETE" })
    if (res.ok) {
      setWorkers((prev) => prev.filter((w) => w.id !== id))
    }
  }

  if (status === "loading" || loading) {
    return <p className="text-slate-400">Loading...</p>
  }

  if (status === "unauthenticated") {
    return null
  }

  const filtered = useMemo(
    () =>
      workers.filter((w) => {
        const matchesSearch =
          !search ||
          w.name.toLowerCase().includes(search.toLowerCase()) ||
          (w.employer &&
            w.employer.toLowerCase().includes(search.toLowerCase()))
        const matchesStatus = !statusFilter || w.status === statusFilter
        return matchesSearch && matchesStatus
      }),
    [workers, search, statusFilter],
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Workers</h1>
        <a
          href="/api/export/workers"
          className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
        >
          Export CSV
        </a>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name or employer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All statuses</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="ACTIVE">Active</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-400">Name</th>
              <th className="px-4 py-3 font-medium text-slate-400">WhatsApp</th>
              <th className="px-4 py-3 font-medium text-slate-400">Employer</th>
              <th className="px-4 py-3 font-medium text-slate-400">Onboarding</th>
              <th className="px-4 py-3 font-medium text-slate-400">Account</th>
              <th className="px-4 py-3 font-medium text-slate-400">Arrival</th>
              <th className="px-4 py-3 font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No workers found.
                </td>
              </tr>
            )}
            {filtered.map((worker) => (
              <tr key={worker.id} className="hover:bg-slate-800/50">
                <td className="px-4 py-3 text-white">{worker.name}</td>
                <td className="px-4 py-3 text-slate-300">{worker.whatsapp}</td>
                <td className="px-4 py-3 text-slate-300">
                  {worker.employer || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[worker.onboardingStatus]}`}
                  >
                    {worker.onboardingStatus.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${accountStatusColors[worker.status] || "bg-slate-900/50 text-slate-400"}`}
                  >
                    {accountStatusLabels[worker.status] || worker.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {worker.arrivalDate
                    ? new Date(worker.arrivalDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/workers/${worker.id}`}
                      className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/workers/${worker.id}/edit`}
                      className="rounded bg-slate-600 px-2 py-1 text-xs text-white hover:bg-slate-700"
                    >
                      Edit
                    </Link>
                    {session?.user?.role === "ADMIN" && (
                      <button
                        onClick={() => handleDelete(worker.id)}
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
