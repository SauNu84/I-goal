import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    // Register fresh user for each test
    testEmail = `dash-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("Dashboard Test");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });

  test("displays welcome message for new user", async ({ page }) => {
    await expect(page.getByText("Hey Dashboard")).toBeVisible();
    await expect(
      page.getByText("Welcome to I-Goal").or(
        page.getByText("first strengths assessment")
      )
    ).toBeVisible();
    await page.screenshot({
      path: "e2e/screenshots/dash-01-new-user-dashboard.png",
      fullPage: true,
    });
  });

  test("shows three quick action cards", async ({ page }) => {
    await expect(page.getByText("Take Assessment")).toBeVisible();
    await expect(page.getByText("My Goals")).toBeVisible();
    await expect(page.getByText("Assessment History")).toBeVisible();
    await page.screenshot({
      path: "e2e/screenshots/dash-02-quick-actions.png",
      fullPage: true,
    });
  });

  test("shows empty state with CTA for new user", async ({ page }) => {
    await expect(page.getByText("Discover your Top 5 strengths")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Start Assessment" })
    ).toBeVisible();
  });

  test("Take Assessment card navigates to /dashboard/assessment", async ({
    page,
  }) => {
    await page.getByText("Take Assessment").click();
    await expect(page).toHaveURL(/\/dashboard\/assessment/);
    await page.screenshot({
      path: "e2e/screenshots/dash-03-assessment-page.png",
      fullPage: true,
    });
  });

  test("My Goals card navigates to /dashboard/goals", async ({ page }) => {
    await page.getByText("My Goals").click();
    await expect(page).toHaveURL(/\/dashboard\/goals/);
    await page.screenshot({
      path: "e2e/screenshots/dash-04-goals-page.png",
      fullPage: true,
    });
  });

  test("Assessment History card navigates to /dashboard/history", async ({
    page,
  }) => {
    await page.getByText("Assessment History").click();
    await expect(page).toHaveURL(/\/dashboard\/history/);
  });
});
