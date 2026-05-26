export function StatCard({
  title,
  value,
  accent,
  onClick,
}: {
  title: string
  value: string | number
  accent: "blue" | "green" | "red" | "amber"
  onClick?: () => void
}) {
  const accentBorders: Record<string, string> = {
    blue: "border-l-blue-600",
    green: "border-l-green-600",
    red: "border-l-red-600",
    amber: "border-l-amber-600",
  }

  const accentText: Record<string, string> = {
    blue: "text-blue-400",
    green: "text-green-400",
    red: "text-red-400",
    amber: "text-amber-400",
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition hover:bg-slate-800/50 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div
        className={`mb-1 border-l-2 ${accentBorders[accent]} pl-3 text-xs font-medium uppercase tracking-wider text-slate-500`}
      >
        {title}
      </div>
      <div className={`pl-3 text-3xl font-bold ${accentText[accent]}`}>
        {value}
      </div>
    </div>
  )
}
