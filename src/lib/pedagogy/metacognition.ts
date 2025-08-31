/**
 * Système de métacognition pour l'auto-évaluation et la réflexion sur l'apprentissage
 * Aide les apprenants à développer leur conscience de leur propre processus d'apprentissage
 */

export interface MetacognitionPrompt {
  id: string;
  type: 'reflection' | 'self-assessment' | 'strategy-planning' | 'goal-setting';
  phase: 'before' | 'during' | 'after';
  question: string;
  category: string;
  expectedResponseType: 'text' | 'scale' | 'multiple-choice';
  options?: string[];
  minLength?: number;
}

export interface MetacognitionResponse {
  promptId: string;
  userId: string;
  response: string | number;
  timestamp: Date;
  courseId?: string;
  lessonId?: string;
  confidence: number; // 1-5 échelle de confiance
}

export interface LearningReflection {
  id: string;
  userId: string;
  courseId: string;
  sessionDate: Date;
  
  // Réflexions pré-apprentissage
  priorKnowledge: string;
  learningGoals: string[];
  anticipatedDifficulties: string;
  chosenStrategies: string[];
  
  // Réflexions pendant l'apprentissage
  currentUnderstanding: string;
  strugglingAreas: string[];
  helpfulStrategies: string[];
  adjustmentsMade: string;
  
  // Réflexions post-apprentissage
  learningOutcomes: string;
  conceptsMastered: string[];
  remainingQuestions: string[];
  futureActions: string[];
  overallSatisfaction: number; // 1-5
}

export interface MetacognitionInsight {
  userId: string;
  type: 'pattern' | 'strength' | 'growth-area' | 'recommendation';
  title: string;
  description: string;
  evidence: string[];
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
  generatedAt: Date;
}

export class MetacognitionSystem {
  private prompts: Map<string, MetacognitionPrompt[]> = new Map();
  private responses: Map<string, MetacognitionResponse[]> = new Map(); // userId -> responses
  private reflections: Map<string, LearningReflection[]> = new Map(); // userId -> reflections
  private insights: Map<string, MetacognitionInsight[]> = new Map(); // userId -> insights

  constructor() {
    this.initializePrompts();
  }

  /**
   * Initialise les prompts de métacognition
   */
  private initializePrompts(): void {
    const beforeLearningPrompts: MetacognitionPrompt[] = [
      {
        id: 'pre-001',
        type: 'reflection',
        phase: 'before',
        question: 'Que savez-vous déjà sur ce sujet ? Décrivez vos connaissances actuelles.',
        category: 'prior-knowledge',
        expectedResponseType: 'text',
        minLength: 50
      },
      {
        id: 'pre-002',
        type: 'goal-setting',
        phase: 'before',
        question: 'Quels sont vos objectifs d\'apprentissage pour cette session ?',
        category: 'goals',
        expectedResponseType: 'text',
        minLength: 30
      },
      {
        id: 'pre-003',
        type: 'strategy-planning',
        phase: 'before',
        question: 'Quelles stratégies allez-vous utiliser pour apprendre efficacement ?',
        category: 'strategies',
        expectedResponseType: 'multiple-choice',
        options: [
          'Prendre des notes détaillées',
          'Faire des exercices pratiques',
          'Créer des diagrammes/schémas',
          'Discuter avec d\'autres apprenants',
          'Réviser régulièrement',
          'Poser des questions fréquemment'
        ]
      },
      {
        id: 'pre-004',
        type: 'self-assessment',
        phase: 'before',
        question: 'À quel point êtes-vous confiant dans votre capacité à maîtriser ce sujet ?',
        category: 'confidence',
        expectedResponseType: 'scale'
      }
    ];

    const duringLearningPrompts: MetacognitionPrompt[] = [
      {
        id: 'during-001',
        type: 'self-assessment',
        phase: 'during',
        question: 'Comment évaluez-vous votre compréhension actuelle ?',
        category: 'understanding',
        expectedResponseType: 'scale'
      },
      {
        id: 'during-002',
        type: 'reflection',
        phase: 'during',
        question: 'Quels sont les concepts qui vous posent le plus de difficultés ?',
        category: 'difficulties',
        expectedResponseType: 'text',
        minLength: 30
      },
      {
        id: 'during-003',
        type: 'strategy-planning',
        phase: 'during',
        question: 'Vos stratégies d\'apprentissage fonctionnent-elles ? Devez-vous les ajuster ?',
        category: 'strategy-adjustment',
        expectedResponseType: 'text',
        minLength: 40
      },
      {
        id: 'during-004',
        type: 'reflection',
        phase: 'during',
        question: 'Qu\'est-ce qui vous aide le mieux à comprendre en ce moment ?',
        category: 'helpful-strategies',
        expectedResponseType: 'text',
        minLength: 30
      }
    ];

    const afterLearningPrompts: MetacognitionPrompt[] = [
      {
        id: 'after-001',
        type: 'reflection',
        phase: 'after',
        question: 'Qu\'avez-vous appris aujourd\'hui ? Résumez vos nouveaux acquis.',
        category: 'learning-outcomes',
        expectedResponseType: 'text',
        minLength: 50
      },
      {
        id: 'after-002',
        type: 'self-assessment',
        phase: 'after',
        question: 'Dans quelle mesure avez-vous atteint vos objectifs d\'apprentissage ?',
        category: 'goal-achievement',
        expectedResponseType: 'scale'
      },
      {
        id: 'after-003',
        type: 'reflection',
        phase: 'after',
        question: 'Quelles questions vous restent-elles après cette session ?',
        category: 'remaining-questions',
        expectedResponseType: 'text',
        minLength: 20
      },
      {
        id: 'after-004',
        type: 'strategy-planning',
        phase: 'after',
        question: 'Que ferez-vous pour consolider ces apprentissages ?',
        category: 'future-actions',
        expectedResponseType: 'text',
        minLength: 30
      },
      {
        id: 'after-005',
        type: 'self-assessment',
        phase: 'after',
        question: 'À quel point êtes-vous satisfait de votre session d\'apprentissage ?',
        category: 'satisfaction',
        expectedResponseType: 'scale'
      }
    ];

    this.prompts.set('before', beforeLearningPrompts);
    this.prompts.set('during', duringLearningPrompts);
    this.prompts.set('after', afterLearningPrompts);
  }

  /**
   * Obtient les prompts pour une phase spécifique
   */
  getPromptsForPhase(phase: 'before' | 'during' | 'after'): MetacognitionPrompt[] {
    return this.prompts.get(phase) || [];
  }

  /**
   * Obtient un prompt aléatoire pour une phase
   */
  getRandomPromptForPhase(phase: 'before' | 'during' | 'after'): MetacognitionPrompt | null {
    const phasePrompts = this.prompts.get(phase) || [];
    if (phasePrompts.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * phasePrompts.length);
    return phasePrompts[randomIndex];
  }

  /**
   * Enregistre une réponse de métacognition
   */
  async recordResponse(
    userId: string,
    promptId: string,
    response: string | number,
    confidence: number,
    courseId?: string,
    lessonId?: string
  ): Promise<void> {
    const metacognitionResponse: MetacognitionResponse = {
      promptId,
      userId,
      response,
      timestamp: new Date(),
      courseId,
      lessonId,
      confidence
    };

    if (!this.responses.has(userId)) {
      this.responses.set(userId, []);
    }

    this.responses.get(userId)!.push(metacognitionResponse);
  }

  /**
   * Crée une réflexion complète d'apprentissage
   */
  async createLearningReflection(
    userId: string,
    courseId: string,
    reflectionData: Partial<LearningReflection>
  ): Promise<string> {
    const reflection: LearningReflection = {
      id: `reflection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      courseId,
      sessionDate: new Date(),
      priorKnowledge: reflectionData.priorKnowledge || '',
      learningGoals: reflectionData.learningGoals || [],
      anticipatedDifficulties: reflectionData.anticipatedDifficulties || '',
      chosenStrategies: reflectionData.chosenStrategies || [],
      currentUnderstanding: reflectionData.currentUnderstanding || '',
      strugglingAreas: reflectionData.strugglingAreas || [],
      helpfulStrategies: reflectionData.helpfulStrategies || [],
      adjustmentsMade: reflectionData.adjustmentsMade || '',
      learningOutcomes: reflectionData.learningOutcomes || '',
      conceptsMastered: reflectionData.conceptsMastered || [],
      remainingQuestions: reflectionData.remainingQuestions || [],
      futureActions: reflectionData.futureActions || [],
      overallSatisfaction: reflectionData.overallSatisfaction || 3
    };

    if (!this.reflections.has(userId)) {
      this.reflections.set(userId, []);
    }

    this.reflections.get(userId)!.push(reflection);
    
    // Générer des insights basés sur cette nouvelle réflexion
    await this.generateInsights(userId);
    
    return reflection.id;
  }

  /**
   * Génère des insights personnalisés basés sur les réflexions
   */
  private async generateInsights(userId: string): Promise<void> {
    const userReflections = this.reflections.get(userId) || [];
    const userResponses = this.responses.get(userId) || [];

    if (userReflections.length < 2) return; // Besoin d'au moins 2 réflexions pour des patterns

    const insights: MetacognitionInsight[] = [];

    // Analyser les patterns de satisfaction
    const satisfactionScores = userReflections.map(r => r.overallSatisfaction);
    const avgSatisfaction = satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length;

    if (avgSatisfaction >= 4) {
      insights.push({
        userId,
        type: 'strength',
        title: 'Apprentissage très satisfaisant',
        description: 'Vous maintenez un haut niveau de satisfaction dans vos sessions d\'apprentissage.',
        evidence: [`Satisfaction moyenne: ${avgSatisfaction.toFixed(1)}/5`],
        actionable: false,
        priority: 'low',
        generatedAt: new Date()
      });
    } else if (avgSatisfaction < 3) {
      insights.push({
        userId,
        type: 'growth-area',
        title: 'Satisfaction à améliorer',
        description: 'Vos sessions d\'apprentissage pourraient être plus satisfaisantes. Explorons des stratégies alternatives.',
        evidence: [`Satisfaction moyenne: ${avgSatisfaction.toFixed(1)}/5`],
        actionable: true,
        priority: 'high',
        generatedAt: new Date()
      });
    }

    // Analyser les stratégies récurrentes
    const allStrategies = userReflections.flatMap(r => r.chosenStrategies);
    const strategyFrequency = this.getFrequencyMap(allStrategies);
    const mostUsedStrategy = Object.entries(strategyFrequency)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostUsedStrategy && mostUsedStrategy[1] >= 3) {
      insights.push({
        userId,
        type: 'pattern',
        title: 'Stratégie préférée identifiée',
        description: `Vous utilisez fréquemment la stratégie "${mostUsedStrategy[0]}". C'est excellent de la maîtriser !`,
        evidence: [`Utilisée ${mostUsedStrategy[1]} fois sur ${userReflections.length} sessions`],
        actionable: false,
        priority: 'medium',
        generatedAt: new Date()
      });
    }

    // Analyser les difficultés récurrentes
    const allDifficulties = userReflections.flatMap(r => r.strugglingAreas);
    const difficultyFrequency = this.getFrequencyMap(allDifficulties);
    const recurringDifficulty = Object.entries(difficultyFrequency)
      .sort(([,a], [,b]) => b - a)[0];

    if (recurringDifficulty && recurringDifficulty[1] >= 2) {
      insights.push({
        userId,
        type: 'recommendation',
        title: 'Difficulté récurrente détectée',
        description: `Le concept "${recurringDifficulty[0]}" semble vous poser des difficultés répétées. Je recommande une approche ciblée.`,
        evidence: [`Mentionné comme difficulté ${recurringDifficulty[1]} fois`],
        actionable: true,
        priority: 'high',
        generatedAt: new Date()
      });
    }

    // Analyser l'évolution de la confiance
    const confidenceScores = userResponses
      .filter(r => r.confidence !== undefined)
      .map(r => r.confidence);
    
    if (confidenceScores.length >= 3) {
      const recent = confidenceScores.slice(-3);
      const earlier = confidenceScores.slice(0, -3);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const earlierAvg = earlier.length > 0 ? earlier.reduce((a, b) => a + b, 0) / earlier.length : recentAvg;

      if (recentAvg > earlierAvg + 0.5) {
        insights.push({
          userId,
          type: 'strength',
          title: 'Confiance en progression',
          description: 'Votre niveau de confiance s\'améliore au fil des sessions. Continuez sur cette lancée !',
          evidence: [`Progression de ${earlierAvg.toFixed(1)} à ${recentAvg.toFixed(1)}`],
          actionable: false,
          priority: 'medium',
          generatedAt: new Date()
        });
      }
    }

    // Sauvegarder les insights
    if (!this.insights.has(userId)) {
      this.insights.set(userId, []);
    }
    
    const existingInsights = this.insights.get(userId)!;
    this.insights.set(userId, [...existingInsights, ...insights]);
  }

  /**
   * Obtient les insights pour un utilisateur
   */
  getInsights(userId: string, limit: number = 10): MetacognitionInsight[] {
    const userInsights = this.insights.get(userId) || [];
    return userInsights
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Obtient les réflexions d'un utilisateur
   */
  getUserReflections(userId: string, courseId?: string): LearningReflection[] {
    const userReflections = this.reflections.get(userId) || [];
    
    if (courseId) {
      return userReflections.filter(r => r.courseId === courseId);
    }
    
    return userReflections.sort((a, b) => b.sessionDate.getTime() - a.sessionDate.getTime());
  }

  /**
   * Obtient les réponses d'un utilisateur
   */
  getUserResponses(userId: string, courseId?: string): MetacognitionResponse[] {
    const userResponses = this.responses.get(userId) || [];
    
    if (courseId) {
      return userResponses.filter(r => r.courseId === courseId);
    }
    
    return userResponses.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Calcule les statistiques de métacognition pour un utilisateur
   */
  getMetacognitionStats(userId: string): {
    totalReflections: number;
    averageSatisfaction: number;
    mostCommonStrategies: string[];
    confidenceTrend: 'improving' | 'stable' | 'declining';
    lastReflectionDate: Date | null;
  } {
    const reflections = this.getUserReflections(userId);
    const responses = this.getUserResponses(userId);

    const totalReflections = reflections.length;
    const averageSatisfaction = reflections.length > 0 
      ? reflections.reduce((sum, r) => sum + r.overallSatisfaction, 0) / reflections.length 
      : 0;

    const allStrategies = reflections.flatMap(r => r.chosenStrategies);
    const strategyFreq = this.getFrequencyMap(allStrategies);
    const mostCommonStrategies = Object.entries(strategyFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([strategy]) => strategy);

    // Analyser la tendance de confiance
    const confidenceScores = responses.map(r => r.confidence);
    let confidenceTrend: 'improving' | 'stable' | 'declining' = 'stable';
    
    if (confidenceScores.length >= 4) {
      const recent = confidenceScores.slice(-2);
      const earlier = confidenceScores.slice(-4, -2);
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
      
      if (recentAvg > earlierAvg + 0.3) confidenceTrend = 'improving';
      else if (recentAvg < earlierAvg - 0.3) confidenceTrend = 'declining';
    }

    const lastReflectionDate = reflections.length > 0 ? reflections[0].sessionDate : null;

    return {
      totalReflections,
      averageSatisfaction,
      mostCommonStrategies,
      confidenceTrend,
      lastReflectionDate
    };
  }

  /**
   * Utilitaire pour calculer la fréquence des éléments
   */
  private getFrequencyMap(items: string[]): Record<string, number> {
    return items.reduce((freq, item) => {
      freq[item] = (freq[item] || 0) + 1;
      return freq;
    }, {} as Record<string, number>);
  }

  /**
   * Suggère des prompts adaptatifs basés sur l'historique
   */
  getSuggestedPrompts(userId: string, phase: 'before' | 'during' | 'after'): MetacognitionPrompt[] {
    const userResponses = this.getUserResponses(userId);
    const answeredPromptIds = new Set(userResponses.map(r => r.promptId));
    
    const phasePrompts = this.getPromptsForPhase(phase);
    
    // Prioriser les prompts non encore répondus
    const unansweredPrompts = phasePrompts.filter(p => !answeredPromptIds.has(p.id));
    
    if (unansweredPrompts.length > 0) {
      return unansweredPrompts.slice(0, 2);
    }
    
    // Si tous ont été répondus, retourner des prompts aléatoires
    return phasePrompts.slice(0, 2);
  }
}

// Instance globale
export const metacognitionSystem = new MetacognitionSystem();
