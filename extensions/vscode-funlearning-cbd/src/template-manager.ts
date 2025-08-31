/**
 * 📝 Template Manager - Gestion des templates dynamiques
 * Phase 2.2 - Templates Dynamiques FunLearning
 */

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: "component" | "page" | "exercise" | "test" | "documentation";
  level: string;
  variables: TemplateVariable[];
  files: TemplateFile[];
  dependencies: string[];
}

export interface TemplateVariable {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  description: string;
  default?: any;
  required: boolean;
  validation?: string;
}

export interface TemplateFile {
  path: string;
  content: string;
  type: "svelte" | "javascript" | "typescript" | "css" | "markdown" | "json";
  condition?: string;
}

export interface TemplateContext {
  projectPhase: number;
  targetLevel: string;
  competences: string[];
  existingFiles: string[];
  userPreferences: { [key: string]: any };
}

export class TemplateManager {
  private templates: Map<string, TemplateConfig> = new Map();
  private readonly templatesPath: string;

  constructor(private workspaceRoot: string) {
    this.templatesPath = path.join(workspaceRoot, ".funlearning", "templates");
    this.initializeDefaultTemplates();
  }

  /**
   * 🎨 Générer template adaptatif
   */
  async generateTemplate(
    templateId: string,
    variables: { [key: string]: any },
    context: TemplateContext
  ): Promise<void> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} non trouvé`);
    }

    // Valider les variables
    const validationErrors = this.validateVariables(template, variables);
    if (validationErrors.length > 0) {
      throw new Error(`Erreurs de validation: ${validationErrors.join(", ")}`);
    }

    // Adapter le template au contexte
    const adaptedTemplate = await this.adaptTemplateToContext(
      template,
      context
    );

    // Générer les fichiers
    await this.generateTemplateFiles(adaptedTemplate, variables, context);

    // Afficher les prochaines étapes
    await this.showNextSteps(adaptedTemplate, context);
  }

  /**
   * 🔧 Adapter template au contexte
   */
  private async adaptTemplateToContext(
    template: TemplateConfig,
    context: TemplateContext
  ): Promise<TemplateConfig> {
    const adaptedTemplate = JSON.parse(JSON.stringify(template)); // Deep clone

    // Adapter selon la phase du projet
    if (context.projectPhase <= 2) {
      // Phase setup/auth - simplifier les composants
      adaptedTemplate.files = adaptedTemplate.files.filter(
        (file: TemplateFile) =>
          !file.path.includes("advanced") && !file.path.includes("optimization")
      );
    } else if (context.projectPhase >= 8) {
      // Phase avancée - ajouter optimisations
      adaptedTemplate.files.push(
        ...this.getOptimizationFiles(template.category)
      );
    }

    // Adapter selon le niveau scolaire
    if (context.targetLevel === "6eme" || context.targetLevel === "5eme") {
      // Simplifier pour niveaux jeunes
      adaptedTemplate.variables = adaptedTemplate.variables.filter(
        (v: TemplateVariable) => !v.name.includes("advanced")
      );
    }

    // Adapter selon les compétences
    if (context.competences.includes("numérique")) {
      adaptedTemplate.dependencies.push("@funlearning/digital-tools");
    }

    return adaptedTemplate;
  }

  /**
   * 📁 Générer fichiers du template
   */
  private async generateTemplateFiles(
    template: TemplateConfig,
    variables: { [key: string]: any },
    context: TemplateContext
  ): Promise<void> {
    for (const file of template.files) {
      // Vérifier condition
      if (
        file.condition &&
        !this.evaluateCondition(file.condition, variables, context)
      ) {
        continue;
      }

      // Générer le contenu
      const content = this.processTemplate(file.content, variables, context);
      const filePath = this.processTemplate(file.path, variables, context);
      const fullPath = path.join(this.workspaceRoot, filePath);

      // Créer répertoire si nécessaire
      await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });

      // Écrire fichier
      await fs.promises.writeFile(fullPath, content, "utf8");

      // Ouvrir fichier principal
      if (file.path.includes("main") || file.path.includes("index")) {
        const document = await vscode.workspace.openTextDocument(fullPath);
        await vscode.window.showTextDocument(document);
      }
    }
  }

  /**
   * 🔤 Traiter template avec variables
   */
  private processTemplate(
    template: string,
    variables: { [key: string]: any },
    context: TemplateContext
  ): string {
    let processed = template;

    // Remplacer variables utilisateur
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      processed = processed.replace(placeholder, String(value));
    }

    // Remplacer variables contextuelles
    processed = processed.replace(
      /{{context\.projectPhase}}/g,
      String(context.projectPhase)
    );
    processed = processed.replace(
      /{{context\.targetLevel}}/g,
      context.targetLevel
    );
    processed = processed.replace(
      /{{context\.competences}}/g,
      context.competences.join(", ")
    );

    // Fonctions de template
    processed = this.procesTemplateFunctions(processed, variables, context);

    return processed;
  }

  /**
   * ⚙️ Traiter fonctions de template
   */
  private procesTemplateFunctions(
    template: string,
    variables: { [key: string]: any },
    context: TemplateContext
  ): string {
    let processed = template;

    // Fonction capitalize
    processed = processed.replace(
      /{{capitalize\(([^)]+)\)}}/g,
      (match, content) => {
        const value = this.resolveVariable(content.trim(), variables, context);
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
      }
    );

    // Fonction camelCase
    processed = processed.replace(
      /{{camelCase\(([^)]+)\)}}/g,
      (match, content) => {
        const value = this.resolveVariable(content.trim(), variables, context);
        return String(value).replace(/[-_\s]+(.)?/g, (_, char) =>
          char ? char.toUpperCase() : ""
        );
      }
    );

    // Fonction kebabCase
    processed = processed.replace(
      /{{kebabCase\(([^)]+)\)}}/g,
      (match, content) => {
        const value = this.resolveVariable(content.trim(), variables, context);
        return String(value).replace(
          /[A-Z]/g,
          (letter) => `-${letter.toLowerCase()}`
        );
      }
    );

    // Fonction if/else
    processed = processed.replace(
      /{{#if\s+([^}]+)}}([\s\S]*?){{\/if}}/g,
      (match, condition, content) => {
        return this.evaluateCondition(condition, variables, context)
          ? content
          : "";
      }
    );

    // Fonction each
    processed = processed.replace(
      /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g,
      (match, arrayName, itemTemplate) => {
        const array = variables[arrayName] || [];
        return array
          .map((item: any, index: number) => {
            return itemTemplate
              .replace(/{{this}}/g, String(item))
              .replace(/{{@index}}/g, String(index));
          })
          .join("");
      }
    );

    return processed;
  }

  /**
   * 🔍 Résoudre variable
   */
  private resolveVariable(
    expression: string,
    variables: { [key: string]: any },
    context: TemplateContext
  ): any {
    // Variable simple
    if (Object.prototype.hasOwnProperty.call(variables, expression)) {
      return variables[expression];
    }

    // Variable contextuelle
    if (expression.startsWith("context.")) {
      const key = expression.slice(8);
      return (context as any)[key];
    }

    // Valeur littérale
    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.slice(1, -1);
    }

    return expression;
  }

  /**
   * ✅ Évaluer condition
   */
  private evaluateCondition(
    condition: string,
    variables: { [key: string]: any },
    context: TemplateContext
  ): boolean {
    try {
      // Remplacer variables dans la condition
      let processedCondition = condition;

      for (const [key, value] of Object.entries(variables)) {
        processedCondition = processedCondition.replace(
          new RegExp(`\\b${key}\\b`, "g"),
          JSON.stringify(value)
        );
      }

      // Évaluer de manière sécurisée (simulation)
      if (processedCondition.includes("projectPhase >")) {
        const match = processedCondition.match(/projectPhase > (\d+)/);
        if (match) {
          return context.projectPhase > parseInt(match[1]);
        }
      }

      if (processedCondition.includes("targetLevel ==")) {
        const match = processedCondition.match(/targetLevel == "([^"]+)"/);
        if (match) {
          return context.targetLevel === match[1];
        }
      }

      return true; // Par défaut
    } catch (error) {
      console.error("Erreur évaluation condition:", error);
      return true;
    }
  }

  /**
   * ✅ Valider variables
   */
  private validateVariables(
    template: TemplateConfig,
    variables: { [key: string]: any }
  ): string[] {
    const errors: string[] = [];

    for (const templateVar of template.variables) {
      const value = variables[templateVar.name];

      // Vérifier variables obligatoires
      if (
        templateVar.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push(`Variable '${templateVar.name}' est obligatoire`);
        continue;
      }

      // Vérifier types
      if (value !== undefined && !this.validateType(value, templateVar.type)) {
        errors.push(
          `Variable '${templateVar.name}' doit être de type ${templateVar.type}`
        );
      }

      // Vérifier validation personnalisée
      if (templateVar.validation && value !== undefined) {
        if (!this.validateCustom(value, templateVar.validation)) {
          errors.push(
            `Variable '${templateVar.name}' ne respecte pas la validation: ${templateVar.validation}`
          );
        }
      }
    }

    return errors;
  }

  /**
   * 🔢 Valider type
   */
  private validateType(value: any, type: string): boolean {
    switch (type) {
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number";
      case "boolean":
        return typeof value === "boolean";
      case "array":
        return Array.isArray(value);
      case "object":
        return typeof value === "object" && !Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * ✅ Validation personnalisée
   */
  private validateCustom(value: any, validation: string): boolean {
    try {
      // Validations communes
      if (validation === "not-empty") {
        return String(value).trim().length > 0;
      }

      if (validation.startsWith("min-length:")) {
        const minLength = parseInt(validation.split(":")[1]);
        return String(value).length >= minLength;
      }

      if (validation.startsWith("pattern:")) {
        const pattern = validation.split(":")[1];
        return new RegExp(pattern).test(String(value));
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 📋 Afficher prochaines étapes
   */
  private async showNextSteps(
    template: TemplateConfig,
    context: TemplateContext
  ): Promise<void> {
    const steps: string[] = [];

    // Étapes basées sur la catégorie
    switch (template.category) {
      case "component":
        steps.push("Tester le composant dans une page");
        steps.push("Ajouter des tests unitaires");
        steps.push("Documenter l'utilisation");
        break;
      case "page":
        steps.push("Ajouter la route dans app.js");
        steps.push("Tester la navigation");
        steps.push("Optimiser le SEO");
        break;
      case "exercise":
        steps.push("Tester avec un groupe d'utilisateurs");
        steps.push("Ajuster la difficulté");
        steps.push("Ajouter des indices progressifs");
        break;
    }

    // Étapes basées sur les dépendances
    if (template.dependencies.length > 0) {
      steps.unshift(
        `Installer les dépendances: ${template.dependencies.join(", ")}`
      );
    }

    // Afficher dans VS Code
    const message = `Template '${
      template.name
    }' généré avec succès!\n\nProchaines étapes:\n${steps
      .map((s) => `• ${s}`)
      .join("\n")}`;

    const action = await vscode.window.showInformationMessage(
      message,
      "Voir documentation",
      "Ouvrir fichier principal"
    );

    if (action === "Voir documentation") {
      await this.openTemplateDocumentation(template.id);
    }
  }

  /**
   * 📚 Ouvrir documentation template
   */
  private async openTemplateDocumentation(templateId: string): Promise<void> {
    const docPath = path.join(this.templatesPath, `${templateId}.md`);

    try {
      const document = await vscode.workspace.openTextDocument(docPath);
      await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
    } catch (error) {
      // Créer documentation de base si elle n'existe pas
      await this.createTemplateDocumentation(templateId);
    }
  }

  /**
   * 📝 Créer documentation template
   */
  private async createTemplateDocumentation(templateId: string): Promise<void> {
    const template = this.templates.get(templateId);
    if (!template) return;

    const documentation = `# Template: ${template.name}

## Description
${template.description}

## Variables
${template.variables
  .map((v) => `- **${v.name}** (${v.type}): ${v.description}`)
  .join("\n")}

## Utilisation
1. Ouvrir la palette de commandes (Ctrl+Shift+P)
2. Sélectionner "FunLearning: Générer Template"
3. Choisir "${template.name}"
4. Remplir les variables demandées

## Fichiers générés
${template.files.map((f) => `- ${f.path}`).join("\n")}

## Dépendances
${template.dependencies.map((d) => `- ${d}`).join("\n")}
`;

    const docPath = path.join(this.templatesPath, `${templateId}.md`);
    await fs.promises.mkdir(path.dirname(docPath), { recursive: true });
    await fs.promises.writeFile(docPath, documentation, "utf8");

    const document = await vscode.workspace.openTextDocument(docPath);
    await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
  }

  /**
   * ⚡ Obtenir fichiers d'optimisation
   */
  private getOptimizationFiles(category: string): TemplateFile[] {
    const optimizations: { [key: string]: TemplateFile[] } = {
      component: [
        {
          path: "{{kebabCase(name)}}.optimization.js",
          content: "// Optimisations de performance pour {{name}}",
          type: "javascript",
        },
      ],
      page: [
        {
          path: "{{kebabCase(name)}.lighthouse.js",
          content: "// Configuration Lighthouse pour {{name}}",
          type: "javascript",
        },
      ],
    };

    return optimizations[category] || [];
  }

  /**
   * 🎨 Initialiser templates par défaut
   */
  private async initializeDefaultTemplates(): Promise<void> {
    // Template Composant Svelte
    this.templates.set("svelte-component", {
      id: "svelte-component",
      name: "Composant Svelte FunLearning",
      description: "Composant Svelte avec validation pédagogique",
      category: "component",
      level: "all",
      variables: [
        {
          name: "name",
          type: "string",
          description: "Nom du composant",
          required: true,
          validation: "not-empty",
        },
        {
          name: "props",
          type: "array",
          description: "Propriétés du composant",
          default: [],
          required: false,
        },
        {
          name: "educational",
          type: "boolean",
          description: "Composant à vocation pédagogique",
          default: true,
          required: false,
        },
      ],
      files: [
        {
          path: "src/lib/components/{{kebabCase(name)}}/{{capitalize(name)}}.svelte",
          content: this.getSvelteComponentTemplate(),
          type: "svelte",
        },
        {
          path: "src/lib/components/{{kebabCase(name)}}/{{capitalize(name)}}.test.js",
          content: this.getSvelteTestTemplate(),
          type: "javascript",
          condition: "context.projectPhase > 2",
        },
      ],
      dependencies: [],
    });

    // Template Page Éducative
    this.templates.set("educational-page", {
      id: "educational-page",
      name: "Page Éducative FunLearning",
      description: "Page complète avec contenu pédagogique",
      category: "page",
      level: "all",
      variables: [
        {
          name: "title",
          type: "string",
          description: "Titre de la page",
          required: true,
        },
        {
          name: "subject",
          type: "string",
          description: "Matière concernée",
          required: true,
        },
        {
          name: "level",
          type: "string",
          description: "Niveau scolaire cible",
          required: true,
        },
        {
          name: "competences",
          type: "array",
          description: "Compétences développées",
          required: true,
        },
      ],
      files: [
        {
          path: "src/routes/{{kebabCase(title)}}/+page.svelte",
          content: this.getEducationalPageTemplate(),
          type: "svelte",
        },
        {
          path: "src/routes/{{kebabCase(title)}}/content.md",
          content: this.getEducationalContentTemplate(),
          type: "markdown",
        },
      ],
      dependencies: ["@funlearning/pedagogical-tools"],
    });

    // Autres templates...
    await this.saveTemplates();
  }

  /**
   * 📄 Template composant Svelte
   */
  private getSvelteComponentTemplate(): string {
    return `<script>
    /**
     * 🎨 {{capitalize(name)}} - Composant FunLearning
     * {{#if educational}}Composant pédagogique pour niveau {{context.targetLevel}}{{/if}}
     */
    
    {{#each props}}
    export let {{this}};
    {{/each}}
    
    import { createEventDispatcher } from 'svelte';
    {{#if educational}}
    import { validateEducationalContent } from '$lib/stores/education.js';
    {{/if}}
    
    const dispatch = createEventDispatcher();
    
    {{#if educational}}
    // Validation pédagogique
    $: isValid = validateEducationalContent({
        component: '{{name}}',
        level: '{{context.targetLevel}}',
        content: /* contenu à valider */
    });
    {{/if}}
    
    function handleInteraction(event) {
        dispatch('interact', {
            component: '{{name}}',
            action: event.type,
            {{#if educational}}
            educational: true,
            level: '{{context.targetLevel}}'
            {{/if}}
        });
    }
</script>

{{#if educational}}
<!-- Composant pédagogique pour {{context.targetLevel}} -->
<div class="educational-component {{kebabCase(name)}}" 
     data-level="{{context.targetLevel}}"
     on:click={handleInteraction}
     on:keydown={handleInteraction}>
    
    <header class="component-header">
        <h3>{{title || name}}</h3>
        {{#if context.targetLevel}}
        <span class="level-badge">Niveau {{context.targetLevel}}</span>
        {{/if}}
    </header>
    
    <main class="component-content">
        <slot />
    </main>
    
    {{#if isValid === false}}
    <aside class="validation-warning">
        ⚠️ Contenu non adapté au niveau {{context.targetLevel}}
    </aside>
    {{/if}}
    
</div>
{{else}}
<!-- Composant standard -->
<div class="component {{kebabCase(name)}}" 
     on:click={handleInteraction}>
    <slot />
</div>
{{/if}}

<style>
    .educational-component {
        border: 2px solid var(--color-educational);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        background: var(--bg-educational);
    }
    
    .component-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .level-badge {
        background: var(--color-level);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
    }
    
    .validation-warning {
        background: var(--color-warning);
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        margin-top: 1rem;
        font-size: 0.875rem;
    }
    
    .component {
        /* Styles composant standard */
    }
</style>`;
  }

  /**
   * 🧪 Template test Svelte
   */
  private getSvelteTestTemplate(): string {
    return `import { render, fireEvent } from '@testing-library/svelte';
import {{capitalize(name)}} from './{{capitalize(name)}}.svelte';

describe('{{capitalize(name)}}', () => {
    test('renders correctly', () => {
        const { getByRole } = render({{capitalize(name)}}, {
            {{#each props}}
            {{this}}: 'test-value',
            {{/each}}
        });
        
        expect(getByRole('main')).toBeInTheDocument();
    });
    
    {{#if educational}}
    test('validates educational content', () => {
        const { container } = render({{capitalize(name)}}, {
            educational: true,
            level: '{{context.targetLevel}}'
        });
        
        expect(container.querySelector('.educational-component')).toBeInTheDocument();
        expect(container.querySelector('[data-level="{{context.targetLevel}}"]')).toBeInTheDocument();
    });
    {{/if}}
    
    test('dispatches interact event', async () => {
        const mock = jest.fn();
        const { component } = render({{capitalize(name)}});
        
        component.$on('interact', mock);
        
        await fireEvent.click(component);
        
        expect(mock).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: expect.objectContaining({
                    component: '{{name}}',
                    action: 'click'
                })
            })
        );
    });
});`;
  }

  /**
   * 📚 Template page éducative
   */
  private getEducationalPageTemplate(): string {
    return `<script>
    /**
     * 📚 {{capitalize(title)}} - Page Éducative FunLearning
     * Matière: {{subject}} | Niveau: {{level}}
     */
    
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import EducationalLayout from '$lib/components/EducationalLayout.svelte';
    import ProgressTracker from '$lib/components/ProgressTracker.svelte';
    import ContentValidator from '$lib/components/ContentValidator.svelte';
    
    // Métadonnées pédagogiques
    const metadata = {
        title: '{{title}}',
        subject: '{{subject}}',
        level: '{{level}}',
        competences: [{{#each competences}}'{{this}}'{{#unless @last}}, {{/unless}}{{/each}}],
        difficulty: getDifficultyFromLevel('{{level}}'),
        estimatedTime: 45 // minutes
    };
    
    let progress = 0;
    let validationScore = 0;
    
    onMount(() => {
        // Tracking de la visite
        trackPageVisit(metadata);
        
        // Validation du contenu pour le niveau
        validateContentForLevel();
    });
    
    function getDifficultyFromLevel(level) {
        const levels = ['6eme', '5eme', '4eme', '3eme', 'seconde', 'premiere', 'terminale'];
        return levels.indexOf(level) + 1;
    }
    
    function trackPageVisit(meta) {
        // Analytics pédagogiques
        console.log('Page visit tracked:', meta);
    }
    
    function validateContentForLevel() {
        // Validation automatique du contenu
        validationScore = 85; // Simulation
    }
    
    function handleProgressUpdate(event) {
        progress = event.detail.progress;
    }
    
    function handleCompetenceValidated(event) {
        console.log('Compétence validée:', event.detail.competence);
    }
</script>

<svelte:head>
    <title>{{title}} - {{subject}} {{level}} | FunLearning</title>
    <meta name="description" content="Cours de {{subject}} niveau {{level}}: {{title}}" />
    <meta name="educational-level" content="{{level}}" />
    <meta name="educational-subject" content="{{subject}}" />
    <meta name="educational-competences" content="{{competences}}" />
</svelte:head>

<EducationalLayout {metadata}>
    <header slot="header" class="page-header">
        <div class="subject-info">
            <span class="subject">{{subject}}</span>
            <span class="level">{{level}}</span>
        </div>
        <h1>{{title}}</h1>
        <div class="competences">
            <h2>Compétences développées:</h2>
            <ul>
                {{#each competences}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </div>
    </header>
    
    <aside slot="sidebar">
        <ProgressTracker 
            {progress} 
            {metadata}
            on:progress={handleProgressUpdate} />
        
        <ContentValidator 
            score={validationScore}
            level="{{level}}" />
    </aside>
    
    <main class="educational-content">
        <!-- Contenu principal chargé depuis content.md -->
        <div class="content-container">
            {#await import('./content.md')}
                <p>Chargement du contenu...</p>
            {:then module}
                <svelte:component this={module.default} />
            {:catch error}
                <p>Erreur de chargement: {error.message}</p>
            {/await}
        </div>
        
        <!-- Activités interactives -->
        <section class="activities">
            <h2>🎯 Activités Pratiques</h2>
            
            <div class="activity-grid">
                <div class="activity-card">
                    <h3>Quiz de Compréhension</h3>
                    <p>Testez votre compréhension des concepts clés</p>
                    <button class="btn-primary">Commencer</button>
                </div>
                
                <div class="activity-card">
                    <h3>Exercice Pratique</h3>
                    <p>Appliquez vos connaissances</p>
                    <button class="btn-secondary">Pratiquer</button>
                </div>
                
                <div class="activity-card">
                    <h3>Projet Créatif</h3>
                    <p>Créez votre propre projet</p>
                    <button class="btn-creative">Créer</button>
                </div>
            </div>
        </section>
        
        <!-- Évaluation -->
        <section class="evaluation">
            <h2>📊 Auto-Évaluation</h2>
            <div class="competence-checklist">
                {{#each competences}}
                <label class="competence-item">
                    <input type="checkbox" on:change={handleCompetenceValidated}>
                    <span>{{this}}</span>
                </label>
                {{/each}}
            </div>
        </section>
    </main>
</EducationalLayout>

<style>
    .page-header {
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        color: white;
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    }
    
    .subject-info {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .subject, .level {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .competences ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .competences li {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
    }
    
    .educational-content {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .content-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
    }
    
    .activities {
        margin: 2rem 0;
    }
    
    .activity-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .activity-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    
    .btn-primary, .btn-secondary, .btn-creative {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: var(--color-primary);
        color: white;
    }
    
    .btn-secondary {
        background: var(--color-secondary);
        color: white;
    }
    
    .btn-creative {
        background: var(--color-creative);
        color: white;
    }
    
    .evaluation {
        background: var(--bg-evaluation);
        padding: 2rem;
        border-radius: 8px;
        margin-top: 2rem;
    }
    
    .competence-checklist {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .competence-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: white;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .competence-item:hover {
        background: var(--bg-hover);
    }
    
    .competence-item input[type="checkbox"] {
        width: 20px;
        height: 20px;
    }
</style>`;
  }

  /**
   * 📄 Template contenu éducatif
   */
  private getEducationalContentTemplate(): string {
    return `# {{title}}

> **Matière:** {{subject}} | **Niveau:** {{level}}  
> **Compétences:** {{competences}}

## 🎯 Objectifs d'apprentissage

À la fin de cette leçon, vous serez capable de :

- Objectif 1 adapté au niveau {{level}}
- Objectif 2 en lien avec {{subject}}
- Objectif 3 développant les compétences ciblées

## 📚 Introduction

Bienvenue dans cette leçon de {{subject}} adaptée au niveau {{level}}. 

Nous allons explorer {{title}} de manière progressive et interactive.

## 🔍 Découverte

### Concept principal

[Explication adaptée au niveau {{level}}]

### Exemples concrets

1. **Exemple 1** : [Exemple simple et parlant]
2. **Exemple 2** : [Exemple avec application pratique]
3. **Exemple 3** : [Exemple créatif]

## 💡 À retenir

- **Point clé 1** : [Synthèse simple]
- **Point clé 2** : [Concept essentiel] 
- **Point clé 3** : [Application pratique]

## 🎮 Activités

### Quiz rapide

1. Question adaptée au niveau {{level}}
2. Question sur {{subject}}
3. Question transversale

### Exercice pratique

[Instructions pour activité hands-on]

### Projet créatif

[Proposition de création personnelle]

## 📈 Pour aller plus loin

- Ressource 1 pour approfondir
- Ressource 2 pour pratiquer
- Ressource 3 pour créer

## ✅ Auto-évaluation

- [ ] J'ai compris le concept principal
- [ ] Je sais donner un exemple
- [ ] Je peux l'appliquer dans un nouveau contexte
- [ ] Je peux l'expliquer à quelqu'un d'autre
`;
  }

  /**
   * 💾 Sauvegarder templates
   */
  private async saveTemplates(): Promise<void> {
    try {
      await fs.promises.mkdir(this.templatesPath, { recursive: true });

      for (const [id, template] of this.templates) {
        const templatePath = path.join(this.templatesPath, `${id}.json`);
        await fs.promises.writeFile(
          templatePath,
          JSON.stringify(template, null, 2),
          "utf8"
        );
      }
    } catch (error) {
      console.error("Erreur sauvegarde templates:", error);
    }
  }

  /**
   * 📋 Lister templates
   */
  getAvailableTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }

  /**
   * 🔍 Obtenir template
   */
  getTemplate(id: string): TemplateConfig | undefined {
    return this.templates.get(id);
  }

  /**
   * ➕ Ajouter template personnalisé
   */
  async addCustomTemplate(template: TemplateConfig): Promise<void> {
    this.templates.set(template.id, template);
    await this.saveTemplates();
  }
}
