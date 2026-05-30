import { test, expect } from "@playwright/test"

test.describe("Language toggle", () => {
  test("switches from English to Tagalog to Czech and back", async ({ page }) => {
    await page.goto("/guide?lang=en")

    // Should start showing TL as next language
    const toggle = page.getByLabel("Switch language").first()
    await expect(toggle).toContainText("TL")

    // Click to go to Tagalog
    await toggle.click()
    await page.waitForURL(/lang=tl/)
    await expect(page.getByRole("heading", { name: "Gabay ng Manggagawa" })).toBeVisible()

    // Should show CZ as next
    const toggle2 = page.getByLabel("Ilipat sa English").first()
    await expect(toggle2).toContainText("CZ")

    // Click to go to Czech
    await toggle2.click()
    await page.waitForURL(/lang=cz/)
    await expect(page.getByRole("heading", { name: "Průvodce pracovníka" })).toBeVisible()

    // Should show EN as next
    const toggle3 = page.getByLabel("Přepnout jazyk").first()
    await expect(toggle3).toContainText("EN")

    // Click to go back to English
    await toggle3.click()
    await page.waitForURL(/lang=en/)
    await expect(page.getByRole("heading", { name: "Worker Guide" })).toBeVisible()
  })

  test("persists language across guide subpages", async ({ page }) => {
    await page.goto("/guide?lang=cz")
    await expect(page.getByRole("heading", { name: "Průvodce pracovníka" })).toBeVisible()

    // Navigate to FAQ via the guide card link (href="/faq?lang=cz")
    await page.getByRole("link", { name: /otázky/i }).first().click()
    await expect(page).toHaveURL(/lang=cz/)
    await expect(page.getByRole("heading", { name: "Často kladené otázky" })).toBeVisible()
  })
})
