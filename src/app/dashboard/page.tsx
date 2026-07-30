import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role

  if (role === "ADMIN") {
    redirect("/dashboard/admin")
  } else if (role === "COORDINATOR") {
    redirect("/dashboard/workers")
  } else if (role === "COMPANY") {
    redirect("/dashboard/companies")
  } else if (role === "CANDIDATE") {
    redirect("/dashboard/candidate/profile")
  } else if (role === "WORKER") {
    if (!session.user.workerStatus) {
      redirect("/dashboard/candidate/profile")
    }
    redirect("/dashboard/worker")
  }

  return null
}
