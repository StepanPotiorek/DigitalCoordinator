import { LoginForm } from "./login-form"
import { type Lang } from "@/lib/translations"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang: langParam } = await searchParams
  const lang: Lang = langParam === "tl" ? "tl" : langParam === "cz" ? "cz" : "en"

  return <LoginForm lang={lang} />
}
