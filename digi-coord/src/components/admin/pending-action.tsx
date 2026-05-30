"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function PendingAction({
  workerId,
  status,
  label,
}: {
  workerId: number
  status: "ACTIVE" | "REJECTED"
  label: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (status === "REJECTED" && !confirm("Reject this worker?")) return
    setLoading(true)
    const res = await fetch(`/api/admin/workers/${workerId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || "Failed")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 ${
        status === "ACTIVE"
          ? "bg-emerald-600 hover:bg-emerald-700"
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {loading ? "..." : label}
    </button>
  )
}
