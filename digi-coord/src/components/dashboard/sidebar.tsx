"use client"

import { LogoutButton } from "@/components/auth/logout-button"
import type { Session } from "next-auth"

function roleLabel(role: string | undefined): string {
  const labels: Record<string, string> = {
    ADMIN: "Admin",
    COORDINATOR: "Coordinator",
    COMPANY: "Company",
    CANDIDATE: "Candidate",
    WORKER: "Worker",
  }
  return labels[role ?? ""] || ""
}

export function Sidebar({
  className,
  navLinks,
  session,
  onLinkClick,
}: {
  className: string
  navLinks: React.ReactNode
  session: Session | null
  onLinkClick?: () => void
}) {
  return (
    <aside className={className}>
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-400">
          {session?.user?.name || "User"}
        </p>
        <p className="text-xs text-slate-500">{roleLabel(session?.user?.role)}</p>
      </div>

      <nav className="flex flex-1 flex-col space-y-2" onClick={onLinkClick}>
        {navLinks}
      </nav>

      <div className="mt-auto pt-4">
        <LogoutButton />
      </div>
    </aside>
  )
}
