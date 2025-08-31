/**
 * Store pour la gestion du contenu des cours
 * Gestion état réactif du contenu et navigation
 */

import { writable, derived, type Readable } from "svelte/store";
import type {
  CourseContent,
  CoursePage,
  CourseNavigation,
  UserProgress,
} from "../types/content.js";

// Store principal pour les cours
export const courses = writable<CourseContent[]>([]);

// Store pour le cours actuellement consulté
export const currentCourse = writable<CourseContent | null>(null);

// Store pour la page actuelle du cours
export const currentPage = writable<CoursePage | null>(null);

// Store pour la navigation du cours
export const courseNavigation = writable<CourseNavigation | null>(null);

// Store pour la progression utilisateur
export const userProgress = writable<UserProgress[]>([]);

/**
 * Store dérivé : cours organisés par catégorie
 */
export const coursesByCategory: Readable<Record<string, CourseContent[]>> =
  derived(courses, ($courses) => {
    return $courses.reduce((acc, course) => {
      const category = course.metadata.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(course);
      return acc;
    }, {} as Record<string, CourseContent[]>);
  });

/**
 * Store dérivé : progression du cours actuel
 */
export const currentCourseProgress: Readable<UserProgress | null> = derived(
  [currentCourse, userProgress],
  ([$currentCourse, $userProgress]) => {
    if (!$currentCourse) return null;
    return $userProgress.find((p) => p.courseId === $currentCourse.id) || null;
  }
);

/**
 * Actions pour manipuler les stores
 */
export const courseActions = {
  /**
   * Charge la liste des cours
   */
  loadCourses: (courseList: CourseContent[]) => {
    courses.set(courseList);
  },

  /**
   * Sélectionne un cours par son slug
   */
  selectCourse: (slug: string) => {
    courses.subscribe((courseList) => {
      const course = courseList.find((c) => c.slug === slug);
      currentCourse.set(course || null);
    })();
  },

  /**
   * Met à jour la navigation du cours
   */
  updateNavigation: (navigation: CourseNavigation) => {
    courseNavigation.set(navigation);
  },

  /**
   * Sélectionne une page du cours
   */
  selectPage: (page: CoursePage) => {
    currentPage.set(page);
  },

  /**
   * Met à jour la progression utilisateur
   */
  updateProgress: (progress: UserProgress) => {
    userProgress.update((progressList) => {
      const existingIndex = progressList.findIndex(
        (p) => p.userId === progress.userId && p.courseId === progress.courseId
      );

      if (existingIndex >= 0) {
        progressList[existingIndex] = progress;
      } else {
        progressList.push(progress);
      }

      return progressList;
    });
  },

  /**
   * Marque une page comme complétée
   */
  markPageCompleted: (userId: string, courseId: string, pageId: string) => {
    userProgress.update((progressList) => {
      const progress = progressList.find(
        (p) => p.userId === userId && p.courseId === courseId
      );

      if (progress && !progress.completedPages.includes(pageId)) {
        progress.completedPages.push(pageId);
        progress.lastAccessedAt = new Date();
        // Recalcul du pourcentage (sera fait côté composant avec navigation)
      }

      return progressList;
    });
  },

  /**
   * Remet à zéro les stores
   */
  reset: () => {
    courses.set([]);
    currentCourse.set(null);
    currentPage.set(null);
    courseNavigation.set(null);
    userProgress.set([]);
  },
};
