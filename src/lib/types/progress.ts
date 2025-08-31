// 🎯 FunLearning V3.0 - Phase 3 Types Progression
// Types TypeScript pour système de progression utilisateur

import type { ExerciseResult } from "./exercise";

// Progression globale utilisateur
export interface UserProgress {
  userId: string;
  totalPoints: number;
  totalExercises: number;
  completedExercises: number;
  currentStreak: number;
  longestStreak: number;
  competences: CompetenceProgress[];
  achievements: Achievement[];
  dailyStats: DailyStats[];
  createdAt: Date;
  updatedAt: Date;
}

// Progression par compétence
export interface CompetenceProgress {
  competenceId: string;
  name: string;
  category: string;
  level: CompetenceLevel;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  completedExercises: number;
  accuracy: number; // Pourcentage de réussite
  averageTime: number; // Temps moyen par exercice (secondes)
  lastActivity: Date;
}

export type CompetenceLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Système d'achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: AchievementType;
  condition: AchievementCondition;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export type AchievementType =
  | "streak" // Séries de succès
  | "mastery" // Maîtrise d'une compétence
  | "speed" // Vitesse d'exécution
  | "accuracy" // Précision
  | "persistence" // Persévérance
  | "explorer" // Exploration de contenu
  | "milestone"; // Jalons importants

export interface AchievementCondition {
  type: AchievementType;
  target: number;
  description: string;
}

// Statistiques quotidiennes
export interface DailyStats {
  date: Date;
  exercisesCompleted: number;
  pointsEarned: number;
  timeSpent: number; // en minutes
  accuracy: number;
  newAchievements: number;
}

// Session d'exercices
export interface ExerciseSession {
  id: string;
  userId: string;
  collectionId: string;
  startedAt: Date;
  completedAt?: Date;
  results: ExerciseResult[];
  totalScore: number;
  maxScore: number;
  accuracy: number;
  timeSpent: number;
  isCompleted: boolean;
}

// Statistiques de performance
export interface PerformanceStats {
  totalExercises: number;
  averageScore: number;
  averageAccuracy: number;
  averageTime: number;
  strongCompetences: string[]; // IDs des compétences fortes
  weakCompetences: string[]; // IDs des compétences à améliorer
  improvementTrends: TrendData[];
}

export interface TrendData {
  competenceId: string;
  dataPoints: TrendPoint[];
}

export interface TrendPoint {
  date: Date;
  value: number;
  type: "accuracy" | "speed" | "score";
}

// Recommandations personnalisées
export interface LearningRecommendation {
  type: "review" | "practice" | "advance" | "strengthen";
  competenceId: string;
  exerciseIds: string[];
  reason: string;
  priority: "low" | "medium" | "high";
  estimatedTime: number; // en minutes
}
