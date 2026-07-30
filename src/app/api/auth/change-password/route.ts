import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest } from "@/lib/api-utils"
import { hash, compare } from "bcryptjs"

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return badRequest("Both current and new password are required")
    }
    if (newPassword.length < 6) {
      return badRequest("New password must be at least 6 characters")
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    })
    if (!user) return unauthorized()

    const valid = await compare(currentPassword, user.passwordHash)
    if (!valid) return badRequest("Current password is incorrect")

    const passwordHash = await hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    })

    return { success: true }
  })
}
