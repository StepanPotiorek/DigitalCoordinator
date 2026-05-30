"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface ActivityFeedItem {
  id: number
  action: string
  entity: string
  entityId: number | null
  details: string | null
  createdAt: string
}

interface OpenIssue {
  id: number
  issueType: string
  priority: string
  worker: { name: string } | null
  createdAt: string
}

export function ActivityFeed() {
  const [auditLogs, setAuditLogs] = useState<ActivityFeedItem[]>([])
  const [openIssues, setOpenIssues] = useState<OpenIssue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/activity?limit=15")
      .then((r) => r.json())
      .then((data) => {
        setAuditLogs(data.auditLogs || [])
        setOpenIssues(data.openIssues || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-sm text-slate-500">Loading activity...</div>
  }

  const allItems = [
    ...openIssues.map((i) => ({
      id: `issue-${i.id}`,
      time: i.createdAt,
      text: (
        <span>
          Open issue: <strong>{i.issueType}</strong>
          {i.worker ? <> — {i.worker.name}</> : null}
          <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-medium ${
            i.priority === "URGENT" ? "bg-red-900/50 text-red-400" :
            i.priority === "HIGH" ? "bg-amber-900/50 text-amber-400" :
            "bg-slate-800 text-slate-400"
          }`}>{i.priority}</span>
        </span>
      ),
      link: `/dashboard/issues/${i.id}`,
    })),
    ...auditLogs.map((a) => ({
      id: `audit-${a.id}`,
      time: a.createdAt,
      text: (
        <span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">{a.action}</span>
          {" on "}{a.entity}{a.entityId ? <> <Link href={`/dashboard/${a.entity.toLowerCase()}s/${a.entityId}`} className="text-blue-400 hover:text-blue-300">#{a.entityId}</Link></> : null}
        </span>
      ),
      link: a.entityId ? `/dashboard/${a.entity.toLowerCase()}s/${a.entityId}` : null,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 20)

  if (allItems.length === 0) {
    return <div className="text-sm text-slate-500">No recent activity.</div>
  }

  return (
    <div className="space-y-1">
      {allItems.map((item) => (
        <div key={item.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-2.5 text-xs text-slate-300">
          <span className="shrink-0 text-slate-600">
            {new Date(item.time).toLocaleDateString()}
          </span>
          <div className="min-w-0 flex-1 truncate">
            {item.link ? (
              <Link href={item.link} className="hover:text-white transition">
                {item.text}
              </Link>
            ) : (
              item.text
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
