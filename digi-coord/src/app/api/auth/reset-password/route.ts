import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiHandler, badRequest } from "@/lib/api-utils"
import { hash } from "bcryptjs"
import crypto from "crypto"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    const body = await request.json()
    const { email, token, password } = body

    if (email && !token && !password) {
      // Step 1: Request password reset
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return { success: true, message: "If the email exists, a reset link has been sent." }
      }

      const resetToken = crypto.randomBytes(32).toString("hex")
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

      await prisma.passwordResetToken.create({
        data: { email, token: resetToken, expiresAt },
      })

      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

      await sendEmail(
        email,
        "Password Reset - Digital Coordinator",
        `<p>You requested a password reset.</p>
         <p>Click the link below to reset your password. This link expires in 1 hour.</p>
         <p><a href="${resetUrl}">${resetUrl}</a></p>
         <p>If you didn't request this, ignore this email.</p>`,
      )

      return { success: true, message: "If the email exists, a reset link has been sent." }
    }

    // Step 2: Reset password with token
    if (!token || !password) {
      return badRequest("Missing token or password")
    }

    if (password.length < 6) {
      return badRequest("Password must be at least 6 characters")
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return badRequest("Invalid or expired reset token")
    }

    const passwordHash = await hash(password, 12)

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    })

    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    })

    return { success: true, message: "Password has been reset. You can now log in." }
  })
}
