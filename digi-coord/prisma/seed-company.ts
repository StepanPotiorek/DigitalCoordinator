import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "firma@test.cz"
  const password = "test123"

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log("Company user already exists, skipping.")
    return
  }

  const passwordHash = await hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name: "Test Company",
      email,
      passwordHash,
      role: "COMPANY",
    },
  })

  await prisma.company.create({
    data: {
      name: "Test Company",
      contactEmail: email,
      contactPhone: "+420777654279",
      userId: user.id,
    },
  })

  console.log(`Created company user: ${email} / ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
