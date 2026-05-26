import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, created, badRequest, parseId } from "@/lib/api-utils"
import { validate, createWorkerSchema, updateWorkerSchema } from "@/lib/validation"
import { defaultOnboardingItems } from "@/lib/onboarding-items"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "COORDINATOR")) {
      return unauthorized()
    }

    const search = request.nextUrl.searchParams.get("search")
    const where = search
      ? { OR: [{ name: { contains: search } }, { employer: { contains: search } }] }
      : {}

    const workers = await prisma.worker.findMany({ where, orderBy: { createdAt: "desc" } })
    return workers
  })
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const body = await request.json()
    const data = validate(createWorkerSchema, body)

    const worker = await prisma.worker.create({
      data: {
        name: data.name,
        whatsapp: data.whatsapp,
        email: data.email || null,
        employer: data.employer || null,
        accommodation: data.accommodation || null,
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
      },
    })

    if (defaultOnboardingItems.length > 0) {
      await prisma.onboardingItem.createMany({
        data: defaultOnboardingItems.map((item) => ({
          workerId: worker.id,
          label: item.label,
          category: item.category,
        })),
      })
    }

    return created(worker)
  })
}
