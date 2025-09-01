/**
 * Firebase Collections Schema Definitions
 * Phase 5: Firebase Data Layer - TDD Implementation
 *
 * @description Schémas Zod pour validation des données Firebase
 * @follows MyDevFramework CoPilot Best Practices
 * @implements TDD approach - implementing to satisfy tests
 */

import { z } from "zod";

// ===== VALIDATION FUNCTIONS (Security Best Practices v2.2) =====

/**
 * Validation sécurisée des chaînes de caractères
 * Basé sur DOC_CoPilot_Practices v2.2 - Section 4: Validation et Sécurité
 */
function secureString(maxLength = 255) {
  return z
    .string()
    .max(maxLength, `Texte trop long (max: ${maxLength} caractères)`)
    .refine(
      (val) =>
        !/<script|javascript:|data:|vbscript:|onload=|onerror=/i.test(val),
      { message: "Contenu potentiellement malveillant détecté" }
    )
    .refine(
      (val) =>
        !/[\u0000-\u001F\u007F-\u009F\uFEFF\u200B-\u200F\u2028-\u202F\uFDD0-\uFDEF\uFFFE\uFFFF]/.test(
          val
        ),
      { message: "Caractères Unicode non autorisés détectés" }
    );
}

/**
 * Validation sécurisée des emails avec protection contre Unicode
 */
function secureEmail() {
  return z
    .string()
    .email("Format email invalide")
    .max(254, "Email trop long")
    .refine(
      (val) =>
        !/[\u0000-\u001F\u007F-\u009F\uFEFF\u200B-\u200F\u2028-\u202F]/.test(
          val
        ),
      { message: "Caractères Unicode non autorisés dans l'email" }
    );
}

// ===== USER PROFILE SCHEMA =====

/**
 * Schéma pour les profils utilisateurs
 * @description Structure complète du profil utilisateur avec préférences et suivi pédagogique
 */
export const UserProfileSchema = z.object({
  id: secureString(50),
  email: secureEmail(),
  displayName: secureString(100),
  photoURL: z.string().url().optional(),
  role: z.enum(["student", "teacher", "admin"]),
  createdAt: z.string(),
  lastLoginAt: z.string(),

  preferences: z
    .object({
      language: z.string().default("fr"),
      theme: z.enum(["light", "dark", "auto"]).default("auto"),
      notifications: z.object({
        email: z.boolean().default(true),
        push: z.boolean().default(true),
        marketing: z.boolean().default(false),
      }),
      accessibility: z.object({
        fontSize: z.enum(["small", "medium", "large"]).default("medium"),
        highContrast: z.boolean().default(false),
        reducedMotion: z.boolean().default(false),
      }),
    })
    .default({
      language: "fr",
      theme: "auto",
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
      accessibility: {
        fontSize: "medium",
        highContrast: false,
        reducedMotion: false,
      },
    }),

  learningProfile: z
    .object({
      style: z
        .enum(["visual", "auditory", "kinesthetic", "reading", "mixed"])
        .default("mixed"),
      difficultyPreference: z.number().min(0).max(1).default(0.5),
      sessionDurationPreference: z.number().positive().default(30), // minutes
      learningGoals: z.array(z.string()).default([]),
      interests: z.array(z.string()).default([]),
    })
    .default({
      style: "mixed",
      difficultyPreference: 0.5,
      sessionDurationPreference: 30,
      learningGoals: [],
      interests: [],
    }),

  progressTracking: z
    .object({
      totalTimeSpent: z.number().default(0), // minutes
      coursesCompleted: z.number().default(0),
      competencesAcquired: z.array(z.string()).default([]),
      currentStreak: z.number().default(0), // jours consécutifs
      longestStreak: z.number().default(0),
      averageScore: z.number().min(0).max(1).optional(),
    })
    .default({
      totalTimeSpent: 0,
      coursesCompleted: 0,
      competencesAcquired: [],
      currentStreak: 0,
      longestStreak: 0,
    }),

  metadata: z
    .object({
      version: z.string().default("1.0"),
      lastUpdated: z.string(),
      isActive: z.boolean().default(true),
      gdprConsent: z.object({
        functional: z.boolean(),
        analytics: z.boolean(),
        marketing: z.boolean(),
        consentDate: z.string(),
      }),
    })
    .optional()
    .transform(
      (val) =>
        val || {
          version: "1.0",
          lastUpdated: new Date().toISOString(),
          isActive: true,
          gdprConsent: {
            functional: false,
            analytics: false,
            marketing: false,
            consentDate: new Date().toISOString(),
          },
        }
    ),
});

// ===== COURSE SCHEMA =====

/**
 * Schéma pour les cours
 * @description Structure hiérarchique cours > modules > leçons
 */
export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedDuration: z.number().positive(), // minutes
  language: z.string().default("fr"),
  tags: z.array(z.string()).default([]),
  competenceIds: z.array(z.string()),
  prerequisites: z.array(z.string()).default([]),

  content: z.object({
    modules: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        order: z.number(),
        lessons: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            type: z.enum(["video", "text", "interactive", "quiz"]),
            content: z.string(),
            duration: z.number(),
            resources: z
              .array(
                z.object({
                  type: z.string(),
                  url: z.string(),
                  title: z.string(),
                })
              )
              .default([]),
          })
        ),
      })
    ),
  }),

  assessment: z.object({
    preAssessment: z.string().optional(), // ID de l'évaluation
    postAssessment: z.string().optional(),
    continuousAssessment: z.array(z.string()).default([]),
    passingScore: z.number().min(0).max(1).default(0.7),
  }),

  analytics: z.object({
    totalEnrollments: z.number().default(0),
    completionRate: z.number().min(0).max(1).default(0),
    averageRating: z.number().min(0).max(5).optional(),
    totalRatings: z.number().default(0),
  }),

  metadata: z.object({
    authorId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.string().default("1.0"),
    isPublished: z.boolean().default(false),
    publishedAt: z.string().optional(),
  }),
});

// ===== COMPETENCE SCHEMA =====

/**
 * Schéma pour les compétences
 * @description Compétences avec critères d'évaluation et ressources associées
 */
export const CompetenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  level: z.number().min(1).max(5), // Échelle 1-5
  prerequisites: z.array(z.string()).default([]),
  learningObjectives: z.array(z.string()),

  assessmentCriteria: z.array(
    z.object({
      criterion: z.string(),
      weight: z.number().min(0).max(1),
    })
  ),

  resources: z
    .array(
      z.object({
        type: z.enum(["course", "exercise", "reading", "video"]),
        resourceId: z.string(),
        title: z.string(),
        difficulty: z.number().min(0).max(1),
      })
    )
    .default([]),

  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    isActive: z.boolean().default(true),
  }),
});

// ===== USER PROGRESS SCHEMA =====

/**
 * Schéma pour le suivi de progression utilisateur
 * @description Structure optimisée pour les coûts Firebase (dénormalisée)
 */
export const UserProgressSchema = z.object({
  id: z.string(), // userId-courseId
  userId: z.string(),
  courseId: z.string(),
  status: z.enum(["not_started", "in_progress", "completed", "paused"]),

  // Métriques de progression
  score: z.number().min(0).max(100).default(0),
  completed: z.boolean().default(false),
  lastAttempt: z.string(), // ISO timestamp
});

// ===== TYPE EXPORTS =====

/**
 * Types TypeScript dérivés des schémas Zod
 * @description Types type-safe pour utilisation dans l'application
 */
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Competence = z.infer<typeof CompetenceSchema>;
export type UserProgress = z.infer<typeof UserProgressSchema>;

// ===== COLLECTION NAMES =====

/**
 * Constantes pour les noms de collections Firebase
 * @description Centralisation des noms pour éviter les erreurs de typage
 */
export const COLLECTIONS = {
  USERS: "users",
  COURSES: "courses",
  COMPETENCES: "competences",
  USER_PROGRESS: "userProgress",
  ANALYTICS: "analytics",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
