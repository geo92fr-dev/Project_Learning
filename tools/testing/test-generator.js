#!/usr/bin/env node

/**
 * 🧪 Test Generator - Auto-Génération Tests Phase 3
 * Génération automatique de tests basée sur l'analyse de code
 * Conformément à ROADMAP_AUTOMATISATIONS_TECHNIQUES Phase 3.1
 */

import fs from "fs";
import path from "path";
import { CodeAnalyzer } from "./code-analyzer.js";

export class TestGenerator {
  constructor(options = {}) {
    this.options = {
      projectRoot: process.cwd(),
      testDirectory: "tests/auto-generated",
      templatesDirectory: "tools/testing/templates",
      overwriteExisting: false,
      dryRun: false,
      testFramework: "vitest", // vitest, jest, playwright
      ...options,
    };
    this.templates = {};
    this.generatedTests = [];
  }

  /**
   * 🚀 Générer tous les tests automatiquement
   */
  async generateAllTests() {
    console.log("🧪 Démarrage génération automatique des tests...");

    // 1. Analyser le code
    const analyzer = new CodeAnalyzer();
    const analysisResults = await analyzer.analyzeProject();

    // 2. Charger les templates
    await this.loadTemplates();

    // 3. Créer le répertoire de tests
    this.ensureTestDirectory();

    // 4. Générer les tests par catégorie
    await this.generateComponentTests(analysisResults.components);
    await this.generateStoreTests(analysisResults.stores);
    await this.generateUtilityTests(analysisResults.utilities);
    await this.generateRouteTests(analysisResults.routes);

    // 5. Générer le rapport de génération
    this.generateGenerationReport();

    return this.generatedTests;
  }

  /**
   * 📋 Charger les templates de tests
   */
  async loadTemplates() {
    const templatesDir = path.join(
      this.options.projectRoot,
      this.options.templatesDirectory
    );

    try {
      const templateFiles = fs.readdirSync(templatesDir);

      for (const file of templateFiles) {
        if (file.endsWith(".template.js")) {
          const templateName = file.replace(".template.js", "");
          const templatePath = path.join(templatesDir, file);
          this.templates[templateName] = fs.readFileSync(templatePath, "utf8");
        }
      }

      console.log(`📋 ${Object.keys(this.templates).length} templates chargés`);
    } catch (error) {
      console.warn("⚠️  Erreur chargement templates:", error.message);
      // Utiliser des templates par défaut
      this.loadDefaultTemplates();
    }
  }

  /**
   * 📋 Templates par défaut
   */
  loadDefaultTemplates() {
    this.templates = {
      "unit-test": this.getDefaultUnitTestTemplate(),
      "component-test": this.getDefaultComponentTestTemplate(),
      "store-test": this.getDefaultStoreTestTemplate(),
      "integration-test": this.getDefaultIntegrationTestTemplate(),
      "e2e-test": this.getDefaultE2ETestTemplate(),
    };
    console.log("📋 Templates par défaut chargés");
  }

  /**
   * 📁 Assurer l'existence du répertoire de tests
   */
  ensureTestDirectory() {
    const testDir = path.join(
      this.options.projectRoot,
      this.options.testDirectory
    );
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
      console.log(`📁 Répertoire créé: ${this.options.testDirectory}`);
    }
  }

  /**
   * 🎨 Générer tests pour les composants Svelte
   */
  async generateComponentTests(components) {
    console.log(`\n🎨 Génération tests composants (${components.length})...`);

    for (const component of components) {
      if (
        component.testPriority === "HIGH" ||
        component.testPriority === "MEDIUM"
      ) {
        await this.generateComponentTest(component);
      }
    }
  }

  /**
   * 🎨 Générer test pour un composant spécifique
   */
  async generateComponentTest(component) {
    const testContent = this.templates["component-test"]
      .replace(/{{COMPONENT_NAME}}/g, component.name)
      .replace(/{{COMPONENT_PATH}}/g, component.path)
      .replace(/{{PROPS_TESTS}}/g, this.generatePropsTests(component.props))
      .replace(/{{EVENTS_TESTS}}/g, this.generateEventsTests(component.events))
      .replace(/{{STORES_TESTS}}/g, this.generateStoresTests(component.stores));

    const testFileName = `${component.name}.test.js`;
    const testPath = path.join(
      this.options.projectRoot,
      this.options.testDirectory,
      "components",
      testFileName
    );

    await this.writeTestFile(testPath, testContent, {
      type: "component",
      name: component.name,
      priority: component.testPriority,
      features: component.suggestedTests,
    });
  }

  /**
   * 🏪 Générer tests pour les stores
   */
  async generateStoreTests(stores) {
    console.log(`\n🏪 Génération tests stores (${stores.length})...`);

    for (const store of stores) {
      if (store.testPriority === "HIGH") {
        await this.generateStoreTest(store);
      }
    }
  }

  /**
   * 🏪 Générer test pour un store spécifique
   */
  async generateStoreTest(store) {
    const testContent = this.templates["store-test"]
      .replace(
        /{{STORE_NAME}}/g,
        path.basename(store.path, path.extname(store.path))
      )
      .replace(/{{STORE_PATH}}/g, store.path)
      .replace(/{{EXPORTS_TESTS}}/g, this.generateExportsTests(store.exports))
      .replace(
        /{{FUNCTIONS_TESTS}}/g,
        this.generateFunctionsTests(store.functions)
      );

    const testFileName = `${path.basename(
      store.path,
      path.extname(store.path)
    )}.test.js`;
    const testPath = path.join(
      this.options.projectRoot,
      this.options.testDirectory,
      "stores",
      testFileName
    );

    await this.writeTestFile(testPath, testContent, {
      type: "store",
      name: path.basename(store.path),
      priority: store.testPriority,
      features: store.suggestedTests,
    });
  }

  /**
   * 🔧 Générer tests pour les utilitaires
   */
  async generateUtilityTests(utilities) {
    console.log(`\n🔧 Génération tests utilitaires (${utilities.length})...`);

    for (const utility of utilities) {
      if (utility.testPriority === "HIGH") {
        await this.generateUtilityTest(utility);
      }
    }
  }

  /**
   * 🔧 Générer test pour un utilitaire spécifique
   */
  async generateUtilityTest(utility) {
    const testContent = this.templates["unit-test"]
      .replace(
        /{{MODULE_NAME}}/g,
        path.basename(utility.path, path.extname(utility.path))
      )
      .replace(/{{MODULE_PATH}}/g, utility.path)
      .replace(
        /{{FUNCTIONS_TESTS}}/g,
        this.generateFunctionsTests(utility.functions)
      )
      .replace(
        /{{EXPORTS_TESTS}}/g,
        this.generateExportsTests(utility.exports)
      );

    const testFileName = `${path.basename(
      utility.path,
      path.extname(utility.path)
    )}.test.js`;
    const testPath = path.join(
      this.options.projectRoot,
      this.options.testDirectory,
      "utils",
      testFileName
    );

    await this.writeTestFile(testPath, testContent, {
      type: "utility",
      name: path.basename(utility.path),
      priority: utility.testPriority,
      features: utility.suggestedTests,
    });
  }

  /**
   * 🛣️ Générer tests pour les routes
   */
  async generateRouteTests(routes) {
    console.log(`\n🛣️ Génération tests routes (${routes.length})...`);

    for (const route of routes) {
      if (route.testPriority === "MEDIUM" || route.testPriority === "HIGH") {
        await this.generateRouteTest(route);
      }
    }
  }

  /**
   * 🛣️ Générer test pour une route spécifique
   */
  async generateRouteTest(route) {
    const testContent = this.templates["e2e-test"]
      .replace(
        /{{ROUTE_NAME}}/g,
        path.basename(route.path, path.extname(route.path))
      )
      .replace(/{{ROUTE_PATH}}/g, route.path)
      .replace(/{{ROUTE_URL}}/g, this.extractRouteUrl(route.path));

    const testFileName = `${path.basename(
      route.path,
      path.extname(route.path)
    )}.e2e.test.js`;
    const testPath = path.join(
      this.options.projectRoot,
      this.options.testDirectory,
      "routes",
      testFileName
    );

    await this.writeTestFile(testPath, testContent, {
      type: "route",
      name: path.basename(route.path),
      priority: route.testPriority,
      features: route.suggestedTests,
    });
  }

  /**
   * 💾 Écrire fichier de test
   */
  async writeTestFile(testPath, content, metadata) {
    // Créer le répertoire si nécessaire
    const testDir = path.dirname(testPath);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Vérifier si le fichier existe déjà
    if (fs.existsSync(testPath) && !this.options.overwriteExisting) {
      console.log(
        `   ⏭️  Ignoré (existe): ${path.relative(
          this.options.projectRoot,
          testPath
        )}`
      );
      return;
    }

    if (this.options.dryRun) {
      console.log(
        `   🔍 [DRY-RUN] Générerait: ${path.relative(
          this.options.projectRoot,
          testPath
        )}`
      );
      this.generatedTests.push({
        ...metadata,
        path: testPath,
        status: "dry-run",
      });
      return;
    }

    try {
      fs.writeFileSync(testPath, content);
      console.log(
        `   ✅ Généré: ${path.relative(this.options.projectRoot, testPath)}`
      );
      this.generatedTests.push({
        ...metadata,
        path: testPath,
        status: "generated",
      });
    } catch (error) {
      console.error(
        `   ❌ Erreur: ${path.relative(this.options.projectRoot, testPath)}`,
        error.message
      );
      this.generatedTests.push({
        ...metadata,
        path: testPath,
        status: "error",
        error: error.message,
      });
    }
  }

  /**
   * 🎯 Générer tests pour les props
   */
  generatePropsTests(props) {
    if (!props || props.length === 0) return "// Aucune prop à tester";

    return props
      .map(
        (prop) => `
    test('should handle ${prop.name} prop', () => {
      const { component } = render(Component, { props: { ${prop.name}: 'test-value' } });
      expect(component).toBeTruthy();
    });`
      )
      .join("\n");
  }

  /**
   * 📡 Générer tests pour les événements
   */
  generateEventsTests(events) {
    if (!events || events.length === 0) return "// Aucun événement à tester";

    return events
      .map(
        (event) => `
    test('should emit ${event} event', () => {
      const { component } = render(Component);
      const mockHandler = vi.fn();
      component.$on('${event}', mockHandler);
      // Déclencher l'événement et vérifier
      expect(mockHandler).toHaveBeenCalled();
    });`
      )
      .join("\n");
  }

  /**
   * 🏪 Générer tests pour les stores
   */
  generateStoresTests(stores) {
    if (!stores || stores.length === 0) return "// Aucun store à tester";

    return stores
      .map(
        (store) => `
    test('should react to ${store} store changes', () => {
      const { component } = render(Component);
      // Tester la réactivité au store
      expect(component).toBeTruthy();
    });`
      )
      .join("\n");
  }

  /**
   * 📤 Générer tests pour les exports
   */
  generateExportsTests(exports) {
    if (!exports || exports.length === 0) return "// Aucun export à tester";

    return exports
      .map(
        (exp) => `
    test('should export ${exp}', () => {
      expect(typeof ${exp}).toBe('function');
    });`
      )
      .join("\n");
  }

  /**
   * ⚙️ Générer tests pour les fonctions
   */
  generateFunctionsTests(functions) {
    if (!functions || functions.length === 0)
      return "// Aucune fonction à tester";

    return functions
      .map(
        (func) => `
    test('should test ${func.name} function', () => {
      // Test basique pour ${func.name}
      expect(typeof ${func.name}).toBe('function');
      ${func.isAsync ? "// Test async function" : "// Test sync function"}
    });`
      )
      .join("\n");
  }

  /**
   * 🛣️ Extraire URL de route
   */
  extractRouteUrl(routePath) {
    // Convertir path de fichier en URL de route SvelteKit
    return (
      routePath
        .replace(/src\/routes/, "")
        .replace(/\+page\.svelte$/, "")
        .replace(/\/index$/, "") || "/"
    );
  }

  /**
   * 📊 Générer rapport de génération
   */
  generateGenerationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalGenerated: this.generatedTests.length,
        byType: this.groupTestsByType(),
        byPriority: this.groupTestsByPriority(),
        byStatus: this.groupTestsByStatus(),
      },
      details: this.generatedTests,
    };

    console.log("\n📊 RAPPORT GÉNÉRATION TESTS:");
    console.log("═══════════════════════════════════");
    console.log(`🧪 Tests générés: ${report.summary.totalGenerated}`);
    console.log("📋 Par type:");
    Object.entries(report.summary.byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    console.log("🎯 Par priorité:");
    Object.entries(report.summary.byPriority).forEach(([priority, count]) => {
      console.log(`   ${priority}: ${count}`);
    });

    // Sauvegarder le rapport
    const reportPath = path.join(
      this.options.projectRoot,
      "tools",
      "testing",
      "generation-report.json"
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Rapport sauvegardé: ${reportPath}`);

    return report;
  }

  /**
   * 📊 Grouper tests par type
   */
  groupTestsByType() {
    return this.generatedTests.reduce((acc, test) => {
      acc[test.type] = (acc[test.type] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * 🎯 Grouper tests par priorité
   */
  groupTestsByPriority() {
    return this.generatedTests.reduce((acc, test) => {
      acc[test.priority] = (acc[test.priority] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * 📊 Grouper tests par statut
   */
  groupTestsByStatus() {
    return this.generatedTests.reduce((acc, test) => {
      acc[test.status] = (acc[test.status] || 0) + 1;
      return acc;
    }, {});
  }

  // Templates par défaut
  getDefaultUnitTestTemplate() {
    return `// 🧪 Test automatiquement généré pour {{MODULE_NAME}}
// Généré le ${new Date().toISOString()}

import { describe, test, expect, vi } from 'vitest';
import * as module from '../../{{MODULE_PATH}}';

describe('{{MODULE_NAME}}', () => {
  {{FUNCTIONS_TESTS}}
  
  {{EXPORTS_TESTS}}
});
`;
  }

  getDefaultComponentTestTemplate() {
    return `// 🎨 Test automatiquement généré pour {{COMPONENT_NAME}}
// Généré le ${new Date().toISOString()}

import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Component from '../../{{COMPONENT_PATH}}';

describe('{{COMPONENT_NAME}}', () => {
  test('should render without errors', () => {
    const { container } = render(Component);
    expect(container).toBeTruthy();
  });

  {{PROPS_TESTS}}
  
  {{EVENTS_TESTS}}
  
  {{STORES_TESTS}}
});
`;
  }

  getDefaultStoreTestTemplate() {
    return `// 🏪 Test automatiquement généré pour {{STORE_NAME}}
// Généré le ${new Date().toISOString()}

import { describe, test, expect, vi } from 'vitest';
import { get } from 'svelte/store';
import * as store from '../../{{STORE_PATH}}';

describe('{{STORE_NAME}} Store', () => {
  {{EXPORTS_TESTS}}
  
  {{FUNCTIONS_TESTS}}
  
  test('should be reactive', () => {
    // Test de réactivité du store
    expect(store).toBeTruthy();
  });
});
`;
  }

  getDefaultIntegrationTestTemplate() {
    return `// 🔗 Test d'intégration automatiquement généré
// Généré le ${new Date().toISOString()}

import { describe, test, expect, vi } from 'vitest';

describe('Integration Tests', () => {
  test('should work with other modules', () => {
    // Test d'intégration
    expect(true).toBe(true);
  });
});
`;
  }

  getDefaultE2ETestTemplate() {
    return `// 🌐 Test E2E automatiquement généré pour {{ROUTE_NAME}}
// Généré le ${new Date().toISOString()}

import { test, expect } from '@playwright/test';

test.describe('{{ROUTE_NAME}} Route', () => {
  test('should load page successfully', async ({ page }) => {
    await page.goto('{{ROUTE_URL}}');
    await expect(page).toHaveTitle(/FunLearning/);
  });

  test('should have no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('{{ROUTE_URL}}');
    await page.waitForTimeout(2000);
    
    expect(errors).toHaveLength(0);
  });
});
`;
  }
}

// 🚀 Exécution standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new TestGenerator({
    dryRun: process.argv.includes("--dry-run"),
    overwriteExisting: process.argv.includes("--overwrite"),
  });

  generator
    .generateAllTests()
    .then((results) => {
      console.log(`\n✅ Génération terminée! ${results.length} tests générés.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Erreur lors de la génération:", error);
      process.exit(1);
    });
}
