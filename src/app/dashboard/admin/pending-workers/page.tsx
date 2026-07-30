import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PendingWorkersTable } from "./pending-workers-table"

export default async function PendingWorkersPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login")
  return <PendingWorkersTable />
}
