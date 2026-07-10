import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { apiHandler, unauthorized } from "@/lib/api-utils"

export async function GET() {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user || session.user.role !== "COMPANY") {
      return unauthorized()
    }

    const candidates = await prisma.user.findMany({
      where: { role: "CANDIDATE" },
      select: {
        name: true,
        email: true,
        candidateProfile: {
          select: {
            countryOfResidence: true,
            currentEmployer: true,
            currentPosition: true,
            englishLevel: true,
            preferredPosition: true,
            availableStartDate: true,
            interestedLongTerm: true,
            validPassport: true,
            validDriversLicense: true,
            driversLicenseCategory: true,
            drivingExperience: true,
            additionalComments: true,
            cvPath: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return candidates
      .filter((c) => c.candidateProfile)
      .map((c) => ({
        name: c.name,
        email: c.email,
        ...c.candidateProfile,
      }))
  })
}
