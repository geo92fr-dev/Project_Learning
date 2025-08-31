"use strict";
/**
 * 🔌 Extension VS Code FunLearning CBD - Point d'entrée principal
 * Phase 2.1 - Intelligence Contextuelle
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const prompt_validator_1 = require("./prompt-validator");
const roadmap_tracker_1 = require("./roadmap-tracker");
const quality_dashboard_1 = require("./quality-dashboard");
const educational_assistant_1 = require("./educational-assistant");
const template_manager_1 = require("./template-manager");
function activate(context) {
  console.log("🚀 Extension FunLearning CBD activée!");
  // Obtenir workspace root
  const workspaceRoot =
    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
  // Initialiser les composants
  const promptValidator = new prompt_validator_1.PromptValidator();
  const roadmapTracker = new roadmap_tracker_1.RoadmapTracker(workspaceRoot);
  const qualityDashboard = new quality_dashboard_1.QualityDashboard(
    workspaceRoot
  );
  const educationalAssistant = new educational_assistant_1.EducationalAssistant(
    workspaceRoot
  );
  const templateManager = new template_manager_1.TemplateManager(workspaceRoot);
  // 🔍 Commande validation prompt CBD
  const validatePromptCommand = vscode.commands.registerCommand(
    "funlearning.validatePrompt",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("Aucun éditeur actif trouvé");
        return;
      }
      const selection = editor.selection;
      const text = editor.document.getText(
        selection.isEmpty ? undefined : selection
      );
      const validation = await promptValidator.validatePrompt(text);
      if (validation.isValid) {
        vscode.window.showInformationMessage("✅ Prompt CBD valide!", {
          detail: `Format: ${validation.format} | Phase: ${validation.detectedPhase}`,
        });
      } else {
        vscode.window.showErrorMessage("❌ Prompt CBD invalide", {
          detail: validation.errors.join("\n"),
        });
      }
    }
  );
  // 📊 Commande dashboard qualité
  const showDashboardCommand = vscode.commands.registerCommand(
    "funlearning.showDashboard",
    async () => {
      await qualityDashboard.showDashboard();
    }
  );
  // 🎯 Commande détection phase
  const detectPhaseCommand = vscode.commands.registerCommand(
    "funlearning.detectPhase",
    async () => {
      await roadmapTracker.analyzeCurrentState();
      const state = roadmapTracker.getState();
      const phase = state.currentPhase;
      vscode.window.showInformationMessage(
        `🎯 Phase détectée: ${phase} (${state.globalProgress}% complété)`,
        `Prochaines tâches: ${
          state.phases.find((p) => p.phase === phase)?.nextTask || "Analyser..."
        }`
      );
    }
  );
  // 📝 Commande génération template
  const generateTemplateCommand = vscode.commands.registerCommand(
    "funlearning.generateTemplate",
    async () => {
      const templateOptions = [
        { label: "🎨 Composant Svelte", value: "svelte-component" },
        { label: "📚 Page Éducative", value: "educational-page" },
        { label: "🧪 Test Unitaire", value: "unit-test" },
        { label: "🔍 Quality Gate", value: "quality-gate" },
      ];
      const selection = await vscode.window.showQuickPick(templateOptions, {
        placeHolder: "Sélectionner le type de template à générer",
      });
      if (selection) {
        // Collecter les variables nécessaires
        const variables = {};
        const context = {
          projectPhase: 3,
          targetLevel: "5eme",
          competences: ["numérique", "créativité"],
          existingFiles: [],
          userPreferences: {},
        };
        // Variables de base pour tous les templates
        const name = await vscode.window.showInputBox({
          prompt: "Nom du composant/élément",
          placeHolder: "MonComposant",
        });
        if (name) {
          variables.name = name;
          variables.title = name;
          try {
            await templateManager.generateTemplate(
              selection.value,
              variables,
              context
            );
            vscode.window.showInformationMessage(
              `✅ Template ${selection.label} généré avec succès !`
            );
          } catch (error) {
            vscode.window.showErrorMessage(
              `❌ Erreur génération template: ${error}`
            );
          }
        }
      }
    }
  );
  // 🎓 Commande validation contenu éducatif
  const validateEducationalCommand = vscode.commands.registerCommand(
    "funlearning.validateEducationalContent",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const text = editor.document.getText();
      const targetLevel = "5eme"; // Pourrait être configuré via settings
      const validation = await educationalAssistant.validateEducationalContent(
        text,
        targetLevel
      );
      if (validation.isValid) {
        vscode.window.showInformationMessage(
          "✅ Contenu pédagogique validé",
          `Niveau: ${validation.level} | Score: ${validation.score}% | Compétences: ${validation.competences.length}`
        );
      } else {
        vscode.window.showWarningMessage(
          "⚠️ Contenu à ajuster",
          `Score: ${validation.score}% | Problèmes: ${validation.gaps.join(
            ", "
          )}`
        );
      }
    }
  );
  // 🔄 Validation automatique en temps réel
  const onDidChangeText = vscode.workspace.onDidChangeTextDocument(
    async (event) => {
      const config = vscode.workspace.getConfiguration("funlearning");
      if (!config.get("autoValidation")) return;
      const document = event.document;
      if (
        document.languageId === "markdown" ||
        document.languageId === "svelte"
      ) {
        // Validation discrète en arrière-plan
        await promptValidator.validateDocumentQuietly(document);
      }
    }
  );
  // 📊 Provider pour la vue dashboard
  const dashboardProvider = vscode.window.createTreeView(
    "funlearningDashboard",
    {
      treeDataProvider: qualityDashboard,
      showCollapseAll: true,
    }
  );
  // 🗺️ Provider pour la vue roadmap
  const roadmapProvider = vscode.window.createTreeView("funlearningRoadmap", {
    treeDataProvider: roadmapTracker,
    showCollapseAll: true,
  });
  // 🎨 Décorateur pour highlighting CBD
  const cbdDecorator = vscode.window.createTextEditorDecorationType({
    backgroundColor: new vscode.ThemeColor("editor.wordHighlightBackground"),
    border: "1px solid",
    borderColor: new vscode.ThemeColor("editorInfo.foreground"),
  });
  // 💡 Provider de completion pour prompts CBD
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    ["markdown", "plaintext"],
    {
      provideCompletionItems(document, position) {
        // Créer des completions CBD de base
        const completions = [
          new vscode.CompletionItem(
            "[CONTEXT]",
            vscode.CompletionItemKind.Snippet
          ),
          new vscode.CompletionItem(
            "[FILE]",
            vscode.CompletionItemKind.Snippet
          ),
          new vscode.CompletionItem("[CMD]", vscode.CompletionItemKind.Snippet),
          new vscode.CompletionItem(
            "[TEST]",
            vscode.CompletionItemKind.Snippet
          ),
          new vscode.CompletionItem(
            "[CHECK]",
            vscode.CompletionItemKind.Snippet
          ),
        ];
        completions[0].detail = "Contexte du prompt CBD";
        completions[1].detail = "Fichier à modifier";
        completions[2].detail = "Commande à exécuter";
        completions[3].detail = "Test à effectuer";
        completions[4].detail = "Vérification finale";
        return completions;
      },
    },
    "[",
    "C",
    "F",
    "T",
    "R"
  );
  // 🔍 Provider de diagnostic pour validation
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("funlearning-cbd");
  const onDidOpenDocument = vscode.workspace.onDidOpenTextDocument(
    async (document) => {
      if (document.languageId === "markdown") {
        const diagnostics = await promptValidator.provideDiagnostics(document);
        diagnosticCollection.set(document.uri, diagnostics);
      }
    }
  );
  // 📈 Statut dans la barre
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "funlearning.showDashboard";
  statusBarItem.text = "$(mortar-board) FunLearning";
  statusBarItem.tooltip = "Cliquer pour ouvrir le dashboard qualité";
  statusBarItem.show();
  // 🔄 Mise à jour périodique du statut
  const updateStatus = async () => {
    await roadmapTracker.analyzeCurrentState();
    const state = roadmapTracker.getState();
    const metrics = qualityDashboard.getMetrics();
    const avgQuality = Math.round(
      (metrics.codeQuality.maintainability +
        metrics.educationalQuality.contentQuality +
        metrics.performance.lighthouse) /
        3
    );
    statusBarItem.text = `$(mortar-board) Phase ${state.currentPhase} | Q: ${avgQuality}%`;
    statusBarItem.backgroundColor =
      avgQuality < 70
        ? new vscode.ThemeColor("statusBarItem.warningBackground")
        : undefined;
    // Rafraîchir les vues
    roadmapTracker.refresh();
    qualityDashboard.refresh();
  };
  // Mise à jour initiale et périodique
  updateStatus();
  const statusUpdateInterval = setInterval(updateStatus, 30000); // 30s
  // Enregistrer les disposables
  context.subscriptions.push(
    validatePromptCommand,
    showDashboardCommand,
    detectPhaseCommand,
    generateTemplateCommand,
    validateEducationalCommand,
    onDidChangeText,
    onDidOpenDocument,
    dashboardProvider,
    roadmapProvider,
    completionProvider,
    diagnosticCollection,
    statusBarItem
  );
  // Nettoyage
  context.subscriptions.push({
    dispose: () => {
      clearInterval(statusUpdateInterval);
    },
  });
  console.log("✅ Extension FunLearning CBD entièrement initialisée");
}
function deactivate() {
  console.log("🔌 Extension FunLearning CBD désactivée");
}
//# sourceMappingURL=extension.js.map
