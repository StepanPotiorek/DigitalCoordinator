"use client"

import { useSession } from "next-auth/react"
import { LogoutButton } from "@/components/auth/logout-button"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import { PushSubscribeButton } from "@/components/pwa/push-subscribe-button"
import Link from "next/link"
import { useState } from "react"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  const role = session?.user?.role

  const navLinks = (
    <>
      {role === "WORKER" && (
        <>
          <Link
            href="/dashboard/worker/help"
            className="rounded-lg bg-blue-900/30 px-3 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-800/40 hover:text-blue-200"
            onClick={() => setMenuOpen(false)}
          >
            🆘 I need help
          </Link>
          <Link
            href="/dashboard/worker"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Overview
          </Link>
          <Link
            href="/dashboard/worker/onboarding"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Onboarding
          </Link>
          <Link
            href="/dashboard/worker/employee-card"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Employee Card
          </Link>
          <Link
            href="/dashboard/worker/issues"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            My Issues
          </Link>
          <Link
            href="/dashboard/worker/documents"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Documents
          </Link>
          <Link
            href="/dashboard/worker/profile"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
        </>
      )}
      {role === "ADMIN" && (
        <Link
          href="/dashboard/admin"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Admin Panel
        </Link>
      )}
      {role === "ADMIN" && (
        <Link
          href="/dashboard/users"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Users
        </Link>
      )}
      {(role === "ADMIN" || role === "COORDINATOR") && (
        <Link
          href="/dashboard/operations"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Operations
        </Link>
      )}
      {(role === "ADMIN" || role === "COORDINATOR") && (
        <Link
          href="/dashboard/workers"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Workers
        </Link>
      )}
      {(role === "ADMIN" || role === "COORDINATOR") && (
        <Link
          href="/dashboard/accommodations"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Accommodations
        </Link>
      )}
      {(role === "ADMIN" || role === "COORDINATOR") && (
        <Link
          href="/dashboard/issues"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Issues
        </Link>
      )}
      {(role === "ADMIN" || role === "COMPANY") && (
        <Link
          href="/dashboard/companies"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Companies
        </Link>
      )}
      {role === "ADMIN" && (
        <Link
          href="/dashboard/audit"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Audit Log
        </Link>
      )}
      {role === "ADMIN" && (
        <Link
          href="/dashboard/admin/api-keys"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          API Keys
        </Link>
      )}
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-800 p-2 text-white md:hidden"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm md:flex">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-400">
            {session?.user?.name || "User"}
          </p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>

        <nav className="flex flex-1 flex-col space-y-2">
          {navLinks}
        </nav>

        <div className="mt-auto pt-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900 p-6 backdrop-blur-sm transition-transform md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-400">
            {session?.user?.name || "User"}
          </p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>

        <nav className="flex flex-1 flex-col space-y-2">
          {navLinks}
        </nav>

        <div className="mt-auto pt-4">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1">
        <div className="flex items-center justify-end gap-2 border-b border-slate-800 px-4 py-2 md:px-8">
          <PushSubscribeButton />
          <NotificationBell />
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
