"use client"

import { useSession } from "next-auth/react"
import { Sidebar } from "./sidebar"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import { PushSubscribeButton } from "@/components/pwa/push-subscribe-button"
import { LanguageToggle } from "@/components/public/language-toggle"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useLang } from "@/lib/use-lang"
import { t } from "@/lib/translations"

function NavLink({ href, className, children, onClick }: { href: string; className: string; children: React.ReactNode; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + "/")
  return (
    <Link
      href={href}
      className={className + (isActive ? " ring-1 ring-inset ring-blue-500/50 bg-blue-900/20" : "")}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const lang = useLang()

  useEffect(() => {
    if (status !== "authenticated") return
    const ws = session?.user?.workerStatus
    if (ws === "PENDING_APPROVAL") {
      router.replace("/dashboard/pending")
    } else if (ws === "REJECTED") {
      router.replace("/dashboard/rejected")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-fg-muted">Loading...</div>
      </div>
    )
  }

  const role = session?.user?.role

  const navLinks = (
    <>
      {(role === "CANDIDATE" || role === "WORKER") && (
        <>
          <NavLink
            href="/dashboard/worker/help"
            className="rounded-lg bg-blue-900/30 px-3 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-800/40 hover:text-blue-200"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.needHelp", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/worker"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.overview", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/candidate/profile"
            className="rounded-lg bg-blue-900/30 px-3 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-800/40 hover:text-blue-200"
            onClick={() => setMenuOpen(false)}
          >
            My Profile
          </NavLink>
          <NavLink
            href="/dashboard/candidate/become-worker"
            className="rounded-lg bg-emerald-900/30 px-3 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-800/40 hover:text-emerald-200"
            onClick={() => setMenuOpen(false)}
          >
            Become a Worker
          </NavLink>
          <NavLink
            href="/dashboard/worker/onboarding"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.onboarding", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/worker/employee-card"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.employeeCard", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/worker/issues"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.myIssues", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/worker/letters"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.myLetters", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/worker/documents"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.documents", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/worker/messages"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.messageCoordinator", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/worker/profile"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.profile", lang)}
          </NavLink>
          <NavLink
            href="/dashboard/worker/change-password"
            className="rounded-lg px-3 py-2 text-sm text-fg-secondary transition hover:bg-surface-raised hover:text-fg"
            onClick={() => setMenuOpen(false)}
          >
            {t("dashboard.changePassword", lang)}
          </NavLink>
        </>
      )}
      {role === "ADMIN" && (
        <NavLink
          href="/dashboard/admin"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Admin Panel
        </NavLink>
      )}
      {role === "ADMIN" && (
        <NavLink
          href="/dashboard/users"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Users
        </NavLink>
      )}
      {role === "ADMIN" && (
        <NavLink
          href="/dashboard/admin/candidates"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Candidates
        </NavLink>
      )}
      {(role === "ADMIN" || role === "COORDINATOR") && (
        <NavLink
          href="/dashboard/operations"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Operations
        </NavLink>
      )}
      {(role === "ADMIN" || role === "COORDINATOR") && (
        <NavLink
          href="/dashboard/workers"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Workers
        </NavLink>
      )}
      {(role === "ADMIN" || role === "COORDINATOR") && (
        <NavLink
          href="/dashboard/accommodations"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Accommodations
        </NavLink>
      )}
      {(role === "ADMIN" || role === "COORDINATOR") && (
        <NavLink
          href="/dashboard/issues"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Issues
        </NavLink>
      )}
      {(role === "ADMIN" || role === "COMPANY") && (
        <NavLink
          href="/dashboard/companies"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Companies
        </NavLink>
      )}
      {role === "ADMIN" && (
        <NavLink
          href="/dashboard/audit"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          Audit Log
        </NavLink>
      )}
      {role === "ADMIN" && (
        <NavLink
          href="/dashboard/admin/api-keys"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          API Keys
        </NavLink>
      )}
      {role === "ADMIN" && (
        <NavLink
          href="/dashboard/worker/change-password"
          className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={() => setMenuOpen(false)}
        >
          {t("dashboard.changePassword", lang)}
        </NavLink>
      )}
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-surface-raised p-2 text-fg md:hidden"
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
      <Sidebar
        className="hidden w-64 flex-col border-r border-border-light bg-surface-card p-6 backdrop-blur-sm md:flex"
        navLinks={navLinks}
        session={session}
      />

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <Sidebar
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border-light bg-surface-card p-6 backdrop-blur-sm transition-transform md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        navLinks={navLinks}
        session={session}
        onLinkClick={() => setMenuOpen(false)}
      />

      <main className="flex-1">
        <div className="flex items-center justify-end gap-2 border-b border-border-light px-4 py-2 md:px-8">
          <ThemeToggle />
          <LanguageToggle lang={lang} />
          <PushSubscribeButton />
          <NotificationBell />
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
