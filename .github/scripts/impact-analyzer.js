#!/usr/bin/env node

/**
 * 🎯 Impact Analyzer - Système d'Analyse d'Impact Intelligent
 * Phase 3.2 - CI/CD Intelligence pour FunLearning
 *
 * Analyse les changements de code pour déterminer:
 * - Zones d'impact technique
 * - Impact éducatif selon niveaux scolaires
 * - Stratégies de test optimales
 * - Priorités de déploiement
 */

import { promises as fs } from "fs";
import path from "path";
import { execSync } from "child_process";

class FunLearningImpactAnalyzer {
  constructor() {
    this.config = {
      educational_levels: ["6eme", "5eme", "4eme", "3eme"],
      impact_zones: {
        "src/routes/": "frontend",
        "src/lib/": "core",
        "src/components/": "frontend",
        "src/educational/": "educational",
        "src/stores/": "state",
        "firebase.js": "backend",
        "package.json": "dependencies",
        "svelte.config.js": "config",
        "vite.config.js": "build",
        ".github/": "ci",
        "docs/": "documentation",
      },
      educational_impact_patterns: {
        vocabulaire: ["educational", "content"],
        exercice: ["educational", "interaction"],
        competence: ["educational", "pedagogy"],
        evaluation: ["educational", "assessment"],
        niveau: ["educational", "progression"],
        feedback: ["educational", "interaction"],
        parcours: ["educational", "progression"],
        cbd: ["educational", "methodology"],
      },
      test_strategies: {
        low_impact: "selective",
        medium_impact: "educational-focus",
        high_impact: "extensive",
        critical_impact: "full",
      },
    };

    this.analysis_results = {
      changed_files: [],
      impact_zones: new Set(),
      educational_impact: {
        levels_affected: new Set(),
        areas_affected: new Set(),
        severity: "low",
      },
      recommended_strategy: "selective",
      deployment_risk: "low",
      testing_priorities: [],
    };
  }

  /**
   * 🔍 Analyse principale des changements
   */
  async analyzeChanges() {
    console.log("🎯 Démarrage analyse d'impact FunLearning...");

    try {
      // 1. Récupération des fichiers modifiés
      await this.getChangedFiles();

      // 2. Analyse impact technique
      await this.analyzeTechnicalImpact();

      // 3. Analyse impact éducatif
      await this.analyzeEducationalImpact();

      // 4. Détermination stratégie de test
      this.determineTestStrategy();

      // 5. Évaluation risque déploiement
      this.assessDeploymentRisk();

      // 6. Génération rapport
      await this.generateReport();

      console.log("✅ Analyse d'impact terminée");
    } catch (error) {
      console.error("❌ Erreur analyse d'impact:", error.message);
      process.exit(1);
    }
  }

  /**
   * 📂 Récupération des fichiers modifiés via Git
   */
  async getChangedFiles() {
    console.log("📂 Récupération fichiers modifiés...");

    try {
      // Fichiers modifiés depuis dernier commit
      const gitDiff = execSync("git diff --name-only HEAD~1 HEAD", {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();

      if (gitDiff) {
        this.analysis_results.changed_files = gitDiff
          .split("\n")
          .filter((f) => f.trim());
      }

      // Si pas de diff Git, analyser fichiers récemment modifiés
      if (this.analysis_results.changed_files.length === 0) {
        console.log("🔍 Recherche fichiers récemment modifiés...");
        const recentFiles = await this.findRecentlyModifiedFiles();
        this.analysis_results.changed_files = recentFiles;
      }

      console.log(
        `📁 ${this.analysis_results.changed_files.length} fichiers analysés:`,
        this.analysis_results.changed_files.slice(0, 5).join(", ") +
          (this.analysis_results.changed_files.length > 5 ? "..." : "")
      );
    } catch (error) {
      console.log("⚠️ Git diff non disponible, analyse fichiers existants...");
      this.analysis_results.changed_files =
        await this.findRecentlyModifiedFiles();
    }
  }

  /**
   * 🕐 Recherche fichiers récemment modifiés
   */
  async findRecentlyModifiedFiles() {
    const recentFiles = [];
    const srcDir = path.join(process.cwd(), "src");

    try {
      const files = await this.getAllFiles(srcDir);
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      for (const file of files) {
        try {
          const stats = await fs.stat(file);
          if (stats.mtime.getTime() > oneDayAgo) {
            recentFiles.push(path.relative(process.cwd(), file));
          }
        } catch (err) {
          // Ignorer fichiers inaccessibles
        }
      }
    } catch (error) {
      console.log("📁 Analyse répertoire src par défaut...");
    }

    return recentFiles.slice(0, 10); // Limiter à 10 fichiers max
  }

  /**
   * 📁 Récupération récursive des fichiers
   */
  async getAllFiles(dir) {
    const files = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith(".")) {
          files.push(...(await this.getAllFiles(fullPath)));
        } else if (entry.isFile() && this.isRelevantFile(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Répertoire inaccessible
    }

    return files;
  }

  /**
   * 📄 Vérification pertinence fichier
   */
  isRelevantFile(filename) {
    const relevantExtensions = [
      ".svelte",
      ".js",
      ".ts",
      ".json",
      ".md",
      ".yml",
      ".yaml",
    ];
    return relevantExtensions.some((ext) => filename.endsWith(ext));
  }

  /**
   * 🔧 Analyse impact technique
   */
  async analyzeTechnicalImpact() {
    console.log("🔧 Analyse impact technique...");

    for (const file of this.analysis_results.changed_files) {
      // Détermination zone d'impact par chemin
      for (const [pattern, zone] of Object.entries(this.config.impact_zones)) {
        if (file.includes(pattern)) {
          this.analysis_results.impact_zones.add(zone);
          break;
        }
      }

      // Analyse contenu si fichier accessible
      try {
        const content = await fs.readFile(file, "utf8");
        await this.analyzeFileContent(file, content);
      } catch (error) {
        console.log(`⚠️ Impossible de lire ${file}, analyse par nom seulement`);
        this.analyzeFileByName(file);
      }
    }

    console.log(
      "🎯 Zones d'impact détectées:",
      Array.from(this.analysis_results.impact_zones)
    );
  }

  /**
   * 📝 Analyse contenu fichier
   */
  async analyzeFileContent(filename, content) {
    const lowerContent = content.toLowerCase();

    // Détection patterns éducatifs
    for (const [pattern, impacts] of Object.entries(
      this.config.educational_impact_patterns
    )) {
      if (lowerContent.includes(pattern)) {
        impacts.forEach((impact) =>
          this.analysis_results.impact_zones.add(impact)
        );
      }
    }

    // Détection niveaux scolaires
    for (const level of this.config.educational_levels) {
      if (lowerContent.includes(level)) {
        this.analysis_results.educational_impact.levels_affected.add(level);
      }
    }

    // Patterns critiques
    const criticalPatterns = [
      "firebase",
      "auth",
      "database",
      "security",
      "api",
    ];
    for (const pattern of criticalPatterns) {
      if (lowerContent.includes(pattern)) {
        this.analysis_results.impact_zones.add("critical");
        break;
      }
    }
  }

  /**
   * 📂 Analyse fichier par nom
   */
  analyzeFileByName(filename) {
    const lowerFilename = filename.toLowerCase();

    // Patterns éducatifs dans noms de fichiers
    if (
      lowerFilename.includes("educational") ||
      lowerFilename.includes("pedagogie")
    ) {
      this.analysis_results.impact_zones.add("educational");
    }

    if (
      lowerFilename.includes("exercise") ||
      lowerFilename.includes("exercice")
    ) {
      this.analysis_results.impact_zones.add("educational");
      this.analysis_results.impact_zones.add("interaction");
    }

    // Détection niveaux dans noms
    for (const level of this.config.educational_levels) {
      if (lowerFilename.includes(level)) {
        this.analysis_results.educational_impact.levels_affected.add(level);
      }
    }
  }

  /**
   * 🎓 Analyse impact éducatif spécialisée
   */
  async analyzeEducationalImpact() {
    console.log("🎓 Analyse impact éducatif...");

    const educationalZones = Array.from(
      this.analysis_results.impact_zones
    ).filter((zone) =>
      ["educational", "content", "interaction", "pedagogy"].includes(zone)
    );

    if (educationalZones.length > 0) {
      this.analysis_results.educational_impact.areas_affected = new Set(
        educationalZones
      );

      // Détermination sévérité
      if (
        educationalZones.includes("pedagogy") ||
        educationalZones.length >= 3
      ) {
        this.analysis_results.educational_impact.severity = "high";
      } else if (educationalZones.length >= 2) {
        this.analysis_results.educational_impact.severity = "medium";
      } else {
        this.analysis_results.educational_impact.severity = "low";
      }
    }

    // Si aucun niveau détecté, affecter tous par sécurité
    if (
      this.analysis_results.educational_impact.levels_affected.size === 0 &&
      this.analysis_results.impact_zones.has("educational")
    ) {
      this.config.educational_levels.forEach((level) =>
        this.analysis_results.educational_impact.levels_affected.add(level)
      );
    }

    console.log("🎯 Impact éducatif:", {
      severity: this.analysis_results.educational_impact.severity,
      levels: Array.from(
        this.analysis_results.educational_impact.levels_affected
      ),
      areas: Array.from(
        this.analysis_results.educational_impact.areas_affected
      ),
    });
  }

  /**
   * 🧪 Détermination stratégie de test
   */
  determineTestStrategy() {
    console.log("🧪 Détermination stratégie de test...");

    const impactScore = this.calculateImpactScore();

    if (
      impactScore >= 8 ||
      this.analysis_results.impact_zones.has("critical")
    ) {
      this.analysis_results.recommended_strategy = "full";
      this.analysis_results.testing_priorities = [
        "critical",
        "security",
        "educational",
        "integration",
      ];
    } else if (
      impactScore >= 6 ||
      this.analysis_results.educational_impact.severity === "high"
    ) {
      this.analysis_results.recommended_strategy = "extensive";
      this.analysis_results.testing_priorities = [
        "educational",
        "integration",
        "e2e",
      ];
    } else if (
      impactScore >= 4 ||
      this.analysis_results.educational_impact.severity === "medium"
    ) {
      this.analysis_results.recommended_strategy = "educational-focus";
      this.analysis_results.testing_priorities = ["educational", "unit"];
    } else {
      this.analysis_results.recommended_strategy = "selective";
      this.analysis_results.testing_priorities = ["unit", "basic"];
    }

    console.log(
      `🎯 Stratégie recommandée: ${this.analysis_results.recommended_strategy} (score: ${impactScore})`
    );
  }

  /**
   * 📊 Calcul score d'impact
   */
  calculateImpactScore() {
    let score = 0;

    // Score zones d'impact
    const impactWeights = {
      critical: 4,
      backend: 3,
      educational: 3,
      frontend: 2,
      config: 2,
      core: 2,
      interaction: 2,
      pedagogy: 3,
      dependencies: 1,
      documentation: 1,
    };

    for (const zone of this.analysis_results.impact_zones) {
      score += impactWeights[zone] || 1;
    }

    // Score impact éducatif
    if (this.analysis_results.educational_impact.severity === "high")
      score += 3;
    else if (this.analysis_results.educational_impact.severity === "medium")
      score += 2;
    else if (this.analysis_results.educational_impact.severity === "low")
      score += 1;

    // Score niveaux affectés
    score += this.analysis_results.educational_impact.levels_affected.size;

    // Score nombre de fichiers
    if (this.analysis_results.changed_files.length > 10) score += 2;
    else if (this.analysis_results.changed_files.length > 5) score += 1;

    return Math.min(score, 10); // Cap à 10
  }

  /**
   * 🚀 Évaluation risque déploiement
   */
  assessDeploymentRisk() {
    console.log("🚀 Évaluation risque déploiement...");

    if (
      this.analysis_results.impact_zones.has("critical") ||
      this.analysis_results.impact_zones.has("backend")
    ) {
      this.analysis_results.deployment_risk = "high";
    } else if (
      this.analysis_results.educational_impact.severity === "high" ||
      this.analysis_results.impact_zones.has("educational")
    ) {
      this.analysis_results.deployment_risk = "medium";
    } else {
      this.analysis_results.deployment_risk = "low";
    }

    console.log(
      `🎯 Risque déploiement: ${this.analysis_results.deployment_risk}`
    );
  }

  /**
   * 📊 Génération rapport complet
   */
  async generateReport() {
    console.log("📊 Génération rapport d'impact...");

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        files_analyzed: this.analysis_results.changed_files.length,
        impact_zones: Array.from(this.analysis_results.impact_zones),
        recommended_strategy: this.analysis_results.recommended_strategy,
        deployment_risk: this.analysis_results.deployment_risk,
      },
      educational_impact: {
        severity: this.analysis_results.educational_impact.severity,
        levels_affected: Array.from(
          this.analysis_results.educational_impact.levels_affected
        ),
        areas_affected: Array.from(
          this.analysis_results.educational_impact.areas_affected
        ),
      },
      testing: {
        strategy: this.analysis_results.recommended_strategy,
        priorities: this.analysis_results.testing_priorities,
        estimated_duration: this.estimateTestDuration(),
      },
      files: this.analysis_results.changed_files,
      recommendations: this.generateRecommendations(),
    };

    // Sauvegarde rapport JSON
    await fs.writeFile("impact-analysis.json", JSON.stringify(report, null, 2));

    // Génération rapport Markdown
    await this.generateMarkdownReport(report);

    // Variables d'environnement pour GitHub Actions
    this.setGitHubOutputs();

    console.log("✅ Rapport généré: impact-analysis.json");
  }

  /**
   * 📝 Génération rapport Markdown
   */
  async generateMarkdownReport(report) {
    const markdown = `# 🎯 Rapport d'Impact FunLearning

**Date**: ${new Date().toLocaleString("fr-FR")}
**Fichiers analysés**: ${report.summary.files_analyzed}

## 🔍 Résumé Exécutif

| Métrique | Valeur |
|----------|--------|
| **Stratégie recommandée** | \`${report.summary.recommended_strategy}\` |
| **Risque déploiement** | \`${report.summary.deployment_risk}\` |
| **Zones d'impact** | ${report.summary.impact_zones.join(", ")} |

## 🎓 Impact Éducatif

- **Sévérité**: ${report.educational_impact.severity}
- **Niveaux affectés**: ${
      report.educational_impact.levels_affected.join(", ") || "Aucun"
    }
- **Domaines impactés**: ${
      report.educational_impact.areas_affected.join(", ") || "Aucun"
    }

## 🧪 Stratégie de Test

- **Stratégie**: ${report.testing.strategy}
- **Priorités**: ${report.testing.priorities.join(" → ")}
- **Durée estimée**: ${report.testing.estimated_duration}

## 📁 Fichiers Modifiés

${report.files.map((f) => `- \`${f}\``).join("\n")}

## 💡 Recommandations

${report.recommendations.map((r) => `- ${r}`).join("\n")}

---
*Rapport généré automatiquement par FunLearning Impact Analyzer v3.2*`;

    await fs.writeFile("impact-report.md", markdown);
  }

  /**
   * ⏱️ Estimation durée tests
   */
  estimateTestDuration() {
    const baseDurations = {
      selective: "5-8 min",
      "educational-focus": "8-12 min",
      extensive: "12-18 min",
      full: "18-25 min",
    };

    return (
      baseDurations[this.analysis_results.recommended_strategy] || "5-8 min"
    );
  }

  /**
   * 💡 Génération recommandations
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.analysis_results.impact_zones.has("educational")) {
      recommendations.push("🎓 Effectuer validation pédagogique approfondie");
    }

    if (this.analysis_results.impact_zones.has("backend")) {
      recommendations.push("🔥 Vérifier intégration Firebase et sécurité");
    }

    if (this.analysis_results.educational_impact.levels_affected.size > 2) {
      recommendations.push("📚 Tester sur plusieurs niveaux scolaires");
    }

    if (this.analysis_results.deployment_risk === "high") {
      recommendations.push("⚠️ Déploiement progressif recommandé");
    }

    if (this.analysis_results.impact_zones.has("frontend")) {
      recommendations.push("🎨 Tests accessibilité et responsive design");
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "✅ Changements à faible impact - processus standard"
      );
    }

    return recommendations;
  }

  /**
   * 🔧 Configuration sorties GitHub Actions
   */
  setGitHubOutputs() {
    if (process.env.GITHUB_OUTPUT) {
      const outputs = [
        `impact-zones=${Array.from(this.analysis_results.impact_zones).join(
          ","
        )}`,
        `test-strategy=${this.analysis_results.recommended_strategy}`,
        `deployment-risk=${this.analysis_results.deployment_risk}`,
        `educational-levels=${Array.from(
          this.analysis_results.educational_impact.levels_affected
        ).join(",")}`,
        `files-count=${this.analysis_results.changed_files.length}`,
      ];

      import("fs").then((fs) => {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, outputs.join("\n") + "\n");
      });
    }
  }
}

// 🚀 Exécution si appelé directement
const analyzer = new FunLearningImpactAnalyzer();
analyzer.analyzeChanges().catch(console.error);

export default FunLearningImpactAnalyzer;
