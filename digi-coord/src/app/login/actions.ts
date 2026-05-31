"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function login(_prev: unknown, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password" }
    }
    return { success: false, error: "Something went wrong" }
  }
}
