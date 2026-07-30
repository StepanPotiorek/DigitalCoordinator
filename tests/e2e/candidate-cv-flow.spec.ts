import { test, expect } from "@playwright/test"

const TEST_EMAIL = `e2e-cv-${Date.now()}@test.com`
const PASSWORD = "TestPass123"
const NAME = "E2E Test Candidate"
const ADMIN_EMAIL = "stepan.potiorek@seznam.cz"
const ADMIN_PASS = "admin123"

test.describe("Candidate registration → fill profile → upload CV → admin view", () => {

  test("full flow", async ({ browser }) => {
    test.setTimeout(60000)
    const candidateCtx = await browser.newContext()
    const page = await candidateCtx.newPage()

    // 1. Register
    await page.goto("/register")
    await page.fill('input[name="name"]', NAME)
    await page.fill('input[name="email"]', TEST_EMAIL)
    await page.fill('input[name="password"]', PASSWORD)
    await page.fill('input[name="confirmPassword"]', PASSWORD)
    await page.locator('input[type="checkbox"]').check()
    await page.locator('form:not([action]) button[type="submit"]').click()

    // 2. Auto-login → redirect to candidate profile
    await page.waitForURL(/\/dashboard\/candidate\/profile/, { timeout: 20000 })
    await expect(page.getByText("Candidate Information")).toBeVisible()

    // 3. Fill profile form
    await page.fill('input[name="countryOfResidence"]', "Philippines")
    await page.fill('input[name="currentEmployer"]', "E2E Test Corp")
    await page.fill('input[name="currentPosition"]', "Test Worker")
    await page.selectOption('select[name="englishLevel"]', "intermediate")
    await page.fill('input[name="preferredPosition"]', "Warehouse Worker")
    await page.fill('input[name="availableStartDate"]', "August 2026")

    // Boolean buttons: click first "Yes" button per section
    const yesButtons = page.locator('div.flex.gap-4 button:has-text("Yes")')
    const yesCount = await yesButtons.count()
    for (let i = 0; i < yesCount; i++) {
      await yesButtons.nth(i).click()
    }

    await page.selectOption('select[name="driversLicenseCategory"]', "B")
    await page.selectOption('select[name="drivingExperience"]', "5")

    await page.fill('textarea[name="additionalComments"]', "E2E test comment")

    // 4. Save profile
    await page.click('button:has-text("Save Profile")')
    await expect(page.getByText("Profile saved successfully!")).toBeVisible({ timeout: 10000 })

    // 5. Upload CV
    const pdfBuffer = Buffer.from("%PDF-1.4 dummy PDF for E2E test")
    await page.setInputFiles('input[type="file"]', {
      name: "cv.pdf",
      mimeType: "application/pdf",
      buffer: pdfBuffer,
    })
    await expect(page.getByText("CV uploaded")).toBeVisible({ timeout: 10000 })
    await expect(page.getByText("View CV")).toBeVisible()

    await candidateCtx.close()

    // 6. Admin login
    const adminCtx = await browser.newContext()
    const adminPage = await adminCtx.newPage()

    await adminPage.goto("/login")
    await adminPage.fill('input[name="email"]', ADMIN_EMAIL)
    await adminPage.fill('input[name="password"]', ADMIN_PASS)
    await adminPage.click('form[action="/api/auth/login"] button[type="submit"]')
    await adminPage.waitForURL(/\/dashboard/)

    // 7. View candidates
    await adminPage.goto("/dashboard/admin/candidates")
    await expect(adminPage.getByText(TEST_EMAIL)).toBeVisible()

    // 8. Verify "View CV" link exists for the candidate
    const cvLink = adminPage.locator(`tr:has-text("${TEST_EMAIL}") a:has-text("View CV")`)
    await expect(cvLink).toBeVisible()
    const href = await cvLink.getAttribute("href")
    expect(href).toContain("/uploads/cv/")

    await adminCtx.close()
  })
})
