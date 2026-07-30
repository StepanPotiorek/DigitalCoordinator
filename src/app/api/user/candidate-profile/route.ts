import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: session.user.id! },
    })

    return profile ?? {}
  })
}

export async function PUT(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const body = await request.json()

    const data = {
      countryOfResidence: body.countryOfResidence ?? null,
      currentEmployer: body.currentEmployer ?? null,
      currentPosition: body.currentPosition ?? null,
      englishLevel: body.englishLevel ?? null,
      preferredPosition: body.preferredPosition ?? null,
      availableStartDate: body.availableStartDate ?? null,
      interestedLongTerm: body.interestedLongTerm ?? null,
      validPassport: body.validPassport ?? null,
      validDriversLicense: body.validDriversLicense ?? null,
      driversLicenseCategory: body.driversLicenseCategory ?? null,
      drivingExperience: body.drivingExperience ?? null,
      additionalComments: body.additionalComments ?? null,
    }

    const profile = await prisma.candidateProfile.upsert({
      where: { userId: session.user.id! },
      update: data,
      create: { userId: session.user.id!, ...data },
    })

    return profile
  })
}
