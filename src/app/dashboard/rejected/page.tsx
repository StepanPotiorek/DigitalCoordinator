import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RejectedPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
        <div className="mb-4 text-4xl">🚫</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Account Rejected</h1>
        <p className="mb-6 text-slate-400">
          Your account has been rejected. If you believe this is a mistake,
          please contact support for assistance.
        </p>
        <div className="flex justify-center">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
