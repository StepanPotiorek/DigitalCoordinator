import { test, expect } from "@playwright/test"

test.describe("Login flow", () => {
  test("shows login page with forgot password link", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible()
    await expect(page.getByText("Forgot password?")).toBeVisible()
  })

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "wrong@example.com")
    await page.fill('input[name="password"]', "wrongpass")
    await page.click('button[type="submit"]')
    await expect(page.getByRole("heading", { name: /invalid/i }).or(page.getByText("Invalid email or password"))).toBeVisible({ timeout: 10000 })
  })
})
