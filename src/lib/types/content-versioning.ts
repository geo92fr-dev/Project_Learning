import { z } from 'zod';

// Schéma de validation pour les versions de contenu
export const ContentVersionSchema = z.object({
  contentId: z.string(),
  contentType: z.enum(['course', 'exercise', 'series']),
  content: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    tags: z.array(z.string()).optional()
  }),
  metadata: z.object({
    contentId: z.string(),
    version: z.number(),
    isActive: z.boolean(),
    isDraft: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdBy: z.string(),
    approvalStatus: z.enum(['draft', 'pending', 'to_be_updated', 'approved', 'rejected', 'not_conformed', 'archived']),
    approvedBy: z.string().optional(),
    approvedAt: z.date().optional(),
    validationComment: z.string().optional(),
    validatedBy: z.string().optional(),
    validatedAt: z.date().optional(),
    archivedAt: z.date().optional(),
  })
});

// Type pour version avec ID requis (lecture)
export const ContentVersionWithIdSchema = ContentVersionSchema.extend({
  id: z.string() // ID requis pour les versions lues
});

export type ContentVersion = z.infer<typeof ContentVersionWithIdSchema>;
export type ContentVersionInput = z.infer<typeof ContentVersionSchema>;

// Types d'export supportés - Formats avec métadonnées
export const EXPORT_FORMATS = [
  {
    id: 'json',
    name: 'JSON',
    mimeType: 'application/json',
    extension: 'json',
    supportsMetadata: true
  },
  {
    id: 'markdown',
    name: 'Markdown',
    mimeType: 'text/markdown',
    extension: 'md',
    supportsMetadata: true
  },
  {
    id: 'package',
    name: 'Package Export',
    mimeType: 'application/json',
    extension: 'json',
    supportsMetadata: true
  },
  {
    id: 'ai_analysis',
    name: 'AI Analysis',
    mimeType: 'text/markdown',
    extension: 'md',
    supportsMetadata: true
  }
] as const;

// Types pour l'export
export type ExportFormat = typeof EXPORT_FORMATS[number]['id'];

// Configuration pour l'export IA - Structure par type de contenu
export const AI_ANALYSIS_PROMPTS = {
  course: {
    expert_role: "Expert en ingénierie pédagogique et conception de cours",
    context: "Analyse d'un cours pédagogique pour optimiser l'apprentissage",
    analysis_criteria: [
      "Structure pédagogique et progression logique",
      "Clarté des objectifs d'apprentissage",
      "Pertinence du contenu par rapport aux objectifs",
      "Qualité des exemples et illustrations",
      "Engagement et interactivité",
      "Évaluation et validation des acquis",
      "Accessibilité et inclusivité",
      "Cohérence globale et fluidité"
    ]
  },
  exercise: {
    expert_role: "Expert en évaluation pédagogique et conception d'exercices",
    context: "Analyse d'un exercice pédagogique pour optimiser l'évaluation",
    analysis_criteria: [
      "Alignement avec les objectifs d'apprentissage",
      "Niveau de difficulté approprié",
      "Clarté des consignes et instructions",
      "Qualité du feedback et correction",
      "Variété des types de questions",
      "Temps de réalisation adapté",
      "Critères d'évaluation explicites",
      "Potentiel d'apprentissage par l'erreur"
    ]
  },
  series: {
    expert_role: "Expert en parcours d'apprentissage et séquençage pédagogique",
    context: "Analyse d'une série pédagogique pour optimiser le parcours",
    analysis_criteria: [
      "Cohérence du parcours d'apprentissage",
      "Progression pédagogique logique",
      "Liens entre les différents modules",
      "Équilibre théorie/pratique",
      "Diversité des modalités pédagogiques",
      "Prérequis et dépendances clairement définis",
      "Évaluation continue et sommative",
      "Adaptabilité aux différents profils d'apprenants"
    ]
  }
} as const;
