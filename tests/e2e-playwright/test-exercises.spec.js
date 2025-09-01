// 🧪 Tests automatisés Playwright pour validation URL Phase 3
// Conformément à DOC_CoPilot_Practices : Terminal → Console → Visuel → Rapport

import { test, expect } from "@playwright/test";

test.describe("Phase 3 - Tests d'exercices automatisés", () => {
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

  test("Page test-exercises se charge sans erreur", async ({ page }) => {
    // Test de base : la page doit se charger
    await page.goto("http://localhost:5173/test-exercises");

    // Vérifier que la page n'est PAS blanche
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
    expect(content.length).toBeGreaterThan(50); // Plus de 50 caractères = pas vide

    // Vérifier le titre
    const title = await page.title();
    expect(title).toContain("Test");

    // Vérifier qu'il n'y a pas d'erreurs JavaScript
    const errors = [];
    page.on("pageerror", (error) => errors.push(error));
    await page.waitForTimeout(2000); // Attendre le chargement
    expect(errors).toHaveLength(0);
  });

  test("Page test-exercises contient le contenu attendu", async ({ page }) => {
    await page.goto("http://localhost:5173/test-exercises");

    // Vérifier que le titre principal est visible
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Test");

    // Vérifier que ce n'est pas une page d'erreur
    const errorText = page.locator("text=404").or(page.locator("text=Error"));
    await expect(errorText).toHaveCount(0);
  });

  test("Debug: Analyser pourquoi la page est blanche", async ({ page }) => {
    await page.goto("http://localhost:5173/test-exercises");

    // Attendre quelques secondes pour le rendu complet
    await page.waitForTimeout(3000);

    // Capturer le HTML complet
    const html = await page.content();
    console.log("🔍 HTML COMPLET:", html.slice(0, 500) + "...");

    // Vérifier le body
    const bodyContent = await page.locator("body").innerHTML();
    console.log("🔍 BODY CONTENT:", bodyContent.slice(0, 200) + "...");

    // Vérifier s'il y a du CSS qui cache le contenu
    const bodyStyles = await page.locator("body").evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        backgroundColor: styles.backgroundColor,
      };
    });
    console.log("🔍 BODY STYLES:", bodyStyles);

    // Compter les éléments visibles
    const visibleElements = await page.locator("*:visible").count();
    console.log("🔍 ÉLÉMENTS VISIBLES:", visibleElements);

    // Faire une capture d'écran pour diagnostic
    await page.screenshot({
      path: "test-results/debug-page-blanche.png",
      fullPage: true,
    });

    // Le test doit échouer si la page est vraiment blanche
    expect(visibleElements).toBeGreaterThan(1);
  });

  test("Vérification complète selon DOC_CoPilot_Practices", async ({
    page,
  }) => {
    let consoleErrors = [];
    let pageErrors = [];

    // 1️⃣ CONSOLE - Capturer toutes les erreurs
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    // 2️⃣ CHARGEMENT
    await page.goto("http://localhost:5173/test-exercises");
    await page.waitForTimeout(2000);

    // 3️⃣ VISUEL - Vérifications détaillées
    const pageContent = await page.textContent("body");
    const hasRealContent = pageContent && pageContent.trim().length > 100;

    // 4️⃣ RAPPORT
    console.log("📊 RAPPORT VALIDATION:");
    console.log(`   Erreurs console: ${consoleErrors.length}`);
    console.log(`   Erreurs page: ${pageErrors.length}`);
    console.log(`   Contenu détecté: ${hasRealContent ? "OUI" : "NON"}`);
    console.log(`   Taille contenu: ${pageContent?.length || 0} caractères`);

    if (consoleErrors.length > 0) {
      console.log("🚨 ERREURS CONSOLE:", consoleErrors);
    }

    if (pageErrors.length > 0) {
      console.log("🚨 ERREURS PAGE:", pageErrors);
    }

    // Assertions finales
    expect(consoleErrors, "Aucune erreur console autorisée").toHaveLength(0);
    expect(pageErrors, "Aucune erreur page autorisée").toHaveLength(0);
    expect(hasRealContent, "La page doit avoir du contenu réel").toBe(true);
  });
});
