import { prisma, createNotificationForAdmins } from "@/lib/prisma"
import { apiHandler, badRequest, conflict, created } from "@/lib/api-utils"
import { validate, registerSchema } from "@/lib/validation"
import { hash } from "bcryptjs"
import { notifyWorkerOfRegistration, notifyAdminsOfNewCandidate } from "@/lib/email"

export async function POST(request: Request) {
  return apiHandler(async () => {
    const body = await request.json()
    const data = validate(registerSchema, body)

    if (!body.privacyConsent) {
      return badRequest("You must agree to the Privacy Policy to register.")
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return conflict("This email is already registered.")
    }

    const passwordHash = await hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: "CANDIDATE",
      },
    })

    await createNotificationForAdmins(
      "NEW_CANDIDATE",
      `New candidate registered: ${data.name}`,
      "/dashboard/admin/candidates",
    )

    notifyWorkerOfRegistration(data.email, data.name)
    notifyAdminsOfNewCandidate(data.name, data.email)

    return created({ user: { id: user.id, name: user.name, email: user.email } })
  })
}
