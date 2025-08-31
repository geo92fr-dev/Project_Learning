# 💪 Phase 9 : Exercises System (4 jours) - v1.7

## 📋 **Vue d'Ensemble**

**Objectif** : Système d'exercices interactifs avec évaluation automatique et feedback adaptatif  
**Version cible** : v1.7 (exercices intelligents)  
**Groupe** : 🏗️ ÉCOSYSTÈME - Exercices & PWA  
**Prérequis** : Phase 8 (Navigation UX) validée ✅

---

## 🎯 **Principes Fondamentaux & Architecture**

### 💪 **Architecture d'Exercices Adaptatifs**

**Types d'Exercices :**

- **Code Challenges** : Programmation avec validation automatique
- **Interactive Quizzes** : QCM adaptatifs avec explications
- **Drag & Drop** : Manipulation visuelle de concepts
- **Fill-in-the-Blanks** : Complétion de code/texte
- **Simulation Exercises** : Environnements virtuels interactifs

**Évaluation Intelligente :**

- **Automated Testing** : Validation code avec test suites
- **Fuzzy Matching** : Reconnaissance variantes de réponses
- **Partial Credit** : Points proportionnels à la progression
- **Adaptive Difficulty** : Ajustement temps réel de complexité
- **Peer Assessment** : Évaluation collaborative optionnelle

### 🧠 **Système de Feedback Avancé**

**Feedback Personnalisé :**

- **Instant Feedback** : Retour immédiat sur chaque action
- **Contextual Hints** : Indices progressifs selon blocage
- **Solution Pathways** : Multiples approches expliquées
- **Error Analysis** : Diagnostic automatique des erreurs
- **Learning Reinforcement** : Consolidation des concepts acquis

**Analytics Exercices :**

- **Attempt Patterns** : Analyse des stratégies d'approche
- **Time-to-Solution** : Optimisation de la vitesse de résolution
- **Error Categorization** : Classification des types d'erreurs
- **Concept Mastery** : Mesure de l'acquisition des compétences
- **Transfer Learning** : Application dans nouveaux contextes

### 🔬 **Approche Qualité & Innovation**

**Validation Pédagogique :**

- **Learning Objectives Alignment** : Correspondance avec objectifs
- **Bloom's Taxonomy Integration** : Niveaux cognitifs appropriés
- **Constructive Alignment** : Cohérence évaluation-apprentissage
- **Formative Assessment** : Évaluation pour l'apprentissage
- **Summative Assessment** : Validation des acquis

---

## 📚 **Références Modulaires**

### **[REF]** Exercise Engine : **[exercise-engine.md](../references/exercises/exercise-engine.md)**

- ✅ Moteur d'exécution code sécurisé
- ✅ Système de validation automatique
- ✅ Feedback adaptatif et progressif
- ✅ Analytics détaillées de performance

### **[REF]** Interactive Components : **[interactive-components.md](../references/exercises/interactive-components.md)**

- ✅ Composants drag & drop avancés
- ✅ Code editor avec autocomplétion
- ✅ Simulation environments
- ✅ Collaborative features

---

## 📝 **Instructions d'Implémentation**

### 💪 **Étape 9.1 : Exercise Engine Core**

**[FILE]** Créer `src/lib/exercises/exerciseEngine.ts` :

```ts
import { z } from "zod";
import type { UserProfile } from "$lib/firebase/collections";

// ===== TYPES D'EXERCICES =====
export const ExerciseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum([
    "code",
    "quiz",
    "drag_drop",
    "fill_blank",
    "simulation",
    "peer_review",
  ]),
  difficulty: z.number().min(0).max(1),
  estimatedTime: z.number().positive(), // minutes
  competenceIds: z.array(z.string()),
  learningObjectives: z.array(z.string()),

  // Configuration spécifique au type
  config: z.object({
    language: z.string().optional(), // Pour exercices code
    template: z.string().optional(), // Code de départ
    solution: z.string().optional(), // Solution de référence
    testCases: z
      .array(
        z.object({
          input: z.unknown(),
          expectedOutput: z.unknown(),
          description: z.string(),
          weight: z.number().default(1),
        })
      )
      .default([]),
    hints: z
      .array(
        z.object({
          trigger: z.string(), // Condition pour déclencher l'indice
          content: z.string(),
          delay: z.number().default(0), // Délai avant disponibilité
        })
      )
      .default([]),
    timeLimit: z.number().optional(), // Limite de temps en secondes
    maxAttempts: z.number().default(-1), // -1 = illimité
    allowPartialCredit: z.boolean().default(true),
  }),

  // Contenu adaptatif
  adaptiveElements: z
    .array(
      z.object({
        condition: z.string(), // Condition d'affichage
        content: z.string(),
        type: z.enum(["hint", "explanation", "example", "challenge"]),
      })
    )
    .default([]),

  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    isActive: z.boolean().default(true),
    bloomLevel: z.enum([
      "remember",
      "understand",
      "apply",
      "analyze",
      "evaluate",
      "create",
    ]),
    tags: z.array(z.string()).default([]),
  }),
});

export const ExerciseAttemptSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  startedAt: z.string(),
  submittedAt: z.string().optional(),
  completedAt: z.string().optional(),

  // État de l'exercice
  state: z.object({
    currentStep: z.number().default(0),
    userInput: z.unknown(),
    isCompleted: z.boolean().default(false),
    score: z.number().min(0).max(1).optional(),
    timeSpent: z.number().default(0), // secondes
    attemptNumber: z.number().positive(),
  }),

  // Résultats détaillés
  results: z.object({
    testResults: z
      .array(
        z.object({
          testId: z.string(),
          passed: z.boolean(),
          actualOutput: z.unknown(),
          expectedOutput: z.unknown(),
          error: z.string().optional(),
          executionTime: z.number().optional(),
        })
      )
      .default([]),
    hintsUsed: z.array(z.string()).default([]),
    mistakes: z
      .array(
        z.object({
          timestamp: z.string(),
          type: z.string(),
          description: z.string(),
          corrected: z.boolean(),
        })
      )
      .default([]),
    feedback: z
      .array(
        z.object({
          type: z.enum(["success", "error", "hint", "suggestion"]),
          message: z.string(),
          timestamp: z.string(),
        })
      )
      .default([]),
  }),

  // Analytics comportementales
  analytics: z.object({
    keystrokes: z.number().default(0),
    pauses: z
      .array(
        z.object({
          duration: z.number(),
          context: z.string(),
        })
      )
      .default([]),
    focusEvents: z
      .array(
        z.object({
          type: z.enum(["focus", "blur"]),
          timestamp: z.string(),
        })
      )
      .default([]),
    scrollEvents: z.number().default(0),
    clickEvents: z.number().default(0),
  }),
});

export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseAttempt = z.infer<typeof ExerciseAttemptSchema>;

// ===== MOTEUR D'EXERCICES =====
export class ExerciseEngine {
  private attempts = new Map<string, ExerciseAttempt>();
  private executionEnvironments = new Map<string, ExecutionEnvironment>();

  /**
   * Démarre une nouvelle tentative d'exercice
   */
  async startExercise(
    exercise: Exercise,
    userId: string,
    userProfile: UserProfile
  ): Promise<ExerciseSession> {
    const sessionId = crypto.randomUUID();
    const attemptId = crypto.randomUUID();

    // Créer tentative
    const attempt: ExerciseAttempt = {
      id: attemptId,
      exerciseId: exercise.id,
      userId,
      sessionId,
      startedAt: new Date().toISOString(),
      state: {
        currentStep: 0,
        userInput: null,
        isCompleted: false,
        timeSpent: 0,
        attemptNumber: (await this.getAttemptNumber(exercise.id, userId)) + 1,
      },
      results: {
        testResults: [],
        hintsUsed: [],
        mistakes: [],
        feedback: [],
      },
      analytics: {
        keystrokes: 0,
        pauses: [],
        focusEvents: [],
        scrollEvents: 0,
        clickEvents: 0,
      },
    };

    this.attempts.set(attemptId, attempt);

    // Adapter exercice selon profil utilisateur
    const adaptedExercise = await this.adaptExercise(exercise, userProfile);

    // Créer environnement d'exécution si nécessaire
    if (exercise.type === "code") {
      const environment = await this.createExecutionEnvironment(
        exercise.config.language || "javascript"
      );
      this.executionEnvironments.set(sessionId, environment);
    }

    return new ExerciseSession(attemptId, adaptedExercise, this);
  }

  /**
   * Soumet une réponse pour évaluation
   */
  async submitAnswer(
    attemptId: string,
    userInput: unknown
  ): Promise<EvaluationResult> {
    const attempt = this.attempts.get(attemptId);
    if (!attempt) {
      throw new Error("Exercise attempt not found");
    }

    const exercise = await this.getExerciseById(attempt.exerciseId);

    // Mise à jour état
    attempt.state.userInput = userInput;
    attempt.submittedAt = new Date().toISOString();

    // Évaluation selon type d'exercice
    const result = await this.evaluateAnswer(exercise, userInput, attempt);

    // Mise à jour résultats
    attempt.state.score = result.score;
    attempt.state.isCompleted = result.isComplete;
    attempt.results.testResults = result.testResults;

    if (result.isComplete) {
      attempt.completedAt = new Date().toISOString();
    }

    // Génération feedback adaptatif
    const feedback = await this.generateFeedback(exercise, result, attempt);
    attempt.results.feedback.push(...feedback);

    return result;
  }

  /**
   * Fournit un indice contextuel
   */
  async getHint(attemptId: string, context?: string): Promise<Hint | null> {
    const attempt = this.attempts.get(attemptId);
    if (!attempt) return null;

    const exercise = await this.getExerciseById(attempt.exerciseId);
    const availableHints = exercise.config.hints.filter(
      (hint) =>
        !attempt.results.hintsUsed.includes(hint.content) &&
        this.evaluateHintCondition(hint.trigger, attempt, context)
    );

    if (availableHints.length === 0) return null;

    // Sélectionner meilleur indice selon contexte
    const bestHint = this.selectBestHint(availableHints, attempt, context);

    // Enregistrer utilisation
    attempt.results.hintsUsed.push(bestHint.content);

    return {
      content: bestHint.content,
      type: "contextual",
      impact: this.calculateHintImpact(bestHint, attempt),
    };
  }

  /**
   * Exécute du code de manière sécurisée
   */
  async executeCode(
    sessionId: string,
    code: string,
    testCase?: TestCase
  ): Promise<ExecutionResult> {
    const environment = this.executionEnvironments.get(sessionId);
    if (!environment) {
      throw new Error("Execution environment not found");
    }

    try {
      const startTime = performance.now();
      const result = await environment.execute(code, testCase?.input);
      const executionTime = performance.now() - startTime;

      return {
        success: true,
        output: result,
        executionTime,
        memoryUsage: await environment.getMemoryUsage(),
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        executionTime: 0,
        memoryUsage: 0,
        error: error.message,
      };
    }
  }

  // ===== MÉTHODES PRIVÉES =====

  private async adaptExercise(
    exercise: Exercise,
    userProfile: UserProfile
  ): Promise<Exercise> {
    const adaptedExercise = { ...exercise };

    // Adaptation selon style d'apprentissage
    if (userProfile.learningProfile.style === "visual") {
      // Ajouter éléments visuels
      adaptedExercise.adaptiveElements.push({
        condition: "learning_style_visual",
        content: "Diagramme visuel du problème",
        type: "example",
      });
    }

    // Adaptation selon niveau de difficulté préféré
    const preferredDifficulty =
      userProfile.learningProfile.difficultyPreference;
    if (preferredDifficulty < 0.3 && exercise.difficulty > 0.7) {
      // Ajouter support pour débutants
      adaptedExercise.config.hints.unshift({
        trigger: "time_elapsed_30s",
        content: "Commencez par identifier les concepts clés nécessaires",
        delay: 0,
      });
    }

    return adaptedExercise;
  }

  private async evaluateAnswer(
    exercise: Exercise,
    userInput: unknown,
    attempt: ExerciseAttempt
  ): Promise<EvaluationResult> {
    switch (exercise.type) {
      case "code":
        return this.evaluateCodeExercise(
          exercise,
          userInput as string,
          attempt
        );
      case "quiz":
        return this.evaluateQuizExercise(exercise, userInput, attempt);
      case "drag_drop":
        return this.evaluateDragDropExercise(exercise, userInput, attempt);
      default:
        throw new Error(`Unsupported exercise type: ${exercise.type}`);
    }
  }

  private async evaluateCodeExercise(
    exercise: Exercise,
    code: string,
    attempt: ExerciseAttempt
  ): Promise<EvaluationResult> {
    const testResults: TestResult[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    for (const testCase of exercise.config.testCases) {
      const execution = await this.executeCode(
        attempt.sessionId,
        code,
        testCase
      );

      const passed =
        execution.success &&
        this.compareOutputs(execution.output, testCase.expectedOutput);

      const result: TestResult = {
        testId: crypto.randomUUID(),
        passed,
        actualOutput: execution.output,
        expectedOutput: testCase.expectedOutput,
        error: execution.error,
        executionTime: execution.executionTime,
      };

      testResults.push(result);

      if (passed) {
        totalScore += testCase.weight;
      }
      totalWeight += testCase.weight;
    }

    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    return {
      score: finalScore,
      isComplete: finalScore >= 0.7, // 70% pour validation
      testResults,
      feedback: this.generateCodeFeedback(testResults, code),
      suggestions: await this.generateCodeSuggestions(code, testResults),
    };
  }

  private compareOutputs(actual: unknown, expected: unknown): boolean {
    // Comparaison intelligente avec tolérance pour types numériques
    if (typeof actual === "number" && typeof expected === "number") {
      return Math.abs(actual - expected) < 1e-10;
    }

    // Comparaison JSON pour objets/arrays
    if (typeof actual === "object" && typeof expected === "object") {
      return JSON.stringify(actual) === JSON.stringify(expected);
    }

    // Comparaison string avec normalisation
    if (typeof actual === "string" && typeof expected === "string") {
      return actual.trim().toLowerCase() === expected.trim().toLowerCase();
    }

    return actual === expected;
  }

  private async generateFeedback(
    exercise: Exercise,
    result: EvaluationResult,
    attempt: ExerciseAttempt
  ): Promise<Feedback[]> {
    const feedback: Feedback[] = [];

    if (result.isComplete) {
      feedback.push({
        type: "success",
        message: this.generateSuccessMessage(result.score, attempt),
        timestamp: new Date().toISOString(),
      });
    } else {
      feedback.push({
        type: "error",
        message: this.generateErrorMessage(result, attempt),
        timestamp: new Date().toISOString(),
      });
    }

    return feedback;
  }

  private generateSuccessMessage(
    score: number,
    attempt: ExerciseAttempt
  ): string {
    const messages = [
      "Excellent travail ! Vous maîtrisez parfaitement ce concept.",
      "Bravo ! Votre solution est élégante et efficace.",
      "Parfait ! Vous progressez rapidement.",
      "Très bien ! Continuez sur cette lancée.",
    ];

    if (score >= 0.95) {
      return messages[0];
    } else if (score >= 0.85) {
      return messages[1];
    } else if (attempt.state.attemptNumber === 1) {
      return messages[2];
    } else {
      return messages[3];
    }
  }
}

// ===== TYPES SUPPLÉMENTAIRES =====
interface ExecutionEnvironment {
  execute(code: string, input?: unknown): Promise<unknown>;
  getMemoryUsage(): Promise<number>;
  cleanup(): Promise<void>;
}

interface ExecutionResult {
  success: boolean;
  output: unknown;
  executionTime: number;
  memoryUsage: number;
  error: string | null;
}

interface EvaluationResult {
  score: number;
  isComplete: boolean;
  testResults: TestResult[];
  feedback: string[];
  suggestions: string[];
}

interface TestResult {
  testId: string;
  passed: boolean;
  actualOutput: unknown;
  expectedOutput: unknown;
  error?: string;
  executionTime?: number;
}

interface TestCase {
  input: unknown;
  expectedOutput: unknown;
  description: string;
  weight: number;
}

interface Hint {
  content: string;
  type: "contextual" | "progressive" | "solution";
  impact: number;
}

interface Feedback {
  type: "success" | "error" | "hint" | "suggestion";
  message: string;
  timestamp: string;
}

// ===== SESSION D'EXERCICE =====
export class ExerciseSession {
  constructor(
    private attemptId: string,
    private exercise: Exercise,
    private engine: ExerciseEngine
  ) {}

  async submitAnswer(answer: unknown): Promise<EvaluationResult> {
    return this.engine.submitAnswer(this.attemptId, answer);
  }

  async getHint(context?: string): Promise<Hint | null> {
    return this.engine.getHint(this.attemptId, context);
  }

  async executeCode(code: string): Promise<ExecutionResult> {
    return this.engine.executeCode(this.attemptId, code);
  }

  getExercise(): Exercise {
    return this.exercise;
  }
}

// Instance globale
export const exerciseEngine = new ExerciseEngine();
```

### 🎯 **Étape 9.2 : Interactive Exercise Components**

**[FILE]** Créer `src/lib/components/exercises/CodeExercise.svelte` :

```svelte
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { CodeEditor } from "$lib/components/editor/CodeEditor.svelte";
  import { TestRunner } from "$lib/components/exercises/TestRunner.svelte";
  import Button from "$lib/components/atoms/Button.svelte";
  import type {
    Exercise,
    ExerciseSession,
    EvaluationResult,
  } from "$lib/exercises/exerciseEngine";

  // ===== PROPS =====
  export let exercise: Exercise;
  export let session: ExerciseSession;

  // ===== STATE =====
  let code = exercise.config.template || "";
  let isExecuting = false;
  let lastResult: EvaluationResult | null = null;
  let hints: string[] = [];
  let showSolution = false;
  let timeSpent = 0;
  let timer: number;

  // Stores
  const executionOutput = writable<string>("");
  const testResults = writable<any[]>([]);

  // ===== LIFECYCLE =====
  onMount(() => {
    // Démarrer timer
    timer = setInterval(() => {
      timeSpent += 1;
    }, 1000);

    // Restaurer code depuis localStorage si disponible
    const savedCode = localStorage.getItem(`exercise_${exercise.id}`);
    if (savedCode) {
      code = savedCode;
    }
  });

  onDestroy(() => {
    clearInterval(timer);

    // Sauvegarder code
    localStorage.setItem(`exercise_${exercise.id}`, code);
  });

  // ===== METHODS =====
  async function runCode() {
    if (isExecuting) return;

    isExecuting = true;
    executionOutput.set("Exécution en cours...");

    try {
      const result = await session.executeCode(code);

      if (result.success) {
        executionOutput.set(formatOutput(result.output));
      } else {
        executionOutput.set(`Erreur: ${result.error}`);
      }
    } catch (error) {
      executionOutput.set(`Erreur d'exécution: ${error.message}`);
    } finally {
      isExecuting = false;
    }
  }

  async function submitSolution() {
    if (isExecuting) return;

    isExecuting = true;

    try {
      const result = await session.submitAnswer(code);
      lastResult = result;
      testResults.set(result.testResults);

      if (result.isComplete) {
        showSuccessMessage(result.score);
      } else {
        showErrorMessage(result);
      }
    } catch (error) {
      showError(`Erreur de soumission: ${error.message}`);
    } finally {
      isExecuting = false;
    }
  }

  async function getHint() {
    try {
      const hint = await session.getHint();
      if (hint) {
        hints = [...hints, hint.content];
        showHintMessage(hint.content);
      } else {
        showInfo("Aucun indice disponible pour le moment.");
      }
    } catch (error) {
      showError("Impossible de récupérer un indice.");
    }
  }

  function toggleSolution() {
    showSolution = !showSolution;
    if (showSolution && exercise.config.solution) {
      code = exercise.config.solution;
    }
  }

  function resetCode() {
    code = exercise.config.template || "";
    executionOutput.set("");
    testResults.set([]);
    hints = [];
    lastResult = null;
  }

  function formatOutput(output: unknown): string {
    if (output === null || output === undefined) {
      return "undefined";
    }
    if (typeof output === "object") {
      return JSON.stringify(output, null, 2);
    }
    return String(output);
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Notifications
  function showSuccessMessage(score: number) {
    // Implementation avec toast ou notification
    console.log(`Succès ! Score: ${Math.round(score * 100)}%`);
  }

  function showErrorMessage(result: EvaluationResult) {
    console.log("Erreurs détectées:", result.feedback);
  }

  function showHintMessage(hint: string) {
    console.log("Indice:", hint);
  }

  function showInfo(message: string) {
    console.log("Info:", message);
  }

  function showError(message: string) {
    console.error("Erreur:", message);
  }
</script>

<!-- ===== TEMPLATE ===== -->
<div class="code-exercise">
  <!-- Header avec informations exercice -->
  <header class="code-exercise__header">
    <div class="code-exercise__info">
      <h2 class="code-exercise__title">{exercise.title}</h2>
      <p class="code-exercise__description">{exercise.description}</p>

      <div class="code-exercise__meta">
        <span class="code-exercise__difficulty">
          Difficulté: {Math.round(exercise.difficulty * 100)}%
        </span>
        <span class="code-exercise__time">
          Temps: {formatTime(timeSpent)}
        </span>
        {#if exercise.config.timeLimit}
          <span class="code-exercise__time-limit">
            Limite: {Math.floor(exercise.config.timeLimit / 60)}min
          </span>
        {/if}
      </div>
    </div>

    <!-- Actions principales -->
    <div class="code-exercise__actions">
      <Button
        variant="secondary"
        size="sm"
        iconLeft="lightbulb"
        on:click={getHint}
        disabled={isExecuting}
      >
        Indice
      </Button>

      <Button
        variant="secondary"
        size="sm"
        iconLeft="refresh"
        on:click={resetCode}
        disabled={isExecuting}
      >
        Reset
      </Button>

      {#if exercise.config.solution}
        <Button
          variant="ghost"
          size="sm"
          iconLeft="eye"
          on:click={toggleSolution}
          disabled={isExecuting}
        >
          {showSolution ? "Masquer" : "Solution"}
        </Button>
      {/if}
    </div>
  </header>

  <!-- Zone de travail principale -->
  <div class="code-exercise__workspace">
    <!-- Éditeur de code -->
    <div class="code-exercise__editor">
      <div class="code-exercise__editor-header">
        <h3>Votre solution</h3>
        <span class="code-exercise__language">
          {exercise.config.language || "JavaScript"}
        </span>
      </div>

      <CodeEditor
        bind:value={code}
        language={exercise.config.language || "javascript"}
        disabled={isExecuting}
        placeholder="Tapez votre code ici..."
        lineNumbers={true}
        autocompletion={true}
        linting={true}
      />
    </div>

    <!-- Console de sortie -->
    <div class="code-exercise__console">
      <div class="code-exercise__console-header">
        <h3>Console</h3>
        <Button
          variant="primary"
          size="sm"
          iconLeft="play"
          loading={isExecuting}
          on:click={runCode}
        >
          Exécuter
        </Button>
      </div>

      <div class="code-exercise__output">
        {#if $executionOutput}
          <pre class="code-exercise__output-content">{$executionOutput}</pre>
        {:else}
          <div class="code-exercise__output-placeholder">
            Exécutez votre code pour voir le résultat
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Tests et résultats -->
  {#if exercise.config.testCases.length > 0}
    <div class="code-exercise__tests">
      <TestRunner
        testCases={exercise.config.testCases}
        results={$testResults}
        isRunning={isExecuting}
      />
    </div>
  {/if}

  <!-- Indices utilisés -->
  {#if hints.length > 0}
    <div class="code-exercise__hints">
      <h3>Indices utilisés</h3>
      <div class="code-exercise__hints-list">
        {#each hints as hint, index}
          <div class="code-exercise__hint">
            <span class="code-exercise__hint-number">{index + 1}</span>
            <span class="code-exercise__hint-content">{hint}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Actions de soumission -->
  <footer class="code-exercise__footer">
    <div class="code-exercise__submission">
      <Button
        variant="primary"
        size="lg"
        iconRight="check"
        loading={isExecuting}
        on:click={submitSolution}
        fullWidth
      >
        Valider la solution
      </Button>

      {#if lastResult}
        <div class="code-exercise__last-result">
          <span class="code-exercise__score">
            Score: {Math.round(lastResult.score * 100)}%
          </span>
          {#if lastResult.isComplete}
            <span class="code-exercise__status code-exercise__status--success">
              ✅ Validé
            </span>
          {:else}
            <span class="code-exercise__status code-exercise__status--error">
              ❌ À améliorer
            </span>
          {/if}
        </div>
      {/if}
    </div>
  </footer>
</div>

<!-- ===== STYLES ===== -->
<style>
  .code-exercise {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    max-width: 100%;
    height: 100vh;
    padding: var(--space-6);
    background: var(--color-surface-bg);
  }

  .code-exercise__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--color-surface-card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .code-exercise__info {
    flex: 1;
  }

  .code-exercise__title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 var(--space-2) 0;
  }

  .code-exercise__description {
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    margin: 0 0 var(--space-3) 0;
  }

  .code-exercise__meta {
    display: flex;
    gap: var(--space-4);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .code-exercise__actions {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .code-exercise__workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
    flex: 1;
    min-height: 0;
  }

  .code-exercise__editor,
  .code-exercise__console {
    display: flex;
    flex-direction: column;
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .code-exercise__editor-header,
  .code-exercise__console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    background: var(--color-surface-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .code-exercise__editor-header h3,
  .code-exercise__console-header h3 {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  .code-exercise__language {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    background: var(--color-primary-100);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
  }

  .code-exercise__output {
    flex: 1;
    padding: var(--space-4);
    overflow: auto;
  }

  .code-exercise__output-content {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .code-exercise__output-placeholder {
    color: var(--color-text-secondary);
    font-style: italic;
    text-align: center;
    padding: var(--space-8);
  }

  .code-exercise__tests {
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
  }

  .code-exercise__hints {
    background: var(--color-warning-50);
    border: 1px solid var(--color-warning-200);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
  }

  .code-exercise__hints h3 {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--color-warning-800);
    margin: 0 0 var(--space-3) 0;
  }

  .code-exercise__hints-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .code-exercise__hint {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .code-exercise__hint-number {
    background: var(--color-warning-200);
    color: var(--color-warning-800);
    border-radius: var(--radius-full);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    font-weight: 600;
    flex-shrink: 0;
  }

  .code-exercise__hint-content {
    color: var(--color-warning-700);
    line-height: var(--line-height-relaxed);
  }

  .code-exercise__footer {
    padding: var(--space-4);
    background: var(--color-surface-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .code-exercise__submission {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .code-exercise__last-result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3);
    background: var(--color-surface-bg);
    border-radius: var(--radius-md);
  }

  .code-exercise__score {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .code-exercise__status {
    font-weight: 600;

    &--success {
      color: var(--color-success);
    }

    &--error {
      color: var(--color-error);
    }
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 1024px) {
    .code-exercise__workspace {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
    }

    .code-exercise__console {
      max-height: 300px;
    }
  }

  @media (max-width: 768px) {
    .code-exercise {
      padding: var(--space-4);
      gap: var(--space-4);
    }

    .code-exercise__header {
      flex-direction: column;
      gap: var(--space-3);
    }

    .code-exercise__actions {
      width: 100%;
      justify-content: stretch;
    }

    .code-exercise__meta {
      flex-direction: column;
      gap: var(--space-1);
    }
  }
</style>
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:exercises        # Tests moteur exercices
[TEST] npm run test:code-execution   # Tests exécution code sécurisée
[TEST] npm run test:adaptive-feedback # Tests feedback adaptatif
[TEST] npm run validate 9           # Validation complète Phase 9
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Moteur d'exercices multi-types (code, quiz, drag&drop)
- [ ] **[CHECK]** Exécution code sécurisée avec sandbox
- [ ] **[CHECK]** Système d'évaluation automatique intelligent
- [ ] **[CHECK]** Feedback adaptatif et personnalisé
- [ ] **[CHECK]** Indices contextuels progressifs
- [ ] **[CHECK]** Analytics comportementales détaillées
- [ ] **[CHECK]** Interface utilisateur responsive et accessible
- [ ] **[CHECK]** Performance exécution < 2s pour code simple

---

## 🏷️ **Processus de Release v1.7**

```bash
[CMD] npm run validate 9              # Validation complète Phase 9
[CMD] git add . && git commit -m "feat: Phase 9 - Exercises System complete"
[CMD] git tag v1.7                   # Tag release exercices
```

**🚫 STOP** : Ne pas passer à Phase 10 sans validation sécurité et performance.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [📱 Phase 10 : PWA & Offline](phase-10-pwa-offline.md)  
**Groupe actuel** : 🏗️ ÉCOSYSTÈME - Exercices & PWA  
**Dépendance** : Phase 9 (Exercises System) validée ✅
