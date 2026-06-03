import { NextResponse } from "next/server"

const VALID_LANGS = ["en", "tl", "cz"]

export async function POST(request: Request) {
  const formData = await request.formData()
  const lang = formData.get("lang") as string | null
  const referer = request.headers.get("referer") || "/"

  if (!lang || !VALID_LANGS.includes(lang)) {
    return NextResponse.redirect(new URL(referer, request.url))
  }

  const response = NextResponse.redirect(new URL(referer, request.url))
  response.cookies.set("lang", lang, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  })
  return response
}
