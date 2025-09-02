/**
 * 💾 IndexedDB Store - Phase 10.2
 * Persistance locale pour fonctionnalités offline
 * Features: Exercises, Progress, User Data, Background Sync Queue
 */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// ===== CONFIGURATION INDEXEDDB =====

const DB_NAME = 'FunLearningDB';
const DB_VERSION = 1;

// Tables/Object Stores
const STORES = {
  EXERCISES: 'exercises',
  EXERCISE_RESULTS: 'exerciseResults', 
  PROGRESS: 'progress',
  LESSONS: 'lessons',
  USER_DATA: 'userData',
  SYNC_QUEUE: 'syncQueue',
  CACHE_META: 'cacheMeta'
};

// ===== ÉTAT INDEXEDDB =====

export const dbReady = writable(false);
export const dbError = writable<string | null>(null);
export const syncQueueSize = writable(0);
export const lastSyncTime = writable<Date | null>(null);

let db: IDBDatabase | null = null;

// ===== INITIALISATION =====

if (browser) {
  initializeDB();
}

async function initializeDB() {
  try {
    db = await openDB();
    dbReady.set(true);
    console.log('[IndexedDB] Base de données initialisée');
    
    // Vérifier la taille de la queue de sync
    await updateSyncQueueSize();
    
  } catch (error) {
    console.error('[IndexedDB] Erreur initialisation:', error);
    dbError.set(error instanceof Error ? error.message : 'Erreur inconnue');
  }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Store des exercices
      if (!db.objectStoreNames.contains(STORES.EXERCISES)) {
        const exerciseStore = db.createObjectStore(STORES.EXERCISES, { keyPath: 'id' });
        exerciseStore.createIndex('type', 'type', { unique: false });
        exerciseStore.createIndex('difficulty', 'difficulty', { unique: false });
        exerciseStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
      }
      
      // Store des résultats d'exercices
      if (!db.objectStoreNames.contains(STORES.EXERCISE_RESULTS)) {
        const resultStore = db.createObjectStore(STORES.EXERCISE_RESULTS, { keyPath: 'id' });
        resultStore.createIndex('exerciseId', 'exerciseId', { unique: false });
        resultStore.createIndex('timestamp', 'timestamp', { unique: false });
        resultStore.createIndex('synced', 'synced', { unique: false });
      }
      
      // Store de progression
      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        const progressStore = db.createObjectStore(STORES.PROGRESS, { keyPath: 'id' });
        progressStore.createIndex('userId', 'userId', { unique: false });
        progressStore.createIndex('competenceId', 'competenceId', { unique: false });
        progressStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
      }
      
      // Store des leçons
      if (!db.objectStoreNames.contains(STORES.LESSONS)) {
        const lessonStore = db.createObjectStore(STORES.LESSONS, { keyPath: 'id' });
        lessonStore.createIndex('matiere', 'matiere', { unique: false });
        lessonStore.createIndex('niveau', 'niveau', { unique: false });
      }
      
      // Store des données utilisateur
      if (!db.objectStoreNames.contains(STORES.USER_DATA)) {
        db.createObjectStore(STORES.USER_DATA, { keyPath: 'key' });
      }
      
      // Queue de synchronisation
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('action', 'action', { unique: false });
        syncStore.createIndex('priority', 'priority', { unique: false });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Métadonnées de cache
      if (!db.objectStoreNames.contains(STORES.CACHE_META)) {
        const metaStore = db.createObjectStore(STORES.CACHE_META, { keyPath: 'key' });
        metaStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// ===== OPÉRATIONS EXERCICES =====

export interface OfflineExercise {
  id: string;
  type: 'qcm' | 'fill-blanks' | 'true-false';
  title: string;
  content: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  cachedAt: number;
  offline: boolean;
}

export interface OfflineExerciseResult {
  id: string;
  exerciseId: string;
  userId: string;
  answers: any;
  score: number;
  isCorrect: boolean;
  timestamp: number;
  synced: boolean;
  syncRetries: number;
}

/** Sauvegarder un exercice pour utilisation offline */
export async function saveExerciseOffline(exercise: OfflineExercise): Promise<void> {
  if (!db) throw new Error('Database not ready');
  
  const transaction = db.transaction([STORES.EXERCISES], 'readwrite');
  const store = transaction.objectStore(STORES.EXERCISES);
  
  const exerciseWithMeta = {
    ...exercise,
    cachedAt: Date.now(),
    offline: true
  };
  
  await new Promise<void>((resolve, reject) => {
    const request = store.put(exerciseWithMeta);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  
  console.log(`[IndexedDB] Exercice ${exercise.id} sauvé offline`);
}

/** Récupérer les exercices disponibles offline */
export async function getOfflineExercises(): Promise<OfflineExercise[]> {
  if (!db) return [];
  
  const transaction = db.transaction([STORES.EXERCISES], 'readonly');
  const store = transaction.objectStore(STORES.EXERCISES);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/** Récupérer un exercice spécifique */
export async function getExerciseById(id: string): Promise<OfflineExercise | null> {
  if (!db) return null;
  
  const transaction = db.transaction([STORES.EXERCISES], 'readonly');
  const store = transaction.objectStore(STORES.EXERCISES);
  
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// ===== OPÉRATIONS RÉSULTATS =====

/** Sauvegarder un résultat d'exercice (avec queue de sync) */
export async function saveExerciseResult(result: Omit<OfflineExerciseResult, 'id' | 'timestamp' | 'synced' | 'syncRetries'>): Promise<string> {
  if (!db) throw new Error('Database not ready');
  
  const resultWithMeta: OfflineExerciseResult = {
    ...result,
    id: `result_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    timestamp: Date.now(),
    synced: false,
    syncRetries: 0
  };
  
  // Sauver le résultat
  const transaction = db.transaction([STORES.EXERCISE_RESULTS, STORES.SYNC_QUEUE], 'readwrite');
  
  const resultStore = transaction.objectStore(STORES.EXERCISE_RESULTS);
  await new Promise<void>((resolve, reject) => {
    const request = resultStore.put(resultWithMeta);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  
  // Ajouter à la queue de synchronisation
  const syncStore = transaction.objectStore(STORES.SYNC_QUEUE);
  await new Promise<void>((resolve, reject) => {
    const syncItem = {
      action: 'SYNC_EXERCISE_RESULT',
      data: resultWithMeta,
      priority: 1,
      timestamp: Date.now(),
      retries: 0
    };
    
    const request = syncStore.add(syncItem);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  
  await updateSyncQueueSize();
  console.log(`[IndexedDB] Résultat ${resultWithMeta.id} sauvé avec sync en attente`);
  
  return resultWithMeta.id;
}

/** Récupérer les résultats non synchronisés */
export async function getUnsyncedResults(): Promise<OfflineExerciseResult[]> {
  if (!db) return [];
  
  const transaction = db.transaction([STORES.EXERCISE_RESULTS], 'readonly');
  const store = transaction.objectStore(STORES.EXERCISE_RESULTS);
  const index = store.index('synced');
  
  return new Promise((resolve, reject) => {
    const request = index.getAll(IDBKeyRange.only(false));
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/** Marquer un résultat comme synchronisé */
export async function markResultSynced(resultId: string): Promise<void> {
  if (!db) return;
  
  const transaction = db.transaction([STORES.EXERCISE_RESULTS], 'readwrite');
  const store = transaction.objectStore(STORES.EXERCISE_RESULTS);
  
  // Récupérer le résultat
  const result = await new Promise<OfflineExerciseResult>((resolve, reject) => {
    const request = store.get(resultId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  
  if (result) {
    result.synced = true;
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(result);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// ===== OPÉRATIONS PROGRESSION =====

export interface OfflineProgress {
  id: string;
  userId: string;
  competenceId: string;
  score: number;
  exercisesCompleted: number;
  timeSpent: number;
  lastUpdated: number;
  synced: boolean;
}

/** Sauvegarder la progression */
export async function saveProgress(progress: Omit<OfflineProgress, 'id' | 'lastUpdated' | 'synced'>): Promise<void> {
  if (!db) throw new Error('Database not ready');
  
  const progressWithMeta: OfflineProgress = {
    ...progress,
    id: `progress_${progress.userId}_${progress.competenceId}`,
    lastUpdated: Date.now(),
    synced: false
  };
  
  const transaction = db.transaction([STORES.PROGRESS, STORES.SYNC_QUEUE], 'readwrite');
  
  // Sauver la progression
  const progressStore = transaction.objectStore(STORES.PROGRESS);
  await new Promise<void>((resolve, reject) => {
    const request = progressStore.put(progressWithMeta);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  
  // Ajouter à la queue de sync
  const syncStore = transaction.objectStore(STORES.SYNC_QUEUE);
  await new Promise<void>((resolve, reject) => {
    const syncItem = {
      action: 'SYNC_PROGRESS',
      data: progressWithMeta,
      priority: 2,
      timestamp: Date.now(),
      retries: 0
    };
    
    const request = syncStore.add(syncItem);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  
  await updateSyncQueueSize();
}

/** Récupérer la progression pour un utilisateur */
export async function getUserProgress(userId: string): Promise<OfflineProgress[]> {
  if (!db) return [];
  
  const transaction = db.transaction([STORES.PROGRESS], 'readonly');
  const store = transaction.objectStore(STORES.PROGRESS);
  const index = store.index('userId');
  
  return new Promise((resolve, reject) => {
    const request = index.getAll(userId);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// ===== QUEUE DE SYNCHRONISATION =====

export interface SyncQueueItem {
  id?: number;
  action: 'SYNC_EXERCISE_RESULT' | 'SYNC_PROGRESS' | 'SYNC_USER_DATA';
  data: any;
  priority: number; // 1 = high, 2 = medium, 3 = low
  timestamp: number;
  retries: number;
  maxRetries?: number;
}

/** Récupérer les items de la queue de sync */
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  if (!db) return [];
  
  const transaction = db.transaction([STORES.SYNC_QUEUE], 'readonly');
  const store = transaction.objectStore(STORES.SYNC_QUEUE);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const items = request.result || [];
      // Trier par priorité puis timestamp
      items.sort((a, b) => a.priority - b.priority || a.timestamp - b.timestamp);
      resolve(items);
    };
    request.onerror = () => reject(request.error);
  });
}

/** Supprimer un item de la queue de sync */
export async function removeSyncQueueItem(id: number): Promise<void> {
  if (!db) return;
  
  const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
  const store = transaction.objectStore(STORES.SYNC_QUEUE);
  
  await new Promise<void>((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  
  await updateSyncQueueSize();
}

/** Incrémenter les tentatives d'un item */
export async function incrementSyncRetries(id: number): Promise<void> {
  if (!db) return;
  
  const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
  const store = transaction.objectStore(STORES.SYNC_QUEUE);
  
  const item = await new Promise<SyncQueueItem>((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  
  if (item) {
    item.retries++;
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

/** Mettre à jour la taille de la queue */
async function updateSyncQueueSize(): Promise<void> {
  if (!db) return;
  
  try {
    const queue = await getSyncQueue();
    syncQueueSize.set(queue.length);
  } catch (error) {
    console.error('[IndexedDB] Erreur update queue size:', error);
  }
}

// ===== UTILITAIRES =====

/** Vider complètement la base de données */
export async function clearDatabase(): Promise<void> {
  if (!db) return;
  
  const storeNames = Object.values(STORES);
  const transaction = db.transaction(storeNames, 'readwrite');
  
  const promises = storeNames.map(storeName => {
    const store = transaction.objectStore(storeName);
    return new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
  
  await Promise.all(promises);
  
  syncQueueSize.set(0);
  console.log('[IndexedDB] Base de données vidée');
}

/** Obtenir la taille de la base de données */
export async function getDatabaseSize(): Promise<number> {
  if (!db) return 0;
  
  try {
    const estimate = await navigator.storage?.estimate();
    return estimate?.usage || 0;
  } catch (error) {
    console.error('[IndexedDB] Erreur calcul taille:', error);
    return 0;
  }
}

/** Statistiques de la base de données */
export async function getDatabaseStats() {
  if (!db) return null;
  
  try {
    const [exercises, results, progress, queue] = await Promise.all([
      getOfflineExercises(),
      getUnsyncedResults(),
      getUserProgress('current'), // TODO: récupérer l'ID utilisateur actuel
      getSyncQueue()
    ]);
    
    return {
      exercises: exercises.length,
      unsyncedResults: results.length,
      progressItems: progress.length,
      queueSize: queue.length,
      size: await getDatabaseSize()
    };
  } catch (error) {
    console.error('[IndexedDB] Erreur stats:', error);
    return null;
  }
}

// ===== STORES DÉRIVÉS =====

/** Store de statistiques en temps réel */
export const dbStats = derived(
  [dbReady, syncQueueSize],
  ([$dbReady, $syncQueueSize], set) => {
    if (!$dbReady) {
      set(null);
      return;
    }
    
    // Mettre à jour les stats toutes les 5 secondes
    const interval = setInterval(async () => {
      const stats = await getDatabaseStats();
      set(stats);
    }, 5000);
    
    // Stats initiales
    getDatabaseStats().then(set);
    
    return () => clearInterval(interval);
  }
);

console.log('[IndexedDB] Store IndexedDB Phase 10.2 initialisé ✅');

// ===== EXPORT PRINCIPAL =====
export const indexedDBStore = {
  // Database management
  initializeDB,
  
  // Exercises
  saveExerciseOffline,
  getOfflineExercises,
  getExerciseById,
  getAllExercises: getOfflineExercises,
  deleteExercise: async (id: string) => {
    const db = await openDB();
    const tx = db.transaction([STORES.EXERCISES], 'readwrite');
    await tx.objectStore(STORES.EXERCISES).delete(id);
  },
  
  // Exercise Results  
  saveExerciseResult,
  getUnsyncedResults,
  markResultSynced,
  
  // Progress
  saveProgress,
  getUserProgress,
  
  // Sync Queue
  getSyncQueue,
  removeSyncQueueItem,
  incrementSyncRetries,
  
  // Cache Management
  clearCache: clearDatabase,
  getCacheStats: getDatabaseStats,
  getDatabaseSize,
  
  // Statistics
  dbStats
};
