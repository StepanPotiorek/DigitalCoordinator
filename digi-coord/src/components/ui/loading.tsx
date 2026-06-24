export default function Loading({ text }: { text?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        {text && <p className="text-sm text-fg-muted">{text}</p>}
      </div>
    </div>
  )
}
