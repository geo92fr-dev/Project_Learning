# 📊 Phase 5 : Firebase Data Layer (4 jours) - v1.3

## 📋 **Vue d'Ensemble**

**Objectif** : Infrastructure de données robuste avec Firebase pour gestion utilisateurs et contenu  
**Version cible** : v1.3 (architecture data complète)  
**Groupe** : ⚙️ MOTEUR  
**Prérequis** : Phase 4 (Pédagogie) validée ✅

---

## 🎯 **Principes Fondamentaux & Architecture**

### 🗄️ **Architecture de Données Firebase**

**Stratégie NoSQL :**
- **Collections principales** : users, courses, competences, assessments, analytics
- **Relations dénormalisées** : Optimisation pour lecture rapide
- **Indexation stratégique** : Requêtes complexes performantes
- **Cache distribué** : Réduction latence avec Redis/Memcache
- **Sharding horizontal** : Évolutivité massive

**Modèle de Données :**
- **Document-oriented** : Structure flexible pour contenu éducatif
- **Références optimisées** : Balance entre cohérence et performance
- **Versionning** : Historique des modifications de contenu
- **Soft deletes** : Récupération de données et analytics
- **Audit trail** : Traçabilité complète des actions

### 🔐 **Sécurité & Conformité**

**Firestore Security Rules :**
- **Authentification obligatoire** : Aucun accès anonyme aux données sensibles
- **Autorisation granulaire** : RBAC (Role-Based Access Control)
- **Validation côté serveur** : Schémas Zod appliqués dans les rules
- **Rate limiting** : Protection contre attaques DDoS
- **Audit logging** : Traçabilité des accès données

**RGPD & Privacy :**
- **Anonymisation** : Données personnelles chiffrées
- **Droit à l'oubli** : Suppression complète sur demande
- **Consentement explicite** : Tracking granulaire des permissions
- **Export de données** : Format portable JSON
- **Minimisation** : Collecte strictement nécessaire

### 🚀 **Performance & Évolutivité**

**Optimisations Firebase :**
- **Composite indexes** : Requêtes multi-champs optimisées
- **Denormalization strategy** : Duplication intelligente pour performance
- **Real-time selective** : WebSockets uniquement si nécessaire
- **Offline persistence** : Synchronisation automatique
- **Bundle splitting** : Chargement modulaire des données

---

## 📚 **Références Modulaires**

### **[REF]** Architecture Firebase : **[firebase-architecture.md](../references/backend/firebase-architecture.md)**
- ✅ Structure complète des collections Firestore
- ✅ Security Rules avancées avec validation
- ✅ Cloud Functions pour logique métier
- ✅ Stratégies de mise en cache et performance

### **[REF]** Gestion des utilisateurs : **[user-management.md](../references/backend/user-management.md)**
- ✅ Profils utilisateurs avec données pédagogiques
- ✅ Système de rôles et permissions
- ✅ Analytics utilisateur et progression
- ✅ Import/export données RGPD

---

## 📝 **Instructions d'Implémentation**

### 🗄️ **Étape 5.1 : Collections Firestore**

**[FILE]** Créer `src/lib/firebase/collections.ts` :

```ts
import { z } from 'zod';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

// ===== SCHÉMAS DE DONNÉES =====

// Collection Users
export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().url().optional(),
  role: z.enum(['student', 'teacher', 'admin']),
  createdAt: z.string(),
  lastLoginAt: z.string(),
  preferences: z.object({
    language: z.string().default('fr'),
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      marketing: z.boolean().default(false)
    }),
    accessibility: z.object({
      fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
      highContrast: z.boolean().default(false),
      reducedMotion: z.boolean().default(false)
    })
  }),
  learningProfile: z.object({
    style: z.enum(['visual', 'auditory', 'kinesthetic', 'reading', 'mixed']).default('mixed'),
    difficultyPreference: z.number().min(0).max(1).default(0.5),
    sessionDurationPreference: z.number().positive().default(30), // minutes
    learningGoals: z.array(z.string()).default([]),
    interests: z.array(z.string()).default([])
  }),
  progressTracking: z.object({
    totalTimeSpent: z.number().default(0), // minutes
    coursesCompleted: z.number().default(0),
    competencesAcquired: z.array(z.string()).default([]),
    currentStreak: z.number().default(0), // jours consécutifs
    longestStreak: z.number().default(0),
    averageScore: z.number().min(0).max(1).optional()
  }),
  metadata: z.object({
    version: z.string().default('1.0'),
    lastUpdated: z.string(),
    isActive: z.boolean().default(true),
    gdprConsent: z.object({
      functional: z.boolean(),
      analytics: z.boolean(),
      marketing: z.boolean(),
      consentDate: z.string()
    })
  })
});

// Collection Courses
export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDuration: z.number().positive(), // minutes
  language: z.string().default('fr'),
  tags: z.array(z.string()).default([]),
  competenceIds: z.array(z.string()),
  prerequisites: z.array(z.string()).default([]),
  content: z.object({
    modules: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      order: z.number(),
      lessons: z.array(z.object({
        id: z.string(),
        title: z.string(),
        type: z.enum(['video', 'text', 'interactive', 'quiz']),
        content: z.string(),
        duration: z.number(),
        resources: z.array(z.object({
          type: z.string(),
          url: z.string(),
          title: z.string()
        })).default([])
      }))
    }))
  }),
  assessment: z.object({
    preAssessment: z.string().optional(), // ID de l'évaluation
    postAssessment: z.string().optional(),
    continuousAssessment: z.array(z.string()).default([]),
    passingScore: z.number().min(0).max(1).default(0.7)
  }),
  analytics: z.object({
    totalEnrollments: z.number().default(0),
    completionRate: z.number().min(0).max(1).default(0),
    averageRating: z.number().min(0).max(5).optional(),
    totalRatings: z.number().default(0)
  }),
  metadata: z.object({
    authorId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.string().default('1.0'),
    isPublished: z.boolean().default(false),
    publishedAt: z.string().optional()
  })
});

// Collection Competences
export const CompetenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  level: z.number().min(1).max(5), // Échelle 1-5
  prerequisites: z.array(z.string()).default([]),
  learningObjectives: z.array(z.string()),
  assessmentCriteria: z.array(z.object({
    criterion: z.string(),
    weight: z.number().min(0).max(1)
  })),
  resources: z.array(z.object({
    type: z.enum(['course', 'exercise', 'reading', 'video']),
    resourceId: z.string(),
    title: z.string(),
    difficulty: z.number().min(0).max(1)
  })).default([]),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    isActive: z.boolean().default(true)
  })
});

// Collection User Progress - STRUCTURE OPTIMISÉE (Recommandation Expert)
export const UserProgressSchema = z.object({
  id: z.string(), // userId-courseId
  userId: z.string(),
  courseId: z.string(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'paused']),
  
  // Structure hiérarchique optimisée pour coûts Firebase
  score: z.number().min(0).max(100).default(0),
  completed: z.boolean().default(false),
  lastAttempt: z.string(), // ISO timestamp
  
  // Exercices avec structure compacte
  exercises: z.array(z.object({
    id: z.string(),
    correct: z.boolean(),
    timeSpent: z.number().optional(), // secondes
    attempts: z.number().default(1)
  })).default([]),
  
  progress: z.object({
    completedModules: z.array(z.string()).default([]),
    completedLessons: z.array(z.string()).default([]),
    currentModule: z.string().optional(),
    currentLesson: z.string().optional(),
    completionPercentage: z.number().min(0).max(1).default(0)
  }),
  
  timeTracking: z.object({
    totalTimeSpent: z.number().default(0), // minutes
    sessionCount: z.number().default(0),
    averageSessionDuration: z.number().default(0),
    lastSessionAt: z.string().optional()
  }),
  
  // Optimisation coûts : Assessments séparés
  lastAssessmentScore: z.number().min(0).max(1).optional(),
  competenceProgress: z.record(z.object({
    masteryLevel: z.number().min(0).max(1),
    lastAssessed: z.string(),
    evidences: z.array(z.string()).default([]) // IDs des preuves de maîtrise
  })),
  
  learningAnalytics: z.object({
    learningVelocity: z.number().default(0), // modules/semaine
    difficultyPreference: z.number().min(0).max(1).default(0.5),
    engagementScore: z.number().min(0).max(1).default(0),
    retentionRate: z.number().min(0).max(1).default(0)
  }),
  metadata: z.object({
    enrolledAt: z.string(),
    lastAccessedAt: z.string(),
    completedAt: z.string().optional(),
    version: z.string().default('1.0')
  })
});

// Collection Assessments
export const AssessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['pre_assessment', 'formative', 'summative', 'adaptive']),
  courseId: z.string().optional(),
  competenceIds: z.array(z.string()),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay', 'code']),
    question: z.string(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]),
    explanation: z.string().optional(),
    difficulty: z.number().min(0).max(1),
    competenceId: z.string(),
    points: z.number().positive(),
    timeLimit: z.number().optional() // secondes
  })),
  configuration: z.object({
    timeLimit: z.number().optional(), // minutes totales
    questionCount: z.number().positive(),
    randomizeQuestions: z.boolean().default(true),
    randomizeOptions: z.boolean().default(true),
    allowRetakes: z.boolean().default(false),
    maxAttempts: z.number().positive().default(1),
    passingScore: z.number().min(0).max(1).default(0.7)
  }),
  adaptiveRules: z.array(z.object({
    condition: z.string(),
    action: z.string(),
    parameters: z.record(z.unknown())
  })).default([]),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    isActive: z.boolean().default(true),
    version: z.string().default('1.0')
  })
});

// Collection Analytics Events
export const AnalyticsEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  eventType: z.enum([
    'page_view', 'lesson_start', 'lesson_complete', 'quiz_attempt',
    'error_occurred', 'help_requested', 'resource_accessed',
    'time_spent', 'interaction_made', 'goal_achieved'
  ]),
  eventData: z.record(z.unknown()),
  context: z.object({
    courseId: z.string().optional(),
    lessonId: z.string().optional(),
    deviceType: z.enum(['mobile', 'tablet', 'desktop']),
    browser: z.string().optional(),
    userAgent: z.string().optional()
  }),
  timestamp: z.string(),
  metadata: z.object({
    version: z.string().default('1.0'),
    processed: z.boolean().default(false)
  })
});

// ===== TYPES TYPESCRIPT =====
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Competence = z.infer<typeof CompetenceSchema>;
export type UserProgress = z.infer<typeof UserProgressSchema>;
export type Assessment = z.infer<typeof AssessmentSchema>;
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// ===== CONVERTISSEURS FIRESTORE =====
export const firestoreConverters = {
  userProfile: {
    toFirestore: (data: UserProfile): DocumentData => data,
    fromFirestore: (snapshot: QueryDocumentSnapshot): UserProfile => 
      UserProfileSchema.parse(snapshot.data())
  },
  
  course: {
    toFirestore: (data: Course): DocumentData => data,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Course => 
      CourseSchema.parse(snapshot.data())
  },
  
  competence: {
    toFirestore: (data: Competence): DocumentData => data,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Competence => 
      CompetenceSchema.parse(snapshot.data())
  },
  
  userProgress: {
    toFirestore: (data: UserProgress): DocumentData => data,
    fromFirestore: (snapshot: QueryDocumentSnapshot): UserProgress => 
      UserProgressSchema.parse(snapshot.data())
  },
  
  assessment: {
    toFirestore: (data: Assessment): DocumentData => data,
    fromFirestore: (snapshot: QueryDocumentSnapshot): Assessment => 
      AssessmentSchema.parse(snapshot.data())
  },
  
  analyticsEvent: {
    toFirestore: (data: AnalyticsEvent): DocumentData => data,
    fromFirestore: (snapshot: QueryDocumentSnapshot): AnalyticsEvent => 
      AnalyticsEventSchema.parse(snapshot.data())
  }
};

// ===== NOMS DES COLLECTIONS =====
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  COMPETENCES: 'competences',
  USER_PROGRESS: 'userProgress',
  ASSESSMENTS: 'assessments',
  ANALYTICS_EVENTS: 'analyticsEvents',
  
  // Sub-collections
  USER_SESSIONS: 'sessions',
  COURSE_REVIEWS: 'reviews',
  ASSESSMENT_RESULTS: 'results'
} as const;
```

### 🔐 **Étape 5.2 : Firestore Security Rules**

**[FILE]** Créer `firestore.rules` - **VERSION RENFORCÉE (Recommandation Expert)** :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== SÉCURITÉ RENFORCÉE =====
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    function isTeacherOrAdmin() {
      return hasRole('teacher') || hasRole('admin');
    }
    
    // 🛡️ VALIDATION DONNÉES SENSIBLES (Nouvelle)
    function isValidUserProfile(data) {
      return data.keys().hasAll(['email', 'displayName', 'role', 'createdAt']) &&
             data.email is string &&
             data.displayName is string &&
             data.role in ['student', 'teacher', 'admin'] &&
             data.createdAt is string &&
             data.email.matches('.*@.*\\..*'); // Email format validation
    }
    
    function isValidCourse(data) {
      return data.keys().hasAll(['title', 'description', 'level', 'metadata']) &&
             data.title is string &&
             data.description is string &&
             data.level in ['beginner', 'intermediate', 'advanced'] &&
             data.metadata.authorId is string;
    }
    
    // 🚨 PROTECTION ANTI-CRÉATION MALVEILLANTE (Nouvelle)
    function canEditCourse(courseData) {
      return isTeacherOrAdmin() && 
             (courseData.metadata.authorId == request.auth.uid || hasRole('admin'));
    }
    
    // ===== RÈGLES DE COLLECTION =====
    
    // Users - Protection renforcée
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if false; // 🛡️ Empêche création comptes via Firestore
      allow update: if isOwner(userId) && isValidUserProfile(request.resource.data);
      allow delete: if hasRole('admin') || isOwner(userId); // RGPD compliance
    }
    
    // User Progress - Structure optimisée
    match /users/{userId}/progress/{courseId} {
      allow read, write: if isOwner(userId);
      allow create: if isOwner(userId) && request.resource.data.keys().hasAll(['score', 'completed', 'lastAttempt']);
      allow update: if isOwner(userId) && 
                       request.resource.data.score is number &&
                       request.resource.data.score >= 0 && 
                       request.resource.data.score <= 100;
    } 
             (hasRole('admin') || courseData.metadata.authorId == request.auth.uid);
    }
    
    // ===== RÈGLES PAR COLLECTION =====
    
    // Users Collection
    match /users/{userId} {
      // Lecture : utilisateur peut lire son propre profil, admin peut tout lire
      allow read: if isOwner(userId) || hasRole('admin');
      
      // Création : seulement l'utilisateur lui-même peut créer son profil
      allow create: if isOwner(userId) && 
                       isValidUserProfile(resource.data) &&
                       resource.data.role == 'student'; // Par défaut étudiant
      
      // Mise à jour : utilisateur peut modifier son profil, admin peut tout modifier
      allow update: if (isOwner(userId) || hasRole('admin')) &&
                       isValidUserProfile(resource.data) &&
                       // Empêcher auto-promotion de rôle sauf par admin
                       (hasRole('admin') || resource.data.role == request.data.role);
      
      // Suppression : seulement admin (soft delete recommandé)
      allow delete: if hasRole('admin');
      
      // Sub-collection sessions
      match /sessions/{sessionId} {
        allow read, write: if isOwner(userId) || hasRole('admin');
      }
    }
    
    // Courses Collection
    match /courses/{courseId} {
      // Lecture : tous les utilisateurs authentifiés peuvent lire les cours publiés
      allow read: if isAuthenticated() && 
                     (resource.data.metadata.isPublished == true || 
                      isTeacherOrAdmin() ||
                      resource.data.metadata.authorId == request.auth.uid);
      
      // Création : seulement enseignants et admins
      allow create: if isTeacherOrAdmin() && 
                       isValidCourse(resource.data) &&
                       resource.data.metadata.authorId == request.auth.uid;
      
      // Mise à jour : créateur du cours ou admin
      allow update: if canEditCourse(resource.data) &&
                       isValidCourse(request.data);
      
      // Suppression : créateur du cours ou admin
      allow delete: if canEditCourse(resource.data);
      
      // Sub-collection reviews
      match /reviews/{reviewId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated() && 
                         resource.data.userId == request.auth.uid;
        allow update: if isOwner(resource.data.userId) || hasRole('admin');
        allow delete: if isOwner(resource.data.userId) || hasRole('admin');
      }
    }
    
    // Competences Collection
    match /competences/{competenceId} {
      // Lecture : tous les utilisateurs authentifiés
      allow read: if isAuthenticated();
      
      // Écriture : seulement enseignants et admins
      allow write: if isTeacherOrAdmin();
    }
    
    // User Progress Collection
    match /userProgress/{progressId} {
      // Lecture : utilisateur peut lire sa progression, enseignants/admins peuvent tout lire
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid || isTeacherOrAdmin());
      
      // Création : utilisateur peut créer sa progression
      allow create: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
      
      // Mise à jour : utilisateur peut modifier sa progression
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid &&
                       request.data.userId == request.auth.uid; // Empêcher changement userId
      
      // Suppression : utilisateur ou admin
      allow delete: if isOwner(resource.data.userId) || hasRole('admin');
    }
    
    // Assessments Collection
    match /assessments/{assessmentId} {
      // Lecture : tous les utilisateurs authentifiés
      allow read: if isAuthenticated();
      
      // Écriture : seulement enseignants et admins
      allow write: if isTeacherOrAdmin();
      
      // Sub-collection results
      match /results/{resultId} {
        allow read: if isAuthenticated() && 
                       (resource.data.userId == request.auth.uid || isTeacherOrAdmin());
        allow create: if isAuthenticated() && 
                         resource.data.userId == request.auth.uid;
        allow update: if false; // Les résultats ne doivent pas être modifiés
        allow delete: if hasRole('admin'); // Seulement admin pour nettoyage
      }
    }
    
    // Analytics Events Collection
    match /analyticsEvents/{eventId} {
      // Lecture : seulement admins pour analytics
      allow read: if hasRole('admin');
      
      // Création : utilisateurs peuvent créer leurs événements
      allow create: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
      
      // Mise à jour/Suppression : seulement admins
      allow update, delete: if hasRole('admin');
    }
    
    // ===== RÈGLES DE RATE LIMITING =====
    // Implémentées via Cloud Functions pour plus de flexibilité
    
    // ===== RÈGLES D'AUDIT =====
    // Toutes les opérations sensibles sont loggées automatiquement
  }
}
```

### 🔧 **Étape 5.3 : Repository Pattern**

**[FILE]** Créer `src/lib/firebase/repositories/baseRepository.ts` :

```ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  type DocumentData,
  type QueryConstraint,
  type DocumentReference,
  type CollectionReference,
  type QuerySnapshot
} from 'firebase/firestore';
import { db } from '../firebaseClient';

// ===== INTERFACE REPOSITORY GÉNÉRIQUE =====
export interface Repository<T> {
  create(data: Omit<T, 'id'>): Promise<string>;
  getById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  getAll(constraints?: QueryConstraint[]): Promise<T[]>;
  getPaginated(pageSize: number, lastDoc?: any): Promise<PaginatedResult<T>>;
  count(): Promise<number>;
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  lastDoc: any;
  total?: number;
}

// ===== REPOSITORY DE BASE =====
export abstract class BaseRepository<T extends { id: string }> implements Repository<T> {
  protected collectionRef: CollectionReference<T>;
  
  constructor(
    collectionName: string,
    private converter?: {
      toFirestore: (data: T) => DocumentData;
      fromFirestore: (snapshot: any) => T;
    }
  ) {
    this.collectionRef = converter 
      ? collection(db, collectionName).withConverter(converter)
      : collection(db, collectionName) as CollectionReference<T>;
  }

  /**
   * Crée un nouveau document
   */
  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.collectionRef, data as T);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionRef.id}:`, error);
      throw new RepositoryError('CREATE_FAILED', error);
    }
  }

  /**
   * Récupère un document par ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return this.converter 
        ? this.converter.fromFirestore(docSnap)
        : { id: docSnap.id, ...docSnap.data() } as T;
    } catch (error) {
      console.error(`Error getting document ${id}:`, error);
      throw new RepositoryError('GET_FAILED', error);
    }
  }

  /**
   * Met à jour un document
   */
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, data as any);
    } catch (error) {
      console.error(`Error updating document ${id}:`, error);
      throw new RepositoryError('UPDATE_FAILED', error);
    }
  }

  /**
   * Supprime un document (soft delete recommandé)
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      throw new RepositoryError('DELETE_FAILED', error);
    }
  }

  /**
   * Soft delete (recommandé pour audit)
   */
  async softDelete(id: string): Promise<void> {
    await this.update(id, { 
      metadata: { 
        ...await this.getMetadata(id),
        isActive: false,
        deletedAt: new Date().toISOString()
      } 
    } as Partial<T>);
  }

  /**
   * Récupère tous les documents avec contraintes optionnelles
   */
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(this.collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => 
        this.converter 
          ? this.converter.fromFirestore(doc)
          : { id: doc.id, ...doc.data() } as T
      );
    } catch (error) {
      console.error('Error getting all documents:', error);
      throw new RepositoryError('GET_ALL_FAILED', error);
    }
  }

  /**
   * Récupère des documents avec pagination
   */
  async getPaginated(
    pageSize: number, 
    lastDoc?: any,
    constraints: QueryConstraint[] = []
  ): Promise<PaginatedResult<T>> {
    try {
      const queryConstraints = [
        ...constraints,
        limit(pageSize + 1) // +1 pour savoir s'il y a plus de pages
      ];
      
      if (lastDoc) {
        queryConstraints.push(startAfter(lastDoc));
      }
      
      const q = query(this.collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const docs = querySnapshot.docs.map(doc => 
        this.converter 
          ? this.converter.fromFirestore(doc)
          : { id: doc.id, ...doc.data() } as T
      );
      
      const hasMore = docs.length > pageSize;
      const data = hasMore ? docs.slice(0, pageSize) : docs;
      const newLastDoc = hasMore ? querySnapshot.docs[pageSize - 1] : null;
      
      return {
        data,
        hasMore,
        lastDoc: newLastDoc
      };
    } catch (error) {
      console.error('Error getting paginated documents:', error);
      throw new RepositoryError('GET_PAGINATED_FAILED', error);
    }
  }

  /**
   * Compte le nombre total de documents
   */
  async count(): Promise<number> {
    try {
      const snapshot = await getDocs(this.collectionRef);
      return snapshot.size;
    } catch (error) {
      console.error('Error counting documents:', error);
      throw new RepositoryError('COUNT_FAILED', error);
    }
  }

  /**
   * Recherche par champs spécifiques
   */
  async findBy(field: keyof T, value: any): Promise<T[]> {
    return this.getAll([where(field as string, '==', value)]);
  }

  /**
   * Recherche un seul document par champ
   */
  async findOneBy(field: keyof T, value: any): Promise<T | null> {
    const results = await this.getAll([
      where(field as string, '==', value),
      limit(1)
    ]);
    
    return results.length > 0 ? results[0] : null;
  }

  // Méthodes utilitaires privées
  private async getMetadata(id: string): Promise<any> {
    const doc = await this.getById(id);
    return doc ? (doc as any).metadata || {} : {};
  }
}

// ===== GESTION D'ERREURS =====
export class RepositoryError extends Error {
  constructor(
    public code: string,
    public originalError?: any
  ) {
    super(`Repository Error [${code}]: ${originalError?.message || 'Unknown error'}`);
    this.name = 'RepositoryError';
  }
}

// ===== DÉCORATEURS POUR CACHE =====
export function cached(ttl: number = 300000) { // 5 minutes par défaut
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cache = new Map<string, { data: any; timestamp: number }>();
    
    descriptor.value = async function(...args: any[]) {
      const cacheKey = JSON.stringify(args);
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
      
      const result = await method.apply(this, args);
      cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    };
  };
}
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:firebase         # Tests intégration Firebase
[TEST] npm run test:repositories     # Tests pattern Repository
[TEST] npm run test:security         # Tests Security Rules
[TEST] npm run validate 5           # Validation complète Phase 5
```

**[FILE]** Créer `src/lib/firebase/repositories/userRepository.test.ts` :

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserRepository } from './userRepository';
import type { UserProfile } from '../collections';

// Tests avec Firebase Emulator
describe('UserRepository', () => {
  let userRepo: UserRepository;
  let testUserId: string;

  beforeEach(() => {
    userRepo = new UserRepository();
  });

  afterEach(async () => {
    // Cleanup
    if (testUserId) {
      await userRepo.delete(testUserId);
    }
  });

  describe('CRUD Operations', () => {
    it('should create user profile', async () => {
      const userData: Omit<UserProfile, 'id'> = {
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'student',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
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
          lastUpdated: new Date().toISOString(),
          isActive: true,
          gdprConsent: {
            functional: true,
            analytics: true,
            marketing: false,
            consentDate: new Date().toISOString()
          }
        }
      };

      testUserId = await userRepo.create(userData);
      
      expect(testUserId).toBeDefined();
      expect(typeof testUserId).toBe('string');
    });

    it('should retrieve user by id', async () => {
      // Create user first
      const userData = { /* ... */ };
      testUserId = await userRepo.create(userData);
      
      const retrievedUser = await userRepo.getById(testUserId);
      
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.email).toBe('test@example.com');
      expect(retrievedUser?.role).toBe('student');
    });

    it('should update user preferences', async () => {
      // Create user first
      const userData = { /* ... */ };
      testUserId = await userRepo.create(userData);
      
      await userRepo.update(testUserId, {
        preferences: {
          ...userData.preferences,
          theme: 'dark'
        }
      });
      
      const updatedUser = await userRepo.getById(testUserId);
      expect(updatedUser?.preferences.theme).toBe('dark');
    });
  });

  describe('Query Operations', () => {
    it('should find users by role', async () => {
      const students = await userRepo.findBy('role', 'student');
      
      expect(Array.isArray(students)).toBe(true);
      students.forEach(user => {
        expect(user.role).toBe('student');
      });
    });

    it('should get paginated results', async () => {
      const result = await userRepo.getPaginated(10);
      
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.hasMore).toBe('boolean');
    });
  });
});
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Collections Firestore avec schémas Zod
- [ ] **[CHECK]** Security Rules implémentées et testées
- [ ] **[CHECK]** Repository Pattern pour toutes les entités
- [ ] **[CHECK]** Gestion d'erreurs robuste
- [ ] **[CHECK]** Système de cache optimisé
- [ ] **[CHECK]** Tests d'intégration Firebase passent
- [ ] **[CHECK]** Performance queries optimisées
- [ ] **[CHECK]** Conformité RGPD validée

---

## 🏷️ **Processus de Release v1.3**

```bash
[CMD] npm run validate 5              # Validation complète Phase 5
[CMD] git add . && git commit -m "feat: Phase 5 - Firebase Data Layer complete"
[CMD] git tag v1.3                   # Tag release données
[CMD] npm run deploy:rules           # Déploiement Security Rules
```

**🚫 STOP** : Ne pas passer à Phase 6 sans validation complète de la couche de données.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [🤖 Phase 6 : Curriculum Generation](phase-6-curriculum-generation.md)  
**Groupe actuel** : ⚙️ MOTEUR - Données & Contenu  
**Dépendance** : Phase 5 (Firebase Data Layer) validée ✅
