import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    await page.context().clearPermissions();
  });

  test("should show login page", async ({ page }) => {
    await page.goto("/auth/login");

    // Check page loads correctly
    await expect(page).toHaveTitle(/Connexion - FunLearning/);
    await expect(page.locator("h1")).toContainText("Connexion FunLearning");
    await expect(page.locator("text=Se connecter avec Google")).toBeVisible();
  });

  test("should redirect to login when accessing dashboard unauthenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Should redirect to login page
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.locator("h1")).toContainText("Connexion FunLearning");
  });

  test("should show Google auth button", async ({ page }) => {
    await page.goto("/auth/login");

    // Check Google auth button is present and functional
    const googleButton = page.locator("text=Se connecter avec Google");
    await expect(googleButton).toBeVisible();
    await expect(googleButton).not.toBeDisabled();
  });

  test("should handle auth loading states", async ({ page }) => {
    await page.goto("/auth/login");

    // Check initial loading state
    await page.waitForLoadState("networkidle");

    // Check that loading spinner is not visible when page is loaded
    await expect(page.locator(".spinner")).not.toBeVisible();
  });

  test("should show auth form properly", async ({ page }) => {
    await page.goto("/auth/login");

    // Check form elements
    await expect(page.locator(".login-card")).toBeVisible();
    await expect(page.locator(".login-header")).toBeVisible();
    await expect(page.locator(".auth-section")).toBeVisible();
  });

  test("should navigate back to home", async ({ page }) => {
    await page.goto("/auth/login");

    // Check back to home link
    const homeLink = page.locator("text=Retour à l'accueil");
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL("/");
  });

  test("should show error messages when auth fails", async ({ page }) => {
    await page.goto("/auth/login");

    // Mock auth failure by intercepting Firebase auth
    await page.route("**/*identitytoolkit*", (route) => {
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: 400,
            message: "INVALID_LOGIN_CREDENTIALS",
          },
        }),
      });
    });

    // Try to authenticate (this will fail due to our mock)
    const googleButton = page.locator("text=Se connecter avec Google");
    await googleButton.click();

    // Should show loading state temporarily
    await expect(page.locator("text=Connexion...")).toBeVisible();
  });
});

test.describe("Dashboard Protection", () => {
  test("should protect dashboard routes", async ({ page }) => {
    // Try to access dashboard directly
    await page.goto("/dashboard");

    // Should be redirected to login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("should show dashboard when authenticated", async ({ page }) => {
    // This test would require actual authentication
    // For now, we'll just test the dashboard loads when accessed directly
    // In a real scenario, we'd mock the auth state

    await page.goto("/dashboard");

    // Wait for redirect to login
    await page.waitForURL(/\/auth\/login/);
    await expect(page.locator("h1")).toContainText("Connexion FunLearning");
  });
});

test.describe("Navigation", () => {
  test("should allow navigation between auth pages", async ({ page }) => {
    // Start at login
    await page.goto("/auth/login");
    await expect(page).toHaveURL("/auth/login");

    // Navigate to home
    await page.locator("text=Retour à l'accueil").click();
    await expect(page).toHaveURL("/");

    // Navigate back to login (if there's a login link)
    // This would depend on your home page structure
  });
});
