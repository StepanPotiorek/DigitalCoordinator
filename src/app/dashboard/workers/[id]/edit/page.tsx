import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EditWorkerForm } from "./edit-worker-form"

export default async function EditWorkerPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <EditWorkerForm session={session} />
}
