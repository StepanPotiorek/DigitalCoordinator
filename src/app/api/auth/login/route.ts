import { NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"

function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get("x-forwarded-proto") ?? "http"
  const host = request.headers.get("host") ?? "localhost:3000"
  return `${proto}://${host}`
}

export async function POST(request: NextRequest) {
  const body = await request.formData()
  const email = body.get("email") as string
  const password = body.get("password") as string
  const baseUrl = getBaseUrl(request)

  if (!email || !password) {
    return NextResponse.redirect(new URL("/login?error=CredentialsSignin", baseUrl), 303)
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return NextResponse.redirect(new URL("/dashboard", baseUrl), 303)
  } catch {
    return NextResponse.redirect(new URL("/login?error=CredentialsSignin", baseUrl), 303)
  }
}
