/**
 * 🔒 Validation Zod - Phase 9
 * Schemas de validation pour exercices avec sécurité renforcée
 * Suivant DOC_CoPilot_Practices : Validation stricte, gestion d'erreurs
 */

import { z } from 'zod';
import DOMPurify from 'dompurify';

// ===== SCHEMAS DE BASE =====

/**
 * Schema pour les niveaux de difficulté
 */
const DifficultyLevelSchema = z.enum(['debutant', 'intermediaire', 'avance', 'expert']);

/**
 * Schema pour les types d'exercices
 */
const ExerciseTypeSchema = z.enum(['qcm', 'true-false', 'fill-blanks', 'ordering', 'matching']);

/**
 * Schema de base pour tous les exercices
 */
export const ExerciseBaseSchema = z.object({
  id: z.string().min(1, 'ID requis').max(100, 'ID trop long'),
  title: z.string()
    .min(1, 'Titre requis')
    .max(200, 'Titre trop long')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] })),
  description: z.string()
    .max(1000, 'Description trop longue')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em'] })),
  type: ExerciseTypeSchema,
  difficulty: DifficultyLevelSchema,
  points: z.number().int().min(1).max(100),
  timeLimit: z.number().int().min(30).max(3600).optional(), // 30s à 1h
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(30)).max(10, 'Trop de tags'),
  createdAt: z.date().or(z.string().transform(str => new Date(str))),
  updatedAt: z.date().or(z.string().transform(str => new Date(str)))
});

// ===== SCHEMAS SPÉCIALISÉS =====

/**
 * Schema pour les options QCM
 */
const QCMOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string()
    .min(1, 'Texte option requis')
    .max(500, 'Texte option trop long')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: ['strong', 'em'] })),
  isCorrect: z.boolean(),
  explanation: z.string()
    .max(300, 'Explication trop longue')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: ['p', 'br'] }))
    .optional()
});

/**
 * Schema pour exercices QCM
 */
const QCMExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal('qcm'),
  question: z.string()
    .min(10, 'Question trop courte')
    .max(1000, 'Question trop longue')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em'] })),
  options: z.array(QCMOptionSchema)
    .min(2, 'Au moins 2 options requises')
    .max(6, 'Maximum 6 options')
    .refine(options => options.some(opt => opt.isCorrect), {
      message: 'Au moins une option correcte requise'
    }),
  explanation: z.string()
    .max(500, 'Explication trop longue')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em'] }))
    .optional(),
  multipleCorrect: z.boolean().default(false)
});

/**
 * Schema pour exercices Vrai/Faux
 */
const TrueFalseExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal('true-false'),
  statement: z.string()
    .min(10, 'Affirmation trop courte')
    .max(500, 'Affirmation trop longue')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: ['strong', 'em'] })),
  correctAnswer: z.boolean(),
  explanation: z.string()
    .max(500, 'Explication trop longue')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em'] }))
    .optional()
});

/**
 * Schema pour exercices à trous
 */
const FillBlanksExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal('fill-blanks'),
  text: z.string()
    .min(20, 'Texte trop court')
    .max(2000, 'Texte trop long')
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'span'] })),
  blanks: z.array(z.object({
    id: z.string().min(1),
    correctAnswers: z.array(z.string().min(1).max(100)).min(1, 'Au moins une réponse correcte'),
    caseSensitive: z.boolean().default(false),
    hint: z.string().max(200).optional()
  })).min(1, 'Au moins un trou requis').max(20, 'Maximum 20 trous')
});

// ===== SCHEMAS DE RÉPONSES =====

/**
 * Schema pour réponses utilisateur QCM
 */
const QCMUserAnswerSchema = z.object({
  selectedOptions: z.array(z.string()).min(1, 'Au moins une option sélectionnée'),
  timeSpent: z.number().int().min(0).max(3600) // Max 1h
});

/**
 * Schema pour réponses utilisateur Vrai/Faux
 */
const TrueFalseUserAnswerSchema = z.object({
  answer: z.boolean(),
  timeSpent: z.number().int().min(0).max(3600)
});

/**
 * Schema pour réponses utilisateur à trous
 */
const FillBlanksUserAnswerSchema = z.object({
  answers: z.record(z.string(), z.string().max(200)), // blankId -> réponse
  timeSpent: z.number().int().min(0).max(3600)
});

// ===== SCHEMAS DE RÉSULTATS =====

/**
 * Schema pour résultats d'exercices
 */
const ExerciseResultSchema = z.object({
  id: z.string().min(1),
  exerciseId: z.string().min(1),
  userId: z.string().min(1).optional(),
  score: z.number().int().min(0).max(100),
  maxScore: z.number().int().min(1).max(100),
  timeSpent: z.number().int().min(0),
  answers: z.union([
    QCMUserAnswerSchema,
    TrueFalseUserAnswerSchema,
    FillBlanksUserAnswerSchema
  ]),
  feedback: z.string().max(1000).optional(),
  completedAt: z.date().or(z.string().transform(str => new Date(str))),
  difficulty: DifficultyLevelSchema
});

// ===== FONCTIONS DE VALIDATION =====

/**
 * Valide un exercice selon son type
 */
export function validateExercise(exercise: unknown): { success: boolean; data?: any; error?: string } {
  try {
    // Validation du type d'abord
    const baseResult = ExerciseBaseSchema.safeParse(exercise);
    if (!baseResult.success) {
      return { 
        success: false, 
        error: `Validation de base échouée: ${baseResult.error.issues.map(i => i.message).join(', ')}` 
      };
    }

    const exerciseData = baseResult.data;
    
    // Validation spécialisée selon le type
    switch (exerciseData.type) {
      case 'qcm':
        const qcmResult = QCMExerciseSchema.safeParse(exercise);
        return qcmResult.success 
          ? { success: true, data: qcmResult.data }
          : { success: false, error: `QCM invalide: ${qcmResult.error.issues.map(i => i.message).join(', ')}` };
      
      case 'true-false':
        const tfResult = TrueFalseExerciseSchema.safeParse(exercise);
        return tfResult.success 
          ? { success: true, data: tfResult.data }
          : { success: false, error: `Vrai/Faux invalide: ${tfResult.error.issues.map(i => i.message).join(', ')}` };
      
      case 'fill-blanks':
        const fbResult = FillBlanksExerciseSchema.safeParse(exercise);
        return fbResult.success 
          ? { success: true, data: fbResult.data }
          : { success: false, error: `Texte à trous invalide: ${fbResult.error.issues.map(i => i.message).join(', ')}` };
      
      default:
        return { success: false, error: `Type d'exercice non supporté: ${exerciseData.type}` };
    }
  } catch (error: any) {
    return { success: false, error: `Erreur de validation: ${error?.message || 'Erreur inconnue'}` };
  }
}

/**
 * Valide une réponse utilisateur
 */
export function validateUserAnswer(answer: unknown, exerciseType: string): { success: boolean; data?: any; error?: string } {
  try {
    let schema;
    switch (exerciseType) {
      case 'qcm':
        schema = QCMUserAnswerSchema;
        break;
      case 'true-false':
        schema = TrueFalseUserAnswerSchema;
        break;
      case 'fill-blanks':
        schema = FillBlanksUserAnswerSchema;
        break;
      default:
        return { success: false, error: `Type d'exercice non supporté: ${exerciseType}` };
    }

    const result = schema.safeParse(answer);
    return result.success 
      ? { success: true, data: result.data }
      : { success: false, error: `Réponse invalide: ${result.error.issues.map(i => i.message).join(', ')}` };
  } catch (error: any) {
    return { success: false, error: `Erreur de validation réponse: ${error?.message || 'Erreur inconnue'}` };
  }
}

/**
 * Valide un résultat d'exercice
 */
export function validateExerciseResult(result: unknown): { success: boolean; data?: any; error?: string } {
  try {
    const validation = ExerciseResultSchema.safeParse(result);
    return validation.success 
      ? { success: true, data: validation.data }
      : { success: false, error: `Résultat invalide: ${validation.error.issues.map(i => i.message).join(', ')}` };
  } catch (error: any) {
    return { success: false, error: `Erreur de validation résultat: ${error?.message || 'Erreur inconnue'}` };
  }
}

/**
 * Sanitise un contenu utilisateur
 */
export function sanitizeUserContent(content: string, allowedTags: string[] = []): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: []
  });
}

/**
 * Valide et sanitise un texte d'exercice
 */
export function validateAndSanitizeText(text: string, maxLength: number = 1000): { success: boolean; data?: string; error?: string } {
  if (typeof text !== 'string') {
    return { success: false, error: 'Le texte doit être une chaîne de caractères' };
  }
  
  if (text.length > maxLength) {
    return { success: false, error: `Texte trop long (max: ${maxLength} caractères)` };
  }
  
  const sanitized = sanitizeUserContent(text, ['p', 'br', 'strong', 'em']);
  return { success: true, data: sanitized };
}

// ===== EXPORTS =====
export {
  QCMExerciseSchema,
  TrueFalseExerciseSchema,
  FillBlanksExerciseSchema,
  ExerciseResultSchema,
  QCMUserAnswerSchema,
  TrueFalseUserAnswerSchema,
  FillBlanksUserAnswerSchema,
  DifficultyLevelSchema,
  ExerciseTypeSchema
};
