import { prisma, createNotificationForAdmins } from "@/lib/prisma"
import { apiHandler, badRequest, conflict, created } from "@/lib/api-utils"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  return apiHandler(async () => {
    const body = await request.json()
    const { name, email, password, confirmPassword, contactPhone, privacyConsent } = body

    if (!privacyConsent) {
      return badRequest("You must agree to the Privacy Policy to register.")
    }

    if (!name || !email || !password || !confirmPassword) {
      return badRequest("Name, email, password, and confirmPassword are required.")
    }

    if (password.length < 6) {
      return badRequest("Password must be at least 6 characters.")
    }

    if (password !== confirmPassword) {
      return badRequest("Passwords do not match.")
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return conflict("This email is already registered.")
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "COMPANY",
      },
    })

    await prisma.company.create({
      data: {
        name,
        contactEmail: email,
        contactPhone: contactPhone || null,
        userId: user.id,
      },
    })

    await createNotificationForAdmins(
      "NEW_CANDIDATE",
      `New company registered: ${name}`,
      "/dashboard/companies",
    )

    return created({ user: { id: user.id, name: user.name, email: user.email } })
  })
}
