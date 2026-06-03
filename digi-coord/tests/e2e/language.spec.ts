import { test, expect } from "@playwright/test"

async function setLang(page, lang: string) {
  await page.evaluate((l) => {
    document.cookie = `lang=${l}; path=/; max-age=${365 * 24 * 60 * 60}; sameSite=lax`
  }, lang)
}

test.describe("Language toggle", () => {
  test("switches from English to Tagalog to Czech and back", async ({ page }) => {
    await page.goto("/guide")
    await setLang(page, "en")
    await page.reload()

    // Switch to TL
    await setLang(page, "tl")
    await page.reload()
    await expect(page.getByRole("heading", { name: "Gabay ng Manggagawa" })).toBeVisible()

    // Switch to CZ
    await setLang(page, "cz")
    await page.reload()
    await expect(page.getByRole("heading", { name: "Průvodce pracovníka" })).toBeVisible()

    // Switch to EN
    await setLang(page, "en")
    await page.reload()
    await expect(page.getByRole("heading", { name: "Worker Guide" })).toBeVisible()
  })

  test("persists language across guide subpages", async ({ page }) => {
    await page.goto("/guide")
    await setLang(page, "cz")
    await page.reload()
    await expect(page.getByRole("heading", { name: "Průvodce pracovníka" })).toBeVisible()

    await page.getByRole("link", { name: /otázky/i }).first().click()
    await expect(page.getByRole("heading", { name: "Často kladené otázky" })).toBeVisible()
  })

  test("toggle button shows correct next language", async ({ page }) => {
    await page.goto("/guide")
    await setLang(page, "en")
    await page.reload()
    await expect(page.getByLabel("Switch language")).toContainText("TL")

    await setLang(page, "tl")
    await page.reload()
    await expect(page.getByLabel("Ilipat sa English").first()).toContainText("CZ")

    await setLang(page, "cz")
    await page.reload()
    await expect(page.getByLabel("Přepnout jazyk")).toContainText("EN")
  })
})
