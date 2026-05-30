import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit"

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        if (!email || !password) return null

        const { allowed, remaining } = checkRateLimit(`login:${email.toLowerCase()}`)
        if (!allowed) {
          throw new Error(`Too many attempts. Try again in 15 minutes.`)
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null

        if (user.role === "WORKER") {
          const worker = await prisma.worker.findUnique({ where: { email } })
          if (!worker || worker.status === "PENDING_APPROVAL") {
            throw new Error("Your account is pending approval. Please wait for an admin to activate it.")
          }
          if (worker.status === "REJECTED") {
            throw new Error("Your account has been rejected. Contact support for assistance.")
          }
        }

        resetRateLimit(`login:${email.toLowerCase()}`)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
})
