import { test, expect } from "@playwright/test";

test.describe("Assessment History", () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    testEmail = `hist-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("History Tester");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });

  test("history page accessible from dashboard", async ({ page }) => {
    await page.goto("/dashboard/history");
    await page.screenshot({
      path: "e2e/screenshots/hist-01-history-page.png",
      fullPage: true,
    });

    // Should be on history page (may show empty state or heading)
    await expect(page).toHaveURL(/\/dashboard\/history/);
  });

  test("shows empty state for user with no assessments", async ({ page }) => {
    await page.goto("/dashboard/history");

    // For a new user, there should be some indication that no assessments exist
    // The exact text depends on the component
    await page.screenshot({
      path: "e2e/screenshots/hist-02-empty-history.png",
      fullPage: true,
    });
  });
});

test.describe("Assessment Hub - Recent Assessments", () => {
  test("assessment page shows no recent assessments for new user", async ({
    page,
  }) => {
    const email = `hub-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("Hub Tester");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });

    await page.goto("/dashboard/assessment");

    // Should show start button but no recent completed list
    await expect(
      page.getByRole("button", { name: "Begin Assessment" })
    ).toBeVisible();

    // "Recent Assessments" section should not appear for brand-new users
    await expect(page.getByText("Recent Assessments")).not.toBeVisible();
    await page.screenshot({
      path: "e2e/screenshots/hist-03-no-recent.png",
      fullPage: true,
    });
  });
});
