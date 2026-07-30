import { getLang } from "@/lib/i18n"
import { LoginForm } from "./login-form"

export default async function LoginPage() {
  const lang = await getLang()

  return <LoginForm lang={lang} />
}
