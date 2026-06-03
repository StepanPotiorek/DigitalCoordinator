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
    await page.locator('form[action="/api/auth/login"] button[type="submit"]').click()
    await expect(page.getByText("Invalid email or password")).toBeVisible({ timeout: 10000 })
  })

  test("logs in with valid credentials and redirects to dashboard", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "stepan.potiorek@seznam.cz")
    await page.fill('input[name="password"]', "admin123")
    await page.locator('form[action="/api/auth/login"] button[type="submit"]').click()
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    expect(page.url()).toContain("/dashboard")
  })
})
