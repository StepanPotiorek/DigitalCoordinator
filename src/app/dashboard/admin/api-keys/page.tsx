"use client"

import { useEffect, useState } from "react"

interface ApiKey {
  id: number
  name: string
  scopes: string
  active: boolean
  lastUsedAt: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [newKey, setNewKey] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")

  const fetchKeys = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/api-keys")
    if (res.ok) setKeys(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const createKey = async () => {
    if (!name) return
    const res = await fetch("/api/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      const data = await res.json()
      setNewKey(data.key)
      setName("")
      setShowForm(false)
      fetchKeys()
    }
  }

  const toggleKey = async (id: number, active: boolean) => {
    await fetch(`/api/admin/api-keys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    })
    fetchKeys()
  }

  const deleteKey = async (id: number) => {
    if (!confirm("Delete this API key?")) return
    await fetch(`/api/admin/api-keys/${id}`, { method: "DELETE" })
    fetchKeys()
  }

  if (loading) return <div className="text-sm text-slate-400">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">API Keys</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
        >
          Generate Key
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
          <input
            type="text"
            placeholder="Key name (e.g., integration-x)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
          <button
            onClick={createKey}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      )}

      {newKey && (
        <div className="rounded-xl border border-amber-800 bg-amber-950/30 p-4 backdrop-blur-sm">
          <p className="text-xs font-medium text-amber-400">New API Key Generated</p>
          <code className="mt-1 block break-all rounded bg-slate-800 px-3 py-2 text-sm text-green-400">
            {newKey}
          </code>
          <p className="mt-1 text-xs text-slate-500">Save this key — it will not be shown again.</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Scopes</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Last Used</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {keys.map((key) => (
              <tr key={key.id} className="hover:bg-slate-900/30">
                <td className="px-4 py-3 font-medium text-white">{key.name}</td>
                <td className="px-4 py-3 text-slate-400">{key.scopes}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleKey(key.id, key.active)}
                    className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                      key.active ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {key.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {key.lastUsedAt ? new Date(key.lastUsedAt).toISOString().split("T")[0] : "never"}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(key.createdAt).toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteKey(key.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
