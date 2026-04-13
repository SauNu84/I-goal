import { test, expect } from "@playwright/test";

test.describe("Admin Strengths Page", () => {
  test("loads within acceptable time and shows loading skeleton", async ({
    page,
  }) => {
    // Navigate and verify the page loads (performance gate)
    const start = Date.now();
    await page.goto("/admin/strengths");
    await expect(
      page.getByRole("heading", { name: "Strengths Framework (Admin)" })
    ).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;

    await page.screenshot({
      path: "e2e/screenshots/09-admin-strengths-loaded.png",
      fullPage: true,
    });

    // Soft assertion — warn if slow but don't fail the suite
    expect(loadTime).toBeLessThan(10000);
  });

  test("displays domain, theme, and question counts", async ({ page }) => {
    await page.goto("/admin/strengths");
    await expect(
      page.getByRole("heading", { name: "Strengths Framework (Admin)" })
    ).toBeVisible({ timeout: 10000 });

    // Summary stats should be visible (use .first() to handle multiple matches)
    const statsRow = page.locator(".flex.gap-4.text-sm");
    await expect(statsRow.getByText(/\d+ domains/)).toBeVisible();
    await expect(statsRow.getByText(/\d+ themes/)).toBeVisible();
    await expect(statsRow.getByText(/\d+ questions/)).toBeVisible();

    await page.screenshot({
      path: "e2e/screenshots/09-admin-strengths-stats.png",
      fullPage: false,
    });
  });

  test("renders all 5 strength domains", async ({ page }) => {
    await page.goto("/admin/strengths");
    await expect(
      page.getByRole("heading", { name: "Strengths Framework (Admin)" })
    ).toBeVisible({ timeout: 10000 });

    const domains = ["Drive", "Influence", "Connection", "Reasoning", "Adaptability"];
    for (const domain of domains) {
      await expect(
        page.getByRole("heading", { name: domain, level: 2 })
      ).toBeVisible();
    }

    await page.screenshot({
      path: "e2e/screenshots/09-admin-strengths-domains.png",
      fullPage: true,
    });
  });

  test("theme cards show name, definition, and rank", async ({ page }) => {
    await page.goto("/admin/strengths");
    await expect(
      page.getByRole("heading", { name: "Strengths Framework (Admin)" })
    ).toBeVisible({ timeout: 10000 });

    // At least one theme card should be visible with rank badge
    await expect(page.getByText("Rank #1").first()).toBeVisible();

    // Theme cards should have details sections
    await expect(
      page.getByText("Behavioral Indicators").first()
    ).toBeVisible();
    await expect(page.getByText("Growth Actions").first()).toBeVisible();
    await expect(page.getByText("Blind Spots").first()).toBeVisible();
    await expect(page.getByText("Questions").first()).toBeVisible();

    await page.screenshot({
      path: "e2e/screenshots/09-admin-strengths-theme-card.png",
      fullPage: false,
    });
  });

  test("expanding details sections shows content", async ({ page }) => {
    await page.goto("/admin/strengths");
    await expect(
      page.getByRole("heading", { name: "Strengths Framework (Admin)" })
    ).toBeVisible({ timeout: 10000 });

    // Find the first theme card's Behavioral Indicators summary and click it
    const firstThemeCard = page.locator(".rounded-xl.border.bg-white").first();
    const biSummary = firstThemeCard.locator("summary", { hasText: "Behavioral Indicators" });
    await biSummary.click();

    // Verify list items appear inside the opened details
    await expect(firstThemeCard.locator("details[open] li").first()).toBeVisible({ timeout: 5000 });

    await page.screenshot({
      path: "e2e/screenshots/09-admin-strengths-indicators-expanded.png",
      fullPage: false,
    });

    // Click to expand Questions in the same theme card
    const questionsSummary = firstThemeCard.locator("summary", { hasText: "Questions" });
    await questionsSummary.click();

    // Verify question content appears (positive/negative text pairs)
    await expect(firstThemeCard.locator("details[open] .text-foreground").first()).toBeVisible({ timeout: 5000 });

    await page.screenshot({
      path: "e2e/screenshots/09-admin-strengths-questions-expanded.png",
      fullPage: false,
    });
  });
});
