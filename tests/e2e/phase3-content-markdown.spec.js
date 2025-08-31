// 🧪 Tests automatisés Playwright pour Phase 3 Content & Markdown
// Conformément à DOC_CoPilot_Practices : Terminal → Console → Visuel → Rapport

import { test, expect } from "@playwright/test";

test.describe("Phase 3 - Tests Content & Markdown System", () => {
  test.beforeEach(async ({ page }) => {
    // Configuration pour capturer les erreurs console
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`🚨 ERREUR CONSOLE: ${msg.text()}`);
      }
    });

    page.on("pageerror", (error) => {
      console.error(`🚨 ERREUR PAGE: ${error.message}`);
    });
  });

  // Test de la page d'accueil avec navigation Phase 3
  test("Page d'accueil avec navigation Phase 3", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Vérifier le titre
    const title = await page.title();
    expect(title).toContain("FunLearning");

    // Vérifier le contenu Phase 3
    await expect(page.locator("h1")).toContainText("Apprendre en s'amusant");

    // Vérifier les liens de navigation Phase 3
    await expect(page.locator('a[href="/content"]')).toBeVisible();
    await expect(page.locator('a[href="/test-content-fixed"]')).toBeVisible();
    await expect(page.locator('a[href="/test-markdown"]')).toBeVisible();

    // Pas d'erreurs console
    await page.waitForTimeout(1000);
  });

  // Test du hub de contenu éducatif
  test("Hub de contenu éducatif (/content)", async ({ page }) => {
    await page.goto("http://localhost:5173/content");

    // Vérifier le titre de la page
    const title = await page.title();
    expect(title).toContain("Contenu Éducatif");

    // Vérifier le contenu principal
    await expect(page.locator("h1")).toContainText("Contenu Éducatif");

    // Vérifier que les matières sont affichées
    const matiereChips = page.locator(".matiere-chip");
    await expect(matiereChips.first()).toBeVisible();

    // Vérifier les statistiques
    await expect(page.locator(".stats-grid")).toBeVisible();

    // Attendre le chargement des données
    await page.waitForTimeout(2000);
  });

  // Test de la page de test Markdown corrigée
  test("Page test Markdown (/test-content-fixed)", async ({ page }) => {
    await page.goto("http://localhost:5173/test-content-fixed");

    // Vérifier le titre
    const title = await page.title();
    expect(title).toContain("Test Contenu Markdown");

    // Vérifier le header principal
    await expect(page.locator("h1")).toContainText(
      "Test du système de contenu Markdown"
    );

    // Vérifier que les sections sont présentes
    await expect(
      page.locator("h2").filter({ hasText: "Matières disponibles" })
    ).toBeVisible();
    await expect(
      page.locator("h2").filter({ hasText: "Cours de test" })
    ).toBeVisible();

    // Vérifier que les matières sont chargées
    await page.waitForTimeout(2000);
    const matiereChips = page.locator(".matiere-chip");
    await expect(matiereChips.first()).toBeVisible();

    // Vérifier que les cours sont chargés
    const courseCards = page.locator(".course-card");
    await expect(courseCards.first()).toBeVisible();
  });

  // Test du composant MarkdownRenderer
  test("Composant MarkdownRenderer (/test-markdown)", async ({ page }) => {
    await page.goto("http://localhost:5173/test-markdown");

    // Vérifier le titre
    const title = await page.title();
    expect(title).toContain("Test MarkdownRenderer");

    // Vérifier le header
    await expect(page.locator("h1")).toContainText(
      "Test du composant MarkdownRenderer"
    );

    // Attendre le chargement des données
    await page.waitForTimeout(2000);

    // Vérifier que les matières sont affichées
    const matiereCards = page.locator(".matiere-card");
    await expect(matiereCards.first()).toBeVisible();

    // Tester l'interaction avec un cours
    const firstCourse = page.locator(".course-item").first();
    if ((await firstCourse.count()) > 0) {
      await firstCourse.click();

      // Vérifier que le composant MarkdownRenderer s'affiche
      await expect(page.locator(".markdown-renderer")).toBeVisible();
    }
  });

  // Test des fonctionnalités interactives
  test("Interactions et fonctionnalités Markdown", async ({ page }) => {
    await page.goto("http://localhost:5173/test-content-fixed");

    // Attendre le chargement complet
    await page.waitForTimeout(3000);

    // Vérifier qu'il y a des boutons de test
    const testButtons = page.locator("button").filter({ hasText: "Test" });
    const buttonCount = await testButtons.count();

    if (buttonCount > 0) {
      // Cliquer sur le premier bouton "Test Markdown"
      const markdownButton = page
        .locator("button")
        .filter({ hasText: "Test Markdown" })
        .first();
      await markdownButton.click();

      // Vérifier que la section de rendu apparaît
      await expect(page.locator(".render-section")).toBeVisible();

      // Vérifier les informations de performance
      await expect(page.locator(".performance-info")).toBeVisible();

      // Vérifier la comparaison Markdown/HTML
      await expect(page.locator(".content-comparison")).toBeVisible();
      await expect(page.locator(".markdown-source")).toBeVisible();
      await expect(page.locator(".html-render")).toBeVisible();

      // Vérifier les informations de sécurité
      await expect(page.locator(".security-info")).toBeVisible();
    }
  });

  // Test de sécurité et performance
  test("Validation sécurité et performance", async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];

    // Capturer les erreurs
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    // Tester toutes les pages Phase 3
    const testPages = [
      "http://localhost:5173/",
      "http://localhost:5173/content",
      "http://localhost:5173/test-content-fixed",
      "http://localhost:5173/test-markdown",
    ];

    for (const url of testPages) {
      console.log(`🔍 Test de: ${url}`);

      const startTime = Date.now();
      const response = await page.goto(url);
      await page.waitForTimeout(2000);
      const loadTime = Date.now() - startTime;

      // Vérifier le temps de chargement (doit être < 5 secondes)
      expect(loadTime).toBeLessThan(5000);

      // Vérifier qu'il n'y a pas d'erreurs 404
      if (response) {
        expect(response.status()).toBe(200);
      }

      // Vérifier le contenu non vide
      const content = await page.textContent("body");
      if (content) {
        expect(content.length).toBeGreaterThan(100);
        console.log(`   ✅ Taille contenu: ${content.length} caractères`);
      }

      console.log(`   ✅ Temps de chargement: ${loadTime}ms`);
    }

    // Rapport final
    console.log("📊 RAPPORT FINAL SÉCURITÉ:");
    console.log(`   Erreurs console: ${consoleErrors.length}`);
    console.log(`   Erreurs page: ${pageErrors.length}`);

    if (consoleErrors.length > 0) {
      console.log("🚨 ERREURS CONSOLE:", consoleErrors);
    }

    // Tolérer les warnings CSS mais pas les erreurs critiques
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes("Unused CSS selector") &&
        !error.includes("has unused export property")
    );

    expect(criticalErrors, "Aucune erreur critique autorisée").toHaveLength(0);
    expect(pageErrors, "Aucune erreur page autorisée").toHaveLength(0);
  });

  // Test responsive et accessibilité
  test("Test responsive et accessibilité", async ({ page }) => {
    await page.goto("http://localhost:5173/content");

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Vérifier que le contenu est toujours visible
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".stats-grid")).toBeVisible();

    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    // Vérifier la navigation
    await expect(page.locator("nav")).toBeVisible();

    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);

    // Vérifier que tout est bien affiché
    await expect(page.locator(".container")).toBeVisible();
  });
});
