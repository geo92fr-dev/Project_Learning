/**
 * Service de métacognition et réflexion guidée - Phase 4
 * Système pour développer la conscience d'apprendre
 */

import type {
  MetacognitionPrompt,
  MetacognitionResponse,
  MetacognitiveStrategy,
  LearningJournal,
  MetacognitiveDevelopment,
} from "$lib/types/pedagogy";
import { writable, derived, get } from "svelte/store";

// ==================== STORES ====================

export const activePrompt = writable<MetacognitionPrompt | null>(null);
export const currentResponse = writable<string>("");
export const metacognitionHistory = writable<MetacognitionResponse[]>([]);
export const learningJournal = writable<LearningJournal[]>([]);
export const metacognitiveDevelopment =
  writable<MetacognitiveDevelopment | null>(null);

// Store dérivé pour les insights métacognitifs
export const metacognitionInsights = derived(
  [metacognitionHistory, metacognitiveDevelopment],
  ([$history, $development]) => ({
    totalReflections: $history.length,
    averageDepth:
      $history.length > 0
        ? $history.reduce((sum, r) => sum + r.reflection_depth, 0) /
          $history.length
        : 0,
    strategiesCount: $development?.strategies_discovered.length || 0,
    reflectionTrend: $development?.reflection_depth_trend || [],
    recentInsights: $history.slice(-5),
  })
);

// ==================== BANQUE DE PROMPTS ====================

class MetacognitionPromptBank {
  private static instance: MetacognitionPromptBank;
  private prompts: Map<string, MetacognitionPrompt[]> = new Map();

  static getInstance(): MetacognitionPromptBank {
    if (!MetacognitionPromptBank.instance) {
      MetacognitionPromptBank.instance = new MetacognitionPromptBank();
    }
    return MetacognitionPromptBank.instance;
  }

  constructor() {
    this.initializePrompts();
  }

  /**
   * Initialise la banque de prompts métacognitifs
   */
  private initializePrompts(): void {
    // Prompts avant la leçon (planification)
    this.prompts.set("before_lesson", [
      {
        id: "bl_001",
        type: "self_assessment",
        trigger: "before_lesson",
        question: "Que savez-vous déjà sur ce sujet ?",
        sub_questions: [
          "Quelles connaissances pouvez-vous relier à ce nouveau contenu ?",
          "Qu'est-ce qui vous intrigue le plus dans ce sujet ?",
        ],
        guidance:
          "Prenez un moment pour réfléchir à vos connaissances existantes. Cela vous aidera à mieux connecter les nouveaux apprentissages.",
        expected_elements: [
          "connaissances_prealables",
          "curiosite",
          "connexions",
        ],
        competence_focus: "metacognition_planification",
      },
      {
        id: "bl_002",
        type: "strategy",
        trigger: "before_lesson",
        question:
          "Quelle stratégie d'apprentissage allez-vous utiliser pour cette leçon ?",
        sub_questions: [
          "Comment allez-vous organiser votre attention ?",
          "Quelles techniques vous aident habituellement à retenir l'information ?",
        ],
        guidance:
          "Choisir une stratégie à l'avance améliore l'efficacité de l'apprentissage.",
        expected_elements: [
          "strategie_choisie",
          "organisation",
          "techniques_memorisation",
        ],
        competence_focus: "metacognition_strategies",
      },
    ]);

    // Prompts pendant la leçon (monitoring)
    this.prompts.set("during_lesson", [
      {
        id: "dl_001",
        type: "monitoring",
        trigger: "during_lesson",
        question: "Comment votre compréhension évolue-t-elle ?",
        sub_questions: [
          "Quels points vous semblent clairs ?",
          "Où ressentez-vous de la confusion ?",
          "Avez-vous besoin d'ajuster votre stratégie ?",
        ],
        guidance:
          "Être conscient de sa compréhension en temps réel permet d'ajuster son apprentissage.",
        expected_elements: [
          "comprehension_actuelle",
          "points_clairs",
          "difficultes",
        ],
        competence_focus: "metacognition_monitoring",
      },
      {
        id: "dl_002",
        type: "strategy",
        trigger: "during_lesson",
        question: "Votre stratégie d'apprentissage fonctionne-t-elle ?",
        sub_questions: [
          "Devriez-vous changer d'approche ?",
          "Quelles techniques semblent les plus efficaces ?",
        ],
        guidance:
          "Ajuster sa stratégie pendant l'apprentissage est une compétence métacognitive clé.",
        expected_elements: [
          "efficacite_strategie",
          "ajustements",
          "techniques_efficaces",
        ],
        competence_focus: "metacognition_adaptation",
      },
    ]);

    // Prompts après la leçon (évaluation)
    this.prompts.set("after_lesson", [
      {
        id: "al_001",
        type: "evaluation",
        trigger: "after_lesson",
        question: "Qu'avez-vous appris aujourd'hui ?",
        sub_questions: [
          "Quels sont les concepts les plus importants que vous retenez ?",
          "Comment pouvez-vous appliquer ces connaissances ?",
          "Qu'est-ce qui reste encore flou ?",
        ],
        guidance:
          "Synthétiser ce qu'on a appris aide à consolider les connaissances.",
        expected_elements: ["concepts_cles", "applications", "zones_floues"],
        competence_focus: "metacognition_evaluation",
      },
      {
        id: "al_002",
        type: "reflection",
        trigger: "after_lesson",
        question: "Comment votre façon d'apprendre a-t-elle évolué ?",
        sub_questions: [
          "Quelles stratégies ont été les plus efficaces ?",
          "Que feriez-vous différemment la prochaine fois ?",
          "Qu'avez-vous découvert sur votre façon d'apprendre ?",
        ],
        guidance:
          "Réfléchir sur son propre processus d'apprentissage développe l'autonomie.",
        expected_elements: [
          "strategies_efficaces",
          "ameliorations",
          "decouverte_soi",
        ],
        competence_focus: "metacognition_reflection",
      },
    ]);

    // Prompts après exercice
    this.prompts.set("after_exercise", [
      {
        id: "ae_001",
        type: "evaluation",
        trigger: "after_exercise",
        question: "Comment évaluez-vous votre performance sur cet exercice ?",
        sub_questions: [
          "Qu'est-ce qui a bien fonctionné ?",
          "Où avez-vous eu des difficultés ?",
          "Quelles erreurs pouvez-vous identifier ?",
        ],
        guidance:
          "Auto-évaluer sa performance développe l'esprit critique et l'autonomie.",
        expected_elements: ["reussites", "difficultes", "erreurs_identifiees"],
        competence_focus: "metacognition_auto_evaluation",
      },
      {
        id: "ae_002",
        type: "strategy",
        trigger: "after_exercise",
        question:
          "Quelle stratégie utiliseriez-vous pour un exercice similaire ?",
        sub_questions: [
          "Quelles approches ont été efficaces ?",
          "Comment pourriez-vous éviter les erreurs commises ?",
          "Quels indices vous aideraient la prochaine fois ?",
        ],
        guidance:
          "Planifier des stratégies futures améliore les performances à long terme.",
        expected_elements: [
          "strategies_futures",
          "prevention_erreurs",
          "indices_utiles",
        ],
        competence_focus: "metacognition_transfert",
      },
    ]);
  }

  /**
   * Sélectionne un prompt adapté au contexte
   */
  selectPrompt(
    trigger:
      | "before_lesson"
      | "during_lesson"
      | "after_lesson"
      | "after_exercise",
    competence: string,
    userLevel:
      | "beginner"
      | "intermediate"
      | "advanced"
      | "expert" = "intermediate",
    previousPrompts: string[] = []
  ): MetacognitionPrompt | null {
    const availablePrompts = this.prompts.get(trigger) || [];

    // Filtrer les prompts déjà utilisés récemment
    const unusedPrompts = availablePrompts.filter(
      (prompt) => !previousPrompts.includes(prompt.id)
    );

    const promptsToUse =
      unusedPrompts.length > 0 ? unusedPrompts : availablePrompts;

    if (promptsToUse.length === 0) return null;

    // Sélectionner selon le niveau de l'utilisateur
    return this.selectByUserLevel(promptsToUse, userLevel);
  }

  /**
   * Sélectionne un prompt selon le niveau de l'utilisateur
   */
  private selectByUserLevel(
    prompts: MetacognitionPrompt[],
    level: "beginner" | "intermediate" | "advanced" | "expert"
  ): MetacognitionPrompt {
    // Pour les débutants, privilégier les prompts d'auto-évaluation simples
    if (level === "beginner") {
      const simple = prompts.filter(
        (p) => p.type === "self_assessment" || p.type === "evaluation"
      );
      if (simple.length > 0)
        return simple[Math.floor(Math.random() * simple.length)];
    }

    // Pour les avancés, privilégier la réflexion et les stratégies
    if (level === "advanced" || level === "expert") {
      const complex = prompts.filter(
        (p) => p.type === "reflection" || p.type === "strategy"
      );
      if (complex.length > 0)
        return complex[Math.floor(Math.random() * complex.length)];
    }

    // Par défaut, sélection aléatoire
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  /**
   * Obtient tous les prompts pour un trigger donné
   */
  getPromptsForTrigger(trigger: string): MetacognitionPrompt[] {
    return this.prompts.get(trigger) || [];
  }
}

// ==================== ANALYSEUR DE RÉPONSES ====================

class ResponseAnalyzer {
  private static instance: ResponseAnalyzer;

  // Mots-clés pour identifier les stratégies métacognitives
  private strategyKeywords: Map<string, string[]> = new Map([
    [
      "planning",
      ["planifier", "organiser", "préparer", "stratégie", "objectif", "plan"],
    ],
    [
      "monitoring",
      [
        "vérifier",
        "contrôler",
        "surveiller",
        "suivre",
        "attention",
        "comprendre",
      ],
    ],
    [
      "evaluating",
      ["évaluer", "juger", "critiquer", "analyser", "performance", "résultat"],
    ],
    [
      "debugging",
      ["corriger", "réparer", "erreur", "problème", "difficulté", "obstacle"],
    ],
    [
      "reviewing",
      ["réviser", "revoir", "reprendre", "récapituler", "synthèse", "résumé"],
    ],
  ]);

  // Vocabulaire métacognitif pour mesurer la sophistication
  private metacognitiveVocabulary = [
    "métacognition",
    "stratégie",
    "réflexion",
    "conscience",
    "monitoring",
    "autorégulation",
    "planification",
    "évaluation",
    "métaconnaissance",
    "transfert",
    "abstraction",
    "généralisation",
    "conceptualisation",
  ];

  static getInstance(): ResponseAnalyzer {
    if (!ResponseAnalyzer.instance) {
      ResponseAnalyzer.instance = new ResponseAnalyzer();
    }
    return ResponseAnalyzer.instance;
  }

  /**
   * Analyse une réponse métacognitive
   */
  analyzeResponse(
    response: string,
    prompt: MetacognitionPrompt
  ): Partial<MetacognitionResponse> {
    const text = response.toLowerCase();
    const words = text.split(/\s+/);

    return {
      word_count: words.length,
      reflection_depth: this.calculateReflectionDepth(text, prompt),
      keywords_identified: this.identifyKeywords(text),
      metacognitive_strategies: this.identifyStrategies(text),
    };
  }

  /**
   * Calcule la profondeur de réflexion (1-5)
   */
  private calculateReflectionDepth(
    text: string,
    prompt: MetacognitionPrompt
  ): 1 | 2 | 3 | 4 | 5 {
    let depth = 1;

    // Facteurs qui augmentent la profondeur
    const factors = [
      // Longueur et détail
      text.length > 200,
      text.split(".").length > 3,

      // Présence d'éléments attendus
      prompt.expected_elements.some((element) =>
        text.includes(element.replace("_", " "))
      ),

      // Vocabulaire métacognitif
      this.metacognitiveVocabulary.some((word) => text.includes(word)),

      // Connecteurs logiques (argumentation)
      /\b(parce que|car|donc|ainsi|par conséquent|en effet|cependant|néanmoins)\b/.test(
        text
      ),

      // Questions auto-générées
      text.includes("?"),

      // Exemples concrets
      /\b(par exemple|comme|tel que|notamment)\b/.test(text),

      // Projection future
      /\b(prochaine fois|améliorer|progresser|développer)\b/.test(text),
    ];

    // Calcul du score de profondeur
    const activeFactors = factors.filter(Boolean).length;
    depth = Math.min(5, Math.max(1, Math.ceil(activeFactors / 2) + 1));

    return depth as 1 | 2 | 3 | 4 | 5;
  }

  /**
   * Identifie les mots-clés pédagogiques
   */
  private identifyKeywords(text: string): string[] {
    const keywords: string[] = [];

    // Recherche de vocabulaire métacognitif
    this.metacognitiveVocabulary.forEach((word) => {
      if (text.includes(word)) {
        keywords.push(word);
      }
    });

    // Recherche de mots-clés de stratégies
    this.strategyKeywords.forEach((words, strategy) => {
      if (words.some((word) => text.includes(word))) {
        keywords.push(strategy);
      }
    });

    return [...new Set(keywords)]; // Supprime les doublons
  }

  /**
   * Identifie les stratégies métacognitives utilisées
   */
  private identifyStrategies(text: string): MetacognitiveStrategy[] {
    const strategies: MetacognitiveStrategy[] = [];

    this.strategyKeywords.forEach((keywords, strategyType) => {
      const foundKeywords = keywords.filter((keyword) =>
        text.includes(keyword)
      );

      if (foundKeywords.length > 0) {
        strategies.push({
          type: strategyType as any,
          description: `Utilise des mots liés à ${strategyType}: ${foundKeywords.join(
            ", "
          )}`,
          effectiveness: this.estimateEffectiveness(
            foundKeywords.length,
            text.length
          ),
          context: this.extractContext(text, foundKeywords[0]),
        });
      }
    });

    return strategies;
  }

  /**
   * Estime l'efficacité d'une stratégie (1-5)
   */
  private estimateEffectiveness(
    keywordCount: number,
    textLength: number
  ): 1 | 2 | 3 | 4 | 5 {
    // Plus de mots-clés et texte détaillé = plus efficace
    const score = Math.min(5, keywordCount + Math.floor(textLength / 100));
    return Math.max(1, score) as 1 | 2 | 3 | 4 | 5;
  }

  /**
   * Extrait le contexte autour d'un mot-clé
   */
  private extractContext(text: string, keyword: string): string {
    const index = text.indexOf(keyword);
    if (index === -1) return "";

    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + keyword.length + 50);
    return text.substring(start, end).trim();
  }
}

// ==================== SERVICE PRINCIPAL ====================

export class MetacognitionService {
  private static instance: MetacognitionService;
  private promptBank: MetacognitionPromptBank;
  private analyzer: ResponseAnalyzer;

  constructor() {
    this.promptBank = MetacognitionPromptBank.getInstance();
    this.analyzer = ResponseAnalyzer.getInstance();
  }

  static getInstance(): MetacognitionService {
    if (!MetacognitionService.instance) {
      MetacognitionService.instance = new MetacognitionService();
    }
    return MetacognitionService.instance;
  }

  /**
   * Propose un prompt métacognitif selon le contexte
   */
  async proposePrompt(
    trigger:
      | "before_lesson"
      | "during_lesson"
      | "after_lesson"
      | "after_exercise",
    competence: string,
    userId: string,
    userLevel:
      | "beginner"
      | "intermediate"
      | "advanced"
      | "expert" = "intermediate"
  ): Promise<MetacognitionPrompt | null> {
    // Récupérer l'historique pour éviter les répétitions
    const history = get(metacognitionHistory);
    const recentPrompts = history
      .filter((r) => r.user_id === userId)
      .slice(-5)
      .map((r) => r.prompt_id);

    const prompt = this.promptBank.selectPrompt(
      trigger,
      competence,
      userLevel,
      recentPrompts
    );

    if (prompt) {
      activePrompt.set(prompt);
    }

    return prompt;
  }

  /**
   * Soumet une réponse métacognitive
   */
  async submitResponse(
    userId: string,
    sessionId: string,
    responseText: string
  ): Promise<MetacognitionResponse | null> {
    const prompt = get(activePrompt);
    if (!prompt || !responseText.trim()) return null;

    // Analyser la réponse
    const analysis = this.analyzer.analyzeResponse(responseText, prompt);

    // Créer la réponse complète
    const response: MetacognitionResponse = {
      prompt_id: prompt.id,
      user_id: userId,
      session_id: sessionId,
      content: responseText,
      timestamp: new Date(),
      word_count: analysis.word_count || 0,
      reflection_depth: analysis.reflection_depth || 1,
      keywords_identified: analysis.keywords_identified || [],
      metacognitive_strategies: analysis.metacognitive_strategies || [],
    };

    // Mettre à jour l'historique
    const currentHistory = get(metacognitionHistory);
    currentHistory.push(response);
    metacognitionHistory.set(currentHistory);

    // Mettre à jour le développement métacognitif
    await this.updateMetacognitiveDevelopment(userId, response);

    // Réinitialiser le prompt actif
    activePrompt.set(null);
    currentResponse.set("");

    return response;
  }

  /**
   * Met à jour le développement métacognitif de l'utilisateur
   */
  private async updateMetacognitiveDevelopment(
    userId: string,
    response: MetacognitionResponse
  ): Promise<void> {
    let development = get(metacognitiveDevelopment);

    if (!development) {
      development = {
        self_awareness_level: 1,
        strategy_knowledge: 1,
        monitoring_skills: 1,
        evaluation_skills: 1,
        reflection_depth_trend: [],
        journal_entries_count: 0,
        strategies_discovered: [],
        metacognitive_vocabulary: [],
      };
    }

    // Mettre à jour la tendance de profondeur
    development.reflection_depth_trend.push(response.reflection_depth);
    if (development.reflection_depth_trend.length > 20) {
      development.reflection_depth_trend =
        development.reflection_depth_trend.slice(-20);
    }

    // Ajouter nouvelles stratégies découvertes
    response.metacognitive_strategies.forEach((strategy) => {
      if (
        !development!.strategies_discovered.some(
          (s) => s.type === strategy.type
        )
      ) {
        development!.strategies_discovered.push(strategy);
      }
    });

    // Ajouter nouveau vocabulaire métacognitif
    response.keywords_identified.forEach((keyword) => {
      if (!development!.metacognitive_vocabulary.includes(keyword)) {
        development!.metacognitive_vocabulary.push(keyword);
      }
    });

    // Calculer les niveaux de compétence
    this.calculateMetacognitiveSkills(development, response);

    metacognitiveDevelopment.set(development);
  }

  /**
   * Calcule les niveaux de compétences métacognitives
   */
  private calculateMetacognitiveSkills(
    development: MetacognitiveDevelopment,
    response: MetacognitionResponse
  ): void {
    const history = get(metacognitionHistory);
    const userResponses = history.filter((r) => r.user_id === response.user_id);

    if (userResponses.length === 0) return;

    // Auto-conscience : basée sur la profondeur moyenne des réflexions
    const avgDepth =
      userResponses.reduce((sum, r) => sum + r.reflection_depth, 0) /
      userResponses.length;
    development.self_awareness_level = Math.min(
      5,
      Math.max(1, Math.round(avgDepth))
    ) as 1 | 2 | 3 | 4 | 5;

    // Connaissance des stratégies : basée sur la diversité des stratégies utilisées
    const uniqueStrategies = new Set(
      userResponses.flatMap((r) =>
        r.metacognitive_strategies.map((s) => s.type)
      )
    );
    development.strategy_knowledge = Math.min(
      5,
      Math.max(1, uniqueStrategies.size)
    ) as 1 | 2 | 3 | 4 | 5;

    // Compétences de monitoring : basée sur l'utilisation de stratégies de monitoring
    const monitoringCount = userResponses.filter((r) =>
      r.metacognitive_strategies.some((s) => s.type === "monitoring")
    ).length;
    development.monitoring_skills = Math.min(
      5,
      Math.max(1, Math.ceil(monitoringCount / 2))
    ) as 1 | 2 | 3 | 4 | 5;

    // Compétences d'évaluation : basée sur l'utilisation de stratégies d'évaluation
    const evaluationCount = userResponses.filter((r) =>
      r.metacognitive_strategies.some((s) => s.type === "evaluating")
    ).length;
    development.evaluation_skills = Math.min(
      5,
      Math.max(1, Math.ceil(evaluationCount / 2))
    ) as 1 | 2 | 3 | 4 | 5;
  }

  /**
   * Crée une entrée de journal d'apprentissage
   */
  async createJournalEntry(
    userId: string,
    sessionSummary: string,
    learningObjectives: string[],
    achievements: string[],
    difficulties: string[],
    insights: string[],
    nextSteps: string[],
    moodBefore: 1 | 2 | 3 | 4 | 5,
    moodAfter: 1 | 2 | 3 | 4 | 5,
    motivationLevel: 1 | 2 | 3 | 4 | 5,
    confidenceChange: -2 | -1 | 0 | 1 | 2
  ): Promise<LearningJournal> {
    const history = get(metacognitionHistory);
    const userResponses = history.filter((r) => r.user_id === userId);

    const strategiesUsed: MetacognitiveStrategy[] = userResponses
      .flatMap((r) => r.metacognitive_strategies)
      .slice(-10); // 10 stratégies les plus récentes

    const entry: LearningJournal = {
      user_id: userId,
      date: new Date(),
      session_summary: sessionSummary,
      learning_objectives: learningObjectives,
      achievements: achievements,
      difficulties_encountered: difficulties,
      strategies_used: strategiesUsed,
      insights: insights,
      next_steps: nextSteps,
      mood_before: moodBefore,
      mood_after: moodAfter,
      motivation_level: motivationLevel,
      confidence_change: confidenceChange,
    };

    const currentJournal = get(learningJournal);
    currentJournal.push(entry);
    learningJournal.set(currentJournal);

    // Mettre à jour le compteur d'entrées
    const development = get(metacognitiveDevelopment);
    if (development) {
      development.journal_entries_count++;
      metacognitiveDevelopment.set(development);
    }

    return entry;
  }

  /**
   * Obtient des recommandations métacognitives personnalisées
   */
  getPersonalizedRecommendations(userId: string): string[] {
    const development = get(metacognitiveDevelopment);
    const recommendations: string[] = [];

    if (!development) {
      return ["Commencez par réfléchir sur vos processus d'apprentissage"];
    }

    // Recommandations basées sur les compétences
    if (development.self_awareness_level < 3) {
      recommendations.push(
        "Prenez du temps pour réfléchir sur votre façon d'apprendre"
      );
    }

    if (development.strategy_knowledge < 3) {
      recommendations.push("Explorez différentes stratégies d'apprentissage");
    }

    if (development.monitoring_skills < 3) {
      recommendations.push(
        "Surveillez votre compréhension pendant l'apprentissage"
      );
    }

    if (development.evaluation_skills < 3) {
      recommendations.push("Évaluez régulièrement vos performances et progrès");
    }

    // Recommandations basées sur les tendances
    const recentDepth = development.reflection_depth_trend.slice(-5);
    if (recentDepth.length > 0) {
      const avgRecentDepth =
        recentDepth.reduce((sum, d) => sum + d, 0) / recentDepth.length;
      if (avgRecentDepth < 3) {
        recommendations.push(
          "Essayez d'approfondir vos réflexions avec plus de détails"
        );
      }
    }

    if (development.journal_entries_count < 5) {
      recommendations.push("Tenez un journal d'apprentissage régulier");
    }

    return recommendations;
  }

  /**
   * Réinitialise le prompt actif
   */
  resetActivePrompt(): void {
    activePrompt.set(null);
    currentResponse.set("");
  }

  /**
   * Obtient l'historique métacognitif d'un utilisateur
   */
  getUserHistory(userId: string): MetacognitionResponse[] {
    const history = get(metacognitionHistory);
    return history.filter((r) => r.user_id === userId);
  }

  /**
   * Obtient le développement métacognitif actuel
   */
  getCurrentDevelopment(): MetacognitiveDevelopment | null {
    return get(metacognitiveDevelopment);
  }
}

// Export de l'instance singleton
export const metacognitionService = MetacognitionService.getInstance();
