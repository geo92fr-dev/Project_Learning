#!/usr/bin/env node

/**
 * 🔍 Audit Complet - Vérification Implémentation Roadmap
 * Validation de tous les sujets précédents selon ROADMAP_AUTOMATISATIONS_TECHNIQUES
 */

import fs from "fs";
import path from "path";

class RoadmapImplementationAuditor {
  constructor() {
    this.projectRoot = process.cwd();
    this.auditResults = {
      phase1: { completed: [], missing: [] },
      phase2: { completed: [], missing: [] },
      phase3: { completed: [], missing: [] },
      summary: {},
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 🚀 Audit complet de l'implémentation
   */
  async runCompleteAudit() {
    console.log("🔍 AUDIT COMPLET - VÉRIFICATION IMPLÉMENTATION ROADMAP");
    console.log("═══════════════════════════════════════════════════════");

    // Phase 1 - Fondations CBD
    await this.auditPhase1();

    // Phase 2 - Intelligence Contextuelle
    await this.auditPhase2();

    // Phase 3 - Automatisation Complète
    await this.auditPhase3();

    // Génération rapport final
    this.generateComprehensiveReport();

    return this.auditResults;
  }

  /**
   * ✅ Audit Phase 1 - Fondations CBD
   */
  async auditPhase1() {
    console.log("\n✅ PHASE 1 - FONDATIONS CBD");
    console.log("─────────────────────────────");

    const phase1Items = [
      {
        name: "Orchestrateur Central Dev:IA",
        files: ["MyDevFramework/core/quality/VALID_CheckBeforeDoing.js"],
        scripts: ["dev:ia"],
        description: "Workflow automatisé complet avec 9 étapes",
      },
      {
        name: "Quality Gates Automatisées",
        files: [
          "MyDevFramework/core/quality/VALID_environment.js",
          "MyDevFramework/core/quality/VALID_structure.js",
        ],
        scripts: ["quality:check"],
        description: "Seuils configurables avec métaparamètres",
      },
      {
        name: "Génération Documentation Automatique",
        files: [
          "MyDevFramework/docs/README.md",
          "MyDevFramework/docs/DOC_COVERAGE.md",
        ],
        scripts: ["docs:generate"],
        description: "README automatiques avec classification criticité",
      },
      {
        name: "Post-Mortem Auto-Apprenant",
        files: ["MyDevFramework/docs/LOG_POSTMORTEM.md"],
        scripts: ["postmortem:analyze"],
        description: "Analyse patterns erreurs avec ML",
      },
      {
        name: "Validation Prompts Obligatoire",
        files: ["MyDevFramework/docs/DOC_CoPilot_Practices.md"],
        scripts: [],
        description: "Format CBD strict avec validation spéciale URL",
      },
      {
        name: "Gestion Déviations Roadmap",
        files: ["MyDevFramework/core/quality/VALID_roadmap_compliance.js"],
        scripts: ["roadmap:validate"],
        description: "Détection écarts avec processus analyse impact",
      },
      {
        name: "Alignement Roadmap 3 Niveaux",
        files: ["roadmap/ROADMAP_AUTOMATISATIONS_TECHNIQUES.md"],
        scripts: ["roadmap:sync"],
        description: "Validation croisée Summary ↔ Main ↔ Phase",
      },
    ];

    for (const item of phase1Items) {
      const status = await this.checkImplementationStatus(item);
      console.log(`   ${status.symbol} ${item.name}`);

      if (status.implemented) {
        this.auditResults.phase1.completed.push(item);
      } else {
        this.auditResults.phase1.missing.push({
          ...item,
          issues: status.issues,
        });
      }
    }
  }

  /**
   * 🔵 Audit Phase 2 - Intelligence Contextuelle
   */
  async auditPhase2() {
    console.log("\n🔵 PHASE 2 - INTELLIGENCE CONTEXTUELLE");
    console.log("─────────────────────────────────────");

    const phase2Items = [
      {
        name: "Extension VS Code Spécialisée FunLearning",
        files: ["extensions/vscode-funlearning-cbd/package.json"],
        scripts: ["build:extension"],
        description: "Validation temps réel prompts CBD avec contexte",
      },
      {
        name: "Templates Dynamiques FunLearning",
        files: ["tools/templates/template-engine.js"],
        scripts: ["templates:generate"],
        description:
          "Templates adaptatifs par phase avec génération contextuelle",
      },
      {
        name: "Dashboard Métriques Temps Réel",
        files: ["tools/dashboard/metrics-dashboard.js"],
        scripts: ["dashboard:start"],
        description: "Interface web temps réel avec métriques avancées",
      },
    ];

    for (const item of phase2Items) {
      const status = await this.checkImplementationStatus(item);
      console.log(`   ${status.symbol} ${item.name}`);

      if (status.implemented) {
        this.auditResults.phase2.completed.push(item);
      } else {
        this.auditResults.phase2.missing.push({
          ...item,
          issues: status.issues,
        });
      }
    }
  }

  /**
   * 🟢 Audit Phase 3 - Automatisation Complète
   */
  async auditPhase3() {
    console.log("\n🟢 PHASE 3 - AUTOMATISATION COMPLÈTE");
    console.log("───────────────────────────────────");

    const phase3Items = [
      {
        name: "Auto-Génération Tests Intelligente",
        files: [
          "tools/testing/test-generator.js",
          "tools/testing/code-analyzer.js",
          "tools/testing/simple-test-generator.js",
        ],
        scripts: ["test:generate"],
        description: "Génération tests basée sur analyse code",
      },
      {
        name: "Templates Tests Avancés",
        files: [
          "tools/testing/templates/component-test.template.js",
          "tools/testing/templates/unit-test.template.js",
          "tools/testing/templates/store-test.template.js",
          "tools/testing/templates/e2e-test.template.js",
        ],
        scripts: [],
        description: "Templates spécialisés pour tous types de tests",
      },
      {
        name: "Performance & Integration Tester",
        files: ["tools/testing/performance-tester.js"],
        scripts: ["test:performance"],
        description: "Tests performance, intégration et qualité",
      },
      {
        name: "Tests Auto-Générés Fonctionnels",
        files: ["tests/auto-generated/"],
        scripts: ["test:auto"],
        description: "Suite de tests automatiquement générés",
      },
      {
        name: "Validation Tools Phase 3.1",
        files: ["tests/validation/phase3-tools-validation.test.js"],
        scripts: [],
        description: "Validation complète des outils de génération",
      },
      {
        name: "CI/CD Intelligent avec Learning",
        files: [".github/workflows/intelligent-ci.yml"],
        scripts: ["ci:intelligent"],
        description: "Pipeline adaptatif avec tests sélectifs",
      },
      {
        name: "Maintenance Tests Automatique",
        files: ["tools/testing/test-maintainer.js"],
        scripts: ["test:maintain"],
        description: "Mise à jour tests lors changements code",
      },
    ];

    for (const item of phase3Items) {
      const status = await this.checkImplementationStatus(item);
      console.log(`   ${status.symbol} ${item.name}`);

      if (status.implemented) {
        this.auditResults.phase3.completed.push(item);
      } else {
        this.auditResults.phase3.missing.push({
          ...item,
          issues: status.issues,
        });
      }
    }
  }

  /**
   * 🔍 Vérifier statut d'implémentation d'un élément
   */
  async checkImplementationStatus(item) {
    const issues = [];
    let filesExist = 0;
    let scriptsExist = 0;

    // Vérifier fichiers
    for (const filePath of item.files) {
      const fullPath = path.join(this.projectRoot, filePath);
      if (fs.existsSync(fullPath)) {
        filesExist++;
      } else {
        issues.push(`Fichier manquant: ${filePath}`);
      }
    }

    // Vérifier scripts package.json
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    let packageJson = {};

    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    }

    for (const script of item.scripts) {
      if (packageJson.scripts && packageJson.scripts[script]) {
        scriptsExist++;
      } else if (script !== "") {
        issues.push(`Script manquant: ${script}`);
      }
    }

    // Déterminer le statut
    const totalFiles = item.files.length;
    const totalScripts = item.scripts.filter((s) => s !== "").length;
    const filesRatio = totalFiles > 0 ? filesExist / totalFiles : 1;
    const scriptsRatio = totalScripts > 0 ? scriptsExist / totalScripts : 1;

    const implemented = filesRatio >= 0.5 && scriptsRatio >= 0.5;
    const symbol = implemented ? "✅" : "❌";

    return {
      implemented,
      symbol,
      issues,
      stats: {
        files: `${filesExist}/${totalFiles}`,
        scripts: `${scriptsExist}/${totalScripts}`,
      },
    };
  }

  /**
   * 📊 Générer rapport compréhensif
   */
  generateComprehensiveReport() {
    console.log("\n📊 RAPPORT COMPLET D'IMPLÉMENTATION");
    console.log("═══════════════════════════════════════");

    // Calculer les statistiques
    const phase1Stats = this.calculatePhaseStats(this.auditResults.phase1);
    const phase2Stats = this.calculatePhaseStats(this.auditResults.phase2);
    const phase3Stats = this.calculatePhaseStats(this.auditResults.phase3);

    console.log("\n📈 STATISTIQUES PAR PHASE:");
    console.log(
      `✅ Phase 1 (Fondations CBD): ${phase1Stats.completion}% (${phase1Stats.completed}/${phase1Stats.total})`
    );
    console.log(
      `🔵 Phase 2 (Intelligence): ${phase2Stats.completion}% (${phase2Stats.completed}/${phase2Stats.total})`
    );
    console.log(
      `🟢 Phase 3 (Automatisation): ${phase3Stats.completion}% (${phase3Stats.completed}/${phase3Stats.total})`
    );

    // Score global
    const totalCompleted =
      phase1Stats.completed + phase2Stats.completed + phase3Stats.completed;
    const totalItems =
      phase1Stats.total + phase2Stats.total + phase3Stats.total;
    const globalScore = Math.round((totalCompleted / totalItems) * 100);

    console.log(
      `\n🏆 SCORE GLOBAL: ${globalScore}% (${totalCompleted}/${totalItems})`
    );

    // Recommandations
    console.log("\n🎯 RECOMMANDATIONS:");

    if (phase1Stats.completion < 100) {
      console.log(
        "   🔴 Priorité HAUTE: Finaliser Phase 1 (Fondations critiques)"
      );
      this.auditResults.phase1.missing.forEach((item) => {
        console.log(`     - ${item.name}`);
      });
    }

    if (phase3Stats.completion >= 70) {
      console.log("   🟢 Phase 3 bien avancée: Continuer les optimisations");
    } else if (phase1Stats.completion >= 80) {
      console.log("   🟡 Prêt pour Phase 3: Lancer auto-génération tests");
    }

    // Sauvegarder le rapport
    this.auditResults.summary = {
      globalScore,
      phase1: phase1Stats,
      phase2: phase2Stats,
      phase3: phase3Stats,
      totalCompleted,
      totalItems,
    };

    const reportPath = path.join(
      this.projectRoot,
      "tools",
      "audit",
      "implementation-audit-report.json"
    );

    // Créer le répertoire si nécessaire
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(this.auditResults, null, 2));
    console.log(
      `\n💾 Rapport détaillé sauvegardé: ${path.relative(
        this.projectRoot,
        reportPath
      )}`
    );

    // Actions recommandées
    this.generateActionPlan();
  }

  /**
   * 📊 Calculer statistiques d'une phase
   */
  calculatePhaseStats(phase) {
    const completed = phase.completed.length;
    const total = completed + phase.missing.length;
    const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, completion };
  }

  /**
   * 📋 Générer plan d'action
   */
  generateActionPlan() {
    console.log("\n📋 PLAN D'ACTION RECOMMANDÉ:");
    console.log("─────────────────────────────");

    const phase1Missing = this.auditResults.phase1.missing;
    const phase2Missing = this.auditResults.phase2.missing;
    const phase3Missing = this.auditResults.phase3.missing;

    if (phase1Missing.length > 0) {
      console.log("\n🔴 ÉTAPE 1 - Finaliser Fondations:");
      phase1Missing.slice(0, 3).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}`);
        if (item.issues.length > 0) {
          console.log(`      Issues: ${item.issues.slice(0, 2).join(", ")}`);
        }
      });
    }

    if (phase3Missing.length > 0) {
      console.log("\n🟢 ÉTAPE 2 - Compléter Phase 3 (En cours):");
      phase3Missing.slice(0, 3).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}`);
      });
    }

    if (phase2Missing.length > 0) {
      console.log("\n🔵 ÉTAPE 3 - Phase 2 (Futur):");
      phase2Missing.slice(0, 2).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}`);
      });
    }

    console.log("\n💡 PROCHAINES ACTIONS SUGGÉRÉES:");

    const phase3Stats = this.calculatePhaseStats(this.auditResults.phase3);
    if (phase3Stats.completion >= 70) {
      console.log(
        "   🚀 Phase 3.1 est bien avancée - Continuer vers Phase 3.2 (CI/CD Intelligence)"
      );
      console.log(
        "   🎯 Objectifs Phase 3.2: Pipeline adaptatif + Monitoring continu"
      );
    } else {
      console.log("   🔧 Compléter les éléments manquants de Phase 3.1");
      console.log("   📝 Tester les outils auto-générés existants");
    }
  }
}

// 🚀 Exécution
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new RoadmapImplementationAuditor();

  auditor
    .runCompleteAudit()
    .then((results) => {
      const score = results.summary?.globalScore || 0;
      console.log(`\n✅ Audit terminé! Score global: ${score}%`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Erreur lors de l'audit:", error);
      process.exit(1);
    });
}
