/**
 * 📋 Types Curriculum - Phase 6
 * Définitions des types pour le système de curriculum
 */

export interface Competence {
  id: string;
  name: string;
  matiere: string;
  matiereDisplay: string;
  niveau: string;
  description: string;
  prerequis: string[];
  objectifs: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  matiere: string;
  niveau: string;
  competenceId: string;
  type: 'lesson' | 'exercises';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number;
  exerciseCount: number;
  estimatedTime: number;
  content: CourseContent;
  exercises: Exercise[];
  resources: Resource[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
  featured: boolean;
}

export interface CourseContent {
  introduction?: string;
  chapters?: Chapter[];
  conclusion?: string;
  warmup?: string;
  practice?: string;
  challenge?: string;
}

export interface Chapter {
  title: string;
  content: string;
  duration: number;
}

export interface Exercise {
  id: string;
  title: string;
  type: 'qcm' | 'text' | 'numeric' | 'drag-drop';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  points: number;
  timeLimit?: number;
  question?: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
}

export interface Resource {
  type: 'pdf' | 'video' | 'audio' | 'link' | 'image';
  title: string;
  url: string;
  description?: string;
  size?: number;
  duration?: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  competenceId?: string;
  startedAt: string;
  completedAt?: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  exercisesCompleted: number;
  totalExercises: number;
  lastAccessedAt: string;
  progress: number; // 0-100
  attempts: number;
  bestScore?: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  competences: string[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumStats {
  totalCompetences: number;
  totalCourses: number;
  totalExercises: number;
  totalEstimatedTime: number;
  byMatiere: Record<string, number>;
  byNiveau: Record<string, number>;
  byDifficulty: Record<string, number>;
}

export interface UserCurriculumStats {
  completedCompetences: number;
  completedCourses: number;
  totalTimeSpent: number;
  averageScore: number;
  currentStreak: number;
  totalPoints: number;
  level: string;
  progressToNextLevel: number;
}

// Énumérations
export enum Matiere {
  MATHEMATIQUES = 'mathematiques',
  FRANCAIS = 'francais',
  SCIENCES = 'sciences',
  HISTOIRE = 'histoire',
  GEOGRAPHIE = 'geographie'
}

export enum Niveau {
  SIXIEME = '6eme',
  CINQUIEME = '5eme',
  QUATRIEME = '4eme',
  TROISIEME = '3eme'
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum CourseType {
  LESSON = 'lesson',
  EXERCISES = 'exercises'
}

export enum ExerciseType {
  QCM = 'qcm',
  TEXT = 'text',
  NUMERIC = 'numeric',
  DRAG_DROP = 'drag-drop'
}

// Types utilitaires
export type CompetenceFilter = {
  matiere?: Matiere;
  niveau?: Niveau;
  difficulty?: Difficulty;
};

export type CourseFilter = CompetenceFilter & {
  type?: CourseType;
  featured?: boolean;
  published?: boolean;
};

export type SearchOptions = {
  query?: string;
  filters?: CompetenceFilter | CourseFilter;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
  page?: number;
  pageSize?: number;
};
