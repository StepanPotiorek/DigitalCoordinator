interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`mx-auto max-w-4xl px-4 py-12 ${className}`}>
      {children}
    </main>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
}

export function PageHeader({ title, subtitle, badge, badgeColor = "blue" }: PageHeaderProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-900/50 text-blue-400",
    green: "bg-green-900/50 text-green-400",
    red: "bg-red-900/50 text-red-400",
    purple: "bg-purple-900/50 text-purple-400",
    amber: "bg-amber-900/50 text-amber-400",
  }

  return (
    <div className="mb-10">
      {badge && (
        <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${colorMap[badgeColor] || colorMap.blue}`}>
          {badge}
        </span>
      )}
      <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base text-slate-400 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}

interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
  color?: string
}

export function StepCard({ number, title, children, color = "blue" }: StepCardProps) {
  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    blue: { bg: "bg-blue-900/50", text: "text-blue-400", ring: "ring-slate-950" },
    red: { bg: "bg-red-900/50", text: "text-red-400", ring: "ring-slate-950" },
    green: { bg: "bg-green-900/50", text: "text-green-400", ring: "ring-slate-950" },
    purple: { bg: "bg-purple-900/50", text: "text-purple-400", ring: "ring-slate-950" },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className="relative pl-14">
      <div className={`absolute left-2 flex h-9 w-9 items-center justify-center rounded-full ${c.bg} ${c.text} text-sm font-bold ${c.ring} ring-4`}>
        {number}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        {children}
      </div>
    </div>
  )
}

interface InfoBoxProps {
  title?: string
  children: React.ReactNode
  color?: "blue" | "red" | "amber" | "green" | "purple"
  className?: string
}

export function InfoBox({ title, children, color = "blue", className = "" }: InfoBoxProps) {
  const colorMap: Record<string, { border: string; bg: string; text: string }> = {
    blue: { border: "border-blue-800", bg: "bg-blue-900/20", text: "text-blue-300" },
    red: { border: "border-red-800", bg: "bg-red-900/20", text: "text-red-400" },
    amber: { border: "border-amber-800", bg: "bg-amber-900/20", text: "text-amber-400" },
    green: { border: "border-green-800", bg: "bg-green-900/20", text: "text-green-400" },
    purple: { border: "border-purple-800", bg: "bg-purple-900/20", text: "text-purple-400" },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5 backdrop-blur-sm ${className}`}>
      {title && (
        <h2 className={`mb-3 text-base font-semibold ${c.text}`}>{title}</h2>
      )}
      {children}
    </div>
  )
}

interface ChecklistItemProps {
  children: React.ReactNode
}

export function ChecklistItem({ children }: ChecklistItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/30 px-4 py-2.5">
      <span className="mt-0.5 shrink-0 text-xs text-green-400">✓</span>
      <span className="text-sm text-slate-200">{children}</span>
    </div>
  )
}

interface FooterProps {
  lang?: string
}

export function SiteFooter({}: FooterProps) {
  return (
    <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
      <p>Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
    </footer>
  )
}

export function Breadcrumb({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          <a href={item.href} className="transition hover:text-slate-300">
            {item.label}
          </a>
        </span>
      ))}
    </nav>
  )
}
