const colorMap: Record<string, string> = {
  red: "bg-red-900/50 text-red-400",
  amber: "bg-amber-900/50 text-amber-400",
  blue: "bg-blue-900/50 text-blue-400",
  green: "bg-green-900/50 text-green-400",
}

function getColor(percent: number): string {
  if (percent === 100) return "green"
  if (percent >= 67) return "blue"
  if (percent >= 34) return "amber"
  return "red"
}

export function ProgressBadge({
  completed,
  total,
}: {
  completed: number
  total: number
}) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  const color = getColor(percent)

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[color]}`}
    >
      {percent}% completed
    </span>
  )
}
