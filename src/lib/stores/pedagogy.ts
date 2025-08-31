/**
 * Stores Svelte pour la gestion des systèmes pédagogiques avancés
 * Intègre pré-évaluation, métacognition et ressources adaptatives
 */

import { writable, derived, get } from 'svelte/store';
import type { 
  AssessmentQuestion, 
  AssessmentResult, 
  LearningProfile,
  preAssessmentSystem 
} from '../pedagogy/preAssessment.js';
import type { 
  MetacognitionPrompt, 
  MetacognitionResponse, 
  LearningReflection,
  MetacognitionInsight,
  metacognitionSystem 
} from '../pedagogy/metacognition.js';
import type { 
  AdaptiveResource, 
  PersonalizedPath, 
  LearningProgress,
  adaptiveResourceSystem 
} from '../pedagogy/adaptiveResources.js';

// ============================================================================
// ÉTAT GLOBAL DE L'APPRENTISSAGE
// ============================================================================

export interface PedagogyState {
  currentUserId: string | null;
  
  // État de pré-évaluation
  assessmentInProgress: boolean;
  currentAssessment: {
    domain: string;
    questions: AssessmentQuestion[];
    currentQuestionIndex: number;
    answers: (string | number)[];
    startTime: Date | null;
  } | null;
  lastAssessmentResult: AssessmentResult | null;
  
  // État de métacognition
  currentReflection: Partial<LearningReflection> | null;
  activePrompts: MetacognitionPrompt[];
  recentInsights: MetacognitionInsight[];
  
  // État de ressources adaptatives
  personalizedPath: PersonalizedPath | null;
  recommendedResources: AdaptiveResource[];
  currentProgress: LearningProgress | null;
  
  // Interface utilisateur
  showMetacognitionModal: boolean;
  showAssessmentModal: boolean;
  showInsightsPanel: boolean;
}

// Store principal
export const pedagogyState = writable<PedagogyState>({
  currentUserId: null,
  assessmentInProgress: false,
  currentAssessment: null,
  lastAssessmentResult: null,
  currentReflection: null,
  activePrompts: [],
  recentInsights: [],
  personalizedPath: null,
  recommendedResources: [],
  currentProgress: null,
  showMetacognitionModal: false,
  showAssessmentModal: false,
  showInsightsPanel: false
});

// ============================================================================
// STORES DÉRIVÉS POUR L'ACCÈS AUX DONNÉES
// ============================================================================

// Profil d'apprentissage actuel
export const currentLearningProfile = derived(
  pedagogyState,
  ($state) => {
    if (!$state.currentUserId) return null;
    // En production, ceci viendrait d'une API ou base de données
    return null; // TODO: Implémenter la récupération du profil
  }
);

// Progression de l'évaluation
export const assessmentProgress = derived(
  pedagogyState,
  ($state) => {
    if (!$state.currentAssessment) return null;
    
    const { currentQuestionIndex, questions } = $state.currentAssessment;
    return {
      current: currentQuestionIndex + 1,
      total: questions.length,
      percentage: Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
    };
  }
);

// Insights récents non lus
export const unreadInsights = derived(
  pedagogyState,
  ($state) => $state.recentInsights.filter(insight => insight.priority === 'high')
);

// Recommandations prioritaires
export const priorityRecommendations = derived(
  pedagogyState,
  ($state) => $state.recommendedResources.slice(0, 3)
);

// ============================================================================
// ACTIONS POUR LA PRÉ-ÉVALUATION
// ============================================================================

export const assessmentActions = {
  /**
   * Démarre une nouvelle évaluation
   */
  async startAssessment(domain: string, questionCount: number = 5) {
    try {
      // En production, importer le vrai système
      const questions: AssessmentQuestion[] = [
        {
          id: 'demo-001',
          question: 'Quelle est la différence entre `let` et `var` ?',
          type: 'multiple-choice',
          options: [
            'Aucune différence',
            '`let` a une portée de bloc',
            '`var` est plus moderne',
            '`let` ne peut pas être réassigné'
          ],
          correctAnswer: 1,
          difficulty: 'easy',
          concept: 'variables',
          explanation: '`let` a une portée de bloc contrairement à `var`.',
          points: 10
        }
      ];

      pedagogyState.update(state => ({
        ...state,
        assessmentInProgress: true,
        currentAssessment: {
          domain,
          questions,
          currentQuestionIndex: 0,
          answers: [],
          startTime: new Date()
        },
        showAssessmentModal: true
      }));
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'évaluation:', error);
    }
  },

  /**
   * Enregistre une réponse et passe à la question suivante
   */
  answerQuestion(answer: string | number) {
    pedagogyState.update(state => {
      if (!state.currentAssessment) return state;

      const newAnswers = [...state.currentAssessment.answers, answer];
      const nextIndex = state.currentAssessment.currentQuestionIndex + 1;
      const isComplete = nextIndex >= state.currentAssessment.questions.length;

      if (isComplete) {
        // Évaluation terminée
        this.completeAssessment(newAnswers);
        return {
          ...state,
          currentAssessment: {
            ...state.currentAssessment,
            answers: newAnswers,
            currentQuestionIndex: nextIndex
          }
        };
      }

      return {
        ...state,
        currentAssessment: {
          ...state.currentAssessment,
          answers: newAnswers,
          currentQuestionIndex: nextIndex
        }
      };
    });
  },

  /**
   * Finalise l'évaluation et génère les résultats
   */
  async completeAssessment(answers: (string | number)[]) {
    const state = get(pedagogyState);
    if (!state.currentAssessment) return;

    // Simuler l'évaluation (en production, utiliser le vrai système)
    const mockResult: AssessmentResult = {
      score: 80,
      maxScore: 100,
      percentage: 80,
      level: 'intermediate',
      strengths: ['variables', 'functions'],
      weaknesses: ['arrays'],
      recommendations: [
        {
          courseId: 'javascript-arrays',
          reason: 'Renforcer la compréhension des tableaux',
          priority: 'high',
          estimatedDuration: 60
        }
      ],
      conceptMastery: {
        variables: 0.9,
        functions: 0.8,
        arrays: 0.4
      }
    };

    pedagogyState.update(state => ({
      ...state,
      assessmentInProgress: false,
      currentAssessment: null,
      lastAssessmentResult: mockResult,
      showAssessmentModal: false
    }));

    // Générer le parcours personnalisé
    await this.generatePersonalizedPath();
  },

  /**
   * Génère un parcours personnalisé basé sur l'évaluation
   */
  async generatePersonalizedPath() {
    // Simuler la génération de parcours
    const mockPath: PersonalizedPath = {
      userId: 'demo-user',
      courseId: 'javascript-basics',
      originalSequence: ['variables', 'functions', 'arrays'],
      adaptedSequence: ['variables', 'functions', 'arrays-support', 'arrays'],
      adaptedResources: [],
      reasoning: [
        'Ajout de support pour les tableaux (concept faible)',
        'Maintien de la séquence normale pour les concepts maîtrisés'
      ],
      estimatedDuration: 150,
      difficultyAdjustments: {
        arrays: 'easier'
      },
      supportResources: []
    };

    pedagogyState.update(state => ({
      ...state,
      personalizedPath: mockPath
    }));
  },

  /**
   * Annule l'évaluation en cours
   */
  cancelAssessment() {
    pedagogyState.update(state => ({
      ...state,
      assessmentInProgress: false,
      currentAssessment: null,
      showAssessmentModal: false
    }));
  }
};

// ============================================================================
// ACTIONS POUR LA MÉTACOGNITION
// ============================================================================

export const metacognitionActions = {
  /**
   * Lance une session de réflexion
   */
  async startReflectionSession(courseId: string, phase: 'before' | 'during' | 'after') {
    // Simuler l'obtention de prompts
    const mockPrompts: MetacognitionPrompt[] = [
      {
        id: `${phase}-001`,
        type: 'reflection',
        phase,
        question: phase === 'before' 
          ? 'Que savez-vous déjà sur ce sujet ?'
          : phase === 'during'
          ? 'Comment évaluez-vous votre compréhension actuelle ?'
          : 'Qu\'avez-vous appris aujourd\'hui ?',
        category: 'knowledge',
        expectedResponseType: 'text',
        minLength: 30
      }
    ];

    pedagogyState.update(state => ({
      ...state,
      activePrompts: mockPrompts,
      currentReflection: {
        userId: state.currentUserId || 'demo-user',
        courseId,
        sessionDate: new Date()
      },
      showMetacognitionModal: true
    }));
  },

  /**
   * Enregistre une réponse de métacognition
   */
  async recordMetacognitionResponse(
    promptId: string, 
    response: string | number, 
    confidence: number
  ) {
    const state = get(pedagogyState);
    
    // En production, sauvegarder via le système de métacognition
    console.log('Réponse métacognition:', { promptId, response, confidence });

    // Mettre à jour l'état local
    pedagogyState.update(state => {
      const updatedPrompts = state.activePrompts.filter(p => p.id !== promptId);
      return {
        ...state,
        activePrompts: updatedPrompts,
        showMetacognitionModal: updatedPrompts.length > 0
      };
    });
  },

  /**
   * Sauvegarde une réflexion complète
   */
  async saveReflection(reflectionData: Partial<LearningReflection>) {
    const state = get(pedagogyState);
    
    if (!state.currentReflection) return;

    const fullReflection = {
      ...state.currentReflection,
      ...reflectionData
    };

    // En production, sauvegarder via le système de métacognition
    console.log('Réflexion sauvegardée:', fullReflection);

    pedagogyState.update(state => ({
      ...state,
      currentReflection: null,
      showMetacognitionModal: false
    }));

    // Générer de nouveaux insights
    await this.generateInsights();
  },

  /**
   * Génère des insights basés sur les réflexions
   */
  async generateInsights() {
    // Simuler la génération d'insights
    const mockInsights: MetacognitionInsight[] = [
      {
        userId: 'demo-user',
        type: 'strength',
        title: 'Progression constante',
        description: 'Vous maintenez un rythme d\'apprentissage régulier.',
        evidence: ['Session quotidienne depuis 5 jours'],
        actionable: false,
        priority: 'medium',
        generatedAt: new Date()
      }
    ];

    pedagogyState.update(state => ({
      ...state,
      recentInsights: mockInsights
    }));
  },

  /**
   * Affiche le panel des insights
   */
  showInsights() {
    pedagogyState.update(state => ({
      ...state,
      showInsightsPanel: true
    }));
  },

  /**
   * Cache le panel des insights
   */
  hideInsights() {
    pedagogyState.update(state => ({
      ...state,
      showInsightsPanel: false
    }));
  }
};

// ============================================================================
// ACTIONS POUR LES RESSOURCES ADAPTATIVES
// ============================================================================

export const adaptiveActions = {
  /**
   * Met à jour le progrès d'apprentissage
   */
  updateProgress(progressUpdate: Partial<LearningProgress>) {
    pedagogyState.update(state => {
      const currentProgress = state.currentProgress || {
        userId: state.currentUserId || 'demo-user',
        courseId: '',
        conceptsMastered: [],
        conceptsInProgress: [],
        conceptsNotStarted: [],
        totalTimeSpent: 0,
        averageSessionTime: 0,
        lastActivity: new Date(),
        completionRate: 0,
        strugglingConcepts: [],
        confidenceLevels: {}
      };

      return {
        ...state,
        currentProgress: {
          ...currentProgress,
          ...progressUpdate,
          lastActivity: new Date()
        }
      };
    });
  },

  /**
   * Obtient des ressources recommandées pour un concept
   */
  async getRecommendedResources(concept: string) {
    // Simuler l'obtention de ressources adaptatives
    const mockResources: AdaptiveResource[] = [
      {
        id: 'var-explain-visual',
        type: 'explanation',
        title: 'Variables JavaScript - Guide visuel',
        content: 'Explication visuelle des variables...',
        difficulty: 'beginner',
        learningStyle: 'visual',
        concept: 'variables',
        estimatedTime: 5,
        prerequisites: [],
        metadata: {
          interactivity: 'low',
          feedback: false,
          collaborative: false,
          selfPaced: true
        }
      }
    ];

    pedagogyState.update(state => ({
      ...state,
      recommendedResources: mockResources
    }));
  },

  /**
   * Marque une ressource comme utilisée
   */
  markResourceAsUsed(resourceId: string) {
    pedagogyState.update(state => ({
      ...state,
      recommendedResources: state.recommendedResources.filter(r => r.id !== resourceId)
    }));
  }
};

// ============================================================================
// ACTIONS GÉNÉRALES
// ============================================================================

export const pedagogyActions = {
  /**
   * Initialise le système pédagogique pour un utilisateur
   */
  async initializeForUser(userId: string) {
    pedagogyState.update(state => ({
      ...state,
      currentUserId: userId
    }));

    // Charger le profil d'apprentissage existant
    // En production, récupérer depuis l'API
  },

  /**
   * Réinitialise l'état pédagogique
   */
  reset() {
    pedagogyState.set({
      currentUserId: null,
      assessmentInProgress: false,
      currentAssessment: null,
      lastAssessmentResult: null,
      currentReflection: null,
      activePrompts: [],
      recentInsights: [],
      personalizedPath: null,
      recommendedResources: [],
      currentProgress: null,
      showMetacognitionModal: false,
      showAssessmentModal: false,
      showInsightsPanel: false
    });
  },

  /**
   * Bascule l'affichage d'un modal
   */
  toggleModal(modalType: 'assessment' | 'metacognition' | 'insights') {
    pedagogyState.update(state => {
      switch (modalType) {
        case 'assessment':
          return { ...state, showAssessmentModal: !state.showAssessmentModal };
        case 'metacognition':
          return { ...state, showMetacognitionModal: !state.showMetacognitionModal };
        case 'insights':
          return { ...state, showInsightsPanel: !state.showInsightsPanel };
        default:
          return state;
      }
    });
  }
};

// Export de l'objet combiné pour faciliter l'utilisation
export const pedagogy = {
  // Stores
  state: pedagogyState,
  profile: currentLearningProfile,
  assessmentProgress,
  unreadInsights,
  priorityRecommendations,
  
  // Actions
  ...pedagogyActions,
  assessment: assessmentActions,
  metacognition: metacognitionActions,
  adaptive: adaptiveActions
};
