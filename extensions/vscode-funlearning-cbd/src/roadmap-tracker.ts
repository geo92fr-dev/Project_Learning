/**
 * 🎯 Roadmap Tracker - Suivi de progression automatique
 * Phase 2.1 - Intelligence Contextuelle FunLearning
 */

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export interface PhaseProgress {
  phase: number;
  title: string;
  totalItems: number;
  completedItems: number;
  percentage: number;
  nextTask: string;
  estimatedHours: number;
  blockers: string[];
}

export interface RoadmapState {
  currentPhase: number;
  globalProgress: number;
  phases: PhaseProgress[];
  lastUpdate: Date;
  activeFiles: string[];
  recentActions: string[];
}

export class RoadmapTracker implements vscode.TreeDataProvider<PhaseProgress> {
  private readonly roadmapConfig = {
    phases: [
      {
        id: 1,
        title: "Configuration & Setup",
        tasks: [
          "Setup projet",
          "Configuration Vite",
          "Firebase init",
          "Première route",
        ],
        estimatedHours: 8,
      },
      {
        id: 2,
        title: "Authentification Firebase",
        tasks: [
          "Firebase config",
          "Auth component",
          "Login/Register",
          "Auth guards",
        ],
        estimatedHours: 12,
      },
      {
        id: 3,
        title: "Contenu Éducatif",
        tasks: [
          "Markdown parser",
          "Exercices interactifs",
          "Système de progression",
          "Validation",
        ],
        estimatedHours: 16,
      },
      {
        id: 4,
        title: "Interface Utilisateur",
        tasks: ["Design system", "Navigation", "Responsive", "Accessibilité"],
        estimatedHours: 20,
      },
      {
        id: 5,
        title: "CRUD Avancé",
        tasks: ["Firestore setup", "Collections", "Real-time", "Offline sync"],
        estimatedHours: 18,
      },
      {
        id: 6,
        title: "Curriculum Intelligence",
        tasks: [
          "Compétences map",
          "Progression adaptative",
          "Recommandations",
          "Analytics",
        ],
        estimatedHours: 24,
      },
      {
        id: 7,
        title: "Interactions Avancées",
        tasks: ["Gamification", "Badges", "Leaderboard", "Social features"],
        estimatedHours: 16,
      },
      {
        id: 8,
        title: "Responsive & Mobile",
        tasks: [
          "Mobile first",
          "Tablet support",
          "Touch interactions",
          "Performance mobile",
        ],
        estimatedHours: 14,
      },
      {
        id: 9,
        title: "PWA & Offline",
        tasks: [
          "Service Worker",
          "Cache strategy",
          "Notifications",
          "Install prompt",
        ],
        estimatedHours: 12,
      },
      {
        id: 10,
        title: "Performance",
        tasks: [
          "Code splitting",
          "Lazy loading",
          "Optimisation assets",
          "Lighthouse 90+",
        ],
        estimatedHours: 10,
      },
      {
        id: 11,
        title: "Production",
        tasks: ["Build config", "Deployment", "CI/CD", "Monitoring"],
        estimatedHours: 14,
      },
      {
        id: 12,
        title: "Maintenance",
        tasks: ["Error tracking", "Analytics", "Updates", "Support"],
        estimatedHours: 8,
      },
    ],
  };

  private state: RoadmapState = {
    currentPhase: 1,
    globalProgress: 0,
    phases: [],
    lastUpdate: new Date(),
    activeFiles: [],
    recentActions: [],
  };

  constructor(private workspaceRoot: string) {
    this.loadState();
    this.initializePhases();
  }

  /**
   * 🔍 Analyser l'état actuel du projet
   */
  async analyzeCurrentState(): Promise<void> {
    const workspaceFiles = await this.scanWorkspace();
    const completedTasks = await this.detectCompletedTasks(workspaceFiles);

    // Mettre à jour les phases
    for (const phaseConfig of this.roadmapConfig.phases) {
      const phaseProgress = this.calculatePhaseProgress(
        phaseConfig,
        completedTasks
      );
      const existingPhase = this.state.phases.find(
        (p) => p.phase === phaseConfig.id
      );

      if (existingPhase) {
        Object.assign(existingPhase, phaseProgress);
      } else {
        this.state.phases.push(phaseProgress);
      }
    }

    // Déterminer la phase actuelle
    this.state.currentPhase = this.getCurrentPhase();
    this.state.globalProgress = this.calculateGlobalProgress();
    this.state.lastUpdate = new Date();

    await this.saveState();
  }

  /**
   * 📁 Scanner le workspace
   */
  private async scanWorkspace(): Promise<string[]> {
    const files: string[] = [];

    try {
      const entries = await vscode.workspace.findFiles(
        "**/*",
        "**/node_modules/**",
        1000
      );

      return entries.map((uri) => uri.fsPath);
    } catch (error) {
      console.error("Erreur scan workspace:", error);
      return [];
    }
  }

  /**
   * ✅ Détecter les tâches complétées
   */
  private async detectCompletedTasks(
    files: string[]
  ): Promise<Map<string, boolean>> {
    const completed = new Map<string, boolean>();

    // Analyse basée sur la présence de fichiers
    const indicators = {
      "Setup projet": () => files.some((f) => f.includes("package.json")),
      "Configuration Vite": () => files.some((f) => f.includes("vite.config")),
      "Firebase init": () =>
        files.some(
          (f) => f.includes("firebase.js") || f.includes("firebase.ts")
        ),
      "Première route": () => files.some((f) => f.includes("+page.svelte")),
      "Firebase config": () => this.checkFirebaseConfig(files),
      "Auth component": () =>
        files.some((f) => f.toLowerCase().includes("auth")),
      "Markdown parser": () => this.checkMarkdownSupport(files),
      "Design system": () =>
        files.some((f) => f.includes("app.css") || f.includes("global.css")),
      "Firestore setup": () => this.checkFirestoreConfig(files),
      "Service Worker": () => files.some((f) => f.includes("service-worker")),
      "Build config": () =>
        files.some((f) => f.includes("build") || f.includes("dist")),
    };

    for (const [task, checker] of Object.entries(indicators)) {
      completed.set(task, checker());
    }

    // Analyse basée sur le contenu des fichiers
    await this.analyzeFileContents(files, completed);

    return completed;
  }

  /**
   * 📋 Analyser le contenu des fichiers
   */
  private async analyzeFileContents(
    files: string[],
    completed: Map<string, boolean>
  ): Promise<void> {
    for (const file of files.slice(0, 20)) {
      // Limiter pour performance
      try {
        if (
          file.endsWith(".svelte") ||
          file.endsWith(".js") ||
          file.endsWith(".ts")
        ) {
          const content = await fs.promises.readFile(file, "utf8");

          // Rechercher des patterns spécifiques
          if (content.includes("firebase/auth")) {
            completed.set("Auth component", true);
          }
          if (content.includes("firebase/firestore")) {
            completed.set("Firestore setup", true);
          }
          if (content.includes("@media") || content.includes("responsive")) {
            completed.set("Responsive", true);
          }
          if (
            content.includes("service-worker") ||
            content.includes("workbox")
          ) {
            completed.set("Service Worker", true);
          }
        }
      } catch (error) {
        // Ignorer les erreurs de lecture
      }
    }
  }

  /**
   * 🔥 Vérifier configuration Firebase
   */
  private checkFirebaseConfig(files: string[]): boolean {
    const firebaseFiles = files.filter(
      (f) => f.includes("firebase") && (f.endsWith(".js") || f.endsWith(".ts"))
    );
    return firebaseFiles.length > 0;
  }

  /**
   * 📝 Vérifier support Markdown
   */
  private checkMarkdownSupport(files: string[]): boolean {
    return files.some(
      (f) => f.includes("markdown") || f.includes("md") || f.includes("parser")
    );
  }

  /**
   * 🗄️ Vérifier configuration Firestore
   */
  private checkFirestoreConfig(files: string[]): boolean {
    return files.some((f) => f.includes("firestore") || f.includes("database"));
  }

  /**
   * 📊 Calculer progression d'une phase
   */
  private calculatePhaseProgress(
    phaseConfig: any,
    completed: Map<string, boolean>
  ): PhaseProgress {
    const completedTasks = phaseConfig.tasks.filter(
      (task: string) => completed.get(task) === true
    ).length;

    const percentage = Math.round(
      (completedTasks / phaseConfig.tasks.length) * 100
    );
    const nextTask =
      phaseConfig.tasks.find((task: string) => completed.get(task) !== true) ||
      "Phase complète";

    return {
      phase: phaseConfig.id,
      title: phaseConfig.title,
      totalItems: phaseConfig.tasks.length,
      completedItems: completedTasks,
      percentage,
      nextTask,
      estimatedHours: phaseConfig.estimatedHours,
      blockers: this.detectBlockers(phaseConfig, completed),
    };
  }

  /**
   * 🚧 Détecter les blockers
   */
  private detectBlockers(
    phaseConfig: any,
    completed: Map<string, boolean>
  ): string[] {
    const blockers: string[] = [];

    // Dépendances entre phases
    if (phaseConfig.id === 2 && !completed.get("Firebase init")) {
      blockers.push("Firebase doit être initialisé avant l'authentification");
    }

    if (phaseConfig.id === 5 && !completed.get("Firebase config")) {
      blockers.push("Configuration Firebase requise pour Firestore");
    }

    if (phaseConfig.id === 9 && !completed.get("Build config")) {
      blockers.push("Configuration build requise pour PWA");
    }

    return blockers;
  }

  /**
   * 🎯 Déterminer phase actuelle
   */
  private getCurrentPhase(): number {
    for (const phase of this.state.phases) {
      if (phase.percentage < 80) {
        return phase.phase;
      }
    }
    return Math.max(...this.state.phases.map((p) => p.phase));
  }

  /**
   * 🌍 Calculer progression globale
   */
  private calculateGlobalProgress(): number {
    if (this.state.phases.length === 0) return 0;

    const totalProgress = this.state.phases.reduce(
      (sum, phase) => sum + phase.percentage,
      0
    );

    return Math.round(totalProgress / this.state.phases.length);
  }

  /**
   * 📅 Estimer temps restant
   */
  getEstimatedTimeRemaining(): number {
    return this.state.phases.reduce((total, phase) => {
      const remainingPercentage = (100 - phase.percentage) / 100;
      return total + phase.estimatedHours * remainingPercentage;
    }, 0);
  }

  /**
   * 📋 Obtenir prochaines tâches
   */
  getNextTasks(limit = 5): string[] {
    const nextTasks: string[] = [];

    for (const phase of this.state.phases.sort((a, b) => a.phase - b.phase)) {
      if (phase.percentage < 100 && nextTasks.length < limit) {
        nextTasks.push(`Phase ${phase.phase}: ${phase.nextTask}`);
      }
    }

    return nextTasks;
  }

  /**
   * 💾 Sauvegarder l'état
   */
  private async saveState(): Promise<void> {
    try {
      const statePath = path.join(
        this.workspaceRoot,
        ".funlearning",
        "roadmap-state.json"
      );
      await fs.promises.mkdir(path.dirname(statePath), { recursive: true });
      await fs.promises.writeFile(
        statePath,
        JSON.stringify(this.state, null, 2)
      );
    } catch (error) {
      console.error("Erreur sauvegarde state:", error);
    }
  }

  /**
   * 📂 Charger l'état
   */
  private async loadState(): Promise<void> {
    try {
      const statePath = path.join(
        this.workspaceRoot,
        ".funlearning",
        "roadmap-state.json"
      );
      const data = await fs.promises.readFile(statePath, "utf8");
      this.state = { ...this.state, ...JSON.parse(data) };
    } catch (error) {
      // État par défaut si pas de fichier
    }
  }

  /**
   * 🔧 Initialiser les phases
   */
  private initializePhases(): void {
    if (this.state.phases.length === 0) {
      this.state.phases = this.roadmapConfig.phases.map((phase) => ({
        phase: phase.id,
        title: phase.title,
        totalItems: phase.tasks.length,
        completedItems: 0,
        percentage: 0,
        nextTask: phase.tasks[0],
        estimatedHours: phase.estimatedHours,
        blockers: [],
      }));
    }
  }

  /**
   * 📊 Obtenir l'état complet
   */
  getState(): RoadmapState {
    return { ...this.state };
  }

  /**
   * 🔄 Forcer mise à jour
   */
  async forceUpdate(): Promise<void> {
    await this.analyzeCurrentState();
  }

  // Implémentation TreeDataProvider
  getTreeItem(element: PhaseProgress): vscode.TreeItem {
    const item = new vscode.TreeItem(
      `Phase ${element.phase}: ${element.title}`,
      vscode.TreeItemCollapsibleState.None
    );

    item.description = `${element.percentage}% (${element.completedItems}/${element.totalItems})`;
    item.tooltip = `Prochaine tâche: ${element.nextTask}`;

    if (element.percentage === 100) {
      item.iconPath = new vscode.ThemeIcon("check");
    } else if (element.percentage > 50) {
      item.iconPath = new vscode.ThemeIcon("loading");
    } else {
      item.iconPath = new vscode.ThemeIcon("circle-outline");
    }

    return item;
  }

  getChildren(element?: PhaseProgress): vscode.ProviderResult<PhaseProgress[]> {
    if (!element) {
      // Retourner les phases racines
      return this.state.phases.sort((a, b) => a.phase - b.phase);
    }
    return [];
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    PhaseProgress | undefined | null | void
  > = new vscode.EventEmitter<PhaseProgress | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    PhaseProgress | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
