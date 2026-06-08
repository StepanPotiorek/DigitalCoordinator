"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Notification {
  id: number
  type: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications")
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch {}
  }

  async function markRead(id: number) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchNotifications()
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    })
    fetchNotifications()
  }

  const typeColor: Record<string, string> = {
    URGENT_ISSUE: "bg-red-500/10 text-red-400 border-red-800",
    NEW_ISSUE: "bg-amber-500/10 text-amber-400 border-amber-800",
    ISSUE_RESOLVED: "bg-green-500/10 text-green-400 border-green-800",
    NEW_WORKER: "bg-blue-500/10 text-blue-400 border-blue-800",
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[90vw] sm:w-80 rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
            <span className="text-sm font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-400 transition hover:text-blue-300"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={n.read ? "" : "bg-slate-800/30"}>
                  {n.link ? (
                    <Link
                      href={n.link}
                      onClick={() => { if (!n.read) markRead(n.id); setOpen(false) }}
                      className={`flex items-start gap-3 border-b border-slate-800 px-4 py-3 transition hover:bg-slate-800/50 ${n.read ? "" : "cursor-pointer"}`}
                    >
                      <span className={`mt-0.5 shrink-0 rounded border px-2 py-0.5 text-[10px] font-medium uppercase ${typeColor[n.type] || "bg-slate-700 text-slate-300"}`}>
                        {n.type.replace("_", " ")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${n.read ? "text-slate-400" : "text-white"}`}>
                          {n.message}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-600">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 border-b border-slate-800 px-4 py-3">
                      <span className={`mt-0.5 shrink-0 rounded border px-2 py-0.5 text-[10px] font-medium uppercase ${typeColor[n.type] || "bg-slate-700 text-slate-300"}`}>
                        {n.type.replace("_", " ")}
                      </span>
                      <p className={`text-sm ${n.read ? "text-slate-400" : "text-white"}`}>
                        {n.message}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
