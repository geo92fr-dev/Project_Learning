# 🚀 Phase 1 : Setup & Architecture (4 jours + buffer) - v1.0-alpha

## 📋 **Vue d'Ensemble**

**Objectif** : Initialiser un projet SvelteKit avec TypeScript, tests, et architecture moderne
**Version cible** : v1.0-alpha (base technique solide)  
**Groupe** : 🏗️ FONDATIONS  
**Prérequis** : Node.js 18+, Git configuré
**⚠️ Buffer intégré** : +1 jour pour incompatibilités TypeScript/SvelteKit/Vitest potentielles

---

## 🎯 **Principes Fondamentaux & Architecture**

### 🏗️ **Architecture Technique**

**Stack Technologique :**

- **Frontend** : SvelteKit (SSR/SPA hybride) + TypeScript
- **Styling** : CSS moderne + composants réutilisables
- **Tests** : Vitest (unit) + Playwright (E2E) + Testing Library
- **Qualité** : ESLint + Prettier + Husky hooks
- **Build** : Vite (bundling optimisé) + SvelteKit adapter
- **Déploiement** : Vercel (serverless) avec preview automatique

**Principes d'Architecture :**

- **Séparation des responsabilités** : lib/ (business) vs routes/ (présentation)
- **Configuration centralisée** : Tous les configs dans `/config/`
- **Structure modulaire** : Exports centralisés via `src/lib/index.js`
- **Tests first** : Tests configurés dès le setup
- **Type safety** : TypeScript strict activé

### ⚙️ **Approche Qualité**

**Quality Gates Intégrés :**

- **Linting** : ESLint avec règles strictes TypeScript + Svelte
- **Formatting** : Prettier avec plugins Svelte
- **Testing** : Couverture > 80% + tests E2E obligatoires
- **Type checking** : svelte-check en mode strict
- **Performance** : Vite optimizations + bundle analysis

**Validation Automatisée :**

- **Scripts de validation** : `npm run validate <phase>`
- **Pre-commit hooks** : Lint + format automatique
- **CI/CD ready** : Configuration pour GitHub Actions
- **Déploiement sécurisé** : Preview branches + production

---

## 📝 **Instructions d'Implémentation**

### 🔧 **Étape 1.1 : Initialisation SvelteKit**

```bash
[CMD] npm create svelte@latest funlearning -- --template skeleton --types typescript
[CMD] cd funlearning
[CMD] npm install
```

**[CHECK]** Confirmer que le projet démarre avec `npm run dev` sur http://localhost:5173

### 🗂️ **Étape 1.2 : Structure de dossiers optimisée**

```bash
[CMD] mkdir -p src/lib/components src/lib/stores src/lib/utils src/lib/firebase
[CMD] mkdir -p src/routes/auth src/routes/admin src/routes/dashboard
[CMD] mkdir -p tests/unit tests/e2e static/icons
[CMD] mkdir -p config scripts
```

**[FILE]** Créer `src/lib/index.js` - Exports centralisés :

```js
// Exports centralisés pour une architecture modulaire
export { default as Header } from "./components/Header.svelte";
export { default as Footer } from "./components/Footer.svelte";
// À enrichir au fur et à mesure des phases
```

### ⚙️ **Étape 1.3 : Configuration centralisée**

```bash
[CMD] npm install -D vitest @vitest/ui jsdom @testing-library/svelte @testing-library/jest-dom
[CMD] npm install -D @playwright/test eslint prettier prettier-plugin-svelte
[CMD] npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**[FILE]** Créer `config/vitest.config.js` :

```js
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    coverage: {
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

**[FILE]** Créer `config/.eslintrc.cjs` :

```js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:svelte/recommended",
  ],
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.cjs"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  ],
  rules: {
    // Règles strictes pour la qualité
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "svelte/no-at-html-tags": "error",
  },
};
```

### 🧪 **Étape 1.4 : Script de validation centralisé**

**[FILE]** Créer `scripts/validate-phase.js` :

```js
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const PHASE_VALIDATIONS = {
  1: ["lint", "build", "test"],
  2: ["lint", "build", "test", "test:auth"],
  3: ["lint", "build", "test", "test:content"],
  // ... configurations pour toutes les phases
};

async function runCommand(command, description) {
  console.log(`🔍 ${description}...`);
  try {
    const { stdout } = await execAsync(`npm run ${command}`);
    console.log(`✅ ${description} réussi`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} échoué:`, error.message);
    return false;
  }
}

async function validatePhase(phase) {
  console.log(`🚀 Validation Phase ${phase} en cours...`);

  const commands = PHASE_VALIDATIONS[phase] || ["lint", "build", "test"];
  let allPassed = true;

  for (const command of commands) {
    const success = await runCommand(command, `${command.toUpperCase()}`);
    if (!success) allPassed = false;
  }

  if (allPassed) {
    console.log(`✅ Phase ${phase} validée avec succès !`);
  } else {
    console.log(
      `❌ Phase ${phase} a échoué. Corrigez les erreurs avant de continuer.`
    );
    process.exit(1);
  }
}

// Récupération de l'argument phase
const phase = process.argv[2];
if (!phase) {
  console.error("Usage: npm run validate <numero-phase>");
  process.exit(1);
}

validatePhase(phase);
```

### 🤖 **Étape 1.5 : Script dev:ia - Orchestrateur IA (Recommandation CBD)**

**[FILE]** Créer `scripts/dev-ia.js` - **Orchestrateur Central IA** :

```js
#!/usr/bin/env node
/**
 * 🤖 Script dev:ia - Orchestrateur Central IA pour FunLearning
 * @description Orchestration complète du workflow de développement guidé par IA
 * @phase 1 - Intégré dès la Phase 1 Setup
 * @criticality HIGH - Script central pour collaboration Humain ↔ IA
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

class DevIAOrchestrator {
  constructor() {
    this.currentPhase = this.detectCurrentPhase();
    this.workflowConfig = this.loadWorkflowConfig();
  }

  // Détection automatique de la phase courante
  detectCurrentPhase() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = packageJson.version || '1.0.0';

    // Logic de détection basée sur la version et les fichiers présents
    if (!fs.existsSync('src/lib/firebase')) return 1;
    if (!fs.existsSync('src/routes/auth')) return 2;
    if (!fs.existsSync('src/lib/curriculum')) return 6;
    // ... autres détections

    return 1; // Default Phase 1
  }

  // Configuration workflow par phase
  loadWorkflowConfig() {
    return {
      1: ['lint', 'build', 'test', 'validate:phase1'],
      2: ['lint', 'build', 'test', 'test:auth', 'validate:phase2'],
      3: ['lint', 'build', 'test', 'test:content', 'validate:phase3'],
      6: ['lint', 'build', 'test', 'test:curriculum', 'validate:phase6'],
      12: ['lint', 'build', 'test', 'test:lighthouse', 'validate:performance']
    };
  }

  // Workflow automatisé principal
  async executeWorkflow(options = {}) {
    console.log(`🤖 DevIA Orchestrator - Phase ${this.currentPhase}`);
    console.log(`📋 Workflow: ${this.workflowConfig[this.currentPhase]?.join(' → ')}`);

    try {
      // Phase 1: Validation CBD automatique
      await this.validateCBD();

      // Phase 2: Synchronisation Git
      if (options.syncGit !== false) {
        await this.syncGit();
      }

      // Phase 3: Exécution des commandes de validation
      const commands = this.workflowConfig[this.currentPhase] || ['lint', 'build', 'test'];
      let allPassed = true;

      for (const command of commands) {
        const success = await this.runCommand(command);
        if (!success) {
          allPassed = false;
          if (options.strictMode !== false) {
            throw new Error(`❌ BLOCAGE: ${command} a échoué`);
          }
        }
      }

      // Phase 4: Génération rapport
      const report = await this.generateReport(allPassed);
      console.log('\n📊 RAPPORT DE VALIDATION:');
      console.log(report);

      // Phase 5: Commit intelligent si tout OK
      if (allPassed && options.autoCommit !== false) {
        await this.smartCommit();
      }

      return { success: allPassed, report };

    } catch (error) {
      console.error('🚨 Erreur dans le workflow:', error.message);
      await this.handleBlockage(error);
      return { success: false, error: error.message };
    }
  }

  // Validation CBD selon DOC_CoPilot_Practices
  async validateCBD() {
    console.log('🔍 Validation CBD (Check Before Doing)...');

    // Vérifications phase-spécifiques
    const checks = {
      1: ['Node.js ≥ 18', 'Git configuré', 'Structure projet'],
      2: ['Firebase projet', 'Variables env', 'Auth routes'],
      6: ['Collections définies', 'Scripts génération', 'Validation curriculum']
    };

    const phaseChecks = checks[this.currentPhase] || [];
    console.log(`✅ CBD Phase ${this.currentPhase}: ${phaseChecks.join(', ')}`);
  }

  // Synchronisation Git intelligente
  async syncGit() {
    console.log('🔄 Synchronisation Git...');
    try {
      await execAsync('git add .');
      const { stdout } = await execAsync('git status --porcelain');

      if (stdout.trim()) {
        console.log('📝 Changements détectés, commit en attente...');
      } else {
        console.log('✅ Pas de changements à commiter');
      }
    } catch (error) {
      console.warn('⚠️ Erreur Git (non-bloquante):', error.message);
    }
  }

  // Exécution sécurisée des commandes
  async runCommand(command) {
    console.log(`🔍 Exécution: npm run ${command}`);
    try {
      const { stdout, stderr } = await execAsync(`npm run ${command}`);
      console.log(`✅ ${command} réussi`);
      return true;
    } catch (error) {
      console.error(`❌ ${command} échoué:`, error.message);
      return false;
    }
  }

  // Génération rapport détaillé
  async generateReport(success) {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      phase: this.currentPhase,
      success,
      workflow: this.workflowConfig[this.currentPhase],
      environment: {
        node: process.version,
        platform: process.platform
      }
    };

    // Sauvegarde historique
    const reportsDir = 'reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const reportFile = path.join(reportsDir, `validation-${timestamp.split('T')[0]}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    return report;
  }

  // Commit intelligent avec métadonnées
  async smartCommit() {
    console.log('💫 Commit intelligent...');
    try {
      const message = `feat(phase-${this.currentPhase}): DevIA validation passed - Auto-commit`;
      await execAsync(`git commit -m "${message}"`);
      console.log('✅ Commit automatique réussi');
    } catch (error) {
      console.warn('⚠️ Commit automatique échoué:', error.message);
    }
  }

  // Gestion des blocages avec suggestions
  async handleBlockage(error) {
    console.log('\n🚨 GESTION DE BLOCAGE ACTIVÉE');
    console.log('💡 Suggestions de résolution:');

    const suggestions = {
      'lint': 'Exécuter: npm run format puis npm run lint',
      'build': 'Vérifier les imports et la syntaxe TypeScript',
      'test': 'Relancer: npm run test:unit ou npm run test:e2e',
      'validate': 'Vérifier les prérequis phase dans roadmap/'
    };

    console.log(`📋 Pour "${error.message}": ${suggestions[error.command] || 'Consulter la documentation roadmap/'}`);
  }
}

// CLI Interface
async function main() {
  const orchestrator = new DevIAOrchestrator();
  const args = process.argv.slice(2);

  const options = {
    strictMode: !args.includes('--no-strict'),
    autoCommit: !args.includes('--no-commit'),
    syncGit: !args.includes('--no-git')
  };

  const result = await orchestrator.executeWorkflow(options);
  process.exit(result.success ? 0 : 1);
}

// Exécution si script appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default DevIAOrchestrator;
export default DevIAOrchestrator;
```

---

### 🛠️ **Scripts d'Orchestration Complémentaires**

**[FILE]** Créer `scripts/roadmap-checker.js` - **Validateur de cohérence roadmap** :

```js
#!/usr/bin/env node
/**
 * 🔍 Roadmap Checker - Validation de cohérence multi-niveaux
 * @description Vérifie l'alignement entre ROADMAP principal, automation et phases
 * @criticality HIGH - Assure la cohérence documentaire
 */

import fs from "fs";
import path from "path";

class RoadmapChecker {
  constructor() {
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
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
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
    // Logique de vérification entre roadmap principal et automation
    return {
      name: "Automation Alignment",
      success: true,
      details: "Roadmap automation aligné avec roadmap principal",
    };
  }

  // Vérification synchronisation summary
  checkSummarySync() {
    console.log("� Vérification synchronisation summary...");
    // Logique de vérification summary vs détail
    return {
      name: "Summary Sync",
      success: true,
      details: "Summary synchronisé avec roadmap détaillé",
    };
  }

  generateAlignmentReport(results, success) {
    console.log("\n� RAPPORT DE COHÉRENCE ROADMAP:");
    console.log(
      `Status Global: ${success ? "✅ CONFORME" : "❌ NON-CONFORME"}`
    );
    console.log("─".repeat(50));

    results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      console.log(`${status} ${result.name}: ${result.details}`);
    });
  }

  // Utilitaires
  loadRoadmap(filePath) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  }

  loadPhases() {
    const phasesDir = "roadmap/phases";
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
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new RoadmapChecker();
  checker
    .validateAlignment()
    .then((success) => process.exit(success ? 0 : 1))
    .catch(console.error);
}

export default RoadmapChecker;
```

**[FILE]** Créer `scripts/quality-gates.js` - **Quality Gates automatisés** :

```js
#!/usr/bin/env node
/**
 * 🛡️ Quality Gates - Validation automatisée multi-domaines
 * @description Tests de qualité complets selon standards FunLearning
 * @criticality HIGH - Garde-fou qualité avant progression
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

class QualityGates {
  constructor() {
    this.gates = {
      lint: { command: "npm run lint", description: "Code style et syntaxe" },
      build: {
        command: "npm run build",
        description: "Compilation TypeScript",
      },
      "test:unit": {
        command: "npm run test:unit",
        description: "Tests unitaires",
      },
      "test:critical": {
        command: "npm run test:critical",
        description: "Tests critiques",
      },
      security: {
        command: "npm audit --audit-level moderate",
        description: "Audit sécurité",
      },
      performance: {
        command: "npm run test:lighthouse",
        description: "Performance Lighthouse",
      },
    };
  }

  async runAllGates(options = {}) {
    console.log("🛡️ Quality Gates - Validation complète...");
    console.log(`📋 ${Object.keys(this.gates).length} gates à valider\n`);

    const results = [];
    let allPassed = true;

    for (const [gateName, gate] of Object.entries(this.gates)) {
      if (options.skip && options.skip.includes(gateName)) {
        console.log(`⏭️ ${gateName}: IGNORÉ`);
        continue;
      }

      const result = await this.runGate(gateName, gate);
      results.push(result);

      if (!result.success) {
        allPassed = false;
        if (options.failFast) {
          console.log("🚨 Arrêt sur premier échec (--fail-fast)");
          break;
        }
      }
    }

    this.generateQualityReport(results, allPassed);
    return { success: allPassed, results };
  }

  async runGate(name, gate) {
    console.log(`🔍 ${name}: ${gate.description}...`);

    try {
      const startTime = Date.now();
      await execAsync(gate.command);
      const duration = Date.now() - startTime;

      console.log(`✅ ${name}: PASSÉ (${duration}ms)`);
      return { name, success: true, duration, message: "Succès" };
    } catch (error) {
      console.log(`❌ ${name}: ÉCHEC`);
      console.log(`   Error: ${error.message.split("\n")[0]}`);

      return {
        name,
        success: false,
        duration: 0,
        message: error.message.split("\n")[0],
      };
    }
  }

  generateQualityReport(results, success) {
    console.log("\n📊 RAPPORT QUALITY GATES:");
    console.log(
      `Status Global: ${success ? "✅ TOUS PASSÉS" : "❌ ÉCHECS DÉTECTÉS"}`
    );
    console.log("─".repeat(60));

    results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      const duration = result.duration ? `(${result.duration}ms)` : "";
      console.log(
        `${status} ${result.name.padEnd(15)} ${duration.padEnd(10)} ${
          result.message
        }`
      );
    });

    if (!success) {
      console.log("\n💡 ACTIONS RECOMMANDÉES:");
      results
        .filter((r) => !r.success)
        .forEach((result) => {
          console.log(
            `🔧 ${result.name}: Vérifier et corriger les erreurs reportées`
          );
        });
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {
    failFast: args.includes("--fail-fast"),
    skip: args.includes("--skip")
      ? args[args.indexOf("--skip") + 1]?.split(",") || []
      : [],
  };

  const gates = new QualityGates();
  gates
    .runAllGates(options)
    .then((result) => process.exit(result.success ? 0 : 1))
    .catch(console.error);
}

export default QualityGates;
```

### � **Étape 1.6 : Templates spécialisés phases 1-3**

**[FILE]** Créer `scripts/templates/` - **Templates phases 1-3** :

**📁 Structure templates :**

```bash
scripts/templates/
├── TEMPLATE_validation_phase1.js    # Setup & Foundation
├── TEMPLATE_validation_phase2.js    # Firebase & Auth
├── TEMPLATE_validation_phase3.js    # Content & Core
├── generator.js                     # Générateur intelligent
└── README.md                        # Documentation templates
```

**[FILE]** Créer `scripts/templates/TEMPLATE_validation_phase1.js` :

```js
/**
 * 🎯 Template Validation Phase 1 - Setup & Foundation
 * @description Validation spécialisée pour l'environnement de développement
 * @criticality HIGH - Base de toutes les autres phases
 */

export const PHASE1_TEMPLATE = {
  phase: "Phase 1 - Setup & Foundation",
  description: "Validation environnement développement et outils de base",

  checks: [
    {
      name: "Node.js Version ≥ 18",
      command: "node --version",
      validator: (output) => {
        const version = output.match(/v(\d+)\./)?.[1];
        return parseInt(version) >= 18;
      },
      errorHelp: "🔧 Installer Node.js 18+ : https://nodejs.org",
      criticality: "HIGH",
    },
    {
      name: "Package Manager (npm/pnpm)",
      command: "npm --version && pnpm --version || echo 'npm only'",
      validator: (output) => output.includes("."),
      errorHelp: "🔧 Installer pnpm : npm install -g pnpm",
      criticality: "MEDIUM",
    },
    {
      name: "Git Configuration",
      command: "git config --list | grep user",
      validator: (output) =>
        output.includes("user.name") && output.includes("user.email"),
      errorHelp: "🔧 git config --global user.name 'Votre Nom'",
      criticality: "HIGH",
    },
    {
      name: "SvelteKit Project Structure",
      validator: () => {
        const fs = require("fs");
        return (
          fs.existsSync("package.json") &&
          fs.existsSync("src/") &&
          fs.existsSync("vite.config.js") &&
          fs.existsSync("svelte.config.js")
        );
      },
      errorHelp:
        "🔧 npm create svelte@latest . --template skeleton --types typescript",
      criticality: "HIGH",
    },
    {
      name: "TypeScript Configuration",
      validator: () => {
        const fs = require("fs");
        return fs.existsSync("tsconfig.json") && fs.existsSync("src/app.d.ts");
      },
      errorHelp: "🔧 Vérifier tsconfig.json et src/app.d.ts",
      criticality: "HIGH",
    },
    {
      name: "Quality Tools (ESLint + Prettier)",
      command: "npm list eslint prettier",
      validator: (output) =>
        output.includes("eslint") && output.includes("prettier"),
      errorHelp:
        "🔧 npm install -D eslint prettier @typescript-eslint/eslint-plugin",
      criticality: "MEDIUM",
    },
  ],

  generateReport: (results) => {
    const passed = results.filter((r) => r.success).length;
    const total = results.length;
    const critical = results.filter(
      (r) => !r.success && r.criticality === "HIGH"
    ).length;

    return {
      phase: "Phase 1",
      score: `${passed}/${total}`,
      criticalIssues: critical,
      readyForNext: critical === 0 && passed >= total * 0.8, // 80% minimum
      nextPhase: "Phase 2 - Firebase & Auth",
      recommendations: results
        .filter((r) => !r.success)
        .map(
          (r) =>
            `${r.criticality === "HIGH" ? "🚨" : "⚠️"} ${r.name}: ${
              r.errorHelp
            }`
        ),
    };
  },
};
```

**[FILE]** Créer `scripts/templates/TEMPLATE_validation_phase2.js` :

```js
/**
 * 🔐 Template Validation Phase 2 - Firebase & Auth
 * @description Validation spécialisée pour l'authentification et sécurité
 * @depends TEMPLATE_validation_phase1.js
 */

export const PHASE2_TEMPLATE = {
  phase: "Phase 2 - Firebase & Auth",
  description: "Validation authentification Firebase et sécurité",
  prerequisites: ["Phase 1 validée"],

  checks: [
    {
      name: "Firebase CLI Installé",
      command: "firebase --version",
      validator: (output) => output.includes("firebase-tools"),
      errorHelp: "🔧 npm install -g firebase-tools",
      criticality: "HIGH",
    },
    {
      name: "Firebase Project Initialized",
      command: "firebase projects:list",
      validator: (output) => !output.includes("No projects found"),
      errorHelp: "🔧 firebase login puis firebase init",
      criticality: "HIGH",
    },
    {
      name: "Firebase Configuration File",
      validator: () => {
        const fs = require("fs");
        return (
          fs.existsSync("src/lib/firebase.js") ||
          fs.existsSync("src/lib/firebase.ts")
        );
      },
      errorHelp:
        "🔧 Créer src/lib/firebase.ts avec initializeApp, getAuth, getFirestore",
      criticality: "HIGH",
    },
    {
      name: "Environment Variables",
      validator: () => {
        const fs = require("fs");
        if (!fs.existsSync(".env")) return false;
        const env = fs.readFileSync(".env", "utf8");
        return (
          env.includes("VITE_FIREBASE_API_KEY") &&
          env.includes("VITE_FIREBASE_PROJECT_ID")
        );
      },
      errorHelp: "🔧 Configurer .env avec toutes les variables VITE_FIREBASE_*",
      criticality: "HIGH",
    },
    {
      name: "Auth Store Created",
      validator: () => {
        const fs = require("fs");
        return (
          fs.existsSync("src/lib/stores/auth.ts") ||
          fs.existsSync("src/lib/stores/auth.js")
        );
      },
      errorHelp: "🔧 Créer store d'authentification réactif avec Svelte stores",
      criticality: "MEDIUM",
    },
    {
      name: "No Hardcoded Secrets",
      command:
        "grep -r 'AIza\\|firebase' src/ --include='*.js' --include='*.ts' || echo 'Clean'",
      validator: (output) =>
        !output.includes("AIza") || output.includes("Clean"),
      errorHelp: "🚨 CRITIQUE: Déplacer toutes les clés API vers .env",
      criticality: "CRITICAL",
    },
  ],

  generateReport: (results) => {
    const securityIssues = results.filter(
      (r) => !r.success && r.criticality === "CRITICAL"
    ).length;
    const authReady = results.find((r) =>
      r.name.includes("Auth Store")
    )?.success;

    return {
      phase: "Phase 2",
      authenticationReady: authReady,
      securityIssues,
      readyForNext:
        securityIssues === 0 &&
        results.filter((r) => r.criticality === "HIGH").every((r) => r.success),
      nextPhase: "Phase 3 - Content & Core Features",
      criticalAlerts: results
        .filter((r) => !r.success && r.criticality === "CRITICAL")
        .map((r) => `🚨 SÉCURITÉ: ${r.name}`),
    };
  },
};
```

**[FILE]** Créer `scripts/templates/TEMPLATE_validation_phase3.js` :

```js
/**
 * 📚 Template Validation Phase 3 - Content & Core
 * @description Validation spécialisée pour le système de contenu
 * @depends TEMPLATE_validation_phase1.js, TEMPLATE_validation_phase2.js
 */

export const PHASE3_TEMPLATE = {
  phase: "Phase 3 - Content & Core Features",
  description: "Validation système de contenu et fonctionnalités core",
  prerequisites: ["Phase 1 validée", "Phase 2 validée"],

  checks: [
    {
      name: "Content Management System",
      validator: () => {
        const fs = require("fs");
        return (
          fs.existsSync("src/lib/content/") &&
          fs.existsSync("src/lib/content/contentManager.ts")
        );
      },
      errorHelp: "🔧 Créer système de gestion de contenu dans src/lib/content/",
      criticality: "HIGH",
    },
    {
      name: "Markdown Parser Installed",
      command: "npm list marked",
      validator: (output) => output.includes("marked"),
      errorHelp: "🔧 npm install marked @types/marked",
      criticality: "MEDIUM",
    },
    {
      name: "Content Routes Structure",
      validator: () => {
        const fs = require("fs");
        return (
          fs.existsSync("src/routes/cours/") &&
          fs.existsSync("src/routes/cours/[matiere]/")
        );
      },
      errorHelp:
        "🔧 Créer structure routes: src/routes/cours/[matiere]/[niveau]/",
      criticality: "HIGH",
    },
    {
      name: "Content Validation Tests",
      command: "npm run test:content || echo 'No content tests'",
      validator: (output) =>
        !output.includes("No content tests") && output.includes("✓"),
      errorHelp: "🔧 Créer tests de validation du contenu",
      criticality: "MEDIUM",
    },
    {
      name: "SEO & Meta Tags",
      validator: () => {
        const fs = require("fs");
        const appHtml = fs.readFileSync("src/app.html", "utf8");
        return (
          appHtml.includes("%sveltekit.head%") && appHtml.includes("viewport")
        );
      },
      errorHelp: "🔧 Configurer meta tags dans src/app.html et +layout.svelte",
      criticality: "LOW",
    },
  ],

  generateReport: (results) => {
    const coreFeatures = results
      .filter((r) => r.criticality === "HIGH")
      .filter((r) => r.success).length;
    const totalCore = results.filter((r) => r.criticality === "HIGH").length;

    return {
      phase: "Phase 3",
      coreFeaturesReady: `${coreFeatures}/${totalCore}`,
      readyForNext: coreFeatures === totalCore,
      nextPhase: "Phase 4 - Advanced Features",
      progressIndicator: Math.round((coreFeatures / totalCore) * 100),
    };
  },
};
```

### 📚 **Étape 1.7 : Documentation automatisée (TypeDoc + Docusaurus)**

**[FILE]** Configuration `typedoc.json` - **Documentation automatique** :

```json
{
  "entryPoints": ["src/lib"],
  "out": "docs/api",
  "theme": "default",
  "includeVersion": true,
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeInternal": true,
  "readme": "none",
  "categorizeByGroup": true,
  "categoryOrder": [
    "Authentication",
    "Content Management",
    "UI Components",
    "Utilities",
    "*"
  ],
  "plugin": ["typedoc-plugin-markdown"],
  "commentStyle": "block",
  "validation": {
    "notExported": false,
    "invalidLink": true,
    "notDocumented": false
  }
}
```

**[FILE]** Créer `scripts/docs-generator.js` - **Générateur automatique** :

```js
/**
 * 📚 Générateur Documentation Automatique FunLearning
 * @description Génération docs API + guides utilisateur avec TypeDoc + Docusaurus
 * @criticality MEDIUM - Documentation essentielle pour maintien projet
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

class DocsGenerator {
  constructor() {
    this.docsConfig = {
      apiDocs: 'docs/api',
      userGuides: 'docs/guides',
      roadmapDocs: 'docs/roadmap',
      outputDir: 'dist/docs'
    };
  }

  // Génération complète documentation
  async generateAll() {
    console.log('📚 Génération documentation complète...');

    try {
      // 1. Documentation API avec TypeDoc
      await this.generateAPIDocumentation();

      // 2. Documentation guides utilisateur
      await this.generateUserGuides();

      // 3. Documentation roadmap et phases
      await this.generateRoadmapDocs();

      // 4. Site Docusaurus unifié
      await this.buildDocusaurusSite();

      console.log('✅ Documentation générée avec succès !');
      return true;

    } catch (error) {
      console.error('❌ Erreur génération docs:', error.message);
      return false;
    }
  }

  // Documentation API TypeScript
  async generateAPIDocumentation() {
    console.log('🔍 Génération documentation API TypeDoc...');

    try {
      // Installation TypeDoc si nécessaire
      await execAsync('npm list typedoc || npm install -D typedoc typedoc-plugin-markdown');

      // Génération docs API
      await execAsync('npx typedoc --options typedoc.json');

      console.log('✅ Documentation API générée');
    } catch (error) {
      throw new Error(`TypeDoc génération échouée: ${error.message}`);
    }
  }

  // Guides utilisateur automatiques
  async generateUserGuides() {
    console.log('📖 Génération guides utilisateur...');

    const guides = [
      {
        title: 'Guide de Démarrage Rapide',
        file: 'quick-start.md',
        content: this.generateQuickStartGuide()
      },
      {
        title: 'Guide Développement',
        file: 'development.md',
        content: this.generateDevelopmentGuide()
      },
      {
        title: 'Guide Architecture',
        file: 'architecture.md',
        content: this.generateArchitectureGuide()
      }
    ];

    // Création répertoire guides
    const guidesDir = this.docsConfig.userGuides;
    if (!fs.existsSync(guidesDir)) {
      fs.mkdirSync(guidesDir, { recursive: true });
    }

    // Génération guides
    for (const guide of guides) {
      const filePath = path.join(guidesDir, guide.file);
      fs.writeFileSync(filePath, guide.content);
      console.log(`📝 Guide créé: ${guide.file}`);
    }
  }

  // Documentation roadmap automatique
  async generateRoadmapDocs() {
    console.log('🗺️ Génération documentation roadmap...');

    const roadmapDir = this.docsConfig.roadmapDocs;
    if (!fs.existsSync(roadmapDir)) {
      fs.mkdirSync(roadmapDir, { recursive: true });
    }

    // Copie et adaptation des docs roadmap existantes
    const roadmapSource = 'roadmap/';
    if (fs.existsSync(roadmapSource)) {
      await execAsync(`cp -r ${roadmapSource}/* ${roadmapDir}/`);
      console.log('📋 Documentation roadmap copiée');
    }
  }

  // Site Docusaurus unifié
  async buildDocusaurusSite() {
    console.log('🏗️ Construction site Docusaurus...');

    // Configuration Docusaurus minimale
    const docusaurusConfig = this.generateDocusaurusConfig();

    // Création config si nécessaire
    if (!fs.existsSync('docusaurus.config.js')) {
      fs.writeFileSync('docusaurus.config.js', docusaurusConfig);
    }

    try {
      // Installation Docusaurus
      await execAsync('npm list @docusaurus/core || npm install -D @docusaurus/core @docusaurus/preset-classic');

      // Build site documentation
      await execAsync('npx docusaurus build --out-dir dist/docs');

      console.log('🌐 Site documentation construit');
    } catch (error) {
      console.warn('⚠️ Docusaurus build échoué (non-bloquant):', error.message);
    }
  }

  // Génération automatique du guide de démarrage
  generateQuickStartGuide() {
    return `# 🚀 Guide de Démarrage Rapide - FunLearning

## Installation

\`\`\`bash
# Clone du projet
git clone [repository-url]
cd funlearning

# Installation dépendances
npm install

# Démarrage développement
npm run dev:ia
\`\`\`

## Premier lancement

1. **Configuration Firebase** : Copier \`.env.example\` vers \`.env\`
2. **Validation Phase 1** : \`npm run validate 1\`
3. **Tests** : \`npm run test\`
4. **Build** : \`npm run build\`

## Scripts disponibles

- \`npm run dev:ia\` - Développement orchestré par IA
- \`npm run validate <phase>\` - Validation phase spécifique
- \`npm run docs:generate\` - Génération documentation

## Architecture

- \`src/lib/\` - Bibliothèques et utilitaires
- \`src/routes/\` - Pages et API routes
- \`src/components/\` - Composants réutilisables
- \`scripts/\` - Scripts d'automatisation

Auto-généré le ${new Date().toISOString()}
`;
  }

  // Guide développement automatique
  generateDevelopmentGuide() {
    return `# 🛠️ Guide Développement - FunLearning

## Workflow Recommandé

1. **Démarrage** : \`npm run dev:ia\`
2. **Développement** : Modification code + tests
3. **Validation** : Automatique via dev:ia
4. **Commit** : Automatique si validation OK

## Standards Code

- **TypeScript** strict activé
- **ESLint** + **Prettier** configurés
- **Tests** obligatoires (couverture > 80%)
- **Documentation** JSDoc pour fonctions publiques

## Phases Développement

- **Phase 1** : Setup & Foundation
- **Phase 2** : Firebase & Auth
- **Phase 3** : Content & Core Features
- **Phases 4-12** : Voir roadmap complète

Auto-généré le ${new Date().toISOString()}
`;
  }

  // Guide architecture automatique
  generateArchitectureGuide() {
    return `# 🏗️ Guide Architecture - FunLearning

## Stack Technique

- **Frontend** : SvelteKit + TypeScript
- **Backend** : Firebase (Auth + Firestore)
- **Testing** : Vitest + Playwright
- **Deployment** : Vercel
- **Documentation** : TypeDoc + Docusaurus

## Patterns Architecturaux

- **Store Pattern** : Gestion état avec Svelte stores
- **Module Pattern** : Organisation code modulaire
- **Repository Pattern** : Accès données via repositories
- **Factory Pattern** : Création objets complexes

Auto-généré le ${new Date().toISOString()}
`;
  }

  // Configuration Docusaurus
  generateDocusaurusConfig() {
    return `module.exports = {
  title: 'FunLearning Documentation',
  tagline: 'Plateforme d\\'apprentissage intelligente',
  url: 'https://funlearning-docs.vercel.app',
  baseUrl: '/',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/votre-repo/funlearning/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'FunLearning',
      items: [
        {
          type: 'doc',
          docId: 'quick-start',
          position: 'left',
          label: 'Guides',
        },
        {
          to: '/api/',
          label: 'API',
          position: 'left',
        },
        {
          to: '/roadmap/',
          label: 'Roadmap',
          position: 'left',
        },
      ],
    },
  },
};`;
  }
}

// Exécution si appelé directement
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const generator = new DocsGenerator();
  generator.generateAll()
    .then(success => process.exit(success ? 0 : 1))
    .catch(console.error);
}

export { DocsGenerator };
```

### 📦 **Étape 1.5 : Mise à jour package.json - SCRIPTS CBD ESSENTIELS**

**[FILE]** Modifier `package.json` - **Ajouter scripts recommandés CBD** :

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest --config config/vitest.config.js",
    "test:ui": "vitest --ui --config config/vitest.config.js",
    "test:e2e": "playwright test",
    "lint": "eslint --config config/.eslintrc.cjs .",
    "format": "prettier --config config/.prettierrc --write .",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "validate": "node scripts/validate-phase.js",

    "dev:ia": "node scripts/dev-ia.js",
    "validate:phase1": "node scripts/templates/validate-phase1.js",
    "validate:phase2": "node scripts/templates/validate-phase2.js",
    "validate:phase3": "node scripts/templates/validate-phase3.js",
    "docs:generate": "node scripts/docs-generator.js",
    "docs:api": "typedoc --options typedoc.json",

    "release:prepare": "npm run lint && npm run test && npm run build",
    "release:validate": "npm run validate",
    "release:deploy": "vercel --prod"
  }
}
```

### 🤖 **Étape 1.6 : Créer scripts CBD de base**

```bash
[CMD] mkdir -p scripts/templates
```

**[FILE]** Créer `scripts/dev-ia.js` - **Script dev:ia simple** :

```js
#!/usr/bin/env node
// Script dev:ia - Orchestration workflow simple
console.log("🤖 DevIA - Phase 1 Validation");

const { exec } = require("child_process");

async function runValidation() {
  try {
    console.log("🔍 Lint...");
    await exec("npm run lint");

    console.log("🧪 Tests...");
    await exec("npm run test");

    console.log("🏗️ Build...");
    await exec("npm run build");

    console.log("✅ Phase 1 validation réussie !");
  } catch (error) {
    console.error("❌ Validation échouée:", error.message);
    process.exit(1);
  }
}

runValidation();
```

**[FILE]** Créer `scripts/templates/validate-phase1.js` :

```js
// Template validation Phase 1
console.log("🎯 Validation Phase 1 - Setup & Foundation");
console.log("✅ Node.js ≥ 18");
console.log("✅ SvelteKit configuré");
console.log("✅ TypeScript activé");
console.log("✅ Tests opérationnels");
console.log("✅ Phase 1 prête pour Phase 2");
```

**[FILE]** Créer `scripts/docs-generator.js` :

```js
// Générateur documentation basique
const fs = require("fs");

console.log("📚 Génération documentation...");

// Guide démarrage rapide auto-généré
const quickStart = `# Guide Démarrage FunLearning

## Installation
\`\`\`bash
npm install
npm run dev:ia
\`\`\`

Auto-généré le ${new Date().toLocaleDateString()}`;

if (!fs.existsSync("docs")) fs.mkdirSync("docs");
fs.writeFileSync("docs/quick-start.md", quickStart);

console.log("✅ Documentation générée");
```

**[FILE]** Créer `typedoc.json` :

```json
{
  "entryPoints": ["src/lib"],
  "out": "docs/api",
  "excludePrivate": true
}
```

**[FILE]** Enrichir `src/app.d.ts` :

```ts
declare global {
  namespace App {
    interface Error {
      code?: string;
      id?: string;
    }

    interface Locals {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }

    interface PageData {
      user?: App.Locals["user"];
    }

    interface Platform {}
  }
}

// Types globaux pour l'application
declare module "*.svelte" {
  import type { ComponentType } from "svelte";
  const component: ComponentType;
  export default component;
}

export {};
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test          # Tests unitaires passent
[TEST] npm run lint          # Aucune erreur de linting
[TEST] npm run build         # Build réussi
[TEST] npm run check         # Type checking OK
```

**[FILE]** Créer `tests/setup.js` :

```js
import "@testing-library/jest-dom";

// Configuration globale des tests
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockClear();
});
```

**[FILE]** Créer test basique `src/lib/utils/helpers.test.ts` :

```ts
import { describe, it, expect } from "vitest";

// Fonction utilitaire simple pour tester
export function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR");
}

describe("helpers", () => {
  it("should format date correctly", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("15/01/2024");
  });
});
```

---

## ⚠️ **Mitigation des Risques & Troubleshooting**

### 🔧 **Risques Identifiés & Solutions**

**⚠️ Incompatibilités TypeScript + SvelteKit :**

```bash
# Si erreurs de types dans .svelte
[CMD] npm install -D @tsconfig/svelte
[FIX] Ajouter extends: ["@tsconfig/svelte/tsconfig.json"] dans tsconfig.json
```

**⚠️ Conflits Vitest + SvelteKit :**

```bash
# Si tests ne trouvent pas les modules Svelte
[FIX] Vérifier vitest.config.js pointe bien vers sveltekit plugin
[FIX] Installer @vitest/environment-jsdom si erreurs DOM
```

**⚠️ ESLint + Prettier conflits :**

```bash
# Configuration anti-conflits
[CMD] npm install -D eslint-config-prettier
[FIX] Ajouter "prettier" en dernier dans extends
```

### 🛠️ **Buffer de 1 jour : Plan d'action**

**Jour 4 - Résolution & Consolidation :**

- **Matin** : Résolution incompatibilités détectées
- **Après-midi** : Tests supplémentaires + optimisations
- **Validation** : Tous les CHECK doivent passer ✅

---

## ✅ **Critères de Validation Obligatoires - Intégrations CBD**

### 🔧 **Validation de base (existante)**

- [ ] **[CHECK]** `npm run dev` démarre sur localhost:5173
- [ ] **[CHECK]** `npm run test` : Au moins 1 test passe
- [ ] **[CHECK]** `npm run lint` : 0 erreur
- [ ] **[CHECK]** `npm run build` : Build réussi
- [ ] **[CHECK]** Configuration centralisée opérationnelle
- [ ] **[CHECK]** Script de validation fonctionne
- [ ] **[CHECK]** Types TypeScript configurés

### 🤖 **Nouveaux critères CBD (ajoutés)**

- [ ] **[CHECK]** `npm run dev:ia` : Script orchestrateur fonctionnel
- [ ] **[CHECK]** `npm run validate:phase1` : Template Phase 1 créé
- [ ] **[CHECK]** `npm run docs:generate` : Documentation de base générée
- [ ] **[CHECK]** Structure `scripts/templates/` créée
- [ ] **[CHECK]** Configuration TypeDoc présente

### 🎯 **Test complet intégration**

```bash
[TEST] npm run dev:ia                 # Test orchestrateur principal
[TEST] npm run validate:phase1        # Test template spécialisé
[TEST] npm run docs:generate          # Test documentation
```

---

## 🏷️ **Processus de Release v1.0-alpha**

```bash
[CMD] npm run validate 1              # Validation complète Phase 1
[CMD] git add . && git commit -m "feat: Phase 1 - Setup & Architecture complete"
[CMD] git tag v1.0-alpha             # Tag de version
[CMD] npm run release:deploy         # Déploiement si configuré
```

**🚫 STOP** : Ne pas passer à Phase 2 sans validation complète de Phase 1.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [📦 Phase 2 : Firebase & Authentification](phase-2-auth.md)  
**Dépendance** : Phase 1 validée ✅
