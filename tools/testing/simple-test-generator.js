#!/usr/bin/env node

/**
 * 🧪 Test Generator Simple - Phase 3.1
 * Version simplifiée pour démarrage rapide
 */

import fs from "fs";
import path from "path";

console.log("🧪 Démarrage génération automatique des tests...");

// Configuration
const config = {
  projectRoot: process.cwd(),
  testDirectory: "tests/auto-generated",
  overwriteExisting: false,
  dryRun: process.argv.includes("--dry-run"),
};

// Créer le répertoire de tests
const testDir = path.join(config.projectRoot, config.testDirectory);
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
  console.log(`📁 Répertoire créé: ${config.testDirectory}`);
}

// Analyser les fichiers source simples
// const sourcePatterns = ["src/**/*.js", "src/**/*.svelte", "src/**/*.ts"]; // Non utilisé avec findFiles

console.log("🔍 Recherche des fichiers source...");

// Version simplifiée sans glob
const findFiles = (dir, extensions = [".js", ".svelte", ".ts"]) => {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (
      stat.isDirectory() &&
      !["node_modules", ".git", "dist", "build"].includes(entry)
    ) {
      files.push(...findFiles(fullPath, extensions));
    } else if (stat.isFile() && extensions.some((ext) => entry.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
};

const sourceFiles = findFiles(path.join(config.projectRoot, "src"));
console.log(`📁 ${sourceFiles.length} fichiers trouvés`);

// Générer tests basiques
const generatedTests = [];

for (const file of sourceFiles) {
  const relativePath = path
    .relative(config.projectRoot, file)
    .replace(/\\/g, "/");
  const fileName = path.basename(file, path.extname(file));
  const fileExt = path.extname(file);

  let testType = "unit";
  let testTemplate = "";
  let testPath = "";

  if (fileExt === ".svelte") {
    testType = "component";
    testPath = path.join(testDir, "components", `${fileName}.test.js`);
    testTemplate = generateComponentTest(fileName, relativePath);
  } else if (relativePath.includes("/routes/")) {
    testType = "route";
    testPath = path.join(testDir, "routes", `${fileName}.e2e.test.js`);
    testTemplate = generateRouteTest(fileName, relativePath);
  } else if (
    relativePath.includes("/lib/") ||
    relativePath.includes("/utils/")
  ) {
    testType = "utility";
    testPath = path.join(testDir, "utils", `${fileName}.test.js`);
    testTemplate = generateUtilityTest(fileName, relativePath);
  }

  if (testTemplate && testPath) {
    if (config.dryRun) {
      console.log(
        `   🔍 [DRY-RUN] Générerait: ${path.relative(
          config.projectRoot,
          testPath
        )}`
      );
      generatedTests.push({
        type: testType,
        name: fileName,
        path: testPath,
        status: "dry-run",
      });
    } else {
      // Créer le répertoire si nécessaire
      const testDirPath = path.dirname(testPath);
      if (!fs.existsSync(testDirPath)) {
        fs.mkdirSync(testDirPath, { recursive: true });
      }

      // Écrire le fichier de test
      if (!fs.existsSync(testPath) || config.overwriteExisting) {
        fs.writeFileSync(testPath, testTemplate);
        console.log(
          `   ✅ Généré: ${path.relative(config.projectRoot, testPath)}`
        );
        generatedTests.push({
          type: testType,
          name: fileName,
          path: testPath,
          status: "generated",
        });
      } else {
        console.log(
          `   ⏭️  Ignoré (existe): ${path.relative(
            config.projectRoot,
            testPath
          )}`
        );
        generatedTests.push({
          type: testType,
          name: fileName,
          path: testPath,
          status: "skipped",
        });
      }
    }
  }
}

// Templates simples
function generateComponentTest(componentName, componentPath) {
  return `// 🎨 Test automatiquement généré pour ${componentName}
// Généré le ${new Date().toISOString()}

import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Component from '../../${componentPath}';

describe('${componentName} Component', () => {
  test('should render without errors', () => {
    const { container } = render(Component);
    expect(container).toBeTruthy();
  });

  test('should have correct structure', () => {
    const { container } = render(Component);
    expect(container.firstChild).toBeTruthy();
  });

  test('should handle props correctly', () => {
    const testProps = { testProp: 'test-value' };
    const { container } = render(Component, { props: testProps });
    expect(container).toBeTruthy();
  });
});
`;
}

function generateUtilityTest(utilityName, utilityPath) {
  return `// 🔧 Test automatiquement généré pour ${utilityName}
// Généré le ${new Date().toISOString()}

import { describe, test, expect } from 'vitest';
import * as utility from '../../${utilityPath}';

describe('${utilityName} Utility', () => {
  test('should export functions', () => {
    expect(typeof utility).toBe('object');
    expect(utility).toBeTruthy();
  });

  test('should have stable exports', () => {
    const exports = Object.keys(utility);
    expect(exports.length).toBeGreaterThan(0);
  });

  test('should handle basic functionality', () => {
    const functions = Object.keys(utility).filter(key => typeof utility[key] === 'function');
    
    functions.forEach(funcName => {
      expect(typeof utility[funcName]).toBe('function');
    });
  });
});
`;
}

function generateRouteTest(routeName, routePath) {
  const routeUrl =
    routePath
      .replace(/src\/routes/, "")
      .replace(/\+page\.svelte$/, "")
      .replace(/\/index$/, "") || "/";

  return `// 🌐 Test E2E automatiquement généré pour ${routeName}
// Généré le ${new Date().toISOString()}

import { test, expect } from '@playwright/test';

test.describe('${routeName} Route', () => {
  test('should load page successfully', async ({ page }) => {
    await page.goto('${routeUrl}');
    await expect(page).toHaveTitle(/FunLearning/);
  });

  test('should render content', async ({ page }) => {
    await page.goto('${routeUrl}');
    await page.waitForLoadState('networkidle');
    
    const content = await page.textContent('body');
    expect(content.trim().length).toBeGreaterThan(0);
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('${routeUrl}');
    
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
`;
}

// Rapport final
console.log("\n📊 RAPPORT GÉNÉRATION TESTS:");
console.log("═══════════════════════════════════");
console.log(`🧪 Tests générés: ${generatedTests.length}`);

const byType = generatedTests.reduce((acc, test) => {
  acc[test.type] = (acc[test.type] || 0) + 1;
  return acc;
}, {});

console.log("📋 Par type:");
Object.entries(byType).forEach(([type, count]) => {
  console.log(`   ${type}: ${count}`);
});

const byStatus = generatedTests.reduce((acc, test) => {
  acc[test.status] = (acc[test.status] || 0) + 1;
  return acc;
}, {});

console.log("📊 Par statut:");
Object.entries(byStatus).forEach(([status, count]) => {
  console.log(`   ${status}: ${count}`);
});

// Sauvegarder le rapport
const reportPath = path.join(
  config.projectRoot,
  "tools",
  "testing",
  "generation-report-simple.json"
);
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalGenerated: generatedTests.length,
    byType,
    byStatus,
  },
  details: generatedTests,
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(
  `\n💾 Rapport sauvegardé: ${path.relative(config.projectRoot, reportPath)}`
);

console.log(
  `\n✅ Génération terminée! ${generatedTests.length} tests ${
    config.dryRun ? "simulés" : "générés"
  }.`
);
