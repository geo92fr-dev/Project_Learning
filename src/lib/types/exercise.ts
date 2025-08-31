// 🎯 FunLearning V3.0 - Phase 3 Types Exercices
// Types TypeScript pour système d'exercices interactifs

export interface ExerciseBase {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  points: number;
  timeLimit?: number; // en secondes
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ExerciseType =
  | "qcm"
  | "true-false"
  | "fill-blanks"
  | "ordering"
  | "matching";

export type DifficultyLevel =
  | "debutant"
  | "intermediaire"
  | "avance"
  | "expert";

// QCM - Questions à Choix Multiples
export interface QCMExercise extends ExerciseBase {
  type: "qcm";
  question: string;
  options: QCMOption[];
  explanation?: string;
  multipleCorrect: boolean; // Permet plusieurs bonnes réponses
}

export interface QCMOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string; // Explication si sélectionné
}

// Vrai/Faux
export interface TrueFalseExercise extends ExerciseBase {
  type: "true-false";
  statement: string;
  correctAnswer: boolean;
  explanation: string;
}

// Texte à trous
export interface FillBlanksExercise extends ExerciseBase {
  type: "fill-blanks";
  text: string; // Texte avec {{blank}} pour les trous
  blanks: BlankAnswer[];
  caseSensitive: boolean;
}

export interface BlankAnswer {
  position: number; // Position du trou dans le texte
  correctAnswers: string[]; // Réponses acceptées
  hint?: string;
}

// Union type pour tous les exercices
export type Exercise = QCMExercise | TrueFalseExercise | FillBlanksExercise;

// Réponse utilisateur
export interface UserAnswer {
  exerciseId: string;
  type: ExerciseType;
  answer: QCMAnswer | boolean | string[] | null;
  timeSpent: number; // en secondes
  submittedAt: Date;
}

export interface QCMAnswer {
  selectedOptions: string[]; // IDs des options sélectionnées
}

// Résultat d'exercice
export interface ExerciseResult {
  exerciseId: string;
  userId: string;
  answer: UserAnswer;
  isCorrect: boolean;
  score: number; // Points obtenus
  maxScore: number; // Points maximum
  feedback: string;
  explanation?: string;
  completedAt: Date;
}

// Collection d'exercices
export interface ExerciseCollection {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  totalPoints: number;
  estimatedTime: number; // en minutes
  prerequisites?: string[]; // IDs d'autres collections
}
