export function SkeletonCard() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-slate-800" />
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-slate-800" />
          <div className="h-3 w-32 rounded bg-slate-800/50" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <div className="mb-3 h-4 w-40 rounded bg-slate-800" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-800/50" />
            <div className="h-4 w-3/4 rounded bg-slate-800/50" />
            <div className="h-4 w-1/2 rounded bg-slate-800/50" />
          </div>
        </div>
      ))}
    </div>
  )
}
