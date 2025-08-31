// 🔐 FunLearning V3.0 - Content Types with Zod Validation
// Types pour le système de contenu Markdown complet

import { z } from "zod";

// ===== ENTITÉ DE BASE =====
export const BaseEntitySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number().int().positive().default(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;

// ===== MATIÈRES =====
export const MatiereSchema = BaseEntitySchema.extend({
  nom: z.string().min(1).max(100),
  code: z.string().min(2).max(10),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icone: z.string().min(1),
  description: z.string().max(500).optional(),
  ordre: z.number().int().min(0).default(0),
  actif: z.boolean().default(true),
});

export type Matiere = z.infer<typeof MatiereSchema>;

// ===== NIVEAUX ÉDUCATIFS =====
export const NiveauEducatifSchema = BaseEntitySchema.extend({
  nom: z.string().min(1).max(50),
  code: z.string().min(2).max(10),
  ordre: z.number().int().min(0),
  cycleId: z.string().optional(),
  ageMin: z.number().int().min(3).max(25).optional(),
  ageMax: z.number().int().min(3).max(25).optional(),
  actif: z.boolean().default(true),
});

export type NiveauEducatif = z.infer<typeof NiveauEducatifSchema>;

// ===== COMPÉTENCES =====
export const CompetenceSchema = BaseEntitySchema.extend({
  nom: z.string().min(1).max(200),
  description: z.string().max(1000),
  matiereId: z.string().min(1),
  niveauId: z.string().min(1),
  prerequis: z.array(z.string()).default([]),
  objectifs: z.array(z.string()).min(1),
  dureeEstimee: z.number().int().min(1).max(480), // en minutes
  difficulte: z.enum(["facile", "moyen", "difficile"]).default("moyen"),
  tags: z.array(z.string()).default([]),
  actif: z.boolean().default(true),
});

export type Competence = z.infer<typeof CompetenceSchema>;

// ===== COURS =====
export const CourseSchema = BaseEntitySchema.extend({
  titre: z.string().min(1).max(200),
  description: z.string().max(1000),
  competenceId: z.string().min(1),
  contenuMarkdown: z.string().min(1),
  contenuHtml: z.string().optional(), // Cache de la conversion
  ordre: z.number().int().min(0).default(0),
  dureeEstimee: z.number().int().min(1).max(240), // en minutes
  type: z.enum(["cours", "exercice", "evaluation"]).default("cours"),
  ressources: z
    .array(
      z.object({
        nom: z.string(),
        url: z.string().url(),
        type: z.enum(["video", "pdf", "lien", "image"]),
      })
    )
    .default([]),
  actif: z.boolean().default(true),
});

export type Course = z.infer<typeof CourseSchema>;

// ===== LEÇONS =====
export const LessonSchema = BaseEntitySchema.extend({
  titre: z.string().min(1).max(200),
  courseId: z.string().min(1),
  contenuMarkdown: z.string().min(1),
  contenuHtml: z.string().optional(),
  ordre: z.number().int().min(0).default(0),
  type: z.enum([
    "introduction",
    "explication",
    "exemple",
    "exercice",
    "synthese",
  ]),
  dureeEstimee: z.number().int().min(1).max(120),
  objectifs: z.array(z.string()).default([]),
  ressources: z
    .array(
      z.object({
        nom: z.string(),
        url: z.string().url(),
        type: z.enum(["video", "pdf", "lien", "image"]),
      })
    )
    .default([]),
  actif: z.boolean().default(true),
});

export type Lesson = z.infer<typeof LessonSchema>;

// ===== MARKDOWN PROCESSING =====
export interface MarkdownOptions {
  allowHtml?: boolean;
  highlight?: boolean;
  headingIds?: boolean;
  breaks?: boolean;
  enableCodeHighlight?: boolean;
  enableMath?: boolean;
  sanitizeHtml?: boolean;
  allowedTags?: string[];
}

export interface ContentMetadata {
  title: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export type MarkdownContent = {
  content: string;
  metadata: ContentMetadata;
  html?: string;
};

// ===== VALIDATION HELPERS =====
export const ValidationHelpers = {
  validateMatiere: (data: unknown) => MatiereSchema.parse(data),
  validateNiveauEducatif: (data: unknown) => NiveauEducatifSchema.parse(data),
  validateCompetence: (data: unknown) => CompetenceSchema.parse(data),
  validateCourse: (data: unknown) => CourseSchema.parse(data),
  validateLesson: (data: unknown) => LessonSchema.parse(data),
};

// ===== EXPORT GROUPÉS =====
export const ContentSchemas = {
  BaseEntity: BaseEntitySchema,
  Matiere: MatiereSchema,
  NiveauEducatif: NiveauEducatifSchema,
  Competence: CompetenceSchema,
  Course: CourseSchema,
  Lesson: LessonSchema,
};

export type ContentEntity =
  | Matiere
  | NiveauEducatif
  | Competence
  | Course
  | Lesson;

// 📋 Phase Status: ✅ Phase 3 - Content Types with Zod validation
