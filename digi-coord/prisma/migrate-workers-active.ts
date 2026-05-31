import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const pending = await prisma.worker.count({ where: { status: "PENDING_APPROVAL" } })
  console.log(`Found ${pending} workers with PENDING_APPROVAL status`)

  if (pending > 0) {
    const result = await prisma.worker.updateMany({
      where: { status: "PENDING_APPROVAL" },
      data: { status: "ACTIVE" },
    })
    console.log(`Migrated ${result.count} workers to ACTIVE`)
  } else {
    console.log("No workers to migrate")
  }

  const allWorkers = await prisma.worker.findMany({
    select: { id: true, name: true, email: true, status: true },
  })
  console.log("\nCurrent workers:")
  for (const w of allWorkers) {
    console.log(`  #${w.id} ${w.name} (${w.email || "no email"}) — ${w.status}`)
  }
}

main().catch((e) => {
  console.error("Migration failed:", e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
