import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("Registration", () => {
    test("registers a new user and redirects to dashboard", async ({
      page,
    }) => {
      const email = `reg-test-${Date.now()}@example.com`;

      await page.goto("/register");
      await page.screenshot({
        path: "e2e/screenshots/auth-01-register-page.png",
        fullPage: true,
      });

      // Verify form elements
      await expect(
        page.getByRole("heading", { name: "Create account" })
      ).toBeVisible();
      await expect(page.getByLabel("Name")).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();

      // Fill the form
      await page.getByLabel("Name").fill("Test User");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("testpass123");
      await page.screenshot({
        path: "e2e/screenshots/auth-02-register-filled.png",
        fullPage: true,
      });

      // Submit
      await page.getByRole("button", { name: "Create account" }).click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });
      await page.screenshot({
        path: "e2e/screenshots/auth-03-register-success.png",
        fullPage: true,
      });

      // Verify we're on the dashboard
      await expect(page.getByText("Hey Test")).toBeVisible();
    });

    test("shows error for duplicate email", async ({ page }) => {
      const email = `dup-test-${Date.now()}@example.com`;

      // Register first time
      await page.goto("/register");
      await page.getByLabel("Name").fill("First User");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("testpass123");
      await page.getByRole("button", { name: "Create account" }).click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });

      // Clear session by going to register page directly
      await page.goto("/register");
      await page.getByLabel("Name").fill("Second User");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("testpass123");
      await page.getByRole("button", { name: "Create account" }).click();

      // Should show error
      await expect(page.getByText(/already/i).or(page.getByText(/exists/i).or(page.getByText(/wrong/i)))).toBeVisible({
        timeout: 10000,
      });
      await page.screenshot({
        path: "e2e/screenshots/auth-04-register-duplicate-error.png",
        fullPage: true,
      });
    });

    test("shows link to sign in page", async ({ page }) => {
      await page.goto("/register");
      const signInLink = page.getByRole("link", { name: "Sign in" });
      await expect(signInLink).toBeVisible();
      await signInLink.click();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe("Login", () => {
    let testEmail: string;

    test.beforeAll(async ({ browser }) => {
      // Create a test user for login tests
      testEmail = `login-test-${Date.now()}@example.com`;
      const page = await browser.newPage();
      await page.goto("/register");
      await page.getByLabel("Name").fill("Login Test");
      await page.getByLabel("Email").fill(testEmail);
      await page.getByLabel("Password").fill("testpass123");
      await page.getByRole("button", { name: "Create account" }).click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });
      await page.close();
    });

    test("logs in with valid credentials", async ({ page }) => {
      await page.goto("/login");
      await page.screenshot({
        path: "e2e/screenshots/auth-05-login-page.png",
        fullPage: true,
      });

      // Verify form elements
      await expect(
        page.getByRole("heading", { name: "Welcome back" })
      ).toBeVisible();

      await page.getByLabel("Email").fill(testEmail);
      await page.getByLabel("Password").fill("testpass123");
      await page.screenshot({
        path: "e2e/screenshots/auth-06-login-filled.png",
        fullPage: true,
      });

      await page.getByRole("button", { name: "Sign in" }).click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });
      await page.screenshot({
        path: "e2e/screenshots/auth-07-login-success.png",
        fullPage: true,
      });

      await expect(page.getByText("Hey Login")).toBeVisible();
    });

    test("shows error for invalid credentials", async ({ page }) => {
      await page.goto("/login");
      await page.getByLabel("Email").fill("wrong@example.com");
      await page.getByLabel("Password").fill("wrongpass");
      await page.getByRole("button", { name: "Sign in" }).click();

      await expect(
        page.getByText("Invalid email or password")
      ).toBeVisible({ timeout: 10000 });
      await page.screenshot({
        path: "e2e/screenshots/auth-08-login-error.png",
        fullPage: true,
      });
    });

    test("shows link to register page", async ({ page }) => {
      await page.goto("/login");
      const signUpLink = page.getByRole("link", { name: "Sign up" });
      await expect(signUpLink).toBeVisible();
      await signUpLink.click();
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe("Protected Routes", () => {
    test("redirects unauthenticated user from /dashboard to /login", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/login/);
    });

    test("redirects unauthenticated user from /dashboard/assessment to /login", async ({
      page,
    }) => {
      await page.goto("/dashboard/assessment");
      await expect(page).toHaveURL(/\/login/);
    });

    test("redirects unauthenticated user from /dashboard/goals to /login", async ({
      page,
    }) => {
      await page.goto("/dashboard/goals");
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
