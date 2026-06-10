import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function CandidateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "CANDIDATE" && session.user.role !== "WORKER")) {
    redirect("/dashboard")
  }
  // If user already has a Worker record, redirect to worker pages
  if (session.user.role === "WORKER" && session.user.workerStatus) {
    redirect("/dashboard/worker")
  }
  return <>{children}</>
}
