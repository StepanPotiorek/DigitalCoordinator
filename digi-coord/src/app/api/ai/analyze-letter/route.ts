import { auth } from "@/lib/auth"
import { apiHandler, unauthorized, badRequest } from "@/lib/api-utils"
import { analyzeLetterWithGemini } from "@/lib/gemini"

export async function POST(request: Request) {
  return apiHandler(async () => {
    const session = await auth()
    if (!session?.user) return unauthorized()

    const { image, mimeType } = await request.json()
    if (!image || !mimeType) return badRequest("Missing image or mimeType")

    const result = await analyzeLetterWithGemini(image, mimeType)
    if (!result) return { error: "AI analysis failed. Check that the image is clear and try again." }

    return result
  })
}
