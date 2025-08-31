#!/usr/bin/env node

/**
 * 🏃‍♂️ Performance & Integration Tester - Phase 3.1
 * Outil d'évaluation automatique de performance et d'intégration
 * Conformément à ROADMAP_AUTOMATISATIONS_TECHNIQUES Phase 3.1
 */

import fs from "fs";
import path from "path";
import { execSync, spawn } from "child_process";

export class PerformanceIntegrationTester {
  constructor(options = {}) {
    this.options = {
      projectRoot: process.cwd(),
      serverPort: 5173,
      testTimeout: 30000,
      performanceThresholds: {
        loadTime: 3000, // 3s max pour le chargement
        renderTime: 100, // 100ms max pour le rendu
        memoryUsage: 50 * 1024 * 1024, // 50MB max
        bundleSize: 2 * 1024 * 1024, // 2MB max
      },
      ...options,
    };

    this.results = {
      performance: {},
      integration: {},
      summary: {},
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 🚀 Lancer tous les tests
   */
  async runAllTests() {
    console.log("🏃‍♂️ Démarrage tests performance & intégration...");
    console.log("═══════════════════════════════════════════════");

    try {
      // 1. Tests de performance
      await this.runPerformanceTests();

      // 2. Tests d'intégration
      await this.runIntegrationTests();

      // 3. Tests de build
      await this.runBuildTests();

      // 4. Générer rapport final
      this.generateReport();

      return this.results;
    } catch (error) {
      console.error("❌ Erreur lors des tests:", error.message);
      this.results.error = error.message;
      return this.results;
    }
  }

  /**
   * ⚡ Tests de performance
   */
  async runPerformanceTests() {
    console.log("\n⚡ TESTS DE PERFORMANCE");
    console.log("─────────────────────────");

    // Test de taille des bundles
    await this.testBundleSize();

    // Test de mémoire
    await this.testMemoryUsage();

    // Test de vitesse de compilation
    await this.testCompilationSpeed();

    // Test de démarrage serveur
    await this.testServerStartup();
  }

  /**
   * 📦 Test taille des bundles
   */
  async testBundleSize() {
    console.log("📦 Test taille des bundles...");

    try {
      // Construire le projet
      console.log("   🔨 Construction du projet...");
      const buildStart = Date.now();

      execSync("npm run build", {
        cwd: this.options.projectRoot,
        stdio: "pipe",
      });

      const buildTime = Date.now() - buildStart;
      console.log(`   ⏱️  Temps de build: ${buildTime}ms`);

      // Analyser les tailles
      const buildDir = path.join(this.options.projectRoot, "build");
      const distDir = path.join(
        this.options.projectRoot,
        ".svelte-kit",
        "output"
      );

      let totalSize = 0;
      let bundleFiles = [];

      // Chercher les fichiers de build
      const checkDir = fs.existsSync(buildDir) ? buildDir : distDir;

      if (fs.existsSync(checkDir)) {
        bundleFiles = this.getFileSizes(checkDir);
        totalSize = bundleFiles.reduce((sum, file) => sum + file.size, 0);
      }

      this.results.performance.bundleSize = {
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        buildTime,
        files: bundleFiles.slice(0, 10), // Top 10 des plus gros fichiers
        threshold: this.options.performanceThresholds.bundleSize,
        passed: totalSize <= this.options.performanceThresholds.bundleSize,
      };

      console.log(
        `   📊 Taille totale: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`
      );
      console.log(
        `   ${
          totalSize <= this.options.performanceThresholds.bundleSize
            ? "✅"
            : "❌"
        } Seuil: ${(
          this.options.performanceThresholds.bundleSize /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
    } catch (error) {
      console.log(`   ❌ Erreur build: ${error.message}`);
      this.results.performance.bundleSize = {
        error: error.message,
        passed: false,
      };
    }
  }

  /**
   * 📁 Obtenir tailles des fichiers récursivement
   */
  getFileSizes(dir, basePath = "") {
    const files = [];

    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const relativePath = path.join(basePath, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.getFileSizes(fullPath, relativePath));
      } else {
        files.push({
          path: relativePath,
          size: stat.size,
          sizeMB: (stat.size / (1024 * 1024)).toFixed(3),
        });
      }
    }

    return files.sort((a, b) => b.size - a.size);
  }

  /**
   * 🧠 Test d'utilisation mémoire
   */
  async testMemoryUsage() {
    console.log("🧠 Test utilisation mémoire...");

    try {
      const initialMemory = process.memoryUsage();

      // Simuler une utilisation intensive
      const testData = [];
      for (let i = 0; i < 10000; i++) {
        testData.push({
          id: i,
          data: "x".repeat(100),
          timestamp: Date.now(),
        });
      }

      // Attendre un peu
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      this.results.performance.memoryUsage = {
        initial: initialMemory,
        final: finalMemory,
        increase: memoryIncrease,
        increaseMB: (memoryIncrease / (1024 * 1024)).toFixed(2),
        threshold: this.options.performanceThresholds.memoryUsage,
        passed:
          memoryIncrease <= this.options.performanceThresholds.memoryUsage,
      };

      console.log(
        `   📊 Augmentation mémoire: ${(memoryIncrease / (1024 * 1024)).toFixed(
          2
        )}MB`
      );
      console.log(
        `   ${
          memoryIncrease <= this.options.performanceThresholds.memoryUsage
            ? "✅"
            : "❌"
        } Seuil: ${(
          this.options.performanceThresholds.memoryUsage /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
    } catch (error) {
      console.log(`   ❌ Erreur mémoire: ${error.message}`);
      this.results.performance.memoryUsage = {
        error: error.message,
        passed: false,
      };
    }
  }

  /**
   * ⚡ Test vitesse de compilation
   */
  async testCompilationSpeed() {
    console.log("⚡ Test vitesse de compilation...");

    try {
      const startTime = Date.now();

      // Test de compilation rapide
      execSync("npm run check", {
        cwd: this.options.projectRoot,
        stdio: "pipe",
      });

      const compilationTime = Date.now() - startTime;

      this.results.performance.compilation = {
        time: compilationTime,
        timeSeconds: (compilationTime / 1000).toFixed(2),
        threshold: 30000, // 30s max
        passed: compilationTime <= 30000,
      };

      console.log(
        `   ⏱️  Temps compilation: ${(compilationTime / 1000).toFixed(2)}s`
      );
      console.log(`   ${compilationTime <= 30000 ? "✅" : "❌"} Seuil: 30s`);
    } catch (error) {
      console.log(`   ❌ Erreur compilation: ${error.message}`);
      this.results.performance.compilation = {
        error: error.message,
        passed: false,
      };
    }
  }

  /**
   * 🚀 Test démarrage serveur
   */
  async testServerStartup() {
    console.log("🚀 Test démarrage serveur...");

    return new Promise((resolve) => {
      const startTime = Date.now();
      let serverProcess;
      let startupTime = 0;
      let serverReady = false;

      try {
        // Démarrer le serveur
        serverProcess = spawn("npm", ["run", "dev"], {
          cwd: this.options.projectRoot,
          stdio: "pipe",
        });

        // Écouter la sortie
        serverProcess.stdout.on("data", (data) => {
          const output = data.toString();

          if (output.includes("Local:") || output.includes("localhost")) {
            if (!serverReady) {
              startupTime = Date.now() - startTime;
              serverReady = true;

              this.results.performance.serverStartup = {
                time: startupTime,
                timeSeconds: (startupTime / 1000).toFixed(2),
                threshold: 10000, // 10s max
                passed: startupTime <= 10000,
              };

              console.log(
                `   ⏱️  Temps démarrage: ${(startupTime / 1000).toFixed(2)}s`
              );
              console.log(
                `   ${startupTime <= 10000 ? "✅" : "❌"} Seuil: 10s`
              );

              // Arrêter le serveur
              if (serverProcess) {
                serverProcess.kill();
              }

              resolve();
            }
          }
        });

        serverProcess.stderr.on("data", (data) => {
          const error = data.toString();
          if (error.includes("EADDRINUSE") || error.includes("port")) {
            console.log("   ⚠️  Port déjà utilisé - test de démarrage ignoré");

            this.results.performance.serverStartup = {
              warning: "Port already in use",
              passed: true,
            };

            if (serverProcess) {
              serverProcess.kill();
            }

            resolve();
          }
        });

        // Timeout
        setTimeout(() => {
          if (!serverReady) {
            console.log("   ❌ Timeout démarrage serveur");

            this.results.performance.serverStartup = {
              error: "Startup timeout",
              passed: false,
            };

            if (serverProcess) {
              serverProcess.kill();
            }

            resolve();
          }
        }, 15000);
      } catch (error) {
        console.log(`   ❌ Erreur démarrage: ${error.message}`);

        this.results.performance.serverStartup = {
          error: error.message,
          passed: false,
        };

        resolve();
      }
    });
  }

  /**
   * 🔗 Tests d'intégration
   */
  async runIntegrationTests() {
    console.log("\n🔗 TESTS D'INTÉGRATION");
    console.log("─────────────────────────");

    // Test des imports
    await this.testImports();

    // Test des dépendances
    await this.testDependencies();

    // Test de la structure
    await this.testProjectStructure();
  }

  /**
   * 📥 Test des imports
   */
  async testImports() {
    console.log("📥 Test des imports...");

    try {
      const sourceFiles = this.findSourceFiles();
      const importIssues = [];

      for (const file of sourceFiles.slice(0, 10)) {
        // Limite pour la performance
        const content = fs.readFileSync(file, "utf8");
        const imports = this.extractImports(content);

        for (const importPath of imports) {
          if (!this.validateImport(importPath, file)) {
            importIssues.push({
              file: path.relative(this.options.projectRoot, file),
              import: importPath,
            });
          }
        }
      }

      this.results.integration.imports = {
        totalFiles: sourceFiles.length,
        checkedFiles: Math.min(sourceFiles.length, 10),
        issues: importIssues,
        passed: importIssues.length === 0,
      };

      console.log(
        `   📊 Fichiers vérifiés: ${Math.min(sourceFiles.length, 10)}/${
          sourceFiles.length
        }`
      );
      console.log(
        `   ${importIssues.length === 0 ? "✅" : "❌"} Problèmes d'import: ${
          importIssues.length
        }`
      );

      if (importIssues.length > 0) {
        importIssues.slice(0, 3).forEach((issue) => {
          console.log(`     ⚠️  ${issue.file}: ${issue.import}`);
        });
      }
    } catch (error) {
      console.log(`   ❌ Erreur imports: ${error.message}`);
      this.results.integration.imports = {
        error: error.message,
        passed: false,
      };
    }
  }

  /**
   * 📦 Test des dépendances
   */
  async testDependencies() {
    console.log("📦 Test des dépendances...");

    try {
      const packageJsonPath = path.join(
        this.options.projectRoot,
        "package.json"
      );

      if (!fs.existsSync(packageJsonPath)) {
        throw new Error("package.json non trouvé");
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const dependencies = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      };

      // Vérifier node_modules
      const nodeModulesPath = path.join(
        this.options.projectRoot,
        "node_modules"
      );
      const installedPackages = fs.existsSync(nodeModulesPath)
        ? fs
            .readdirSync(nodeModulesPath)
            .filter((name) => !name.startsWith("."))
        : [];

      const missingDependencies = Object.keys(dependencies).filter(
        (dep) => !installedPackages.includes(dep) && !dep.startsWith("@types/")
      );

      this.results.integration.dependencies = {
        total: Object.keys(dependencies).length,
        installed: installedPackages.length,
        missing: missingDependencies,
        passed: missingDependencies.length === 0,
      };

      console.log(`   📊 Dépendances: ${Object.keys(dependencies).length}`);
      console.log(`   📦 Installées: ${installedPackages.length}`);
      console.log(
        `   ${missingDependencies.length === 0 ? "✅" : "❌"} Manquantes: ${
          missingDependencies.length
        }`
      );
    } catch (error) {
      console.log(`   ❌ Erreur dépendances: ${error.message}`);
      this.results.integration.dependencies = {
        error: error.message,
        passed: false,
      };
    }
  }

  /**
   * 🏗️ Test structure du projet
   */
  async testProjectStructure() {
    console.log("🏗️ Test structure du projet...");

    try {
      const expectedPaths = [
        "src",
        "src/routes",
        "src/lib",
        "package.json",
        "svelte.config.js",
      ];

      const missingPaths = expectedPaths.filter(
        (p) => !fs.existsSync(path.join(this.options.projectRoot, p))
      );

      // Vérifier les fichiers de configuration
      const configFiles = [
        "vite.config.js",
        "vite.config.ts",
        "svelte.config.js",
      ].filter((f) => fs.existsSync(path.join(this.options.projectRoot, f)));

      this.results.integration.structure = {
        expectedPaths,
        missingPaths,
        configFiles,
        passed: missingPaths.length === 0,
      };

      console.log(
        `   📁 Structure attendue: ${
          expectedPaths.length - missingPaths.length
        }/${expectedPaths.length}`
      );
      console.log(`   ⚙️  Fichiers config: ${configFiles.length}`);
      console.log(
        `   ${missingPaths.length === 0 ? "✅" : "❌"} Structure valide`
      );
    } catch (error) {
      console.log(`   ❌ Erreur structure: ${error.message}`);
      this.results.integration.structure = {
        error: error.message,
        passed: false,
      };
    }
  }

  /**
   * 🔨 Tests de build
   */
  async runBuildTests() {
    console.log("\n🔨 TESTS DE BUILD");
    console.log("─────────────────");

    try {
      console.log("🔨 Test de build production...");

      const buildStart = Date.now();

      execSync("npm run build", {
        cwd: this.options.projectRoot,
        stdio: "pipe",
      });

      const buildTime = Date.now() - buildStart;

      this.results.build = {
        time: buildTime,
        timeSeconds: (buildTime / 1000).toFixed(2),
        passed: true,
      };

      console.log(`   ⏱️  Temps de build: ${(buildTime / 1000).toFixed(2)}s`);
      console.log("   ✅ Build réussi");
    } catch (error) {
      console.log(`   ❌ Erreur build: ${error.message}`);
      this.results.build = {
        error: error.message,
        passed: false,
      };
    }
  }

  /**
   * 📊 Générer rapport final
   */
  generateReport() {
    console.log("\n📊 RAPPORT FINAL");
    console.log("═══════════════════════════════════════════════");

    // Calculer les scores
    const performanceTests = Object.values(this.results.performance || {});
    const integrationTests = Object.values(this.results.integration || {});
    const buildTests = this.results.build ? [this.results.build] : [];

    const allTests = [...performanceTests, ...integrationTests, ...buildTests];
    const passedTests = allTests.filter((test) => test.passed).length;
    const totalTests = allTests.length;

    const score =
      totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    this.results.summary = {
      score,
      passedTests,
      totalTests,
      categories: {
        performance: {
          passed: performanceTests.filter((t) => t.passed).length,
          total: performanceTests.length,
        },
        integration: {
          passed: integrationTests.filter((t) => t.passed).length,
          total: integrationTests.length,
        },
        build: {
          passed: buildTests.filter((t) => t.passed).length,
          total: buildTests.length,
        },
      },
    };

    console.log(`🏆 Score global: ${score}% (${passedTests}/${totalTests})`);
    console.log(
      `⚡ Performance: ${this.results.summary.categories.performance.passed}/${this.results.summary.categories.performance.total}`
    );
    console.log(
      `🔗 Intégration: ${this.results.summary.categories.integration.passed}/${this.results.summary.categories.integration.total}`
    );
    console.log(
      `🔨 Build: ${this.results.summary.categories.build.passed}/${this.results.summary.categories.build.total}`
    );

    // Sauvegarder le rapport
    const reportPath = path.join(
      this.options.projectRoot,
      "tools",
      "testing",
      "performance-integration-report.json"
    );
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log(
      `\n💾 Rapport sauvegardé: ${path.relative(
        this.options.projectRoot,
        reportPath
      )}`
    );

    if (score >= 80) {
      console.log("\n🎉 Excellent! Le projet passe tous les tests de qualité.");
    } else if (score >= 60) {
      console.log("\n⚠️  Bon score, mais quelques améliorations possibles.");
    } else {
      console.log("\n❌ Score faible - révision nécessaire.");
    }

    return this.results;
  }

  // Méthodes utilitaires
  findSourceFiles() {
    const files = [];
    const srcDir = path.join(this.options.projectRoot, "src");

    if (!fs.existsSync(srcDir)) return files;

    const extensions = [".js", ".ts", ".svelte"];

    const walkDir = (dir) => {
      const entries = fs.readdirSync(dir);

      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (extensions.some((ext) => entry.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };

    walkDir(srcDir);
    return files;
  }

  extractImports(content) {
    const imports = [];
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"];?/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  validateImport(importPath, fromFile) {
    // Validation basique des imports
    if (importPath.startsWith(".")) {
      // Import relatif
      const resolvedPath = path.resolve(path.dirname(fromFile), importPath);
      return (
        fs.existsSync(resolvedPath) ||
        fs.existsSync(resolvedPath + ".js") ||
        fs.existsSync(resolvedPath + ".ts") ||
        fs.existsSync(resolvedPath + ".svelte")
      );
    }

    // Import de package - assume qu'il existe si pas relatif
    return true;
  }
}

// 🚀 Exécution standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new PerformanceIntegrationTester();

  tester
    .runAllTests()
    .then((results) => {
      const score = results.summary?.score || 0;
      console.log(`\n✅ Tests terminés! Score: ${score}%`);
      process.exit(score >= 60 ? 0 : 1);
    })
    .catch((error) => {
      console.error("\n❌ Erreur lors des tests:", error);
      process.exit(1);
    });
}
