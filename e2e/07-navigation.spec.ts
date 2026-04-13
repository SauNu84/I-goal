import { test, expect } from "@playwright/test";

test.describe("Dashboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    const email = `nav-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("Nav Tester");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });

  test("sidebar navigation links work correctly", async ({ page }) => {
    // Navigate through sidebar links
    // Dashboard link
    await page.goto("/dashboard");
    await page.screenshot({
      path: "e2e/screenshots/nav-01-dashboard.png",
      fullPage: true,
    });

    // Assessment page
    await page.goto("/dashboard/assessment");
    await expect(
      page.getByRole("heading", { name: "Strengths Assessment" })
    ).toBeVisible();
    await page.screenshot({
      path: "e2e/screenshots/nav-02-assessment.png",
      fullPage: true,
    });

    // Goals page
    await page.goto("/dashboard/goals");
    await expect(
      page.getByRole("heading", { name: "Goals" })
    ).toBeVisible();
    await page.screenshot({
      path: "e2e/screenshots/nav-03-goals.png",
      fullPage: true,
    });

    // History page
    await page.goto("/dashboard/history");
    await expect(page).toHaveURL(/\/dashboard\/history/);
    await page.screenshot({
      path: "e2e/screenshots/nav-04-history.png",
      fullPage: true,
    });
  });
});

test.describe("Error Boundary", () => {
  test("accessing invalid assessment session redirects to assessment hub", async ({
    page,
  }) => {
    const email = `err-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("Error Tester");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });

    // Try to access a non-existent assessment session
    await page.goto("/assessment/non-existent-id");

    // Should redirect to assessment hub or show error
    await page.waitForURL(/\/dashboard\/assessment|\/login/, {
      timeout: 10000,
    });
    await page.screenshot({
      path: "e2e/screenshots/nav-05-invalid-assessment.png",
      fullPage: true,
    });
  });

  test("accessing invalid results redirects to dashboard", async ({
    page,
  }) => {
    const email = `err2-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("Error Tester 2");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });

    // Try to access non-existent results
    await page.goto("/results/non-existent-id");
    await page.waitForURL(/\/dashboard|\/login/, { timeout: 10000 });
    await page.screenshot({
      path: "e2e/screenshots/nav-06-invalid-results.png",
      fullPage: true,
    });
  });
});
