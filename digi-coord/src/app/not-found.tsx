import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center">
      <div className="text-6xl">404</div>
      <h2 className="text-xl font-bold text-white">Page not found</h2>
      <p className="text-sm text-slate-400">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Go home
      </Link>
    </div>
  )
}
