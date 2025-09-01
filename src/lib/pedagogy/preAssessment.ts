/**
 * Service de Pré-évaluation - Phase 4
 * Système adaptatif pour évaluer les connaissances préalables
 */

import { writable, derived, get } from "svelte/store";
import type {
  PreEvaluationQuestion,
  PreEvaluationResponse,
  PreEvaluationResult,
  AdaptiveLearningPath,
} from "$lib/types/pedagogy";

// ===== STORES =====
export const currentAssessment = writable<PreEvaluationQuestion[]>([]);
export const userResponses = writable<PreEvaluationResponse[]>([]);
export const assessmentState = writable<
  "idle" | "running" | "completed" | "analyzing"
>("idle");
export const currentQuestionIndex = writable<number>(0);

// Store dérivé pour l'analyse des réponses
export const assessmentAnalysis = derived(
  [userResponses, assessmentState],
  ([$responses, $state]) => {
    if ($state === "completed" && $responses.length > 0) {
      return analyzeResponses($responses);
    }
    return null;
  }
);

// ===== BANQUE DE QUESTIONS =====
const QUESTION_BANK: PreEvaluationQuestion[] = [
  // Questions JavaScript - Niveau Débutant
  {
    id: "js-001",
    type: "multiple_choice",
    question:
      "Quelle est la méthode correcte pour déclarer une variable en JavaScript moderne ?",
    competence: "javascript-fundamentals",
    difficulty: 2,
    options: ["var myVar = 5;", "let myVar = 5;", "myVar = 5;", "const myVar;"],
    correct_answer: "let myVar = 5;",
    explanation:
      "let est la méthode moderne recommandée pour déclarer des variables",
    time_limit: 30,
    skill_indicators: ["variable-declaration", "modern-javascript"],
  },
  // Questions TypeScript - Niveau Intermédiaire
  {
    id: "ts-001",
    type: "multiple_choice",
    question:
      "Quel est l'avantage principal de TypeScript par rapport à JavaScript ?",
    competence: "typescript-fundamentals",
    difficulty: 3,
    options: [
      "Plus rapide à l'exécution",
      "Typage statique",
      "Syntaxe plus simple",
      "Compatibilité mobile",
    ],
    correct_answer: "Typage statique",
    explanation:
      "Le typage statique aide à détecter les erreurs à la compilation",
    time_limit: 45,
    skill_indicators: ["typescript-benefits", "static-typing"],
  },
  // Questions Svelte - Niveau Avancé
  {
    id: "sv-001",
    type: "multiple_choice",
    question: "Comment implémenter une réactivité dérivée en Svelte ?",
    competence: "svelte-advanced",
    difficulty: 4,
    options: [
      "$: derivedValue = baseValue * 2;",
      "derived(baseValue, v => v * 2);",
      "reactive(() => baseValue * 2);",
      "computed(() => baseValue * 2);",
    ],
    correct_answer: "$: derivedValue = baseValue * 2;",
    explanation: "Syntaxe reactive statement de Svelte",
    time_limit: 60,
    skill_indicators: ["svelte-reactivity", "reactive-statements"],
  },
  // Questions HTML/CSS - Niveau Débutant
  {
    id: "html-001",
    type: "multiple_choice",
    question:
      "Quelle balise HTML est sémantiquement correcte pour un titre principal ?",
    competence: "html-semantics",
    difficulty: 1,
    options: ["<title>", "<h1>", "<header>", "<main>"],
    correct_answer: "<h1>",
    explanation: "h1 représente le titre principal d'une page",
    time_limit: 20,
    skill_indicators: ["html-semantics", "accessibility"],
  },
  // Questions Git - Niveau Intermédiaire
  {
    id: "git-001",
    type: "multiple_choice",
    question:
      "Quelle commande Git permet de fusionner une branche dans la branche actuelle ?",
    competence: "git-workflow",
    difficulty: 3,
    options: [
      "git branch merge",
      "git merge <branche>",
      "git pull <branche>",
      "git join <branche>",
    ],
    correct_answer: "git merge <branche>",
    explanation:
      "git merge fusionne une branche spécifiée dans la branche actuelle",
    time_limit: 30,
    skill_indicators: ["git-commands", "branch-management"],
  },
];

// ===== ALGORITHME ADAPTATIF =====
export class AdaptiveEngine {
  private responses: PreEvaluationResponse[] = [];
  private competenceScores: Map<string, number> = new Map();

  /**
   * Calcule la probabilité de maîtrise d'une compétence (Knowledge Tracing)
   */
  calculateMasteryProbability(
    skill: string,
    responses: Array<{ correct: boolean; timeSpent: number }>,
    priorKnowledge: number = 0.5
  ): number {
    if (responses.length === 0) return priorKnowledge;

    let probability = priorKnowledge;
    const learningRate = 0.1;
    const slipRate = 0.15;
    const guessRate = 0.25;

    for (const response of responses) {
      if (response.correct) {
        probability = probability + (1 - probability) * learningRate;
      } else {
        probability = probability * (1 - slipRate);
      }
    }

    return Math.max(0, Math.min(1, probability));
  }

  /**
   * Adapte la difficulté selon les performances
   */
  adaptDifficulty(
    responses: Array<{ correct: boolean; timeSpent: number }>,
    currentDifficulty: number
  ): number {
    const correctRate =
      responses.filter((r) => r.correct).length / responses.length;
    const avgTime =
      responses.reduce((acc, r) => acc + r.timeSpent, 0) / responses.length;

    let adjustment = 0;

    // Ajustement basé sur le taux de réussite
    if (correctRate > 0.8) {
      adjustment += 0.1; // Augmenter la difficulté
    } else if (correctRate < 0.4) {
      adjustment -= 0.1; // Diminuer la difficulté
    }

    // Ajustement basé sur le temps de réponse
    if (avgTime < 20) {
      adjustment += 0.05; // Trop rapide, augmenter
    } else if (avgTime > 90) {
      adjustment -= 0.05; // Trop lent, diminuer
    }

    return Math.max(0.1, Math.min(1.0, currentDifficulty + adjustment));
  }

  /**
   * Calcule les métriques d'engagement
   */
  calculateEngagementMetrics(session: {
    duration: number;
    interactions: number;
    questionsAnswered: number;
    correctAnswers: number;
  }): {
    focus_score: number;
    interaction_rate: number;
    completion_rate: number;
    accuracy_rate: number;
  } {
    const focus_score = Math.min(
      1,
      session.interactions / (session.duration / 60)
    ); // interactions par minute
    const interaction_rate = session.interactions / session.questionsAnswered;
    const completion_rate =
      session.questionsAnswered / (session.questionsAnswered + 5); // Supposons 5 questions non répondues
    const accuracy_rate = session.correctAnswers / session.questionsAnswered;

    return {
      focus_score: Math.max(0, Math.min(1, focus_score)),
      interaction_rate: Math.max(0, interaction_rate),
      completion_rate: Math.max(0, Math.min(1, completion_rate)),
      accuracy_rate: Math.max(0, Math.min(1, accuracy_rate)),
    };
  }

  /**
   * Sélectionne la prochaine question basée sur les réponses précédentes
   */
  selectNextQuestion(
    availableQuestions: PreEvaluationQuestion[]
  ): PreEvaluationQuestion | null {
    const answered = this.responses.map((r) => r.question_id);
    const remaining = availableQuestions.filter(
      (q) => !answered.includes(q.id)
    );

    if (remaining.length === 0) return null;

    // Si première question, commencer par niveau intermédiaire (difficulté 3)
    if (this.responses.length === 0) {
      return remaining.find((q) => q.difficulty === 3) || remaining[0];
    }

    // Adapter selon la performance récente
    const recentPerformance = this.calculateRecentPerformance();

    if (recentPerformance > 0.8) {
      // Performance élevée -> questions plus difficiles (4-5)
      return (
        remaining.find((q) => q.difficulty >= 4) ||
        remaining.find((q) => q.difficulty === 3) ||
        remaining[0]
      );
    } else if (recentPerformance < 0.4) {
      // Performance faible -> questions plus faciles (1-2)
      return (
        remaining.find((q) => q.difficulty <= 2) ||
        remaining.find((q) => q.difficulty === 3) ||
        remaining[0]
      );
    } else {
      // Performance moyenne -> niveau intermédiaire (2-3)
      return (
        remaining.find((q) => q.difficulty === 3) ||
        remaining.find((q) => q.difficulty === 2) ||
        remaining[0]
      );
    }
  }

  /**
   * Calcule la performance récente (3 dernières questions)
   */
  private calculateRecentPerformance(): number {
    const recentResponses = this.responses.slice(-3);
    if (recentResponses.length === 0) return 0.5;

    const correctCount = recentResponses.filter((r) =>
      this.isCorrect(r)
    ).length;
    return correctCount / recentResponses.length;
  }

  /**
   * Vérifie si une réponse est correcte
   */
  private isCorrect(response: PreEvaluationResponse): boolean {
    const question = QUESTION_BANK.find((q) => q.id === response.question_id);
    if (!question) return false;

    return question.correct_answer === response.answer;
  }

  /**
   * Met à jour les scores des compétences
   */
  updateCompetenceScores(response: PreEvaluationResponse): void {
    this.responses.push(response);

    const question = QUESTION_BANK.find((q) => q.id === response.question_id);
    if (!question) return;

    const isCorrect = this.isCorrect(response);
    const currentScore = this.competenceScores.get(question.competence) || 0.5;

    // Algorithme de Knowledge Tracing simplifié
    const learningRate = 0.3;
    const forgettingRate = 0.1;

    if (isCorrect) {
      const newScore = currentScore + (1 - currentScore) * learningRate;
      this.competenceScores.set(question.competence, Math.min(1, newScore));
    } else {
      const newScore = currentScore - currentScore * forgettingRate;
      this.competenceScores.set(question.competence, Math.max(0, newScore));
    }
  }

  /**
   * Détermine si l'évaluation est terminée
   */
  shouldContinue(): boolean {
    const minQuestions = 3;
    const maxQuestions = 8;
    const confidenceThreshold = 0.15; // Seuil de variance acceptable

    if (this.responses.length < minQuestions) return true;
    if (this.responses.length >= maxQuestions) return false;

    // Arrêter si variance des scores est faible (estimation stable)
    const scores = Array.from(this.competenceScores.values());
    if (scores.length < 2) return true;

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) /
      scores.length;

    return variance > confidenceThreshold;
  }

  /**
   * Génère l'analyse complète des réponses
   */
  generateAnalysis(): any {
    const correctResponses = this.responses.filter((r) => this.isCorrect(r));
    const totalQuestions = this.responses.length;
    const rawScore = correctResponses.length;
    const percentage =
      totalQuestions > 0 ? (rawScore / totalQuestions) * 100 : 0;

    // Score ajusté selon la difficulté
    let weightedScore = 0;
    let totalWeight = 0;

    for (const response of this.responses) {
      const question = QUESTION_BANK.find((q) => q.id === response.question_id);
      if (question) {
        const weight = question.difficulty;
        const isCorrect = this.isCorrect(response);
        weightedScore += isCorrect ? weight : 0;
        totalWeight += weight;
      }
    }

    const adjustedScore =
      totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;

    // Niveau de compétence déterminé
    let competenceLevel: "beginner" | "intermediate" | "advanced" | "expert";
    if (adjustedScore >= 85) competenceLevel = "expert";
    else if (adjustedScore >= 70) competenceLevel = "advanced";
    else if (adjustedScore >= 50) competenceLevel = "intermediate";
    else competenceLevel = "beginner";

    // Analytics
    const avgTimePerQuestion =
      this.responses.length > 0
        ? this.responses.reduce((acc, r) => acc + r.time_taken, 0) /
          this.responses.length
        : 0;

    // Corrélation confiance/justesse
    const confidenceCorrelation = this.calculateConfidenceCorrelation();

    // Performance par niveau de difficulté
    const difficultyProgression = this.calculateDifficultyProgression();

    // Recommandations
    const recommendations = this.generateRecommendations(
      competenceLevel,
      adjustedScore
    );

    return {
      rawScore,
      percentage,
      adjustedScore,
      competenceLevel,
      avgTimePerQuestion,
      confidenceCorrelation,
      difficultyProgression,
      recommendations,
      competenceScores: Object.fromEntries(this.competenceScores),
    };
  }

  private calculateConfidenceCorrelation(): number {
    const validResponses = this.responses.filter(
      (r) => r.confidence_level !== undefined
    );
    if (validResponses.length < 2) return 0;

    let correlation = 0;
    let count = 0;

    for (const response of validResponses) {
      const isCorrect = this.isCorrect(response) ? 1 : 0;
      const confidence = (response.confidence_level! - 1) / 4; // Normaliser 0-1

      correlation += isCorrect === 1 && confidence > 0.6 ? 1 : 0;
      count++;
    }

    return count > 0 ? correlation / count : 0;
  }

  private calculateDifficultyProgression(): number[] {
    const progression = [0, 0, 0, 0, 0]; // Pour les difficultés 1-5

    for (const response of this.responses) {
      const question = QUESTION_BANK.find((q) => q.id === response.question_id);
      if (question) {
        const isCorrect = this.isCorrect(response) ? 1 : 0;
        const diffIndex = question.difficulty - 1;
        progression[diffIndex] = isCorrect;
      }
    }

    return progression;
  }

  private generateRecommendations(level: string, score: number): string[] {
    const recommendations: string[] = [];

    if (level === "beginner") {
      recommendations.push("Commencer par les concepts fondamentaux");
      recommendations.push("Privilégier les exercices guidés");
      recommendations.push("Prévoir plus de temps pour chaque concept");
    } else if (level === "intermediate") {
      recommendations.push("Alterner théorie et pratique");
      recommendations.push("Utiliser des projets pratiques");
      recommendations.push("Réviser les bases si nécessaire");
    } else if (level === "advanced") {
      recommendations.push("Aborder des concepts avancés");
      recommendations.push("Travailler sur des projets complexes");
      recommendations.push("Enseigner à d'autres pour renforcer");
    } else {
      recommendations.push("Créer vos propres projets");
      recommendations.push("Explorer des technologies émergentes");
      recommendations.push("Contribuer à des projets open source");
    }

    return recommendations;
  }
}

// ===== GESTIONNAIRE PRINCIPAL =====
export class PreAssessmentManager {
  private adaptiveEngine: AdaptiveEngine;
  private sessionId: string;
  private userId: string = "";

  constructor() {
    this.adaptiveEngine = new AdaptiveEngine();
    this.sessionId = this.generateSessionId();
  }

  /**
   * Démarre une nouvelle évaluation
   */
  async startAssessment(
    userId: string,
    targetCompetences?: string[]
  ): Promise<void> {
    this.userId = userId;

    // Filtrer les questions selon les compétences cibles
    const relevantQuestions = targetCompetences
      ? QUESTION_BANK.filter((q) => targetCompetences.includes(q.competence))
      : QUESTION_BANK;

    currentAssessment.set(relevantQuestions);
    userResponses.set([]);
    assessmentState.set("running");
    currentQuestionIndex.set(0);

    console.log(`🎯 Pré-évaluation démarrée pour l'utilisateur ${userId}`);
    console.log(`📝 ${relevantQuestions.length} questions disponibles`);
  }

  /**
   * Traite une réponse utilisateur
   */
  async submitResponse(
    response: Omit<PreEvaluationResponse, "timestamp">
  ): Promise<boolean> {
    const fullResponse: PreEvaluationResponse = {
      ...response,
      timestamp: new Date(),
    };

    // Mettre à jour les stores
    userResponses.update((responses) => [...responses, fullResponse]);

    // Mettre à jour le moteur adaptatif
    this.adaptiveEngine.updateCompetenceScores(fullResponse);

    // Vérifier si l'évaluation doit continuer
    const shouldContinue = this.adaptiveEngine.shouldContinue();

    if (shouldContinue) {
      // Passer à la question suivante
      const questions = get(currentAssessment);
      const nextQuestion = this.adaptiveEngine.selectNextQuestion(questions);

      if (nextQuestion) {
        const nextIndex = questions.findIndex((q) => q.id === nextQuestion.id);
        currentQuestionIndex.set(nextIndex);
        return true;
      }
    }

    // Terminer l'évaluation
    await this.completeAssessment();
    return false;
  }

  /**
   * Termine l'évaluation et génère le résultat
   */
  private async completeAssessment(): Promise<void> {
    assessmentState.set("analyzing");

    // Simuler le temps d'analyse
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const analysis = this.adaptiveEngine.generateAnalysis();

    console.log("🧠 Analyse de pré-évaluation terminée:", analysis);

    assessmentState.set("completed");
  }

  /**
   * Récupère la question actuelle
   */
  getCurrentQuestion(): PreEvaluationQuestion | null {
    const questions = get(currentAssessment);
    const index = get(currentQuestionIndex);
    return questions[index] || null;
  }

  /**
   * Récupère la prochaine question recommandée
   */
  getNextRecommendedQuestion(): PreEvaluationQuestion | null {
    const questions = get(currentAssessment);
    return this.adaptiveEngine.selectNextQuestion(questions);
  }

  /**
   * Génère un ID de session unique
   */
  private generateSessionId(): string {
    return `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Génère le résultat complet de l'évaluation
   */
  generateResult(): PreEvaluationResult | null {
    const responses = get(userResponses);
    const questions = get(currentAssessment);

    if (responses.length === 0) return null;

    const analysis = this.adaptiveEngine.generateAnalysis();
    const startTime = responses[0]?.timestamp;
    const endTime = responses[responses.length - 1]?.timestamp;
    const totalDuration =
      endTime && startTime ? endTime.getTime() - startTime.getTime() : 0;

    // Générer un parcours adaptatif basique
    const adaptivePath: AdaptiveLearningPath = {
      user_id: this.userId,
      competence: questions[0]?.competence || "general",
      current_level: analysis.competenceLevel,
      target_level: this.getTargetLevel(analysis.competenceLevel),
      estimated_completion_time: this.estimatePathDuration(
        analysis.competenceLevel
      ),
      learning_style: this.generateLearningStyle(),
      recommended_resources: [],
      milestones: this.generateMilestones(analysis.competenceLevel),
      adaptation_triggers: [],
      personalization_factors: [],
    };

    const result: PreEvaluationResult = {
      user_id: this.userId,
      competence: questions[0]?.competence || "general",
      session_id: this.sessionId,
      start_time: startTime || new Date(),
      end_time: endTime || new Date(),
      total_duration: totalDuration,
      questions: questions.filter((q) =>
        responses.some((r) => r.question_id === q.id)
      ),
      responses,
      score: {
        raw_score: analysis.rawScore,
        percentage: analysis.percentage,
        adjusted_score: analysis.adjustedScore,
        competence_level: analysis.competenceLevel,
      },
      analytics: {
        average_time_per_question: analysis.avgTimePerQuestion,
        confidence_correlation: analysis.confidenceCorrelation,
        difficulty_progression: analysis.difficultyProgression,
        recommendations: analysis.recommendations,
      },
      adaptive_path: adaptivePath,
    };

    return result;
  }

  private estimatePathDuration(level: string): number {
    // Estimation en heures selon le niveau
    switch (level) {
      case "beginner":
        return 20;
      case "intermediate":
        return 15;
      case "advanced":
        return 10;
      case "expert":
        return 5;
      default:
        return 15;
    }
  }

  private getTargetLevel(
    currentLevel: string
  ): "beginner" | "intermediate" | "advanced" | "expert" {
    // Niveau cible (un niveau au-dessus)
    switch (currentLevel) {
      case "beginner":
        return "intermediate";
      case "intermediate":
        return "advanced";
      case "advanced":
        return "expert";
      case "expert":
        return "expert";
      default:
        return "intermediate";
    }
  }

  private generateLearningStyle(): any {
    // Génération basique d'un style d'apprentissage
    return {
      visual: 70,
      auditory: 20,
      kinesthetic: 50,
      reading_writing: 60,
      dominant_style: "visual" as const,
      learning_pace: "normal" as const,
      attention_span: "medium" as const,
    };
  }

  private generateMilestones(level: string): any[] {
    // Génération basique de jalons selon le niveau
    const baseMilestones = [
      {
        title: "Concepts fondamentaux",
        estimated_duration: 25,
        completion_criteria: ["Comprendre les bases"],
        resources: [],
      },
      {
        title: "Application pratique",
        estimated_duration: 35,
        completion_criteria: ["Réaliser des exercices"],
        resources: [],
      },
      {
        title: "Projet personnel",
        estimated_duration: 40,
        completion_criteria: ["Créer un projet"],
        resources: [],
      },
    ];

    if (level === "beginner") {
      return [
        {
          title: "Initiation",
          estimated_duration: 20,
          completion_criteria: ["Découvrir les concepts"],
          resources: [],
        },
        ...baseMilestones,
      ];
    }

    return baseMilestones;
  }

  /**
   * Remet à zéro l'évaluation
   */
  reset(): void {
    currentAssessment.set([]);
    userResponses.set([]);
    assessmentState.set("idle");
    currentQuestionIndex.set(0);
    this.adaptiveEngine = new AdaptiveEngine();
    this.sessionId = this.generateSessionId();
    this.userId = "";
  }
}

// ===== FONCTION D'ANALYSE =====
function analyzeResponses(responses: PreEvaluationResponse[]): any {
  if (responses.length === 0) return null;

  const engine = new AdaptiveEngine();

  // Rejouer les réponses pour recalculer l'analyse
  for (const response of responses) {
    engine.updateCompetenceScores(response);
  }

  return engine.generateAnalysis();
}

// ===== INSTANCE GLOBALE =====
export const preAssessmentManager = new PreAssessmentManager();

// ===== UTILITAIRES =====
export function getQuestionById(id: string): PreEvaluationQuestion | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}

export function getQuestionsByCompetence(
  competence: string
): PreEvaluationQuestion[] {
  return QUESTION_BANK.filter((q) => q.competence === competence);
}

export function getDifficultyDistribution(): Record<number, number> {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  QUESTION_BANK.forEach((q) => {
    distribution[q.difficulty]++;
  });

  return distribution;
}

export function getAvailableCompetences(): string[] {
  return [...new Set(QUESTION_BANK.map((q) => q.competence))];
}
