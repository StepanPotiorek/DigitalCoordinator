import { NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const body = await request.formData()
  const email = body.get("email") as string
  const password = body.get("password") as string

  if (!email || !password) {
    return NextResponse.redirect(new URL("/login?error=CredentialsSignin", request.url), 303)
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return NextResponse.redirect(new URL("/dashboard", request.url), 303)
  } catch {
    return NextResponse.redirect(new URL("/login?error=CredentialsSignin", request.url), 303)
  }
}
