/**
 * 🔍 Prompt Validator - Validation CBD temps réel
 * Phase 2.1 - Intelligence Contextuelle FunLearning
 */

import * as vscode from "vscode";

export interface PromptValidation {
  isValid: boolean;
  format: string;
  detectedPhase: string;
  errors: string[];
  suggestions: string[];
}

export class PromptValidator {
  private readonly cbdPatterns = {
    standard: /\[CONTEXT\].*\[FILE\].*\[CMD\].*\[TEST\].*\[CHECK\]/s,
    url: /\[VERIFICATION\].*\[CONSOLE\].*\[VISUAL\].*\[REPORT\].*\[CRITICAL\]/s,
    education: /\[NIVEAU\].*\[COMPETENCE\].*\[OBJECTIF\].*\[EVALUATION\]/s,
    documentation:
      /\[CONTEXT\].*(\[FILE\]|\[ROADMAP-CURRENT\]|\[PROBLEM\]|\[OPTIONS\]|\[DECISION\])/s,
    postmortem: /\[CONTEXT\].*\[PROBLEM\].*\[ROOT-CAUSE\].*\[QUICK-FIX\]/s,
    deviation:
      /\[CONTEXT\].*\[ROADMAP-CURRENT\].*\[DEVIATION\].*\[JUSTIFICATION\]/s,
    template: /\[CONTEXT\].*(\[TEMPLATE\]|\[EDIT\]|\[EXAMPLE\])/s,
    general: /\[CONTEXT\].*\[[A-Z-]+\]/s, // Pattern général pour documentation
  };

  private readonly phaseKeywords = {
    "1": ["setup", "install", "init", "configuration"],
    "2": ["auth", "firebase", "login", "authentication"],
    "3": ["content", "markdown", "exercise", "pedagogie"],
    "4": ["ui", "interface", "design", "composant"],
    "5": ["crud", "database", "firestore", "data"],
    "6": ["curriculum", "progression", "competence"],
    "7": ["interaction", "gamification", "engagement"],
    "8": ["responsive", "mobile", "tablet", "adaptive"],
    "9": ["pwa", "offline", "notification", "service-worker"],
    "10": ["performance", "optimisation", "lighthouse"],
    "11": ["production", "deploy", "hosting", "ci-cd"],
    "12": ["monitoring", "analytics", "maintenance"],
  };

  /**
   * 🔍 Valider un prompt CBD
   */
  async validatePrompt(text: string): Promise<PromptValidation> {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Ignorer la validation CBD dans les fichiers de documentation
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const fileName = activeEditor.document.fileName.toLowerCase();
      const docFiles = [
        "doc_copilot_practices.md",
        "roadmap_automatisations_techniques.md",
        "cbd_guide.md",
        "readme.md",
        "doc_roadmap.md",
      ];

      if (docFiles.some((docFile) => fileName.includes(docFile))) {
        return {
          isValid: true,
          format: "Documentation (validation CBD désactivée)",
          detectedPhase: "N/A",
          errors: [],
          suggestions: [],
        };
      }
    }

    // Ignorer le texte descriptif avec mentions de tags CBD entre backticks
    if (
      text.includes("`[") &&
      text.includes("]`") &&
      text.includes("Auto-insertion")
    ) {
      return {
        isValid: true,
        format: "Description technique",
        detectedPhase: "N/A",
        errors: [],
        suggestions: [],
      };
    }

    // Détecter le format
    let format = "unknown";
    let isValid = false;

    if (this.cbdPatterns.standard.test(text)) {
      format = "CBD Standard";
      isValid = true;
    } else if (this.cbdPatterns.url.test(text)) {
      format = "CBD URL/Test";
      isValid = true;
    } else if (this.cbdPatterns.education.test(text)) {
      format = "CBD Éducation";
      isValid = true;
    } else if (this.cbdPatterns.documentation.test(text)) {
      format = "CBD Documentation";
      isValid = true;
    } else if (this.cbdPatterns.postmortem.test(text)) {
      format = "CBD Post-Mortem";
      isValid = true;
    } else if (this.cbdPatterns.deviation.test(text)) {
      format = "CBD Déviation";
      isValid = true;
    } else if (this.cbdPatterns.template.test(text)) {
      format = "CBD Template";
      isValid = true;
    } else if (this.cbdPatterns.general.test(text)) {
      format = "CBD Documentation Générale";
      isValid = true;
    } else {
      errors.push("Format CBD non reconnu");
      suggestions.push(
        "Utiliser [CONTEXT][FILE][CMD][TEST][CHECK] pour format standard"
      );
      suggestions.push(
        "Utiliser [VERIFICATION][CONSOLE][VISUAL][REPORT][CRITICAL] pour tests URL"
      );
      suggestions.push(
        "Utiliser [NIVEAU][COMPETENCE][OBJECTIF][EVALUATION] pour contenu éducatif"
      );
      suggestions.push(
        "Utiliser [CONTEXT] avec [ROADMAP-CURRENT][DEVIATION] pour déviations"
      );
      suggestions.push(
        "Utiliser [CONTEXT][PROBLEM][ROOT-CAUSE][QUICK-FIX] pour post-mortem"
      );
    }

    // Détecter la phase
    const detectedPhase = this.detectPhase(text);

    // Validations spécifiques
    if (text.length < 50) {
      errors.push("Prompt trop court (minimum 50 caractères)");
    }

    if (!text.includes("FunLearning") && !text.includes("éducatif")) {
      suggestions.push("Ajouter le contexte FunLearning ou éducatif");
    }

    // Vérifications de qualité
    const hasObjective = /objectif|but|goal|purpose/i.test(text);
    const hasContext = /contexte|context|situation/i.test(text);

    if (!hasObjective) {
      suggestions.push("Préciser l'objectif du prompt");
    }

    if (!hasContext) {
      suggestions.push("Ajouter plus de contexte");
    }

    return {
      isValid: isValid && errors.length === 0,
      format,
      detectedPhase,
      errors,
      suggestions,
    };
  }

  /**
   * 🎯 Détecter la phase projet
   */
  private detectPhase(text: string): string {
    const textLower = text.toLowerCase();
    let maxScore = 0;
    let detectedPhase = "?";

    for (const [phase, keywords] of Object.entries(this.phaseKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (textLower.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedPhase = phase;
      }
    }

    return detectedPhase;
  }

  /**
   * 🔍 Validation silencieuse de document
   */
  async validateDocumentQuietly(document: vscode.TextDocument): Promise<void> {
    const text = document.getText();

    // Rechercher les patterns CBD dans le document
    const cbdBlocks = this.extractCBDBlocks(text);

    for (const block of cbdBlocks) {
      const validation = await this.validatePrompt(block.text);

      if (!validation.isValid) {
        // Afficher une décoration discrète
        this.showValidationDecoration(document, block.range, validation);
      }
    }
  }

  /**
   * 📋 Extraire les blocs CBD du document
   */
  private extractCBDBlocks(
    text: string
  ): Array<{ text: string; range: vscode.Range }> {
    const blocks: Array<{ text: string; range: vscode.Range }> = [];
    const lines = text.split("\n");

    let currentBlock = "";
    let startLine = -1;
    let inCBDBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (
        line.includes("[CONTEXT]") ||
        line.includes("[VERIFICATION]") ||
        line.includes("[NIVEAU]")
      ) {
        if (inCBDBlock && currentBlock) {
          // Finir le bloc précédent
          blocks.push({
            text: currentBlock.trim(),
            range: new vscode.Range(startLine, 0, i - 1, lines[i - 1].length),
          });
        }

        // Commencer nouveau bloc
        inCBDBlock = true;
        startLine = i;
        currentBlock = line;
      } else if (inCBDBlock) {
        currentBlock += "\n" + line;

        // Vérifier si c'est la fin du bloc
        if (
          line.includes("[CHECK]") ||
          line.includes("[CRITICAL]") ||
          line.includes("[EVALUATION]")
        ) {
          blocks.push({
            text: currentBlock.trim(),
            range: new vscode.Range(startLine, 0, i, line.length),
          });
          inCBDBlock = false;
          currentBlock = "";
        }
      }
    }

    // Gérer un bloc non fermé
    if (inCBDBlock && currentBlock) {
      blocks.push({
        text: currentBlock.trim(),
        range: new vscode.Range(
          startLine,
          0,
          lines.length - 1,
          lines[lines.length - 1].length
        ),
      });
    }

    return blocks;
  }

  /**
   * 🎨 Afficher décoration de validation
   */
  private showValidationDecoration(
    document: vscode.TextDocument,
    range: vscode.Range,
    validation: PromptValidation
  ): void {
    // Créer une décoration pour erreur CBD
    const decorationType = vscode.window.createTextEditorDecorationType({
      backgroundColor: new vscode.ThemeColor("editorError.background"),
      border: "1px solid",
      borderColor: new vscode.ThemeColor("editorError.foreground"),
      isWholeLine: false,
    });

    // Appliquer la décoration
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === document) {
      editor.setDecorations(decorationType, [range]);

      // Supprimer après 5 secondes
      setTimeout(() => {
        decorationType.dispose();
      }, 5000);
    }
  }

  /**
   * 🔍 Provider de diagnostics
   */
  async provideDiagnostics(
    document: vscode.TextDocument
  ): Promise<vscode.Diagnostic[]> {
    const diagnostics: vscode.Diagnostic[] = [];

    // Ignorer TOUS les fichiers Markdown de documentation pour éviter les faux positifs
    if (document.languageId === "markdown") {
      const fileName = document.fileName.toLowerCase();
      if (
        fileName.includes("doc_") ||
        fileName.includes("readme") ||
        fileName.includes("roadmap") ||
        fileName.includes("cbd_guide") ||
        fileName.includes("changelog") ||
        fileName.includes("/docs/") ||
        fileName.includes("\\docs\\")
      ) {
        return diagnostics; // Pas de validation CBD pour ces fichiers
      }
    }

    const text = document.getText();
    const cbdBlocks = this.extractCBDBlocks(text);

    for (const block of cbdBlocks) {
      const validation = await this.validatePrompt(block.text);

      if (!validation.isValid) {
        for (const error of validation.errors) {
          const diagnostic = new vscode.Diagnostic(
            block.range,
            `CBD: ${error}`,
            vscode.DiagnosticSeverity.Error
          );
          diagnostic.source = "FunLearning CBD";
          diagnostics.push(diagnostic);
        }
      }

      // Ajouter suggestions comme warnings
      for (const suggestion of validation.suggestions) {
        const diagnostic = new vscode.Diagnostic(
          block.range,
          `Suggestion: ${suggestion}`,
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = "FunLearning CBD";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * 📊 Statistiques de validation
   */
  getValidationStats(): {
    totalPrompts: number;
    validPrompts: number;
    invalidPrompts: number;
    successRate: number;
  } {
    // Implémentation future avec persistance
    return {
      totalPrompts: 0,
      validPrompts: 0,
      invalidPrompts: 0,
      successRate: 0,
    };
  }
}
