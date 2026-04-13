import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("displays hero section with CTAs", async ({ page }) => {
    await page.goto("/");
    await page.screenshot({
      path: "e2e/screenshots/00-landing-hero.png",
      fullPage: false,
    });

    // Hero headline
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "top strengths"
    );

    // Navigation links
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Get Started" })
    ).toBeVisible();

    // CTA buttons
    await expect(
      page.getByRole("link", { name: "Take the Assessment" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Sign Up Free" })
    ).toBeVisible();
  });

  test("displays 5 strength domains", async ({ page }) => {
    await page.goto("/");

    for (const domain of [
      "Drive",
      "Influence",
      "Connection",
      "Reasoning",
      "Adaptability",
    ]) {
      await expect(page.getByText(domain).first()).toBeVisible();
    }

    await page.screenshot({
      path: "e2e/screenshots/00-landing-domains.png",
      fullPage: true,
    });
  });

  test("displays how-it-works steps", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("How it works")).toBeVisible();
    await expect(page.getByText("Take the Assessment").first()).toBeVisible();
    await expect(page.getByText("Get Your Profile")).toBeVisible();
    await expect(page.getByText("Read AI Insights")).toBeVisible();
    await expect(page.getByText("Set Goals")).toBeVisible();
  });

  test("Sign in link navigates to /login", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("Get Started link navigates to /register", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Get Started" }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("redirects authenticated users to /dashboard", async ({ page }) => {
    // Register a user first
    const email = `landing-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("Landing Test");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });

    // Now visit landing page - should redirect to dashboard
    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
