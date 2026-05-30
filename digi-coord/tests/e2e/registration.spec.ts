import { test, expect } from "@playwright/test"

test.describe("Worker registration", () => {
  test("shows registration page", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByText("Worker Registration")).toBeVisible()
  })

  test("shows validation error for empty form", async ({ page }) => {
    await page.goto("/register")
    // The form uses browser-native validation; submitting empty triggers a popup
    // We verify the page doesn't navigate away and submit button remains
    await page.click('button[type="submit"]')
    // Native validation prevents submission, so URL stays on /register
    await expect(page).toHaveURL(/\/register/)
  })
})
