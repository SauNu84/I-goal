import { test, expect } from "@playwright/test";

test.describe("Assessment Flow", () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    testEmail = `assess-test-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("Assessment Tester");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("testpass123");
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });

  test("assessment page shows start button and description", async ({
    page,
  }) => {
    await page.goto("/dashboard/assessment");
    await page.screenshot({
      path: "e2e/screenshots/assess-01-assessment-hub.png",
      fullPage: true,
    });

    await expect(
      page.getByRole("heading", { name: "Strengths Assessment" })
    ).toBeVisible();
    await expect(page.getByText("~80 questions")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Begin Assessment" })
    ).toBeVisible();
  });

  test("starts a new assessment and shows first question", async ({
    page,
  }) => {
    await page.goto("/dashboard/assessment");
    await page.getByRole("button", { name: "Begin Assessment" }).click();

    // Should navigate to /assessment/[sessionId]
    await page.waitForURL(/\/assessment\//, { timeout: 15000 });
    await page.screenshot({
      path: "e2e/screenshots/assess-02-first-question.png",
      fullPage: true,
    });

    // Verify question UI elements
    await expect(page.getByText(/1 \/ \d+/)).toBeVisible(); // "1 / 80" counter
    await expect(page.getByText("Strongly Disagree")).toBeVisible();
    await expect(page.getByText("Disagree").first()).toBeVisible();
    await expect(page.getByText("Neutral")).toBeVisible();
    await expect(page.getByText("Agree").first()).toBeVisible();
    await expect(page.getByText("Strongly Agree")).toBeVisible();
  });

  test("answers questions and progresses through assessment", async ({
    page,
  }) => {
    await page.goto("/dashboard/assessment");
    await page.getByRole("button", { name: "Begin Assessment" }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 15000 });

    // Answer first 5 questions by clicking different Likert options
    for (let i = 0; i < 5; i++) {
      // Wait for question to load
      await expect(page.getByText(`${i + 1} / `)).toBeVisible({
        timeout: 5000,
      });

      // Click a Likert option (cycle through 1-5)
      const options = ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"];
      await page.getByText(options[i % 5]).click();

      // Wait for next question to appear
      if (i < 4) {
        await expect(page.getByText(`${i + 2} / `)).toBeVisible({
          timeout: 5000,
        });
      }
    }

    await page.screenshot({
      path: "e2e/screenshots/assess-03-after-5-questions.png",
      fullPage: true,
    });

    // Verify progress - should show "6 / 80" or similar
    await expect(page.getByText(/6 \/ \d+/)).toBeVisible();
  });

  test("can pause and resume assessment", async ({ page }) => {
    // Start assessment
    await page.goto("/dashboard/assessment");
    await page.getByRole("button", { name: "Begin Assessment" }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 15000 });
    const assessmentUrl = page.url();

    // Answer 3 questions
    for (let i = 0; i < 3; i++) {
      await page.getByText("Agree").first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: "e2e/screenshots/assess-04-before-pause.png",
      fullPage: true,
    });

    // Pause by clicking the Pause button
    await page.locator("button").filter({ hasText: /pause/i }).click();
    await page.waitForURL(/\/dashboard\/assessment/, { timeout: 15000 });

    await page.screenshot({
      path: "e2e/screenshots/assess-05-after-pause.png",
      fullPage: true,
    });

    // Verify "Assessment in Progress" banner appears
    await expect(page.getByText("Assessment in Progress")).toBeVisible();
    await expect(page.getByText("3 questions answered")).toBeVisible();

    // Resume
    await page.getByRole("link", { name: "Resume Assessment" }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 15000 });

    await page.screenshot({
      path: "e2e/screenshots/assess-06-resumed.png",
      fullPage: true,
    });

    // Should be on question 4
    await expect(page.getByText(/4 \/ \d+/)).toBeVisible();
  });

  test("keyboard shortcuts work for answering (keys 1-5)", async ({
    page,
  }) => {
    await page.goto("/dashboard/assessment");
    await page.getByRole("button", { name: "Begin Assessment" }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 15000 });

    // Press key "4" (Agree)
    await page.keyboard.press("4");
    await page.waitForTimeout(500);

    // Should advance to question 2
    await expect(page.getByText(/2 \/ \d+/)).toBeVisible({ timeout: 5000 });

    await page.screenshot({
      path: "e2e/screenshots/assess-07-keyboard-answer.png",
      fullPage: true,
    });
  });

  test("timer shows 20s countdown per question", async ({ page }) => {
    await page.goto("/dashboard/assessment");
    await page.getByRole("button", { name: "Begin Assessment" }).click();
    await page.waitForURL(/\/assessment\//, { timeout: 15000 });

    // Timer should show "20s" initially
    await expect(page.getByText(/20s/)).toBeVisible();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Timer should have decreased
    await expect(page.getByText(/1[0-8]s/)).toBeVisible();
  });

  test.describe("Complete Assessment (abbreviated)", () => {
    test.skip(
      !!process.env.CI,
      "Full assessment completion takes too long for CI"
    );

    test("completes full assessment and shows completion screen", async ({
      page,
    }) => {
      test.setTimeout(300000); // 5 minutes for 80 questions

      await page.goto("/dashboard/assessment");
      await page.getByRole("button", { name: "Begin Assessment" }).click();
      await page.waitForURL(/\/assessment\//, { timeout: 15000 });

      // Answer all questions automatically
      let questionNum = 1;
      while (true) {
        // Check if we've reached the completion screen
        const completeVisible = await page
          .getByText("Assessment Complete!")
          .isVisible()
          .catch(() => false);
        if (completeVisible) break;

        // Click a random Likert option
        const score = (questionNum % 5) + 1;
        const options = [
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree",
        ];
        await page
          .getByText(options[score - 1])
          .click()
          .catch(() => {});
        await page.waitForTimeout(350);
        questionNum++;

        if (questionNum > 85) break; // Safety exit
      }

      await page.screenshot({
        path: "e2e/screenshots/assess-08-complete-screen.png",
        fullPage: true,
      });

      // Verify completion screen
      await expect(page.getByText("Assessment Complete!")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "See My Results" })
      ).toBeVisible();

      // Click "See My Results" to generate results
      await page.getByRole("button", { name: "See My Results" }).click();
      await page.waitForURL(/\/results\//, { timeout: 60000 });

      await page.screenshot({
        path: "e2e/screenshots/assess-09-results-page.png",
        fullPage: true,
      });
    });
  });
});
