"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Worker {
  id: number
  name: string
  whatsapp: string
  email: string | null
  employer: string | null
  createdAt: string
}

export function PendingWorkersTable() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchWorkers()
  }, [])

  async function fetchWorkers() {
    const res = await fetch("/api/workers?status=PENDING_APPROVAL")
    if (res.ok) {
      setWorkers(await res.json())
    }
    setLoading(false)
  }

  async function handleAction(workerId: number, newStatus: "ACTIVE" | "REJECTED") {
    setActionLoading(workerId)
    const res = await fetch(`/api/admin/workers/${workerId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setWorkers((prev) => prev.filter((w) => w.id !== workerId))
    } else {
      const data = await res.json()
      alert(data.error || "Failed to update status")
    }
    setActionLoading(null)
  }

  if (loading) {
    return <p className="text-slate-400">Loading...</p>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pending Approvals</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review and approve new worker registrations
        </p>
      </div>

      {workers.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
          <p className="text-slate-400">No pending approvals.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-400">Name</th>
                <th className="px-4 py-3 font-medium text-slate-400">WhatsApp</th>
                <th className="px-4 py-3 font-medium text-slate-400">Email</th>
                <th className="px-4 py-3 font-medium text-slate-400">Employer</th>
                <th className="px-4 py-3 font-medium text-slate-400">Registered</th>
                <th className="px-4 py-3 font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {workers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/workers/${worker.id}`}
                      className="font-medium text-white hover:text-blue-400"
                    >
                      {worker.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{worker.whatsapp}</td>
                  <td className="px-4 py-3 text-slate-300">{worker.email || "—"}</td>
                  <td className="px-4 py-3 text-slate-300">{worker.employer || "—"}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(worker.createdAt).toISOString().split("T")[0]}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(worker.id, "ACTIVE")}
                        disabled={actionLoading === worker.id}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {actionLoading === worker.id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Reject ${worker.name}?`)) {
                            handleAction(worker.id, "REJECTED")
                          }
                        }}
                        disabled={actionLoading === worker.id}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
