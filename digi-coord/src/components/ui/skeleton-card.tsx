export function SkeletonCard() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-surface-hover" />
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-surface-hover" />
          <div className="h-3 w-32 rounded bg-surface-hover/50" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border-light bg-surface-card p-5 backdrop-blur-sm">
          <div className="mb-3 h-4 w-40 rounded bg-surface-hover" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-surface-hover/50" />
            <div className="h-4 w-3/4 rounded bg-surface-hover/50" />
            <div className="h-4 w-1/2 rounded bg-surface-hover/50" />
          </div>
        </div>
      ))}
    </div>
  )
}
