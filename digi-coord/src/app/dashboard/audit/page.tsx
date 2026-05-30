"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface AuditRow {
  id: number
  userId: string | null
  action: string
  entity: string
  entityId: number | null
  details: string | null
  createdAt: string
}

export default function AuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterAction, setFilterAction] = useState("")
  const [filterEntity, setFilterEntity] = useState("")

  const fetchAudit = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterAction) params.set("action", filterAction)
    if (filterEntity) params.set("entity", filterEntity)
    params.set("limit", "100")

    const res = await fetch(`/api/audit?${params}`)
    if (res.ok) {
      const data = await res.json()
      setRows(data.rows)
      setTotal(data.total)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAudit()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <span className="text-xs text-slate-500">{total} entries</span>
      </div>

      <div className="flex gap-3">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
        >
          <option value="">All actions</option>
          <option value="worker.create">worker.create</option>
          <option value="worker.update">worker.update</option>
          <option value="issue.create">issue.create</option>
          <option value="issue.update">issue.update</option>
          <option value="onboarding.toggle">onboarding.toggle</option>
        </select>
        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
        >
          <option value="">All entities</option>
          <option value="Worker">Worker</option>
          <option value="Issue">Issue</option>
          <option value="OnboardingItem">OnboardingItem</option>
        </select>
        <button
          onClick={fetchAudit}
          className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500">No audit entries found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/30">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
                      {row.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{row.entity}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {row.entityId ? (
                      <Link
                        href={`/dashboard/${row.entity.toLowerCase()}s/${row.entityId}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        #{row.entityId}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500">
                    {row.details || "-"}
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
