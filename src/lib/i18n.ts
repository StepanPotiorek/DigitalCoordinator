import { cookies } from "next/headers"
import type { Lang } from "./translations"

export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies()
  const val = cookieStore.get("lang")?.value
  if (val === "tl" || val === "cz") return val
  return "en"
}
