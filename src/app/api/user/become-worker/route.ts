import { auth } from "@/lib/auth"
import { prisma, createNotificationForAdmins } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest, created } from "@/lib/api-utils"
import { defaultOnboardingItems } from "@/lib/onboarding-items"
import { notifyAdminsOfNewWorker } from "@/lib/email"
import { sendWhatsApp } from "@/lib/whatsapp"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
const MAX_SIZE = 20 * 1024 * 1024

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()
    if (session.user.role !== "CANDIDATE" && session.user.role !== "WORKER") return unauthorized()

    const user = await prisma.user.findUnique({ where: { id: session.user.id! } })
    if (!user) return unauthorized()

    const existingWorker = await prisma.worker.findFirst({
      where: { OR: [{ userId: user.id }, { email: user.email! }] },
    })
    if (existingWorker) {
      return badRequest("You already have a worker profile.")
    }

    const formData = await request.formData()
    const employer = (formData.get("employer") as string) || ""
    const whatsapp = (formData.get("whatsapp") as string) || ""
    const city = (formData.get("city") as string) || ""
    const contract = formData.get("contract") as File | null
    const employeeCard = formData.get("employeeCard") as File | null

    if (!whatsapp) return badRequest("WhatsApp number is required")
    if (!contract) return badRequest("Employment contract is required")
    if (!employeeCard) return badRequest("Employee card photo is required")

    for (const file of [contract, employeeCard]) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return badRequest(`File type ${file.type} not allowed. Accepted: jpg, png, webp, pdf`)
      }
      if (file.size > MAX_SIZE) {
        return badRequest("File too large (max 20MB)")
      }
    }

    const worker = await prisma.worker.create({
      data: {
        userId: user.id,
        name: user.name || "Unknown",
        whatsapp,
        email: user.email,
        employer: employer || null,
        city: city || null,
        status: "PENDING_APPROVAL",
      },
    })

    const uploadDir = path.join(process.cwd(), "public", "uploads", "documents")
    await mkdir(uploadDir, { recursive: true })

    for (const [fieldName, file] of [["contract", contract], ["employeeCard", employeeCard]] as const) {
      const ext = path.extname(file.name) || ".bin"
      const filename = `${randomUUID()}${ext}`
      const bytes = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(uploadDir, filename), bytes)

      await prisma.document.create({
        data: {
          workerId: worker.id,
          type: fieldName === "contract" ? "CONTRACT" : "OTHER",
          filename,
          originalName: `become-worker-${fieldName}-${file.name}`,
        },
      })
    }

    if (defaultOnboardingItems.length > 0) {
      await prisma.onboardingItem.createMany({
        data: defaultOnboardingItems.map((item) => ({
          workerId: worker.id,
          label: item.label,
          category: item.category,
        })),
      })
    }

    await createNotificationForAdmins(
      "NEW_WORKER",
      `New worker request: ${worker.name}`,
      `/dashboard/workers/${worker.id}`,
    )

    notifyAdminsOfNewWorker(worker.name, worker.id)

    sendWhatsApp(
      `🆕 Worker request: ${worker.name}\n📱 ${worker.whatsapp || "N/A"}${worker.employer ? `\n🏢 ${worker.employer}` : ""}\n🔗 https://digicoord.cz/dashboard/workers/${worker.id}`,
    )

    return created({ worker })
  })
}
