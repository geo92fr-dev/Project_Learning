/**
 * Système de pré-évaluation pour adapter le contenu au niveau de l'apprenant
 * Fonctionnalités: Questions diagnostic, évaluation de niveau, recommandations personnalisées
 */

import type { CourseContent } from '../types/content.js';

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'code-completion' | 'code-review';
  options?: string[];
  correctAnswer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  concept: string;
  explanation: string;
  points: number;
}

export interface AssessmentResult {
  score: number;
  maxScore: number;
  percentage: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  recommendations: CourseRecommendation[];
  conceptMastery: Record<string, number>;
}

export interface CourseRecommendation {
  courseId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: number;
}

export interface LearningProfile {
  userId: string;
  assessmentResults: AssessmentResult[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  pace: 'slow' | 'normal' | 'fast';
  preferredDifficulty: 'gradual' | 'challenging';
  lastAssessment: Date;
  adaptedLevel: 'beginner' | 'intermediate' | 'advanced';
}

export class PreAssessmentSystem {
  private questions: Map<string, AssessmentQuestion[]> = new Map();
  private profiles: Map<string, LearningProfile> = new Map();

  constructor() {
    this.initializeQuestions();
  }

  /**
   * Initialise les questions d'évaluation par domaine
   */
  private initializeQuestions(): void {
    // Questions JavaScript
    this.questions.set('javascript', [
      {
        id: 'js-001',
        question: 'Quelle est la différence entre `let` et `var` en JavaScript ?',
        type: 'multiple-choice',
        options: [
          'Aucune différence',
          '`let` a une portée de bloc, `var` a une portée de fonction',
          '`var` est plus moderne que `let`',
          '`let` ne peut pas être réassigné'
        ],
        correctAnswer: 1,
        difficulty: 'easy',
        concept: 'variables',
        explanation: '`let` introduit la portée de bloc (block scope) contrairement à `var` qui a une portée de fonction.',
        points: 10
      },
      {
        id: 'js-002',
        question: 'Que fait ce code ?\n```javascript\nconst arr = [1, 2, 3];\nconst doubled = arr.map(x => x * 2);\n```',
        type: 'multiple-choice',
        options: [
          'Modifie le tableau original',
          'Crée un nouveau tableau avec les valeurs doublées',
          'Provoque une erreur',
          'Ne fait rien'
        ],
        correctAnswer: 1,
        difficulty: 'medium',
        concept: 'array-methods',
        explanation: 'La méthode `map()` crée un nouveau tableau avec les résultats de l\'appel d\'une fonction sur chaque élément.',
        points: 15
      },
      {
        id: 'js-003',
        question: 'Quel sera le résultat de ce code ?\n```javascript\nconsole.log(typeof null);\n```',
        type: 'multiple-choice',
        options: [
          '"null"',
          '"undefined"', 
          '"object"',
          '"boolean"'
        ],
        correctAnswer: 2,
        difficulty: 'hard',
        concept: 'types',
        explanation: 'C\'est un bug historique de JavaScript. `typeof null` retourne "object" au lieu de "null".',
        points: 20
      }
    ]);

    // Questions Svelte
    this.questions.set('svelte', [
      {
        id: 'sv-001',
        question: 'Comment déclare-t-on une variable réactive dans un composant Svelte ?',
        type: 'multiple-choice',
        options: [
          'let reactive variable = value;',
          '$: reactive = value;',
          'reactive: let variable = value;',
          '@reactive variable = value;'
        ],
        correctAnswer: 1,
        difficulty: 'easy',
        concept: 'reactivity',
        explanation: 'La syntaxe `$:` est utilisée pour créer des déclarations réactives dans Svelte.',
        points: 10
      },
      {
        id: 'sv-002',
        question: 'Quelle est la syntaxe correcte pour un événement click dans Svelte ?',
        type: 'multiple-choice',
        options: [
          'onclick={handleClick}',
          'on:click={handleClick}',
          '@click={handleClick}',
          'click={handleClick}'
        ],
        correctAnswer: 1,
        difficulty: 'easy',
        concept: 'events',
        explanation: 'Svelte utilise la syntaxe `on:event` pour les gestionnaires d\'événements.',
        points: 10
      }
    ]);
  }

  /**
   * Lance une évaluation pour un domaine spécifique
   */
  async startAssessment(domain: string, questionCount: number = 5): Promise<AssessmentQuestion[]> {
    const domainQuestions = this.questions.get(domain) || [];
    
    if (domainQuestions.length === 0) {
      throw new Error(`Aucune question disponible pour le domaine: ${domain}`);
    }

    // Sélectionner un mélange de questions de différentes difficultés
    const selectedQuestions = this.selectBalancedQuestions(domainQuestions, questionCount);
    
    return selectedQuestions;
  }

  /**
   * Sélectionne des questions équilibrées par difficulté
   */
  private selectBalancedQuestions(questions: AssessmentQuestion[], count: number): AssessmentQuestion[] {
    const easy = questions.filter(q => q.difficulty === 'easy');
    const medium = questions.filter(q => q.difficulty === 'medium');
    const hard = questions.filter(q => q.difficulty === 'hard');

    const selected: AssessmentQuestion[] = [];
    
    // Distribution: 40% facile, 40% moyen, 20% difficile
    const easyCount = Math.ceil(count * 0.4);
    const mediumCount = Math.ceil(count * 0.4);
    const hardCount = count - easyCount - mediumCount;

    selected.push(...this.shuffleArray(easy).slice(0, easyCount));
    selected.push(...this.shuffleArray(medium).slice(0, mediumCount));
    selected.push(...this.shuffleArray(hard).slice(0, hardCount));

    return this.shuffleArray(selected).slice(0, count);
  }

  /**
   * Évalue les réponses et génère un profil d'apprentissage
   */
  async evaluateAssessment(
    domain: string, 
    questions: AssessmentQuestion[], 
    answers: (string | number)[]
  ): Promise<AssessmentResult> {
    let score = 0;
    let maxScore = 0;
    const conceptMastery: Record<string, number> = {};
    const conceptCounts: Record<string, number> = {};

    questions.forEach((question, index) => {
      maxScore += question.points;
      
      if (answers[index] === question.correctAnswer) {
        score += question.points;
      }

      // Suivi de la maîtrise par concept
      const concept = question.concept;
      if (!conceptMastery[concept]) {
        conceptMastery[concept] = 0;
        conceptCounts[concept] = 0;
      }
      
      if (answers[index] === question.correctAnswer) {
        conceptMastery[concept] += question.points;
      }
      conceptCounts[concept] += question.points;
    });

    // Normaliser les scores par concept (0-1)
    Object.keys(conceptMastery).forEach(concept => {
      conceptMastery[concept] = conceptMastery[concept] / conceptCounts[concept];
    });

    const percentage = (score / maxScore) * 100;
    const level = this.determineLevel(percentage);
    const strengths = this.getStrengths(conceptMastery);
    const weaknesses = this.getWeaknesses(conceptMastery);

    return {
      score,
      maxScore,
      percentage,
      level,
      strengths,
      weaknesses,
      recommendations: await this.generateRecommendations(level, weaknesses),
      conceptMastery
    };
  }

  /**
   * Détermine le niveau basé sur le pourcentage
   */
  private determineLevel(percentage: number): 'beginner' | 'intermediate' | 'advanced' {
    if (percentage >= 80) return 'advanced';
    if (percentage >= 60) return 'intermediate';
    return 'beginner';
  }

  /**
   * Identifie les forces de l'apprenant
   */
  private getStrengths(conceptMastery: Record<string, number>): string[] {
    return Object.entries(conceptMastery)
      .filter(([_, score]) => score >= 0.8)
      .map(([concept, _]) => concept);
  }

  /**
   * Identifie les faiblesses de l'apprenant
   */
  private getWeaknesses(conceptMastery: Record<string, number>): string[] {
    return Object.entries(conceptMastery)
      .filter(([_, score]) => score < 0.6)
      .map(([concept, _]) => concept);
  }

  /**
   * Génère des recommandations personnalisées
   */
  private async generateRecommendations(
    level: string, 
    weaknesses: string[]
  ): Promise<CourseRecommendation[]> {
    const recommendations: CourseRecommendation[] = [];

    // Recommandations basées sur le niveau
    if (level === 'beginner') {
      recommendations.push({
        courseId: 'javascript-basics',
        reason: 'Parfait pour débuter avec les concepts fondamentaux',
        priority: 'high',
        estimatedDuration: 120
      });
    }

    // Recommandations basées sur les faiblesses
    weaknesses.forEach(weakness => {
      if (weakness === 'variables') {
        recommendations.push({
          courseId: 'javascript-variables-deep',
          reason: 'Renforcer la compréhension des variables et de leur portée',
          priority: 'high',
          estimatedDuration: 60
        });
      }
      
      if (weakness === 'array-methods') {
        recommendations.push({
          courseId: 'javascript-arrays',
          reason: 'Maîtriser les méthodes de tableau essentielles',
          priority: 'medium',
          estimatedDuration: 90
        });
      }
    });

    return recommendations;
  }

  /**
   * Sauvegarde le profil d'apprentissage
   */
  async saveLearningProfile(userId: string, assessmentResult: AssessmentResult): Promise<void> {
    const existingProfile = this.profiles.get(userId);
    
    const profile: LearningProfile = {
      userId,
      assessmentResults: existingProfile 
        ? [...existingProfile.assessmentResults, assessmentResult]
        : [assessmentResult],
      learningStyle: existingProfile?.learningStyle || 'visual', // Par défaut
      pace: existingProfile?.pace || 'normal',
      preferredDifficulty: existingProfile?.preferredDifficulty || 'gradual',
      lastAssessment: new Date(),
      adaptedLevel: assessmentResult.level
    };

    this.profiles.set(userId, profile);
  }

  /**
   * Récupère le profil d'apprentissage d'un utilisateur
   */
  getLearningProfile(userId: string): LearningProfile | null {
    return this.profiles.get(userId) || null;
  }

  /**
   * Utilitaire pour mélanger un tableau
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Obtient les domaines disponibles pour l'évaluation
   */
  getAvailableDomains(): string[] {
    return Array.from(this.questions.keys());
  }

  /**
   * Obtient le nombre de questions disponibles pour un domaine
   */
  getQuestionCount(domain: string): number {
    return this.questions.get(domain)?.length || 0;
  }
}

// Instance globale pour l'application
export const preAssessmentSystem = new PreAssessmentSystem();
