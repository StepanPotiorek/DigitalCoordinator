import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NewWorkerForm } from "./new-worker-form"

export default async function NewWorkerPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login")
  return <NewWorkerForm />
}
