import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit"

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 365 * 10 },
  pages: { signIn: "/login", error: "/login" },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: { maxAge: 60 * 60 * 24 * 365 * 10 },
    },
  },
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
        if (!allowed) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null

        let workerStatus: string | undefined | null
        if (user.role === "WORKER") {
          const worker = await prisma.worker.findFirst({
            where: { OR: [{ userId: user.id }, { email }] },
          })
          workerStatus = worker?.status ?? null
        }

        resetRateLimit(`login:${email.toLowerCase()}`)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          workerStatus,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.role = user.role
        token.workerStatus = user.workerStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.workerStatus = token.workerStatus
        if (token.email) {
          const user = await prisma.user.findUnique({
            where: { email: token.email },
            select: { role: true },
          })
          if (user) {
            session.user.role = user.role
          }
          if (user?.role === "WORKER") {
            const worker = await prisma.worker.findFirst({
              where: { OR: [{ userId: token.id }, { email: token.email }] },
              select: { status: true },
            })
            session.user.workerStatus = worker?.status ?? null
          } else {
            session.user.workerStatus = null
          }
        }
      }
      return session
    },
  },
})
