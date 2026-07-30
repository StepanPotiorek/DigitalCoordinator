import { describe, it, expect } from "vitest"
import { t } from "../../src/lib/translations"

describe("translations", () => {
  it("returns English for 'en'", () => {
    expect(t("nav.guide", "en")).toBe("Guide")
  })

  it("returns Tagalog for 'tl'", () => {
    expect(t("nav.guide", "tl")).toBe("Gabay")
  })

  it("returns Czech for 'cz'", () => {
    expect(t("nav.guide", "cz")).toBe("Průvodce")
  })

  it("falls back to English when lang key is missing", () => {
    expect(t("nonexistent.key", "cz")).toBe("nonexistent.key")
  })
})
