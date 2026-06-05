interface GeminiLetterResult {
  sender: string
  purpose: string
  actionRequired: string
  deadline: string | null
  explanation: string
}

export async function analyzeLetterWithGemini(
  imageBase64: string,
  mimeType: string,
): Promise<GeminiLetterResult | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  try {
    const prompt = `You are analyzing an official letter received by a Filipino worker in the Czech Republic. The letter may be in Czech.

Identify:
1. sender — one of: MINISTRY_OF_INTERIOR, HEALTH_INSURANCE, BANK, EMPLOYER, ACCOMMODATION, OTHER
2. purpose — brief description of what the letter is about (max 15 words)
3. actionRequired — what the recipient must do (max 20 words)
4. deadline — any date mentioned in YYYY-MM-DD format, or null if none
5. explanation — a brief explanation in simple English for the worker (max 40 words)

Respond ONLY with valid JSON. No markdown, no formatting:
{"sender":"...","purpose":"...","actionRequired":"...","deadline":"..." or null,"explanation":"..."}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const text = await response.text()
      console.error("Gemini API error:", response.status, text)
      return null
    }

    const data = await response.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!raw) return null

    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
    const parsed = JSON.parse(cleaned) as GeminiLetterResult
    return parsed
  } catch (err) {
    console.error("Gemini analysis failed:", err)
    return null
  }
}
