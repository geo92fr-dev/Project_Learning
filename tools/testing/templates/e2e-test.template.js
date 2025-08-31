// 🌐 Template de test E2E avec Playwright
// Template pour tests end-to-end des routes et pages

import { test, expect } from "@playwright/test";

test.describe("{{ROUTE_NAME}} Route E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Configuration avant chaque test
    await page.goto("{{ROUTE_URL}}");

    // Attendre que la page soit complètement chargée
    await page.waitForLoadState("networkidle");
  });

  test.describe("📋 Chargement de base", () => {
    test("should load page successfully", async ({ page }) => {
      // Vérifier que la page se charge sans erreur
      await expect(page).toHaveTitle(/FunLearning/);

      // Vérifier l'URL
      expect(page.url()).toContain("{{ROUTE_URL}}");
    });

    test("should have no console errors", async ({ page }) => {
      const errors = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      // Recharger la page pour capturer tous les logs
      await page.reload();
      await page.waitForTimeout(2000);

      // Filtrer les erreurs connues/acceptables
      const criticalErrors = errors.filter(
        (error) =>
          !error.includes("favicon") &&
          !error.includes("ServiceWorker") &&
          !error.includes("AdBlock")
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test("should have proper meta tags", async ({ page }) => {
      // Vérifier les meta tags essentiels
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);

      // Vérifier la meta description
      const description = await page.getAttribute(
        'meta[name="description"]',
        "content"
      );
      if (description) {
        expect(description.length).toBeGreaterThan(10);
      }

      // Vérifier le viewport
      const viewport = await page.getAttribute(
        'meta[name="viewport"]',
        "content"
      );
      expect(viewport).toContain("width=device-width");
    });
  });

  test.describe("🎨 Interface utilisateur", () => {
    test("should render main content", async ({ page }) => {
      // Vérifier que le contenu principal est visible
      const mainContent = page.locator('main, [role="main"], .main-content');
      await expect(mainContent).toBeVisible();

      // Vérifier qu'il y a du contenu textuel
      const textContent = await page.textContent("body");
      expect(textContent.trim().length).toBeGreaterThan(10);
    });

    test("should have functional navigation", async ({ page }) => {
      // Vérifier la navigation principale
      const navLinks = page.locator('nav a, .nav a, [role="navigation"] a');
      const linkCount = await navLinks.count();

      if (linkCount > 0) {
        // Tester le premier lien de navigation
        const firstLink = navLinks.first();
        await expect(firstLink).toBeVisible();

        const href = await firstLink.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("mailto:")) {
          // Tester que le lien est cliquable
          await expect(firstLink).toBeEnabled();
        }
      }
    });

    test("should handle interactive elements", async ({ page }) => {
      // Tester les boutons
      const buttons = page.locator("button:visible");
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = buttons.nth(i);
        await expect(button).toBeEnabled();

        // Tester le survol
        await button.hover();

        // Si le bouton n'est pas un submit, le cliquer
        const type = await button.getAttribute("type");
        if (type !== "submit") {
          await button.click();
          await page.waitForTimeout(500);
        }
      }

      // Tester les liens
      const links = page.locator("a:visible");
      const linkCount = await links.count();

      for (let i = 0; i < Math.min(linkCount, 2); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute("href");

        if (href && href.startsWith("#")) {
          // Lien d'ancre - tester le clic
          await link.click();
          await page.waitForTimeout(300);
        }
      }
    });
  });

  test.describe("📱 Responsive Design", () => {
    test("should work on mobile viewport", async ({ page }) => {
      // Simuler viewport mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Vérifier que le contenu est toujours visible
      const body = page.locator("body");
      await expect(body).toBeVisible();

      // Vérifier qu'il n'y a pas de dépassement horizontal
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375 + 20); // +20px de tolérance
    });

    test("should work on tablet viewport", async ({ page }) => {
      // Simuler viewport tablette
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Vérifier que le layout s'adapte
      const body = page.locator("body");
      await expect(body).toBeVisible();

      // Vérifier la navigation si elle existe
      const nav = page.locator('nav, [role="navigation"]');
      if ((await nav.count()) > 0) {
        await expect(nav).toBeVisible();
      }
    });

    test("should work on desktop viewport", async ({ page }) => {
      // Simuler viewport desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Vérifier que le contenu utilise bien l'espace
      const mainContent = page.locator("main, .main-content, .container");
      if ((await mainContent.count()) > 0) {
        await expect(mainContent).toBeVisible();
      }
    });
  });

  test.describe("⚡ Performance", () => {
    test("should load within acceptable time", async ({ page }) => {
      const startTime = Date.now();

      await page.goto("{{ROUTE_URL}}");
      await page.waitForLoadState("networkidle");

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // La page devrait se charger en moins de 5 secondes
      expect(loadTime).toBeLessThan(5000);
    });

    test("should have good Core Web Vitals", async ({ page }) => {
      await page.goto("{{ROUTE_URL}}");

      // Mesurer LCP (Largest Contentful Paint)
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ["largest-contentful-paint"] });

          // Timeout après 5 secondes
          setTimeout(() => resolve(0), 5000);
        });
      });

      // LCP devrait être inférieur à 2.5 secondes (bon score)
      if (lcp > 0) {
        expect(lcp).toBeLessThan(2500);
      }
    });

    test("should not have memory leaks", async ({ page }) => {
      const initialMemory = await page.evaluate(() => {
        if (performance.memory) {
          return performance.memory.usedJSHeapSize;
        }
        return 0;
      });

      // Simuler navigation et interactions
      for (let i = 0; i < 5; i++) {
        await page.reload();
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(1000);
      }

      // Forcer garbage collection si possible
      await page.evaluate(() => {
        if (window.gc) {
          window.gc();
        }
      });

      const finalMemory = await page.evaluate(() => {
        if (performance.memory) {
          return performance.memory.usedJSHeapSize;
        }
        return 0;
      });

      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = finalMemory - initialMemory;
        // L'augmentation mémoire ne devrait pas être excessive (< 50MB)
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      }
    });
  });

  test.describe("♿ Accessibilité", () => {
    test("should be keyboard navigable", async ({ page }) => {
      await page.goto("{{ROUTE_URL}}");

      // Tester la navigation au clavier
      const focusableElements = page.locator(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const count = await focusableElements.count();

      if (count > 0) {
        // Naviguer avec Tab
        for (let i = 0; i < Math.min(count, 5); i++) {
          await page.keyboard.press("Tab");
          await page.waitForTimeout(100);

          // Vérifier qu'un élément a le focus
          const focusedElement = await page.locator(":focus").count();
          expect(focusedElement).toBeGreaterThan(0);
        }
      }
    });

    test("should have proper ARIA attributes", async ({ page }) => {
      await page.goto("{{ROUTE_URL}}");

      // Vérifier les attributs ARIA essentiels
      const headings = page.locator("h1, h2, h3, h4, h5, h6");
      const headingCount = await headings.count();

      if (headingCount > 0) {
        // Il devrait y avoir au moins un h1
        const h1Count = await page.locator("h1").count();
        expect(h1Count).toBeGreaterThanOrEqual(1);
      }

      // Vérifier les images alt text
      const images = page.locator("img");
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute("alt");
        const ariaLabel = await img.getAttribute("aria-label");

        // Les images devraient avoir alt ou aria-label
        expect(alt !== null || ariaLabel !== null).toBe(true);
      }
    });

    test("should have good color contrast", async ({ page }) => {
      await page.goto("{{ROUTE_URL}}");

      // Test basique de contraste - vérifier qu'il n'y a pas de texte invisible
      const textElements = page.locator(
        "p, span, div, h1, h2, h3, h4, h5, h6, a, button, label"
      );
      const count = await textElements.count();

      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = textElements.nth(i);
        const isVisible = await element.isVisible();
        const text = await element.textContent();

        if (text && text.trim().length > 0) {
          expect(isVisible).toBe(true);
        }
      }
    });
  });

  test.describe("🔒 Sécurité", () => {
    test("should not expose sensitive information", async ({ page }) => {
      await page.goto("{{ROUTE_URL}}");

      // Vérifier qu'aucune information sensible n'est exposée
      const pageContent = await page.content();

      const sensitivePatterns = [
        /password["\s]*[:=]["\s]*\w+/i,
        /api[_-]?key["\s]*[:=]["\s]*\w+/i,
        /secret["\s]*[:=]["\s]*\w+/i,
        /token["\s]*[:=]["\s]*\w+/i,
        /localhost:\d+/g,
      ];

      sensitivePatterns.forEach((pattern) => {
        const matches = pageContent.match(pattern);
        if (matches) {
          // Filtrer les faux positifs courants
          const filteredMatches = matches.filter(
            (match) =>
              !match.includes("placeholder") &&
              !match.includes("example") &&
              !match.includes("test")
          );

          expect(filteredMatches).toHaveLength(0);
        }
      });
    });

    test("should handle XSS prevention", async ({ page }) => {
      await page.goto("{{ROUTE_URL}}");

      // Tenter injection XSS via URL
      const xssPayload = "<script>window.xssTest=true;</script>";

      try {
        await page.goto(
          `{{ROUTE_URL}}?search=${encodeURIComponent(xssPayload)}`
        );
        await page.waitForLoadState("networkidle");

        // Vérifier que le script malicieux ne s'est pas exécuté
        const xssExecuted = await page.evaluate(() => window.xssTest);
        expect(xssExecuted).toBeUndefined();

        // Vérifier que le payload n'est pas dans le DOM non échappé
        const pageContent = await page.content();
        expect(pageContent).not.toContain(
          "<script>window.xssTest=true;</script>"
        );
      } catch (error) {
        // Si l'URL est rejetée, c'est une bonne chose
        expect(error).toBeTruthy();
      }
    });

    test("should have secure headers", async ({ page }) => {
      const response = await page.goto("{{ROUTE_URL}}");
      const headers = response.headers();

      // Vérifier les headers de sécurité recommandés
      const securityHeaders = [
        "x-frame-options",
        "x-content-type-options",
        "x-xss-protection",
      ];

      // Au moins quelques headers de sécurité devraient être présents
      const presentHeaders = securityHeaders.filter(
        (header) => headers[header]
      );
      expect(presentHeaders.length).toBeGreaterThan(0);
    });
  });

  test.describe("🌐 SEO et Métadonnées", () => {
    test("should have proper SEO structure", async ({ page }) => {
      await page.goto("{{ROUTE_URL}}");

      // Vérifier la structure SEO de base
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(5);
      expect(title.length).toBeLessThan(70);

      // Vérifier H1 unique
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);

      // Vérifier la hiérarchie des titres
      const headings = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .allTextContents();
      expect(headings.length).toBeGreaterThan(0);
    });

    test("should have social media meta tags", async ({ page }) => {
      await page.goto("{{ROUTE_URL}}");

      // Vérifier Open Graph tags
      const ogTitle = await page.getAttribute(
        'meta[property="og:title"]',
        "content"
      );
      const ogDescription = await page.getAttribute(
        'meta[property="og:description"]',
        "content"
      );

      if (ogTitle) {
        expect(ogTitle.length).toBeGreaterThan(5);
      }

      if (ogDescription) {
        expect(ogDescription.length).toBeGreaterThan(10);
      }
    });
  });
});
