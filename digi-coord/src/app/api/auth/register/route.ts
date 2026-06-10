import { prisma } from "@/lib/prisma"
import { apiHandler, conflict, created } from "@/lib/api-utils"
import { validate, registerSchema } from "@/lib/validation"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  return apiHandler(async () => {
    const body = await request.json()
    const data = validate(registerSchema, body)

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

    return created({ user: { id: user.id, name: user.name, email: user.email } })
  })
}
