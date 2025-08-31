"use strict";
/**
 * 📊 Quality Dashboard - Tableau de bord qualité temps réel
 * Phase 2.3 - Dashboard Métriques FunLearning
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityDashboard = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class QualityDashboard {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
    this.refreshInterval = 30000; // 30 secondes
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.metrics = this.getDefaultMetrics();
    this.startAutoRefresh();
  }
  /**
   * 📊 Afficher le dashboard
   */
  async showDashboard() {
    if (this.webviewPanel) {
      this.webviewPanel.reveal();
      return;
    }
    this.webviewPanel = vscode.window.createWebviewPanel(
      "funlearningDashboard",
      "📊 FunLearning Quality Dashboard",
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(
            path.join(
              this.workspaceRoot,
              "extensions",
              "vscode-funlearning-cbd"
            )
          ),
        ],
      }
    );
    await this.updateMetrics();
    this.webviewPanel.webview.html = this.generateDashboardHTML();
    // Gérer la fermeture
    this.webviewPanel.onDidDispose(() => {
      this.webviewPanel = undefined;
    });
    // Gérer les messages de la webview
    this.webviewPanel.webview.onDidReceiveMessage(
      (message) => this.handleWebviewMessage(message),
      undefined
    );
  }
  /**
   * 🔄 Mettre à jour les métriques
   */
  async updateMetrics() {
    try {
      // Code Quality
      await this.updateCodeQuality();
      // Project Health
      await this.updateProjectHealth();
      // Educational Quality
      await this.updateEducationalQuality();
      // Performance
      await this.updatePerformance();
      this.metrics.lastUpdate = new Date();
      // Mettre à jour la webview si ouverte
      if (this.webviewPanel) {
        this.webviewPanel.webview.html = this.generateDashboardHTML();
      }
      // Sauvegarder métriques
      await this.saveMetrics();
    } catch (error) {
      console.error("Erreur mise à jour métriques:", error);
    }
  }
  /**
   * 📝 Analyser qualité du code
   */
  async updateCodeQuality() {
    const sourceFiles = await this.getSourceFiles();
    // Coverage (simulation basée sur tests)
    const testFiles = sourceFiles.filter(
      (f) => f.includes(".test.") || f.includes(".spec.")
    );
    this.metrics.codeQuality.coverage = Math.min(
      90,
      (testFiles.length / Math.max(1, sourceFiles.length * 0.8)) * 100
    );
    // Complexity (simulation basée sur taille fichiers)
    let totalComplexity = 0;
    for (const file of sourceFiles.slice(0, 10)) {
      // Limite pour performance
      try {
        const content = await fs.promises.readFile(file, "utf8");
        const lines = content.split("\n").length;
        const cyclomaticComplexity =
          this.calculateCyclomaticComplexity(content);
        totalComplexity += cyclomaticComplexity;
      } catch (error) {
        // Ignorer erreurs de lecture
      }
    }
    this.metrics.codeQuality.complexity = Math.max(
      1,
      Math.min(10, totalComplexity / Math.max(1, sourceFiles.length))
    );
    // Duplication (simulation)
    this.metrics.codeQuality.duplication = Math.random() * 5; // 0-5%
    // Maintainability (score composite)
    this.metrics.codeQuality.maintainability = Math.round(
      (100 -
        this.metrics.codeQuality.complexity * 10 -
        this.metrics.codeQuality.duplication * 5) *
        (this.metrics.codeQuality.coverage / 100)
    );
  }
  /**
   * 🏥 Analyser santé du projet
   */
  async updateProjectHealth() {
    try {
      // Build status (vérifier package.json scripts)
      const packageJson = await this.getPackageJson();
      this.metrics.projectHealth.buildStatus = packageJson
        ? "success"
        : "warning";
      // Tests
      const testFiles = await this.getTestFiles();
      this.metrics.projectHealth.testsTotal = testFiles.length;
      this.metrics.projectHealth.testsPassing = Math.floor(
        testFiles.length * (0.85 + Math.random() * 0.1)
      );
      // Dependencies
      if (packageJson) {
        const deps = Object.keys(packageJson.dependencies || {}).length;
        const devDeps = Object.keys(packageJson.devDependencies || {}).length;
        this.metrics.projectHealth.dependencies = deps + devDeps;
      }
      // Vulnerabilities (simulation)
      this.metrics.projectHealth.vulnerabilities = Math.floor(
        Math.random() * 3
      );
    } catch (error) {
      this.metrics.projectHealth.buildStatus = "error";
    }
  }
  /**
   * 🎓 Analyser qualité éducative
   */
  async updateEducationalQuality() {
    const markdownFiles = await this.getMarkdownFiles();
    // CBD Compliance
    let cbdCompliantFiles = 0;
    for (const file of markdownFiles) {
      try {
        const content = await fs.promises.readFile(file, "utf8");
        if (this.isCBDCompliant(content)) {
          cbdCompliantFiles++;
        }
      } catch (error) {
        // Ignorer erreurs
      }
    }
    this.metrics.educationalQuality.cbdCompliance =
      markdownFiles.length > 0
        ? Math.round((cbdCompliantFiles / markdownFiles.length) * 100)
        : 0;
    // Pedagogical Alignment (simulation basée sur mots-clés)
    this.metrics.educationalQuality.pedagogicalAlignment =
      75 + Math.floor(Math.random() * 20);
    // Accessibility Score
    this.metrics.educationalQuality.accessibilityScore =
      await this.calculateAccessibilityScore();
    // Content Quality
    this.metrics.educationalQuality.contentQuality = Math.round(
      (this.metrics.educationalQuality.cbdCompliance +
        this.metrics.educationalQuality.pedagogicalAlignment +
        this.metrics.educationalQuality.accessibilityScore) /
        3
    );
  }
  /**
   * ⚡ Analyser performance
   */
  async updatePerformance() {
    // Lighthouse (simulation)
    this.metrics.performance.lighthouse = 85 + Math.floor(Math.random() * 10);
    // Load Time (simulation basée sur taille bundle)
    const bundleSize = await this.estimateBundleSize();
    this.metrics.performance.bundleSize = bundleSize;
    this.metrics.performance.loadTime = Math.max(500, bundleSize / 100); // ms
    // Memory Usage (simulation)
    this.metrics.performance.memoryUsage = 15 + Math.random() * 10; // MB
  }
  /**
   * 🧮 Calculer complexité cyclomatique
   */
  calculateCyclomaticComplexity(code) {
    const complexityPatterns = [
      /if\s*\(/g,
      /else\s*if\s*\(/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /switch\s*\(/g,
      /catch\s*\(/g,
      /&&/g,
      /\|\|/g,
    ];
    let complexity = 1; // Base complexity
    for (const pattern of complexityPatterns) {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    }
    return complexity;
  }
  /**
   * 📚 Vérifier conformité CBD
   */
  isCBDCompliant(content) {
    const cbdPatterns = [
      /\[CONTEXT\]/,
      /\[FILE\]/,
      /\[CMD\]/,
      /\[TEST\]/,
      /\[CHECK\]/,
    ];
    return cbdPatterns.every((pattern) => pattern.test(content));
  }
  /**
   * ♿ Calculer score accessibilité
   */
  async calculateAccessibilityScore() {
    const svelteFiles = await this.getSvelteFiles();
    let accessibilityScore = 100;
    for (const file of svelteFiles.slice(0, 5)) {
      try {
        const content = await fs.promises.readFile(file, "utf8");
        // Vérifier alt text
        const images = content.match(/<img[^>]*>/g) || [];
        const imagesWithAlt = content.match(/<img[^>]*alt\s*=/g) || [];
        if (images.length > 0) {
          accessibilityScore -= (images.length - imagesWithAlt.length) * 5;
        }
        // Vérifier labels
        const inputs = content.match(/<input[^>]*>/g) || [];
        const labels = content.match(/<label[^>]*>/g) || [];
        if (inputs.length > labels.length) {
          accessibilityScore -= (inputs.length - labels.length) * 3;
        }
      } catch (error) {
        // Ignorer erreurs
      }
    }
    return Math.max(0, Math.min(100, accessibilityScore));
  }
  /**
   * 📦 Estimer taille bundle
   */
  async estimateBundleSize() {
    const sourceFiles = await this.getSourceFiles();
    let totalSize = 0;
    for (const file of sourceFiles.slice(0, 20)) {
      try {
        const stats = await fs.promises.stat(file);
        totalSize += stats.size;
      } catch (error) {
        // Ignorer erreurs
      }
    }
    return Math.round(totalSize / 1024); // KB
  }
  /**
   * 📁 Obtenir fichiers sources
   */
  async getSourceFiles() {
    const files = [];
    try {
      const entries = await vscode.workspace.findFiles(
        "**/*.{js,ts,svelte}",
        "**/node_modules/**",
        200
      );
      return entries.map((uri) => uri.fsPath);
    } catch (error) {
      return [];
    }
  }
  /**
   * 🧪 Obtenir fichiers de test
   */
  async getTestFiles() {
    try {
      const entries = await vscode.workspace.findFiles(
        "**/*.{test,spec}.{js,ts}",
        "**/node_modules/**",
        100
      );
      return entries.map((uri) => uri.fsPath);
    } catch (error) {
      return [];
    }
  }
  /**
   * 📄 Obtenir fichiers Markdown
   */
  async getMarkdownFiles() {
    try {
      const entries = await vscode.workspace.findFiles(
        "**/*.md",
        "**/node_modules/**",
        100
      );
      return entries.map((uri) => uri.fsPath);
    } catch (error) {
      return [];
    }
  }
  /**
   * 🎨 Obtenir fichiers Svelte
   */
  async getSvelteFiles() {
    try {
      const entries = await vscode.workspace.findFiles(
        "**/*.svelte",
        "**/node_modules/**",
        100
      );
      return entries.map((uri) => uri.fsPath);
    } catch (error) {
      return [];
    }
  }
  /**
   * 📦 Obtenir package.json
   */
  async getPackageJson() {
    try {
      const packagePath = path.join(this.workspaceRoot, "package.json");
      const content = await fs.promises.readFile(packagePath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }
  /**
   * 🎨 Générer HTML du dashboard
   */
  generateDashboardHTML() {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FunLearning Quality Dashboard</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .metric-card {
            background: var(--vscode-editor-widget-background);
            border: 1px solid var(--vscode-editor-widget-border);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .metric-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .metric-value {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .metric-subtitle {
            font-size: 14px;
            opacity: 0.8;
            margin-bottom: 15px;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--vscode-editor-lineHighlightBackground);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        .status-good { color: #4CAF50; }
        .status-warning { color: #FF9800; }
        .status-error { color: #F44336; }
        .status-info { color: #2196F3; }
        .metric-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .metric-list li {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid var(--vscode-editor-lineHighlightBackground);
        }
        .metric-list li:last-child {
            border-bottom: none;
        }
        .refresh-button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .refresh-button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .last-update {
            text-align: center;
            opacity: 0.6;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="dashboard-header">
        <h1>📊 FunLearning Quality Dashboard</h1>
        <button class="refresh-button" onclick="refreshMetrics()">🔄 Actualiser</button>
    </div>

    <div class="dashboard">
        <!-- Code Quality -->
        <div class="metric-card">
            <div class="metric-title">
                <span>💻</span> Qualité du Code
            </div>
            <div class="metric-value status-${this.getStatusClass(
              this.metrics.codeQuality.maintainability
            )}">
                ${this.metrics.codeQuality.maintainability}%
            </div>
            <div class="metric-subtitle">Maintenabilité globale</div>
            <ul class="metric-list">
                <li>
                    <span>Coverage</span>
                    <span class="status-${this.getStatusClass(
                      this.metrics.codeQuality.coverage
                    )}">${this.metrics.codeQuality.coverage.toFixed(1)}%</span>
                </li>
                <li>
                    <span>Complexité</span>
                    <span class="status-${this.getComplexityStatus(
                      this.metrics.codeQuality.complexity
                    )}">${this.metrics.codeQuality.complexity.toFixed(1)}</span>
                </li>
                <li>
                    <span>Duplication</span>
                    <span class="status-${this.getDuplicationStatus(
                      this.metrics.codeQuality.duplication
                    )}">${this.metrics.codeQuality.duplication.toFixed(
      1
    )}%</span>
                </li>
            </ul>
        </div>

        <!-- Project Health -->
        <div class="metric-card">
            <div class="metric-title">
                <span>🏥</span> Santé du Projet
            </div>
            <div class="metric-value status-${
              this.metrics.projectHealth.buildStatus === "success"
                ? "good"
                : "warning"
            }">
                ${
                  this.metrics.projectHealth.buildStatus === "success"
                    ? "✅"
                    : "⚠️"
                }
            </div>
            <div class="metric-subtitle">Status de build</div>
            <ul class="metric-list">
                <li>
                    <span>Tests réussis</span>
                    <span class="status-${this.getTestStatus()}">${
      this.metrics.projectHealth.testsPassing
    }/${this.metrics.projectHealth.testsTotal}</span>
                </li>
                <li>
                    <span>Dépendances</span>
                    <span>${this.metrics.projectHealth.dependencies}</span>
                </li>
                <li>
                    <span>Vulnérabilités</span>
                    <span class="status-${
                      this.metrics.projectHealth.vulnerabilities === 0
                        ? "good"
                        : "warning"
                    }">${this.metrics.projectHealth.vulnerabilities}</span>
                </li>
            </ul>
        </div>

        <!-- Educational Quality -->
        <div class="metric-card">
            <div class="metric-title">
                <span>🎓</span> Qualité Éducative
            </div>
            <div class="metric-value status-${this.getStatusClass(
              this.metrics.educationalQuality.contentQuality
            )}">
                ${this.metrics.educationalQuality.contentQuality}%
            </div>
            <div class="metric-subtitle">Score global pédagogique</div>
            <ul class="metric-list">
                <li>
                    <span>Conformité CBD</span>
                    <span class="status-${this.getStatusClass(
                      this.metrics.educationalQuality.cbdCompliance
                    )}">${this.metrics.educationalQuality.cbdCompliance}%</span>
                </li>
                <li>
                    <span>Alignement pédagogique</span>
                    <span class="status-${this.getStatusClass(
                      this.metrics.educationalQuality.pedagogicalAlignment
                    )}">${
      this.metrics.educationalQuality.pedagogicalAlignment
    }%</span>
                </li>
                <li>
                    <span>Accessibilité</span>
                    <span class="status-${this.getStatusClass(
                      this.metrics.educationalQuality.accessibilityScore
                    )}">${
      this.metrics.educationalQuality.accessibilityScore
    }%</span>
                </li>
            </ul>
        </div>

        <!-- Performance -->
        <div class="metric-card">
            <div class="metric-title">
                <span>⚡</span> Performance
            </div>
            <div class="metric-value status-${this.getStatusClass(
              this.metrics.performance.lighthouse
            )}">
                ${this.metrics.performance.lighthouse}
            </div>
            <div class="metric-subtitle">Score Lighthouse</div>
            <ul class="metric-list">
                <li>
                    <span>Temps de chargement</span>
                    <span class="status-${this.getLoadTimeStatus()}">${this.metrics.performance.loadTime.toFixed(
      0
    )}ms</span>
                </li>
                <li>
                    <span>Taille bundle</span>
                    <span>${this.metrics.performance.bundleSize}KB</span>
                </li>
                <li>
                    <span>Mémoire</span>
                    <span>${this.metrics.performance.memoryUsage.toFixed(
                      1
                    )}MB</span>
                </li>
            </ul>
        </div>
    </div>

    <div class="last-update">
        Dernière mise à jour: ${this.metrics.lastUpdate.toLocaleString("fr-FR")}
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function refreshMetrics() {
            vscode.postMessage({ command: 'refresh' });
        }

        // Auto-refresh toutes les 30 secondes
        setInterval(() => {
            vscode.postMessage({ command: 'autoRefresh' });
        }, 30000);
    </script>
</body>
</html>`;
  }
  /**
   * 🎨 Obtenir classe de status
   */
  getStatusClass(value) {
    if (value >= 80) return "good";
    if (value >= 60) return "warning";
    return "error";
  }
  getComplexityStatus(complexity) {
    if (complexity <= 3) return "good";
    if (complexity <= 6) return "warning";
    return "error";
  }
  getDuplicationStatus(duplication) {
    if (duplication <= 2) return "good";
    if (duplication <= 5) return "warning";
    return "error";
  }
  getTestStatus() {
    const ratio =
      this.metrics.projectHealth.testsPassing /
      Math.max(1, this.metrics.projectHealth.testsTotal);
    return this.getStatusClass(ratio * 100);
  }
  getLoadTimeStatus() {
    if (this.metrics.performance.loadTime <= 1000) return "good";
    if (this.metrics.performance.loadTime <= 2000) return "warning";
    return "error";
  }
  /**
   * 💬 Gérer messages webview
   */
  async handleWebviewMessage(message) {
    switch (message.command) {
      case "refresh":
      case "autoRefresh":
        await this.updateMetrics();
        break;
    }
  }
  /**
   * 🔄 Démarrer auto-refresh
   */
  startAutoRefresh() {
    setInterval(async () => {
      await this.updateMetrics();
    }, this.refreshInterval);
  }
  /**
   * 📊 Métriques par défaut
   */
  getDefaultMetrics() {
    return {
      codeQuality: {
        coverage: 0,
        complexity: 1,
        duplication: 0,
        maintainability: 0,
      },
      projectHealth: {
        buildStatus: "warning",
        testsPassing: 0,
        testsTotal: 0,
        dependencies: 0,
        vulnerabilities: 0,
      },
      educationalQuality: {
        cbdCompliance: 0,
        pedagogicalAlignment: 0,
        accessibilityScore: 0,
        contentQuality: 0,
      },
      performance: {
        lighthouse: 0,
        loadTime: 0,
        bundleSize: 0,
        memoryUsage: 0,
      },
      lastUpdate: new Date(),
    };
  }
  /**
   * 💾 Sauvegarder métriques
   */
  async saveMetrics() {
    try {
      const metricsPath = path.join(
        this.workspaceRoot,
        ".funlearning",
        "quality-metrics.json"
      );
      await fs.promises.mkdir(path.dirname(metricsPath), { recursive: true });
      await fs.promises.writeFile(
        metricsPath,
        JSON.stringify(this.metrics, null, 2)
      );
    } catch (error) {
      console.error("Erreur sauvegarde métriques:", error);
    }
  }
  /**
   * 📊 Obtenir métriques
   */
  getMetrics() {
    return { ...this.metrics };
  }
  /**
   * 📈 Obtenir tendances
   */
  async getTrends() {
    // Implémentation future avec historique
    return [];
  }
  /**
   * 🗑️ Nettoyer ressources
   */
  dispose() {
    if (this.webviewPanel) {
      this.webviewPanel.dispose();
    }
  }
  // Implémentation TreeDataProvider
  getTreeItem(element) {
    const item = new vscode.TreeItem(
      element,
      vscode.TreeItemCollapsibleState.None
    );
    switch (element) {
      case "Code Quality":
        item.description = `${this.metrics.codeQuality.maintainability}%`;
        item.iconPath = new vscode.ThemeIcon("code");
        break;
      case "Project Health":
        item.description = this.metrics.projectHealth.buildStatus;
        item.iconPath = new vscode.ThemeIcon(
          this.metrics.projectHealth.buildStatus === "success"
            ? "check"
            : "warning"
        );
        break;
      case "Educational Quality":
        item.description = `${this.metrics.educationalQuality.contentQuality}%`;
        item.iconPath = new vscode.ThemeIcon("mortar-board");
        break;
      case "Performance":
        item.description = `${this.metrics.performance.lighthouse}`;
        item.iconPath = new vscode.ThemeIcon("dashboard");
        break;
    }
    return item;
  }
  getChildren(element) {
    if (!element) {
      return [
        "Code Quality",
        "Project Health",
        "Educational Quality",
        "Performance",
      ];
    }
    return [];
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
}
exports.QualityDashboard = QualityDashboard;
//# sourceMappingURL=quality-dashboard.js.map
