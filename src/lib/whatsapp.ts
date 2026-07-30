import { logger } from "./logger"

const WHATSAPP_PHONE = process.env.WHATSAPP_NOTIFY_PHONE
const CALLMEBOT_API_KEY = process.env.WHATSAPP_CALLMEBOT_API_KEY

export async function sendWhatsApp(text: string) {
  if (!WHATSAPP_PHONE || !CALLMEBOT_API_KEY) {
    logger.info({ text }, "WhatsApp skipped (not configured)")
    return
  }

  const phone = WHATSAPP_PHONE.replace(/^\+/, "")

  try {
    const url = new URL("https://api.callmebot.com/whatsapp.php")
    url.searchParams.set("phone", phone)
    url.searchParams.set("text", text)
    url.searchParams.set("apikey", CALLMEBOT_API_KEY)

    const res = await fetch(url.toString())
    if (!res.ok) {
      logger.error({ status: res.status, text }, "WhatsApp send failed")
    } else {
      logger.info({ text }, "WhatsApp sent")
    }
  } catch (err) {
    logger.error({ err, text }, "WhatsApp send error")
  }
}
