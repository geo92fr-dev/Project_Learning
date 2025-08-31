#!/usr/bin/env node

/**
 * 🔍 Code Analyzer - Auto-Génération Tests Phase 3
 * Analyse statique du code pour identifier les fonctions à tester
 * Conformément à ROADMAP_AUTOMATISATIONS_TECHNIQUES Phase 3.1
 */

import fs from "fs";
import path from "path";
import * as glob from "glob";

export class CodeAnalyzer {
  constructor(options = {}) {
    this.options = {
      projectRoot: process.cwd(),
      includePatterns: ["src/**/*.{js,ts,svelte}", "lib/**/*.{js,ts}"],
      excludePatterns: [
        "src/**/*.test.{js,ts}",
        "src/**/*.spec.{js,ts}",
        "node_modules/**",
        ".svelte-kit/**",
      ],
      ...options,
    };
    this.analysisResults = {
      functions: [],
      components: [],
      stores: [],
      utilities: [],
      routes: [],
    };
  }

  /**
   * 🎯 Analyse complète du projet
   */
  async analyzeProject() {
    console.log("🔍 Démarrage analyse code pour auto-génération tests...");

    const files = await this.findSourceFiles();
    console.log(`📁 ${files.length} fichiers trouvés pour analyse`);

    for (const file of files) {
      await this.analyzeFile(file);
    }

    this.generateAnalysisReport();
    return this.analysisResults;
  }

  /**
   * 📁 Trouver tous les fichiers source
   */
  async findSourceFiles() {
    const files = [];

    for (const pattern of this.options.includePatterns) {
      const matches = await glob.glob(pattern, {
        cwd: this.options.projectRoot,
        ignore: this.options.excludePatterns,
      });
      files.push(...matches.map((f) => path.join(this.options.projectRoot, f)));
    }

    return [...new Set(files)]; // Supprimer les doublons
  }

  /**
   * 🔍 Analyser un fichier spécifique
   */
  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const relativePath = path.relative(this.options.projectRoot, filePath);
      const ext = path.extname(filePath);

      console.log(`   📄 Analyse: ${relativePath}`);

      switch (ext) {
        case ".svelte":
          this.analyzeSvelteComponent(content, relativePath);
          break;
        case ".js":
        case ".ts":
          this.analyzeJavaScriptFile(content, relativePath);
          break;
      }
    } catch (error) {
      console.warn(`⚠️  Erreur analyse ${filePath}:`, error.message);
    }
  }

  /**
   * 🎨 Analyser composant Svelte
   */
  analyzeSvelteComponent(content, filePath) {
    const component = {
      path: filePath,
      type: "svelte-component",
      name: this.extractComponentName(filePath),
      props: this.extractSvelteProps(content),
      events: this.extractSvelteEvents(content),
      stores: this.extractStoreUsage(content),
      functions: this.extractFunctions(content),
      testPriority: this.calculateTestPriority("component"),
      suggestedTests: [],
    };

    // Suggestions de tests automatiques
    if (component.props.length > 0) {
      component.suggestedTests.push("props-validation");
    }
    if (component.events.length > 0) {
      component.suggestedTests.push("event-handling");
    }
    if (component.stores.length > 0) {
      component.suggestedTests.push("store-integration");
    }

    this.analysisResults.components.push(component);
  }

  /**
   * 📜 Analyser fichier JavaScript/TypeScript
   */
  analyzeJavaScriptFile(content, filePath) {
    const functions = this.extractFunctions(content);
    const exports = this.extractExports(content);
    const imports = this.extractImports(content);

    // Déterminer le type de fichier
    const fileType = this.determineFileType(filePath, content);

    const analysis = {
      path: filePath,
      type: fileType,
      functions: functions,
      exports: exports,
      imports: imports,
      testPriority: this.calculateTestPriority(fileType),
      suggestedTests: this.generateTestSuggestions(functions, fileType),
    };

    // Classer selon le type
    switch (fileType) {
      case "store":
        this.analysisResults.stores.push(analysis);
        break;
      case "utility":
        this.analysisResults.utilities.push(analysis);
        break;
      case "route":
        this.analysisResults.routes.push(analysis);
        break;
      default:
        this.analysisResults.functions.push(analysis);
    }
  }

  /**
   * 🔍 Extraire les fonctions d'un code
   */
  extractFunctions(content) {
    const functions = [];

    // Fonctions classiques
    const functionRegex =
      /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)/g;
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        type: "function",
        isAsync: match[0].includes("async"),
        isExported: match[0].includes("export"),
        complexity: this.calculateComplexity(match[0]),
      });
    }

    // Fonctions fléchées
    const arrowRegex =
      /(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g;
    while ((match = arrowRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        type: "arrow-function",
        isAsync: match[0].includes("async"),
        isExported: match[0].includes("export"),
        complexity: this.calculateComplexity(match[0]),
      });
    }

    return functions;
  }

  /**
   * 🎨 Extraire les props Svelte
   */
  extractSvelteProps(content) {
    const props = [];
    const propRegex = /export\s+let\s+(\w+)(?:\s*=\s*[^;]+)?;/g;
    let match;
    while ((match = propRegex.exec(content)) !== null) {
      props.push({
        name: match[1],
        hasDefault: match[0].includes("="),
        required: !match[0].includes("="),
      });
    }
    return props;
  }

  /**
   * 📡 Extraire les événements Svelte
   */
  extractSvelteEvents(content) {
    const events = [];
    // const eventRegex = /createEventDispatcher[^}]+(\w+)[^}]+/g; // Non utilisé actuellement
    const dispatchRegex = /dispatch\(['"`](\w+)['"`]/g;

    let match;
    while ((match = dispatchRegex.exec(content)) !== null) {
      events.push(match[1]);
    }

    return [...new Set(events)];
  }

  /**
   * 🏪 Extraire usage des stores
   */
  extractStoreUsage(content) {
    const stores = [];
    const storeRegex = /\$(\w+)/g;
    let match;
    while ((match = storeRegex.exec(content)) !== null) {
      if (!stores.includes(match[1])) {
        stores.push(match[1]);
      }
    }
    return stores;
  }

  /**
   * 📤 Extraire les exports
   */
  extractExports(content) {
    const exports = [];
    const exportRegex =
      /export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    return exports;
  }

  /**
   * 📥 Extraire les imports
   */
  extractImports(content) {
    const imports = [];
    const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    return imports;
  }

  /**
   * 🔧 Déterminer le type de fichier
   */
  determineFileType(filePath, content) {
    if (
      filePath.includes("/stores/") ||
      content.includes("writable") ||
      content.includes("readable")
    ) {
      return "store";
    }
    if (filePath.includes("/utils/") || filePath.includes("/lib/")) {
      return "utility";
    }
    if (filePath.includes("/routes/")) {
      return "route";
    }
    return "module";
  }

  /**
   * 🎯 Calculer priorité de test
   */
  calculateTestPriority(type) {
    const priorities = {
      utility: "HIGH",
      store: "HIGH",
      component: "MEDIUM",
      route: "MEDIUM",
      module: "LOW",
    };
    return priorities[type] || "LOW";
  }

  /**
   * 🧠 Calculer complexité d'une fonction
   */
  calculateComplexity(functionCode) {
    const complexityIndicators = [
      /if\s*\(/g,
      /else/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /switch\s*\(/g,
      /try\s*{/g,
      /catch\s*\(/g,
    ];

    let complexity = 1; // Complexité de base
    complexityIndicators.forEach((regex) => {
      const matches = functionCode.match(regex);
      if (matches) complexity += matches.length;
    });

    if (complexity <= 5) return "LOW";
    if (complexity <= 10) return "MEDIUM";
    return "HIGH";
  }

  /**
   * 💡 Générer suggestions de tests
   */
  generateTestSuggestions(functions, fileType) {
    const suggestions = [];

    functions.forEach((func) => {
      if (func.isExported) {
        suggestions.push(`unit-test-${func.name}`);

        if (func.isAsync) {
          suggestions.push(`async-test-${func.name}`);
        }

        if (func.complexity === "HIGH") {
          suggestions.push(`integration-test-${func.name}`);
        }
      }
    });

    // Suggestions spécifiques par type
    if (fileType === "store") {
      suggestions.push("store-state-test", "store-subscription-test");
    }
    if (fileType === "utility") {
      suggestions.push("edge-cases-test", "error-handling-test");
    }

    return suggestions;
  }

  /**
   * 🎨 Extraire nom du composant
   */
  extractComponentName(filePath) {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * 📊 Générer rapport d'analyse
   */
  generateAnalysisReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles:
          this.analysisResults.components.length +
          this.analysisResults.functions.length +
          this.analysisResults.stores.length +
          this.analysisResults.utilities.length +
          this.analysisResults.routes.length,
        components: this.analysisResults.components.length,
        stores: this.analysisResults.stores.length,
        utilities: this.analysisResults.utilities.length,
        routes: this.analysisResults.routes.length,
        highPriorityTests: this.countHighPriorityTests(),
        suggestedTestsTotal: this.countSuggestedTests(),
      },
    };

    console.log("\n📊 RAPPORT D'ANALYSE CODE:");
    console.log("═══════════════════════════════");
    console.log(`📁 Fichiers analysés: ${report.summary.totalFiles}`);
    console.log(`🎨 Composants Svelte: ${report.summary.components}`);
    console.log(`🏪 Stores: ${report.summary.stores}`);
    console.log(`🔧 Utilitaires: ${report.summary.utilities}`);
    console.log(`🛣️  Routes: ${report.summary.routes}`);
    console.log(`🔴 Tests haute priorité: ${report.summary.highPriorityTests}`);
    console.log(
      `💡 Tests suggérés total: ${report.summary.suggestedTestsTotal}`
    );

    // Sauvegarder le rapport
    const reportPath = path.join(
      this.options.projectRoot,
      "tools",
      "testing",
      "analysis-report.json"
    );
    fs.writeFileSync(
      reportPath,
      JSON.stringify({ ...report, details: this.analysisResults }, null, 2)
    );
    console.log(`\n💾 Rapport sauvegardé: ${reportPath}`);

    return report;
  }

  /**
   * 🔴 Compter tests haute priorité
   */
  countHighPriorityTests() {
    let count = 0;
    Object.values(this.analysisResults).forEach((category) => {
      if (Array.isArray(category)) {
        count += category.filter((item) => item.testPriority === "HIGH").length;
      }
    });
    return count;
  }

  /**
   * 💡 Compter tous les tests suggérés
   */
  countSuggestedTests() {
    let count = 0;
    Object.values(this.analysisResults).forEach((category) => {
      if (Array.isArray(category)) {
        category.forEach((item) => {
          if (item.suggestedTests) {
            count += item.suggestedTests.length;
          }
        });
      }
    });
    return count;
  }
}

// 🚀 Exécution standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new CodeAnalyzer();
  analyzer
    .analyzeProject()
    .then(() => {
      console.log("\n✅ Analyse terminée avec succès!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Erreur lors de l'analyse:", error);
      process.exit(1);
    });
}
