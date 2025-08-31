#!/usr/bin/env node
/**
 * 🔍 Roadmap Checker - Validation de cohérence multi-niveaux
 * @description Vérifie l'alignement entre ROADMAP principal, automation et phases
 * @criticality HIGH - Assure la cohérence documentaire
 */

const fs = require("fs");
const path = require("path");

class RoadmapChecker {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.roadmapMain = this.loadRoadmap("roadmap/ROADMAP_LEARNING.md");
    this.roadmapAuto = this.loadRoadmap(
      "roadmap/ROADMAP_AUTOMATISATIONS_TECHNIQUES.md"
    );
    this.roadmapSummary = this.loadRoadmap(
      "roadmap/ROADMAP_LEARNING_SUMMARY.md"
    );
    this.phases = this.loadPhases();
  }

  // Validation de cohérence multi-niveaux
  async validateAlignment() {
    console.log("🔍 Validation cohérence roadmap multi-niveaux...");

    const checks = [
      this.checkPhaseConsistency(),
      this.checkCommandsConsistency(),
      this.checkAutomationAlignment(),
      this.checkSummarySync(),
    ];

    const results = await Promise.all(checks);
    const allPassed = results.every((r) => r.success);

    this.generateAlignmentReport(results, allPassed);
    return allPassed;
  }

  // Vérification cohérence des phases
  checkPhaseConsistency() {
    console.log("📋 Vérification cohérence phases...");
    const mainPhases = this.extractPhases(this.roadmapMain);
    const summaryPhases = this.extractPhases(this.roadmapSummary);

    const mismatches = mainPhases.filter((p) => !summaryPhases.includes(p));

    return {
      name: "Phase Consistency",
      success: mismatches.length === 0,
      details: mismatches.length
        ? `Phases manquantes: ${mismatches.join(", ")}`
        : "Toutes les phases alignées",
    };
  }

  // Vérification cohérence des commandes npm
  checkCommandsConsistency() {
    console.log("⚙️ Vérification commandes npm...");
    const packageJsonPath = path.join(this.projectRoot, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
      return {
        name: "Commands Consistency",
        success: false,
        details: "package.json introuvable",
      };
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const scripts = Object.keys(packageJson.scripts || {});

    const requiredScripts = [
      "dev:ia",
      "quality:gates",
      "validate",
      "test:critical",
    ];
    const missing = requiredScripts.filter((s) => !scripts.includes(s));

    return {
      name: "Commands Consistency",
      success: missing.length === 0,
      details: missing.length
        ? `Scripts manquants: ${missing.join(", ")}`
        : "Tous les scripts présents",
    };
  }

  // Vérification alignement automation
  checkAutomationAlignment() {
    console.log("🤖 Vérification alignement automation...");
    const hasAutomationRoadmap = this.roadmapAuto.length > 0;
    const hasDevIaScript =
      this.roadmapMain.includes("npm run dev:ia") ||
      this.roadmapSummary.includes("npm run dev:ia");

    return {
      name: "Automation Alignment",
      success: hasAutomationRoadmap && hasDevIaScript,
      details:
        hasAutomationRoadmap && hasDevIaScript
          ? "Roadmap automation aligné avec roadmap principal"
          : "Alignement automation incomplet",
    };
  }

  // Vérification synchronisation summary
  checkSummarySync() {
    console.log("📄 Vérification synchronisation summary...");
    const hasSummary = this.roadmapSummary.length > 0;
    const hasOrchestration = this.roadmapSummary.includes(
      "Orchestration Workflow"
    );

    return {
      name: "Summary Sync",
      success: hasSummary && hasOrchestration,
      details:
        hasSummary && hasOrchestration
          ? "Summary synchronisé avec orchestration documentée"
          : "Summary nécessite mise à jour orchestration",
    };
  }

  generateAlignmentReport(results, success) {
    console.log("\n📊 RAPPORT DE COHÉRENCE ROADMAP:");
    console.log(
      `Status Global: ${success ? "✅ CONFORME" : "❌ NON-CONFORME"}`
    );
    console.log("─".repeat(50));

    results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      console.log(`${status} ${result.name}: ${result.details}`);
    });

    if (!success) {
      console.log("\n💡 ACTIONS RECOMMANDÉES:");
      console.log(
        "🔧 Vérifier la cohérence entre les différents niveaux de roadmap"
      );
      console.log("🔧 Compléter les scripts manquants dans package.json");
      console.log("🔧 Mettre à jour la documentation d'orchestration");
    }
  }

  // Utilitaires
  loadRoadmap(filePath) {
    const fullPath = path.join(this.projectRoot, filePath);
    return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : "";
  }

  loadPhases() {
    const phasesDir = path.join(this.projectRoot, "roadmap/phases");
    if (!fs.existsSync(phasesDir)) return [];

    return fs
      .readdirSync(phasesDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(".md", ""));
  }

  extractPhases(content) {
    const phaseRegex = /phase[- ]?(\d+)/gi;
    const matches = content.match(phaseRegex) || [];
    return [...new Set(matches)];
  }
}

// CLI Interface
if (require.main === module) {
  const checker = new RoadmapChecker();
  checker
    .validateAlignment()
    .then((success) => {
      console.log(
        `\n🎯 Résultat: ${
          success ? "COHÉRENCE VALIDÉE" : "CORRECTIONS NÉCESSAIRES"
        }`
      );
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("🚨 Erreur lors de la validation:", error);
      process.exit(1);
    });
}

module.exports = RoadmapChecker;
