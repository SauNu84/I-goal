import { test as base, expect, Page } from "@playwright/test";

const TEST_USER = {
  name: "E2E Test User",
  email: `e2e-test-${Date.now()}@example.com`,
  password: "testpass123",
};

/**
 * Registers a new user and returns credentials.
 * Takes a screenshot at each step for UAT documentation.
 */
export async function registerUser(
  page: Page,
  user = TEST_USER
): Promise<typeof TEST_USER> {
  await page.goto("/register");
  await page.screenshot({
    path: "e2e/screenshots/01-register-page.png",
    fullPage: true,
  });

  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.screenshot({
    path: "e2e/screenshots/02-register-form-filled.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.screenshot({
    path: "e2e/screenshots/03-dashboard-after-register.png",
    fullPage: true,
  });

  return user;
}

/**
 * Logs in with existing credentials.
 */
export async function loginUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto("/login");
  await page.screenshot({
    path: "e2e/screenshots/04-login-page.png",
    fullPage: true,
  });

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.screenshot({
    path: "e2e/screenshots/05-dashboard-after-login.png",
    fullPage: true,
  });
}

/**
 * Extended test fixture that provides a registered, logged-in user.
 */
export const test = base.extend<{ authedPage: Page; testUser: typeof TEST_USER }>({
  testUser: async ({}, use) => {
    const user = {
      ...TEST_USER,
      email: `e2e-test-${Date.now()}@example.com`,
    };
    await use(user);
  },
  authedPage: async ({ page, testUser }, use) => {
    await registerUser(page, testUser);
    await use(page);
  },
});

export { expect, TEST_USER };
