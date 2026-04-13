import { test, expect } from "@playwright/test";

test.describe("API Endpoints", () => {
  test.describe("Registration API", () => {
    test("POST /api/auth/register creates user", async ({ request }) => {
      const res = await request.post("/api/auth/register", {
        data: {
          name: "API Test User",
          email: `api-test-${Date.now()}@example.com`,
          password: "testpass123",
        },
      });
      expect(res.status()).toBe(201);

      const body = await res.json();
      expect(body.user).toBeDefined();
      expect(body.user.name).toBe("API Test User");
    });

    test("POST /api/auth/register rejects short password", async ({
      request,
    }) => {
      const res = await request.post("/api/auth/register", {
        data: {
          name: "Short Pass",
          email: `short-${Date.now()}@example.com`,
          password: "123",
        },
      });
      expect(res.status()).toBeGreaterThanOrEqual(400);
    });

    test("POST /api/auth/register rejects missing email", async ({
      request,
    }) => {
      const res = await request.post("/api/auth/register", {
        data: {
          name: "No Email",
          password: "testpass123",
        },
      });
      expect(res.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe("Assessment API (requires auth)", () => {
    test("POST /api/assessment/start returns 401 without auth", async ({
      request,
    }) => {
      const res = await request.post("/api/assessment/start");
      expect(res.status()).toBe(401);
    });

    test("GET /api/goals returns 401 without auth", async ({ request }) => {
      const res = await request.get("/api/goals");
      expect(res.status()).toBe(401);
    });
  });
});
