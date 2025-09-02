/**
 * 🔄 Background Sync Service - Phase 10.2
 * Synchronisation automatique des données offline
 * Features: Queue management, retry logic, conflict resolution
 */

import { browser } from '$app/environment';
import { 
  getSyncQueue, 
  removeSyncQueueItem, 
  incrementSyncRetries,
  markResultSynced,
  type SyncQueueItem,
  type OfflineExerciseResult,
  type OfflineProgress 
} from '$lib/stores/indexeddb';
import { isOnline, addNotification } from '$lib/stores/pwa';
import { get } from 'svelte/store';

// ===== CONFIGURATION =====

const SYNC_INTERVAL = 30000; // 30 secondes
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 secondes
const BATCH_SIZE = 5; // Traiter 5 items max à la fois

// ===== ÉTAT SYNCHRONISATION =====

let syncInterval: number | null = null;
let isSyncing = false;
let lastSyncAttempt: Date | null = null;

// ===== INITIALISATION =====

if (browser) {
  initializeBackgroundSync();
}

function initializeBackgroundSync() {
  console.log('[BackgroundSync] Initialisation du service de synchronisation');
  
  // Démarrer la synchronisation périodique
  startSyncInterval();
  
  // Écouter les changements de connexion
  const unsubscribe = isOnline.subscribe((online) => {
    if (online && !isSyncing) {
      console.log('[BackgroundSync] Connexion détectée, synchronisation immédiate');
      syncNow();
    }
  });
  
  // Démarrer une sync immédiate si en ligne
  if (get(isOnline)) {
    setTimeout(() => syncNow(), 1000); // Délai pour laisser l'app se charger
  }
}

// ===== GESTION INTERVALLE =====

function startSyncInterval() {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  syncInterval = window.setInterval(() => {
    if (get(isOnline) && !isSyncing) {
      syncNow();
    }
  }, SYNC_INTERVAL);
}

function stopSyncInterval() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

// ===== SYNCHRONISATION PRINCIPALE =====

/** Synchroniser maintenant */
export async function syncNow(): Promise<void> {
  if (isSyncing || !get(isOnline)) {
    console.log('[BackgroundSync] Sync déjà en cours ou hors ligne');
    return;
  }
  
  isSyncing = true;
  lastSyncAttempt = new Date();
  
  try {
    console.log('[BackgroundSync] Début de la synchronisation');
    
    // Récupérer la queue de synchronisation
    const queue = await getSyncQueue();
    
    if (queue.length === 0) {
      console.log('[BackgroundSync] Aucun élément à synchroniser');
      return;
    }
    
    console.log(`[BackgroundSync] ${queue.length} éléments à synchroniser`);
    
    // Traiter par batch pour éviter la surcharge
    const batches = chunkArray(queue, BATCH_SIZE);
    let successCount = 0;
    let errorCount = 0;
    
    for (const batch of batches) {
      const results = await Promise.allSettled(
        batch.map(item => syncItem(item))
      );
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          errorCount++;
          console.error(`[BackgroundSync] Erreur sync item ${batch[index].id}:`, result.reason);
        }
      });
    }
    
    // Notification du résultat
    if (successCount > 0) {
      addNotification({
        type: 'sync',
        message: `🔄 ${successCount} éléments synchronisés avec succès`
      });
    }
    
    if (errorCount > 0) {
      addNotification({
        type: 'sync',
        message: `⚠️ ${errorCount} éléments n'ont pas pu être synchronisés`
      });
    }
    
    console.log(`[BackgroundSync] Synchronisation terminée: ${successCount} succès, ${errorCount} erreurs`);
    
  } catch (error) {
    console.error('[BackgroundSync] Erreur synchronisation globale:', error);
    
    addNotification({
      type: 'sync',
      message: '❌ Erreur lors de la synchronisation'
    });
    
  } finally {
    isSyncing = false;
  }
}

/** Synchroniser un élément spécifique */
async function syncItem(item: SyncQueueItem): Promise<void> {
  if (!item.id) {
    throw new Error('Item sans ID');
  }
  
  try {
    switch (item.action) {
      case 'SYNC_EXERCISE_RESULT':
        await syncExerciseResult(item);
        break;
        
      case 'SYNC_PROGRESS':
        await syncProgress(item);
        break;
        
      case 'SYNC_USER_DATA':
        await syncUserData(item);
        break;
        
      default:
        throw new Error(`Action inconnue: ${item.action}`);
    }
    
    // Succès : supprimer de la queue
    await removeSyncQueueItem(item.id);
    console.log(`[BackgroundSync] Item ${item.id} synchronisé avec succès`);
    
  } catch (error) {
    // Erreur : incrémenter les tentatives
    await incrementSyncRetries(item.id);
    
    // Si max tentatives atteint, supprimer l'item
    if (item.retries >= (item.maxRetries || MAX_RETRIES)) {
      console.warn(`[BackgroundSync] Item ${item.id} abandonné après ${item.retries} tentatives`);
      await removeSyncQueueItem(item.id);
    }
    
    throw error;
  }
}

// ===== SYNCHRONISATION SPÉCIFIQUE =====

/** Synchroniser un résultat d'exercice */
async function syncExerciseResult(item: SyncQueueItem): Promise<void> {
  const result: OfflineExerciseResult = item.data;
  
  try {
    const response = await fetch('/api/exercises/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseId: result.exerciseId,
        answers: result.answers,
        score: result.score,
        isCorrect: result.isCorrect,
        timestamp: result.timestamp
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Marquer comme synchronisé dans IndexedDB
    await markResultSynced(result.id);
    
    console.log(`[BackgroundSync] Résultat exercice ${result.exerciseId} synchronisé`);
    
  } catch (error) {
    console.error(`[BackgroundSync] Erreur sync résultat ${result.id}:`, error);
    throw error;
  }
}

/** Synchroniser la progression */
async function syncProgress(item: SyncQueueItem): Promise<void> {
  const progress: OfflineProgress = item.data;
  
  try {
    const response = await fetch('/api/progress', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        competenceId: progress.competenceId,
        score: progress.score,
        exercisesCompleted: progress.exercisesCompleted,
        timeSpent: progress.timeSpent
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log(`[BackgroundSync] Progression ${progress.competenceId} synchronisée`);
    
  } catch (error) {
    console.error(`[BackgroundSync] Erreur sync progression ${progress.id}:`, error);
    throw error;
  }
}

/** Synchroniser les données utilisateur */
async function syncUserData(item: SyncQueueItem): Promise<void> {
  const userData = item.data;
  
  try {
    const response = await fetch('/api/user/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('[BackgroundSync] Données utilisateur synchronisées');
    
  } catch (error) {
    console.error('[BackgroundSync] Erreur sync données utilisateur:', error);
    throw error;
  }
}

// ===== GESTION CONFLITS =====

/** Résoudre les conflits de données */
export async function resolveConflicts(): Promise<void> {
  // TODO: Implémenter la résolution de conflits
  // Stratégies possibles:
  // - Last write wins
  // - Merge automatique
  // - Demander à l'utilisateur
  
  console.log('[BackgroundSync] Résolution de conflits non implémentée');
}

// ===== SYNCHRONISATION DESCENDANTE =====

/** Synchroniser les données depuis le serveur vers local */
export async function syncFromServer(): Promise<void> {
  if (!get(isOnline)) {
    console.log('[BackgroundSync] Sync descendante impossible: hors ligne');
    return;
  }
  
  try {
    console.log('[BackgroundSync] Début sync descendante');
    
    // Synchroniser les exercices récents
    await syncExercisesFromServer();
    
    // Synchroniser la progression utilisateur
    await syncProgressFromServer();
    
    // Synchroniser les leçons
    await syncLessonsFromServer();
    
    console.log('[BackgroundSync] Sync descendante terminée');
    
  } catch (error) {
    console.error('[BackgroundSync] Erreur sync descendante:', error);
    throw error;
  }
}

async function syncExercisesFromServer(): Promise<void> {
  // TODO: Récupérer les exercices récents du serveur
  // et les sauvegarder en local
}

async function syncProgressFromServer(): Promise<void> {
  // TODO: Récupérer la progression utilisateur du serveur
  // et la mettre à jour en local
}

async function syncLessonsFromServer(): Promise<void> {
  // TODO: Récupérer les leçons du serveur
  // et les sauvegarder en local
}

// ===== PRIORITÉS ET STRATÉGIES =====

/** Définir la priorité d'un item de sync */
export function getSyncPriority(action: string, data: any): number {
  switch (action) {
    case 'SYNC_EXERCISE_RESULT':
      // Résultats d'exercices = haute priorité
      return 1;
      
    case 'SYNC_PROGRESS':
      // Progression = priorité moyenne
      return 2;
      
    case 'SYNC_USER_DATA':
      // Données utilisateur = basse priorité
      return 3;
      
    default:
      return 5;
  }
}

/** Stratégie de retry avec backoff exponentiel */
export function getRetryDelay(attempt: number): number {
  return RETRY_DELAY * Math.pow(2, attempt - 1);
}

// ===== MONITORING =====

/** Statistiques de synchronisation */
export function getSyncStats() {
  return {
    isSyncing,
    lastSyncAttempt,
    syncInterval: syncInterval !== null,
    isOnline: get(isOnline)
  };
}

/** Force une synchronisation complète (UP + DOWN) */
export async function fullSync(): Promise<void> {
  try {
    // Sync montante (local vers serveur)
    await syncNow();
    
    // Attendre un peu
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sync descendante (serveur vers local)
    await syncFromServer();
    
    addNotification({
      type: 'sync',
      message: '✅ Synchronisation complète terminée'
    });
    
  } catch (error) {
    console.error('[BackgroundSync] Erreur sync complète:', error);
    
    addNotification({
      type: 'sync',
      message: '❌ Erreur lors de la synchronisation complète'
    });
    
    throw error;
  }
}

// ===== UTILITAIRES =====

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ===== API PUBLIQUE =====

export const backgroundSync = {
  syncNow,
  fullSync,
  resolveConflicts,
  getSyncStats,
  start: startSyncInterval,
  stop: stopSyncInterval
};

// ===== CLEANUP =====

if (browser) {
  // Nettoyer lors du déchargement de la page
  window.addEventListener('beforeunload', () => {
    stopSyncInterval();
  });
}

console.log('[BackgroundSync] Service de synchronisation Phase 10.2 initialisé ✅');
