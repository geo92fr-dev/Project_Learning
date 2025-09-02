/**
 * 📱 PWA Store - Phase 10
 * Gestion des fonctionnalités PWA et offline
 * Features: Installation, mises à jour, synchronisation, cache management
 */

import { writable, derived, readable } from 'svelte/store';
import { browser } from '$app/environment';

// ===== ÉTAT PWA =====

/** État de l'installation PWA */
export const installPrompt = writable<BeforeInstallPromptEvent | null>(null);
export const isInstallable = writable(false);
export const isInstalled = writable(false);

/** État de la connexion */
export const isOnline = writable(true);
export const connectionType = writable('unknown');

/** État du Service Worker */
export const serviceWorkerRegistration = writable<ServiceWorkerRegistration | null>(null);
export const serviceWorkerUpdate = writable<ServiceWorker | null>(null);
export const isServiceWorkerReady = writable(false);

/** Cache management */
export const cacheSize = writable(0);
export const cacheStatus = writable<'loading' | 'ready' | 'error'>('loading');

// ===== TYPES =====

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
}

// ===== STORES DÉRIVÉS =====

/** Indicateur de mode offline */
export const isOfflineMode = derived(
  [isOnline, isServiceWorkerReady],
  ([$isOnline, $isServiceWorkerReady]) => !$isOnline && $isServiceWorkerReady
);

/** Statut global PWA */
export const pwaStatus = derived(
  [isInstalled, isServiceWorkerReady, isOnline],
  ([$isInstalled, $isServiceWorkerReady, $isOnline]) => ({
    installed: $isInstalled,
    offline: $isServiceWorkerReady,
    online: $isOnline,
    ready: $isServiceWorkerReady
  })
);

// ===== INITIALISATION =====

if (browser) {
  initializePWA();
}

async function initializePWA() {
  // Détection de l'état d'installation
  detectInstallation();
  
  // Monitoring de la connexion
  monitorConnection();
  
  // Gestion du Service Worker
  await registerServiceWorker();
  
  // Gestion de l'install prompt
  setupInstallPrompt();
  
  // Cache monitoring
  monitorCache();
}

// ===== DÉTECTION INSTALLATION =====

function detectInstallation() {
  // Détecter si l'app est lancée en mode standalone (installée)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  isInstalled.set(isStandalone || isIOSStandalone);
  
  // Écouter les changements
  window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
    isInstalled.set(e.matches);
  });
}

// ===== MONITORING CONNEXION =====

function monitorConnection() {
  // État initial
  isOnline.set(navigator.onLine);
  
  // Type de connexion si supporté
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    connectionType.set(connection.effectiveType || 'unknown');
    
    connection.addEventListener('change', () => {
      connectionType.set(connection.effectiveType || 'unknown');
    });
  }
  
  // Événements online/offline
  window.addEventListener('online', () => {
    isOnline.set(true);
    console.log('[PWA] Connexion rétablie');
    
    // Déclencher la synchronisation
    triggerBackgroundSync();
  });
  
  window.addEventListener('offline', () => {
    isOnline.set(false);
    console.log('[PWA] Mode hors ligne activé');
  });
}

// ===== SERVICE WORKER =====

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service Worker non supporté');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    serviceWorkerRegistration.set(registration);
    
    console.log('[PWA] Service Worker enregistré:', registration);
    
    // Vérifier si ready
    if (registration.active) {
      isServiceWorkerReady.set(true);
    }
    
    // Écouter les changements d'état
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        serviceWorkerUpdate.set(newWorker);
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nouvelle version disponible
            console.log('[PWA] Nouvelle version disponible');
          }
          
          if (newWorker.state === 'activated') {
            isServiceWorkerReady.set(true);
          }
        });
      }
    });
    
    // Si déjà contrôlé par un SW
    if (navigator.serviceWorker.controller) {
      isServiceWorkerReady.set(true);
    }
    
  } catch (error) {
    console.error('[PWA] Erreur Service Worker:', error);
  }
}

// ===== INSTALL PROMPT =====

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher l'affichage automatique
    e.preventDefault();
    
    // Stocker l'événement pour usage ultérieur
    installPrompt.set(e as BeforeInstallPromptEvent);
    isInstallable.set(true);
    
    console.log('[PWA] Installation disponible');
  });
  
  window.addEventListener('appinstalled', () => {
    installPrompt.set(null);
    isInstallable.set(false);
    isInstalled.set(true);
    
    console.log('[PWA] Application installée');
  });
}

// ===== CACHE MONITORING =====

async function monitorCache() {
  if (!('caches' in window)) return;
  
  try {
    cacheStatus.set('loading');
    
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      if (cacheName.includes('funlearning')) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }
    }
    
    cacheSize.set(totalSize);
    cacheStatus.set('ready');
    
  } catch (error) {
    console.error('[PWA] Erreur cache monitoring:', error);
    cacheStatus.set('error');
  }
}

// ===== ACTIONS PWA =====

/** Déclencher l'installation de l'app */
export async function installApp() {
  let currentPrompt: any = null;
  const unsubscribe = installPrompt.subscribe(value => {
    currentPrompt = value;
  });
  unsubscribe();
  
  if (!currentPrompt) {
    throw new Error('Installation non disponible');
  }
  
  try {
    const result = await (currentPrompt as any).prompt();
    console.log('[PWA] Résultat installation:', result);
    
    installPrompt.set(null);
    isInstallable.set(false);
    
    return result;
  } catch (error) {
    console.error('[PWA] Erreur installation:', error);
    throw error;
  }
}

/** Activer la mise à jour du Service Worker */
export async function activateUpdate() {
  let currentUpdate: any = null;
  const unsubscribe = serviceWorkerUpdate.subscribe(value => {
    currentUpdate = value;
  });
  unsubscribe();
  
  if (currentUpdate) {
    (currentUpdate as any).postMessage({ action: 'skipWaiting' });
    window.location.reload();
  }
}

/** Vider le cache */
export async function clearCache() {
  if (!('caches' in window)) return;
  
  try {
    const cacheNames = await caches.keys();
    const funlearningCaches = cacheNames.filter(name => name.includes('funlearning'));
    
    await Promise.all(
      funlearningCaches.map(cacheName => caches.delete(cacheName))
    );
    
    cacheSize.set(0);
    console.log('[PWA] Cache vidé');
    
    // Recharger la page pour refaire le cache
    window.location.reload();
    
  } catch (error) {
    console.error('[PWA] Erreur vidage cache:', error);
    throw error;
  }
}

/** Déclencher la synchronisation en arrière-plan */
export async function triggerBackgroundSync() {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.ready) {
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    if ('sync' in registration) {
      // Déclencher les sync des exercices et progression
      await (registration as any).sync.register('background-sync-exercises');
      await (registration as any).sync.register('background-sync-progress');
      
      console.log('[PWA] Background sync déclenché');
    }
  } catch (error) {
    console.error('[PWA] Erreur background sync:', error);
  }
}

/** Précharger des ressources importantes */
export async function preloadCriticalResources(urls: string[]) {
  if (!('caches' in window)) return;
  
  try {
    const cache = await caches.open('funlearning-dynamic-v1.8.0');
    
    const preloadPromises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.warn(`[PWA] Erreur préchargement ${url}:`, error);
      }
    });
    
    await Promise.all(preloadPromises);
    console.log('[PWA] Ressources critiques préchargées');
    
  } catch (error) {
    console.error('[PWA] Erreur préchargement:', error);
  }
}

// ===== STORE DE NOTIFICATIONS =====

/** File des notifications à afficher */
export const notificationQueue = writable<Array<{
  id: string;
  type: 'update' | 'offline' | 'sync' | 'install';
  message: string;
  action?: () => void;
}>>([]);

/** Ajouter une notification */
export function addNotification(notification: {
  type: 'update' | 'offline' | 'sync' | 'install';
  message: string;
  action?: () => void;
}) {
  const id = `notification-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  
  notificationQueue.update(queue => [
    ...queue,
    { id, ...notification }
  ]);
  
  // Auto-suppression après 5 secondes si pas d'action
  if (!notification.action) {
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }
}

/** Supprimer une notification */
export function removeNotification(id: string) {
  notificationQueue.update(queue => queue.filter(n => n.id !== id));
}

// ===== UTILITAIRES =====

/** Formater la taille du cache */
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/** Détecter le type de connexion */
export function getConnectionInfo() {
  if (!('connection' in navigator)) {
    return { type: 'unknown', speed: 'unknown' };
  }
  
  const connection = (navigator as any).connection;
  return {
    type: connection.effectiveType || 'unknown',
    speed: connection.downlink || 0,
    rtt: connection.rtt || 0,
    saveData: connection.saveData || false
  };
}

console.log('[PWA] Store PWA initialisé ✅');
