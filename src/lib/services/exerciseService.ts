/**
 * 💪 Exercise Service - Phase 9
 * Service de gestion des exercices avec évaluation automatique et feedback adaptatif
 * Suivant DOC_CoPilot_Practices : TDD, Types First, Architecture modulaire
 */

import type { 
  Exercise, 
  ExerciseResult, 
  ExerciseCollection,
  QCMExercise,
  TrueFalseExercise,
  FillBlanksExercise,
  ExerciseType,
  DifficultyLevel,
  UserAnswer,
  QCMOption,
  BlankAnswer
} from '../types/exercise.js';

// Interface du service
export interface ExerciseServiceInterface {
  // Gestion des exercices
  getExercise(id: string): Promise<Exercise | null>;
  getExercisesByDifficulty(difficulty: DifficultyLevel): Promise<Exercise[]>;
  
  // Collections d'exercices
  createExerciseCollection(title: string, description: string): Promise<ExerciseCollection>;
  getRecommendedExercises(userId: string, limit?: number): Promise<Exercise[]>;
  
  // Évaluation automatique
  evaluateUserAnswer(exercise: Exercise, userAnswer: UserAnswer): ExerciseResult;
  
  // Génération d'exercices
  generateQCMExercise(topic: string, difficulty: DifficultyLevel): QCMExercise;
  generateTrueFalseExercise(topic: string, difficulty: DifficultyLevel): TrueFalseExercise;
  generateFillBlanksExercise(topic: string, difficulty: DifficultyLevel): FillBlanksExercise;
}

/**
 * 🎯 Service principal pour la gestion des exercices
 * Fonctionnalités :
 * - Génération automatique d'exercices
 * - Évaluation des réponses utilisateur
 * - Feedback adaptatif selon les performances
 * - Collections d'exercices thématiques
 */
export class ExerciseService implements ExerciseServiceInterface {
  private exercises: Map<string, Exercise> = new Map();
  private static instance: ExerciseService;

  // Singleton pattern
  public static getInstance(): ExerciseService {
    if (!ExerciseService.instance) {
      ExerciseService.instance = new ExerciseService();
    }
    return ExerciseService.instance;
  }

  /**
   * Récupération d'un exercice par ID
   */
  async getExercise(id: string): Promise<Exercise | null> {
    return this.exercises.get(id) || null;
  }

  /**
   * Filtrage des exercices par difficulté
   */
  async getExercisesByDifficulty(difficulty: DifficultyLevel): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.difficulty === difficulty);
  }

  /**
   * Création d'une collection d'exercices
   */
  async createExerciseCollection(title: string, description: string): Promise<ExerciseCollection> {
    const exercises = Array.from(this.exercises.values()).slice(0, 10);
    const totalPoints = exercises.reduce((sum, ex) => sum + ex.points, 0);
    const estimatedTime = Math.ceil(exercises.length * 3); // 3 min par exercice

    return {
      id: `collection_${Date.now()}`,
      title,
      description,
      exercises,
      totalPoints,
      estimatedTime
    };
  }

  /**
   * Recommandations d'exercices personnalisées
   */
  async getRecommendedExercises(userId: string, limit: number = 5): Promise<Exercise[]> {
    // Logique simple : mélanger et retourner les premiers
    const allExercises = Array.from(this.exercises.values());
    const shuffled = allExercises.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  /**
   * 🔍 Évaluation automatique des réponses utilisateur
   */
  evaluateUserAnswer(exercise: Exercise, userAnswer: UserAnswer): ExerciseResult {
    const baseResult = {
      exerciseId: exercise.id,
      userId: userAnswer.exerciseId, // Temporaire - devrait venir d'ailleurs
      answer: userAnswer,
      completedAt: new Date()
    };

    switch (exercise.type) {
      case 'qcm':
        return this.evaluateQCM(exercise as QCMExercise, userAnswer, baseResult);
      
      case 'true-false':
        return this.evaluateTrueFalse(exercise as TrueFalseExercise, userAnswer, baseResult);
      
      case 'fill-blanks':
        return this.evaluateFillBlanks(exercise as FillBlanksExercise, userAnswer, baseResult);
      
      default:
        throw new Error(`Type d'exercice non supporté: ${(exercise as any).type}`);
    }
  }

  /**
   * Évaluation spécifique QCM
   */
  private evaluateQCM(exercise: QCMExercise, userAnswer: UserAnswer, baseResult: any): ExerciseResult {
    if (typeof userAnswer.answer !== 'object' || userAnswer.answer === null) {
      return {
        ...baseResult,
        isCorrect: false,
        score: 0,
        maxScore: exercise.points,
        feedback: "Réponse invalide"
      };
    }

    const userSelectedIds = (userAnswer.answer as any).selectedOptions || [];
    const correctOptions = exercise.options.filter(opt => opt.isCorrect);
    const correctIds = correctOptions.map(opt => opt.id);

    const isCorrect = this.arraysEqual(userSelectedIds.sort(), correctIds.sort());
    const score = isCorrect ? exercise.points : 0;

    return {
      ...baseResult,
      isCorrect,
      score,
      maxScore: exercise.points,
      feedback: this.generateQCMFeedback(exercise, userSelectedIds, isCorrect),
      explanation: exercise.explanation
    };
  }

  /**
   * Évaluation spécifique Vrai/Faux
   */
  private evaluateTrueFalse(exercise: TrueFalseExercise, userAnswer: UserAnswer, baseResult: any): ExerciseResult {
    const userBooleanAnswer = userAnswer.answer as boolean;
    const isCorrect = userBooleanAnswer === exercise.correctAnswer;
    const score = isCorrect ? exercise.points : 0;

    return {
      ...baseResult,
      isCorrect,
      score,
      maxScore: exercise.points,
      feedback: this.generateTrueFalseFeedback(exercise, userBooleanAnswer, isCorrect),
      explanation: exercise.explanation
    };
  }

  /**
   * Évaluation spécifique Texte à trous
   */
  private evaluateFillBlanks(exercise: FillBlanksExercise, userAnswer: UserAnswer, baseResult: any): ExerciseResult {
    const userAnswers = userAnswer.answer as string[];
    let correctCount = 0;
    
    exercise.blanks.forEach((blank, index) => {
      const userInput = userAnswers[index]?.toLowerCase() || '';
      const correctAnswers = blank.correctAnswers.map(answer => 
        exercise.caseSensitive ? answer : answer.toLowerCase()
      );
      
      if (correctAnswers.includes(userInput)) {
        correctCount++;
      }
    });

    const totalBlanks = exercise.blanks.length;
    const score = Math.round((correctCount / totalBlanks) * exercise.points);
    const isCorrect = correctCount === totalBlanks;

    return {
      ...baseResult,
      isCorrect,
      score,
      maxScore: exercise.points,
      feedback: this.generateFillBlanksFeedback(correctCount, totalBlanks, isCorrect)
    };
  }

  /**
   * 🎲 Génération automatique d'exercices QCM
   */
  generateQCMExercise(topic: string, difficulty: DifficultyLevel): QCMExercise {
    const templates = this.getQCMTemplates(topic, difficulty);
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const options: QCMOption[] = [
      { id: 'opt1', text: template.correctAnswer, isCorrect: true },
      { id: 'opt2', text: template.wrongAnswers[0], isCorrect: false },
      { id: 'opt3', text: template.wrongAnswers[1], isCorrect: false },
      { id: 'opt4', text: template.wrongAnswers[2], isCorrect: false }
    ].sort(() => Math.random() - 0.5); // Mélanger les options

    const exercise: QCMExercise = {
      id: `qcm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: template.question,
      description: `Exercice QCM sur ${topic}`,
      type: 'qcm',
      difficulty,
      points: this.getPointsByDifficulty(difficulty),
      category: topic,
      tags: [topic, difficulty],
      createdAt: new Date(),
      updatedAt: new Date(),
      question: template.question,
      options,
      explanation: template.explanation,
      multipleCorrect: false
    };

    // Stocker l'exercice généré
    this.exercises.set(exercise.id, exercise);
    
    return exercise;
  }

  /**
   * 🎲 Génération automatique d'exercices Vrai/Faux
   */
  generateTrueFalseExercise(topic: string, difficulty: DifficultyLevel): TrueFalseExercise {
    const templates = this.getTrueFalseTemplates(topic, difficulty);
    const template = templates[Math.floor(Math.random() * templates.length)];

    const exercise: TrueFalseExercise = {
      id: `tf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Vrai ou Faux : ${topic}`,
      description: `Exercice Vrai/Faux sur ${topic}`,
      type: 'true-false',
      difficulty,
      points: this.getPointsByDifficulty(difficulty),
      category: topic,
      tags: [topic, difficulty],
      createdAt: new Date(),
      updatedAt: new Date(),
      statement: template.statement,
      correctAnswer: template.isTrue,
      explanation: template.explanation
    };

    // Stocker l'exercice généré
    this.exercises.set(exercise.id, exercise);
    
    return exercise;
  }

  /**
   * 🎲 Génération automatique d'exercices Texte à trous
   */
  generateFillBlanksExercise(topic: string, difficulty: DifficultyLevel): FillBlanksExercise {
    const templates = this.getFillBlanksTemplates(topic, difficulty);
    const template = templates[Math.floor(Math.random() * templates.length)];

    const blanks: BlankAnswer[] = template.blanks.map((blank, index) => ({
      position: index,
      correctAnswers: blank.answers,
      hint: blank.hint
    }));

    const exercise: FillBlanksExercise = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Complétez le texte : ${topic}`,
      description: `Exercice à trous sur ${topic}`,
      type: 'fill-blanks',
      difficulty,
      points: this.getPointsByDifficulty(difficulty),
      category: topic,
      tags: [topic, difficulty],
      createdAt: new Date(),
      updatedAt: new Date(),
      text: template.text,
      blanks,
      caseSensitive: false
    };

    // Stocker l'exercice généré
    this.exercises.set(exercise.id, exercise);
    
    return exercise;
  }

  /**
   * 🎯 Helpers pour la génération de feedback
   */
  private generateQCMFeedback(exercise: QCMExercise, selectedIds: string[], isCorrect: boolean): string {
    if (isCorrect) {
      return "🎉 Excellente réponse ! Vous maîtrisez bien ce concept.";
    }

    const correctOptions = exercise.options.filter(opt => opt.isCorrect);
    const correctTexts = correctOptions.map(opt => opt.text).join(', ');
    return `❌ Ce n'est pas correct. La bonne réponse était : ${correctTexts}`;
  }

  private generateTrueFalseFeedback(exercise: TrueFalseExercise, userAnswer: boolean, isCorrect: boolean): string {
    if (isCorrect) {
      return "✅ Parfait ! Vous avez la bonne réponse.";
    }
    
    const correctText = exercise.correctAnswer ? "Vrai" : "Faux";
    return `❌ Incorrect. La bonne réponse était : ${correctText}`;
  }

  private generateFillBlanksFeedback(correct: number, total: number, isCorrect: boolean): string {
    if (isCorrect) {
      return "🌟 Parfait ! Tous les mots sont corrects.";
    }
    
    const percentage = Math.round((correct / total) * 100);
    return `📝 ${correct}/${total} mots corrects (${percentage}%). Continuez vos efforts !`;
  }

  /**
   * 🏗️ Templates et données pour la génération
   */
  private getQCMTemplates(topic: string, difficulty: DifficultyLevel) {
    const templates = {
      mathematiques: [
        {
          question: "Combien font 7 × 8 ?",
          correctAnswer: "56",
          wrongAnswers: ["48", "54", "64"],
          explanation: "7 × 8 = 56. Table de multiplication de 7."
        }
      ],
      francais: [
        {
          question: "Quel est le pluriel de 'cheval' ?",
          correctAnswer: "chevaux",
          wrongAnswers: ["chevals", "chevales", "chevaus"],
          explanation: "Les mots en -al font leur pluriel en -aux."
        }
      ]
    };

    return templates[topic as keyof typeof templates] || templates.mathematiques;
  }

  private getTrueFalseTemplates(topic: string, difficulty: DifficultyLevel) {
    const templates = {
      mathematiques: [
        {
          statement: "Un triangle équilatéral a trois côtés égaux",
          isTrue: true,
          explanation: "Par définition, un triangle équilatéral a ses trois côtés de même longueur."
        }
      ],
      francais: [
        {
          statement: "Le verbe 'aller' se conjugue régulièrement",
          isTrue: false,
          explanation: "Le verbe 'aller' est un verbe irrégulier du 3ème groupe."
        }
      ]
    };

    return templates[topic as keyof typeof templates] || templates.mathematiques;
  }

  private getFillBlanksTemplates(topic: string, difficulty: DifficultyLevel) {
    const templates = {
      mathematiques: [
        {
          text: "Dans un triangle rectangle, le théorème de {{blank}} s'écrit : a² + b² = {{blank}}²",
          blanks: [
            { answers: ["Pythagore", "pythagore"], hint: "Mathématicien grec" },
            { answers: ["c", "hypoténuse"], hint: "Le côté le plus long" }
          ]
        }
      ],
      francais: [
        {
          text: "Le {{blank}} est un groupe de mots organisé autour d'un {{blank}}.",
          blanks: [
            { answers: ["groupe nominal", "GN"], hint: "Abrégé GN" },
            { answers: ["nom", "noyau"], hint: "Mot principal du groupe" }
          ]
        }
      ]
    };

    return templates[topic as keyof typeof templates] || templates.mathematiques;
  }

  /**
   * 🎯 Utilitaires
   */
  private getPointsByDifficulty(difficulty: DifficultyLevel): number {
    const pointsMap = {
      debutant: 10,
      intermediaire: 15,
      avance: 20,
      expert: 25
    };
    return pointsMap[difficulty];
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  /**
   * 💾 Sauvegarde d'un exercice généré
   */
  saveExercise(exercise: Exercise): void {
    this.exercises.set(exercise.id, exercise);
  }

  /**
   * 📊 Statistiques des exercices
   */
  getExerciseStats() {
    const byType = Array.from(this.exercises.values()).reduce((acc, ex) => {
      acc[ex.type] = (acc[ex.type] || 0) + 1;
      return acc;
    }, {} as Record<ExerciseType, number>);

    const byDifficulty = Array.from(this.exercises.values()).reduce((acc, ex) => {
      acc[ex.difficulty] = (acc[ex.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<DifficultyLevel, number>);

    return {
      total: this.exercises.size,
      byType,
      byDifficulty
    };
  }
}

// Export de l'instance singleton
export const exerciseService = ExerciseService.getInstance();

// Export par défaut pour la compatibilité
export default exerciseService;