interface LetterResult {
  sender: string
  purpose: string
  actionRequired: string
  deadline: string | null
  explanation: string
}

export async function analyzeLetterWithAI(
  imageBase64: string,
  mimeType: string,
): Promise<LetterResult | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are analyzing an official letter received by a Filipino worker in the Czech Republic. The letter may be in Czech.

Identify:
1. sender — one of: MINISTRY_OF_INTERIOR, HEALTH_INSURANCE, BANK, EMPLOYER, ACCOMMODATION, OTHER
2. purpose — brief description of what the letter is about (max 15 words)
3. actionRequired — what the recipient must do (max 20 words)
4. deadline — any date mentioned in YYYY-MM-DD format, or null if none
5. explanation — a brief explanation in simple English for the worker (max 40 words)

Respond ONLY with valid JSON.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this letter and return the JSON.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error("OpenAI API error:", response.status, text)
      return null
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) return null

    const parsed = JSON.parse(content) as LetterResult
    return parsed
  } catch (err) {
    console.error("OpenAI analysis failed:", err)
    return null
  }
}
