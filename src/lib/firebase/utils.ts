/**
 * Firebase Utilities
 * Phase 5: Firebase Data Layer - Utilities Implementation
 * 
 * @description Utilitaires Firebase avec converters, validation et helpers
 * @follows MyDevFramework CoPilot Best Practices + TDD approach
 */

import { 
  DocumentData, 
  QueryDocumentSnapshot, 
  FirestoreDataConverter,
  SnapshotOptions 
} from 'firebase/firestore';
import DOMPurify from 'isomorphic-dompurify';
import { 
  UserProfileSchema, 
  CourseSchema, 
  CompetenceSchema, 
  UserProgressSchema,
  type UserProfile,
  type Course,
  type Competence,
  type UserProgress
} from './collections';

// ===== FIRESTORE DATA CONVERTERS =====

/**
 * Créer un converter pour les documents User
 * @description Convertit entre objets TypeScript et documents Firestore
 */
export function createUserConverter(): FirestoreDataConverter<UserProfile> {
  return {
    toFirestore(user: UserProfile): DocumentData {
      // Exclure l'ID du document lors de la sauvegarde
      const { id, ...userData } = user;
      return userData;
    },
    
    fromFirestore(
      snapshot: QueryDocumentSnapshot<DocumentData>,
      options?: SnapshotOptions
    ): UserProfile {
      const data = snapshot.data(options);
      
      // Valider et parser les données avec le schéma Zod
      const parsedData = UserProfileSchema.parse({
        id: snapshot.id,
        ...data
      });
      
      return parsedData;
    }
  };
}

/**
 * Créer un converter pour les documents Course
 */
export function createCourseConverter(): FirestoreDataConverter<Course> {
  return {
    toFirestore(course: Course): DocumentData {
      const { id, ...courseData } = course;
      return courseData;
    },
    
    fromFirestore(
      snapshot: QueryDocumentSnapshot<DocumentData>,
      options?: SnapshotOptions
    ): Course {
      const data = snapshot.data(options);
      
      const parsedData = CourseSchema.parse({
        id: snapshot.id,
        ...data
      });
      
      return parsedData;
    }
  };
}

/**
 * Créer un converter pour les documents Competence
 */
export function createCompetenceConverter(): FirestoreDataConverter<Competence> {
  return {
    toFirestore(competence: Competence): DocumentData {
      const { id, ...competenceData } = competence;
      return competenceData;
    },
    
    fromFirestore(
      snapshot: QueryDocumentSnapshot<DocumentData>,
      options?: SnapshotOptions
    ): Competence {
      const data = snapshot.data(options);
      
      const parsedData = CompetenceSchema.parse({
        id: snapshot.id,
        ...data
      });
      
      return parsedData;
    }
  };
}

/**
 * Créer un converter pour les documents UserProgress
 */
export function createUserProgressConverter(): FirestoreDataConverter<UserProgress> {
  return {
    toFirestore(progress: UserProgress): DocumentData {
      const { id, ...progressData } = progress;
      return progressData;
    },
    
    fromFirestore(
      snapshot: QueryDocumentSnapshot<DocumentData>,
      options?: SnapshotOptions
    ): UserProgress {
      const data = snapshot.data(options);
      
      const parsedData = UserProgressSchema.parse({
        id: snapshot.id,
        ...data
      });
      
      return parsedData;
    }
  };
}

// ===== DATA VALIDATION UTILITIES =====

/**
 * Type pour les résultats de validation
 */
export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

/**
 * Valider des données Firestore contre un schéma
 * @param type Type de document (user, course, etc.)
 * @param data Données à valider
 */
export function validateFirestoreData(
  type: 'user' | 'course' | 'competence' | 'userProgress',
  data: any
): ValidationResult<any> {
  try {
    let validatedData: any;
    
    switch (type) {
      case 'user':
        validatedData = UserProfileSchema.parse(data);
        break;
      case 'course':
        validatedData = CourseSchema.parse(data);
        break;
      case 'competence':
        validatedData = CompetenceSchema.parse(data);
        break;
      case 'userProgress':
        validatedData = UserProgressSchema.parse(data);
        break;
      default:
        throw new Error(`Type de document non supporté: ${type}`);
    }
    
    return { success: true, data: validatedData };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Erreur de validation inconnue' 
    };
  }
}

// ===== INPUT SANITIZATION =====

/**
 * Options de sanitisation
 */
export interface SanitizeOptions {
  maxLength?: number;
  allowedTags?: string[];
  stripTags?: boolean;
}

/**
 * Sanitiser les entrées utilisateur
 * @param input Texte à sanitiser
 * @param options Options de sanitisation
 */
export function sanitizeUserInput(
  input: string | null | undefined,
  options: SanitizeOptions = {}
): string {
  // Gérer les valeurs nulles/undefined
  if (!input) return '';
  
  const {
    maxLength = 5000,
    allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    stripTags = false
  } = options;
  
  let sanitized = input;
  
  // Limiter la longueur
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Sanitiser le HTML
  if (stripTags) {
    // Supprimer tous les tags HTML
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } else {
    // Utiliser DOMPurify pour permettre seulement les tags sûrs
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: ['href', 'title', 'alt'],
      KEEP_CONTENT: true
    });
  }
  
  return sanitized;
}

// ===== TIMESTAMP UTILITIES =====

/**
 * Créer un timestamp ISO formaté
 * @param date Date optionnelle (par défaut: maintenant)
 */
export function createTimestamp(date?: Date): string {
  const targetDate = date || new Date();
  return targetDate.toISOString();
}

// ===== DOCUMENT ID GENERATION =====

/**
 * Générer un ID de document approprié selon le type
 * @param type Type de collection
 * @param params Paramètres pour ID composite
 */
export function generateDocumentId(
  type: 'user' | 'course' | 'competence' | 'userProgress' | 'assessment',
  params?: { userId?: string; courseId?: string; [key: string]: any }
): string {
  switch (type) {
    case 'userProgress':
      if (!params?.userId || !params?.courseId) {
        throw new Error('userId et courseId requis pour userProgress');
      }
      return `${params.userId}-${params.courseId}`;
      
    case 'assessment':
      if (!params?.userId || !params?.courseId) {
        throw new Error('userId et courseId requis pour assessment');
      }
      const timestamp = Date.now();
      return `${params.userId}-${params.courseId}-${timestamp}`;
      
    default:
      // Générer un ID aléatoire pour les autres types
      return generateRandomId();
  }
}

/**
 * Générer un ID aléatoire sécurisé
 */
function generateRandomId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ===== COLLECTION PATH CONSTANTS =====

/**
 * Constantes pour les chemins de collection
 */
export const COLLECTION_PATHS = {
  USERS: 'users',
  COURSES: 'courses',
  COMPETENCES: 'competences',
  USER_PROGRESS: 'userProgress',
  ANALYTICS: 'analytics',
  
  // Helpers pour sous-collections
  getUserNotifications: (userId: string) => `users/${userId}/notifications`,
  getCourseModules: (courseId: string) => `courses/${courseId}/modules`,
  getUserAssessments: (userId: string) => `users/${userId}/assessments`,
  getCourseAnalytics: (courseId: string) => `analytics/courses/${courseId}`,
} as const;

// ===== ERROR HANDLING UTILITIES =====

/**
 * Types d'erreurs Firebase
 */
export type FirebaseErrorCode = 
  | 'permission-denied'
  | 'not-found'
  | 'already-exists'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'unavailable';

/**
 * Traduire les erreurs Firebase en messages utilisateur
 * @param errorCode Code d'erreur Firebase
 */
export function getFirebaseErrorMessage(errorCode: FirebaseErrorCode): string {
  const messages: Record<FirebaseErrorCode, string> = {
    'permission-denied': 'Vous n\'avez pas les permissions nécessaires pour cette action.',
    'not-found': 'Le document demandé n\'existe pas.',
    'already-exists': 'Ce document existe déjà.',
    'invalid-argument': 'Les données fournies sont invalides.',
    'deadline-exceeded': 'L\'opération a pris trop de temps. Veuillez réessayer.',
    'unavailable': 'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
  };
  
  return messages[errorCode] || 'Une erreur inattendue s\'est produite.';
}

/**
 * Wrapper pour gérer les erreurs Firestore
 * @param operation Fonction async à exécuter
 */
export async function handleFirestoreOperation<T>(
  operation: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error: any) {
    console.error('Erreur Firestore:', error);
    
    const errorCode = error.code as FirebaseErrorCode;
    const message = getFirebaseErrorMessage(errorCode);
    
    return { success: false, error: message };
  }
}

// ===== BATCH OPERATIONS UTILITIES =====

/**
 * Taille maximale des batches Firestore
 */
export const FIRESTORE_BATCH_LIMIT = 500;

/**
 * Diviser un tableau en chunks pour les opérations batch
 * @param array Tableau à diviser
 * @param chunkSize Taille des chunks
 */
export function chunkArray<T>(array: T[], chunkSize: number = FIRESTORE_BATCH_LIMIT): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  
  return chunks;
}

/**
 * Valider une opération batch
 * @param operations Opérations à valider
 */
export function validateBatchOperations(operations: any[]): boolean {
  return operations.length <= FIRESTORE_BATCH_LIMIT && operations.length > 0;
}

// ===== TYPE GUARDS =====

/**
 * Vérifier si un objet est un UserProfile valide
 */
export function isUserProfile(obj: any): obj is UserProfile {
  try {
    UserProfileSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

/**
 * Vérifier si un objet est un Course valide
 */
export function isCourse(obj: any): obj is Course {
  try {
    CourseSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

/**
 * Vérifier si un objet est une Competence valide
 */
export function isCompetence(obj: any): obj is Competence {
  try {
    CompetenceSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

/**
 * Vérifier si un objet est un UserProgress valide
 */
export function isUserProgress(obj: any): obj is UserProgress {
  try {
    UserProgressSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}
