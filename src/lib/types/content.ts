/**
 * Types pour le système de contenu éducatif
 * Phase 2 : Contenu & Markdown
 */

// Types de base pour le contenu
export interface CourseMetadata {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // en minutes
  category: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  prerequisites?: string[];
}

export interface CourseContent {
  id: string;
  slug: string;
  metadata: CourseMetadata;
  content: string; // Contenu Markdown
  htmlContent?: string; // HTML généré
  order: number;
  isPublished: boolean;
}

export interface CoursePage {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  slug: string;
}

// Types pour la navigation
export interface CourseNavigation {
  courseId: string;
  pages: {
    id: string;
    title: string;
    slug: string;
    order: number;
  }[];
  currentPage?: string;
}

// Types pour la progression
export interface UserProgress {
  userId: string;
  courseId: string;
  completedPages: string[];
  currentPage?: string;
  startedAt: Date;
  lastAccessedAt: Date;
  completionPercentage: number;
}

// Types pour les options de rendu Markdown
export interface MarkdownOptions {
  enableCodeHighlight: boolean;
  enableMath: boolean;
  sanitizeHtml: boolean;
  allowedTags?: string[];
}
