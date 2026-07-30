import { auth } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/server-fetch"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Checklist } from "@/components/onboarding/checklist"

interface OnboardingApiResponse {
  worker: { id: number; name: string }
  items: {
    id: number
    workerId: number
    label: string
    category: string
    completed: boolean
    completedAt: string | null
    createdAt: string
  }[]
}

export default async function WorkerOnboardingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")
  ) {
    redirect("/login")
  }

  const { id } = await params
  const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`

  const res = await fetchWithAuth(`${baseUrl}/api/onboarding?workerId=${id}`, { cache: "no-store" })
  if (!res.ok) {
    return <p className="text-slate-400">Worker not found.</p>
  }

  const data: OnboardingApiResponse = await res.json()
  const { worker, items } = data

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Onboarding — {worker.name}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track and manage onboarding progress
          </p>
        </div>
        <Link
          href={`/dashboard/workers/${worker.id}`}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
        >
          Back to Worker
        </Link>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
        <Checklist
          workerId={worker.id}
          initialItems={items}
        />
      </div>
    </div>
  )
}
