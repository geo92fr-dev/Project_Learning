/**
 * Firebase Stores for Svelte Frontend Integration
 * Phase 5B: Frontend Integration - Reactive Firebase Stores
 * 
 * @description Stores Svelte réactifs pour Firebase avec TypeScript strict
 * @follows MyDevFramework CoPilot Best Practices + TDD approach
 */

import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  type Unsubscribe
} from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getDb, getAuth } from '../config';
import { 
  createUserConverter, 
  createCourseConverter, 
  createUserProgressConverter,
  createCompetenceConverter,
  validateFirestoreData,
  createTimestamp,
  generateDocumentId,
  COLLECTION_PATHS,
  handleFirestoreOperation
} from '../utils';
import type { 
  UserProfile, 
  Course, 
  UserProgress, 
  Competence 
} from '../collections';

// ===== STORE DEFINITIONS =====

/**
 * Store pour le profil utilisateur actuel
 */
export const userProfileStore: Writable<UserProfile | null> = writable(null);

/**
 * Store pour les cours disponibles
 */
export const coursesStore: Writable<Course[]> = writable([]);

/**
 * Store pour les progrès utilisateur (Map courseId -> UserProgress)
 */
export const userProgressStore: Writable<Map<string, UserProgress>> = writable(new Map());

/**
 * Store pour les compétences disponibles
 */
export const competencesStore: Writable<Competence[]> = writable([]);

/**
 * Store pour l'état d'authentification Firebase
 */
export const authUserStore: Writable<User | null> = writable(null);

/**
 * Store dérivé pour vérifier si l'utilisateur est connecté
 */
export const isAuthenticatedStore: Readable<boolean> = derived(
  authUserStore,
  ($authUser) => $authUser !== null
);

/**
 * Store dérivé pour obtenir les informations d'authentification
 */
export const authInfoStore: Readable<{
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
}> = derived(
  [authUserStore, userProfileStore],
  ([$authUser, $userProfile]) => ({
    isAuthenticated: $authUser !== null,
    user: $authUser,
    profile: $userProfile
  })
);

// ===== AUTHENTICATION INTEGRATION =====

/**
 * Initialiser l'écoute des changements d'authentification
 */
export function initializeAuthListener(): Unsubscribe {
  const auth = getAuth();
  return onAuthStateChanged(auth, async (user) => {
    authUserStore.set(user);
    
    if (user) {
      // Charger le profil utilisateur quand l'user est connecté
      await loadUserProfile(user.uid);
    } else {
      // Nettoyer les stores quand l'user est déconnecté
      userProfileStore.set(null);
      coursesStore.set([]);
      userProgressStore.set(new Map());
      competencesStore.set([]);
    }
  });
}

// ===== USER PROFILE OPERATIONS =====

/**
 * Créer un nouveau profil utilisateur
 */
export async function createUserProfile(profileData: {
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  photoURL?: string;
}): Promise<UserProfile> {
  const userId = generateDocumentId('user');
  const timestamp = createTimestamp();
  
  const userProfile: UserProfile = {
    id: userId,
    email: profileData.email,
    displayName: profileData.displayName,
    photoURL: profileData.photoURL,
    role: profileData.role,
    createdAt: timestamp,
    lastLoginAt: timestamp,
    
    preferences: {
      language: 'fr',
      theme: 'auto',
      notifications: {
        email: true,
        push: true,
        marketing: false
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reducedMotion: false
      }
    },
    
    learningProfile: {
      style: 'mixed',
      difficultyPreference: 0.5,
      sessionDurationPreference: 30,
      learningGoals: [],
      interests: []
    },
    
    progressTracking: {
      totalTimeSpent: 0,
      coursesCompleted: 0,
      competencesAcquired: [],
      currentStreak: 0,
      longestStreak: 0
    },
    
    metadata: {
      version: '1.0',
      lastUpdated: timestamp,
      isActive: true,
      gdprConsent: {
        functional: true,
        analytics: false,
        marketing: false,
        consentDate: timestamp
      }
    }
  };

  // Valider les données
  const validation = validateFirestoreData('user', userProfile);
  if (!validation.success) {
    throw new Error(`Validation du profil échouée: ${validation.error}`);
  }

  const result = await handleFirestoreOperation(async () => {
    const userDoc = doc(getDb(), COLLECTION_PATHS.USERS, userId).withConverter(createUserConverter());
    await setDoc(userDoc, userProfile);
    return userProfile;
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  // Mettre à jour le store
  userProfileStore.set(result.data);
  
  return result.data;
}

/**
 * Charger le profil utilisateur depuis Firestore
 */
export async function loadUserProfile(userId: string): Promise<UserProfile | null> {
  const result = await handleFirestoreOperation(async () => {
    const userDoc = doc(getDb(), COLLECTION_PATHS.USERS, userId).withConverter(createUserConverter());
    const snapshot = await getDoc(userDoc);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return snapshot.data();
  });

  if (!result.success) {
    console.error('Erreur chargement profil:', result.error);
    return null;
  }

  userProfileStore.set(result.data);
  return result.data;
}

/**
 * Mettre à jour le profil utilisateur
 */
export async function updateUserProfile(
  userId: string, 
  updates: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  const result = await handleFirestoreOperation(async () => {
    const userDoc = doc(getDb(), COLLECTION_PATHS.USERS, userId);
    const updateData = {
      ...updates,
      'metadata.lastUpdated': createTimestamp()
    };
    
    await updateDoc(userDoc, updateData);
    
    // Recharger le profil mis à jour
    await loadUserProfile(userId);
  });

  return result.success 
    ? { success: true }
    : { success: false, error: result.error };
}

// ===== COURSES OPERATIONS =====

/**
 * Charger les cours pour un utilisateur
 */
export async function getUserCourses(
  userId: string,
  filters?: {
    level?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
    limit?: number;
  }
): Promise<Course[]> {
  const result = await handleFirestoreOperation(async () => {
    let q = query(
      collection(getDb(), COLLECTION_PATHS.COURSES).withConverter(createCourseConverter()),
      where('metadata.isPublished', '==', true),
      orderBy('metadata.createdAt', 'desc')
    );

    // Appliquer les filtres
    if (filters?.level) {
      q = query(q, where('level', '==', filters.level));
    }
    
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  });

  if (!result.success) {
    console.error('Erreur chargement cours:', result.error);
    return [];
  }

  coursesStore.set(result.data);
  return result.data;
}

/**
 * Charger un cours spécifique
 */
export async function getCourse(courseId: string): Promise<Course | null> {
  const result = await handleFirestoreOperation(async () => {
    const courseDoc = doc(getDb(), COLLECTION_PATHS.COURSES, courseId).withConverter(createCourseConverter());
    const snapshot = await getDoc(courseDoc);
    
    return snapshot.exists() ? snapshot.data() : null;
  });

  return result.success ? result.data : null;
}

// ===== USER PROGRESS OPERATIONS =====

/**
 * Charger les progrès utilisateur
 */
export async function getUserProgress(userId: string): Promise<Map<string, UserProgress>> {
  const result = await handleFirestoreOperation(async () => {
    const q = query(
      collection(getDb(), COLLECTION_PATHS.USER_PROGRESS).withConverter(createUserProgressConverter()),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const progressMap = new Map<string, UserProgress>();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      progressMap.set(data.courseId, data);
    });
    
    return progressMap;
  });

  if (!result.success) {
    console.error('Erreur chargement progrès:', result.error);
    return new Map();
  }

  userProgressStore.set(result.data);
  return result.data;
}

/**
 * Mettre à jour le progrès pour un cours
 */
export async function updateUserProgress(progressData: {
  userId: string;
  courseId: string;
  score?: number;
  status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
  completed?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const progressId = generateDocumentId('userProgress', {
    userId: progressData.userId,
    courseId: progressData.courseId
  });

  const result = await handleFirestoreOperation(async () => {
    const progressDoc = doc(getDb(), COLLECTION_PATHS.USER_PROGRESS, progressId);
    
    const updateData = {
      ...progressData,
      id: progressId,
      lastAttempt: createTimestamp()
    };

    await setDoc(progressDoc, updateData, { merge: true });
    
    // Recharger les progrès
    await getUserProgress(progressData.userId);
  });

  return result.success 
    ? { success: true }
    : { success: false, error: result.error };
}

/**
 * S'abonner aux changements de progrès en temps réel
 */
export function subscribeToUserProgress(
  userId: string,
  callback: (progress: Map<string, UserProgress>) => void
): Unsubscribe {
  const q = query(
    collection(getDb(), COLLECTION_PATHS.USER_PROGRESS).withConverter(createUserProgressConverter()),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const progressMap = new Map<string, UserProgress>();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      progressMap.set(data.courseId, data);
    });
    
    userProgressStore.set(progressMap);
    callback(progressMap);
  }, (error) => {
    console.error('Erreur subscription progrès:', error);
  });
}

// ===== COMPETENCES OPERATIONS =====

/**
 * Charger les compétences disponibles
 */
export async function getCompetences(): Promise<Competence[]> {
  const result = await handleFirestoreOperation(async () => {
    const q = query(
      collection(getDb(), COLLECTION_PATHS.COMPETENCES).withConverter(createCompetenceConverter()),
      where('metadata.isActive', '==', true),
      orderBy('category'),
      orderBy('level')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  });

  if (!result.success) {
    console.error('Erreur chargement compétences:', result.error);
    return [];
  }

  competencesStore.set(result.data);
  return result.data;
}

// ===== DERIVED STORES FOR UI =====

/**
 * Store dérivé pour les cours en cours
 */
export const currentCoursesStore: Readable<Course[]> = derived(
  [coursesStore, userProgressStore],
  ([$courses, $progress]) => {
    return $courses.filter(course => {
      const progress = $progress.get(course.id);
      return progress && progress.status === 'in_progress';
    });
  }
);

/**
 * Store dérivé pour les cours complétés
 */
export const completedCoursesStore: Readable<Course[]> = derived(
  [coursesStore, userProgressStore],
  ([$courses, $progress]) => {
    return $courses.filter(course => {
      const progress = $progress.get(course.id);
      return progress && progress.completed;
    });
  }
);

/**
 * Store dérivé pour les statistiques utilisateur
 */
export const userStatsStore: Readable<{
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageScore: number;
  totalTimeSpent: number;
}> = derived(
  [userProfileStore, userProgressStore],
  ([$profile, $progress]) => {
    const progressArray = Array.from($progress.values());
    const completedCount = progressArray.filter(p => p.completed).length;
    const inProgressCount = progressArray.filter(p => p.status === 'in_progress').length;
    const averageScore = progressArray.length > 0 
      ? progressArray.reduce((sum, p) => sum + p.score, 0) / progressArray.length
      : 0;

    return {
      totalCourses: progressArray.length,
      completedCourses: completedCount,
      inProgressCourses: inProgressCount,
      averageScore: Math.round(averageScore),
      totalTimeSpent: $profile?.progressTracking.totalTimeSpent || 0
    };
  }
);

// ===== INITIALIZATION =====

/**
 * Initialiser tous les stores Firebase
 */
export function initializeFirebaseStores(): Unsubscribe {
  // Démarrer l'écoute d'authentification
  const authUnsubscribe = initializeAuthListener();
  
  // Charger les compétences (données publiques)
  getCompetences();
  
  // Retourner fonction de nettoyage
  return () => {
    authUnsubscribe();
    userProfileStore.set(null);
    coursesStore.set([]);
    userProgressStore.set(new Map());
    competencesStore.set([]);
    authUserStore.set(null);
  };
}
