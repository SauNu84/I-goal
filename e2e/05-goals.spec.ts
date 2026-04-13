import { test, expect } from "@playwright/test";

test.describe("Goals Management", () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    testEmail = `goal-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("Goals Tester");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });

  test("goals page shows empty state for new user", async ({ page }) => {
    await page.goto("/dashboard/goals");
    await page.screenshot({
      path: "e2e/screenshots/goals-01-empty-state.png",
      fullPage: true,
    });

    await expect(
      page.getByRole("heading", { name: "Goals" })
    ).toBeVisible();
    await expect(page.getByText("No goals yet")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "New Goal" })
    ).toBeVisible();
  });

  test("can create a new goal", async ({ page }) => {
    await page.goto("/dashboard/goals");

    // Click "New Goal" to open form
    await page.getByRole("button", { name: "New Goal" }).click();
    await page.screenshot({
      path: "e2e/screenshots/goals-02-create-form.png",
      fullPage: true,
    });

    // Fill goal form
    await page.getByPlaceholder("Goal title...").fill("Improve public speaking");
    await page
      .getByPlaceholder("What does success look like?")
      .fill("Present confidently at team meetings without notes");
    await page.screenshot({
      path: "e2e/screenshots/goals-03-form-filled.png",
      fullPage: true,
    });

    // Submit
    await page.getByRole("button", { name: "Create Goal" }).click();

    // Verify goal appears in list
    await expect(page.getByText("Improve public speaking")).toBeVisible();
    await expect(
      page.getByText("Present confidently at team meetings")
    ).toBeVisible();
    await page.screenshot({
      path: "e2e/screenshots/goals-04-goal-created.png",
      fullPage: true,
    });
  });

  test("can toggle goal status (not_started -> in_progress -> completed)", async ({
    page,
  }) => {
    await page.goto("/dashboard/goals");

    // Create a goal first
    await page.getByRole("button", { name: "New Goal" }).click();
    await page.getByPlaceholder("Goal title...").fill("Status Test Goal");
    await page.getByRole("button", { name: "Create Goal" }).click();
    await expect(page.getByText("Status Test Goal")).toBeVisible();

    // Click status icon to advance: not_started -> in_progress
    await page
      .getByTitle(/Status: Not Started/)
      .click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "e2e/screenshots/goals-05-status-in-progress.png",
      fullPage: true,
    });

    // Click again: in_progress -> completed
    await page
      .getByTitle(/Status: In Progress/)
      .click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "e2e/screenshots/goals-06-status-completed.png",
      fullPage: true,
    });

    // Verify completed section appears
    await expect(page.getByText("Completed (1)")).toBeVisible();
  });

  test("can delete a goal", async ({ page }) => {
    await page.goto("/dashboard/goals");

    // Create a goal
    await page.getByRole("button", { name: "New Goal" }).click();
    await page.getByPlaceholder("Goal title...").fill("Delete Me Goal");
    await page.getByRole("button", { name: "Create Goal" }).click();
    await expect(page.getByText("Delete Me Goal")).toBeVisible();

    // Delete it
    await page.getByTitle("Delete goal").click();
    await page.waitForTimeout(500);

    // Verify it's gone
    await expect(page.getByText("Delete Me Goal")).not.toBeVisible();
    await expect(page.getByText("No goals yet")).toBeVisible();
    await page.screenshot({
      path: "e2e/screenshots/goals-07-after-delete.png",
      fullPage: true,
    });
  });

  test("can cancel goal creation", async ({ page }) => {
    await page.goto("/dashboard/goals");

    // Open form
    await page.getByRole("button", { name: "New Goal" }).click();
    await expect(page.getByPlaceholder("Goal title...")).toBeVisible();

    // Cancel
    await page.getByRole("button", { name: "Cancel" }).click();

    // Form should be hidden
    await expect(page.getByPlaceholder("Goal title...")).not.toBeVisible();
  });

  test("create goal button is disabled when title is empty", async ({
    page,
  }) => {
    await page.goto("/dashboard/goals");
    await page.getByRole("button", { name: "New Goal" }).click();

    // Create Goal button should be disabled initially
    await expect(
      page.getByRole("button", { name: "Create Goal" })
    ).toBeDisabled();

    // Type a title
    await page.getByPlaceholder("Goal title...").fill("Valid Goal");
    await expect(
      page.getByRole("button", { name: "Create Goal" })
    ).toBeEnabled();
  });
});
