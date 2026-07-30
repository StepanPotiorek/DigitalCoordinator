import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { WorkersTable } from "./workers-table"

export default async function WorkersPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <WorkersTable session={session} />
}
