/**
 * 🔧 Service Worker - Phase 10 PWA
 * Gestionnaire avancé de cache et synchronisation offline
 * Features: Cache intelligent, stratégies adaptatives, background sync
 */

const CACHE_VERSION = "v1.8.1";
const STATIC_CACHE = `funlearning-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `funlearning-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `funlearning-offline-${CACHE_VERSION}`;

// Ressources critiques à mettre en cache immédiatement
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Pages importantes pour navigation offline
const OFFLINE_PAGES = ["/", "/exercises", "/lessons", "/progress"];

// APIs à mettre en cache avec TTL
const API_CACHE_CONFIG = {
  "/api/exercises": { ttl: 1800000, strategy: "cache-first" }, // 30min
  "/api/lessons": { ttl: 3600000, strategy: "stale-while-revalidate" }, // 1h
  "/api/progress": { ttl: 300000, strategy: "network-first" }, // 5min
  "/api/curriculum": { ttl: 7200000, strategy: "stale-while-revalidate" }, // 2h
};

// ===== INSTALLATION =====
self.addEventListener("install", (event) => {
  console.log(`[SW] Installation Phase 10 - Version ${CACHE_VERSION}...`);

  event.waitUntil(
    (async () => {
      try {
        // Cache des ressources statiques
        const staticCache = await caches.open(STATIC_CACHE);
        await staticCache.addAll(STATIC_ASSETS);

        // Cache des pages offline
        const offlineCache = await caches.open(OFFLINE_CACHE);
        await offlineCache.addAll(OFFLINE_PAGES);

        // Activation forcée
        await self.skipWaiting();

        console.log("[SW] Installation terminée");
      } catch (error) {
        console.error("[SW] Erreur installation:", error);
      }
    })()
  );
});

// ===== ACTIVATION =====
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation...");

  event.waitUntil(
    (async () => {
      try {
        // Nettoyage des anciens caches
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(
          (name) => name.includes("funlearning") && !name.includes(CACHE_VERSION)
        );

        await Promise.all(oldCaches.map((cacheName) => caches.delete(cacheName)));

        // Prise de contrôle des clients
        await self.clients.claim();

        console.log("[SW] Activation terminée");
      } catch (error) {
        console.error("[SW] Erreur activation:", error);
      }
    })()
  );
});

// ===== INTERCESSION FETCH =====
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!url.protocol.startsWith("http")) return;

  // Ignorer les requêtes POST, PUT, DELETE (non cachables)
  if (request.method !== 'GET') return;

  // Choisir la stratégie selon le type de requête
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleAPIRequest(request));
  } else if (request.destination === "document") {
    event.respondWith(handlePageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// ===== STRATÉGIES DE CACHE =====

/**
 * Gestion des requêtes API avec stratégies adaptatives
 */
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  const config = getAPIConfig(url.pathname);

  if (!config) {
    return fetch(request);
  }

  switch (config.strategy) {
    case "network-first":
      return networkFirst(request, DYNAMIC_CACHE, config.ttl);
    case "cache-first":
      return cacheFirst(request, DYNAMIC_CACHE, config.ttl);
    case "stale-while-revalidate":
      return staleWhileRevalidate(request, DYNAMIC_CACHE, config.ttl);
    default:
      return fetch(request);
  }
}

/**
 * Gestion des pages avec fallback offline
 */
async function handlePageRequest(request) {
  try {
    // Essayer le réseau en premier
    const response = await fetch(request);
    
    // Mettre en cache si succès
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback vers le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback vers page offline
    return caches.match("/offline");
  }
}

/**
 * Gestion des assets statiques (images, CSS, JS)
 */
async function handleStaticRequest(request) {
  return cacheFirst(request, STATIC_CACHE);
}

/**
 * Gestion des requêtes dynamiques
 */
async function handleDynamicRequest(request) {
  try {
    return await staleWhileRevalidate(request, DYNAMIC_CACHE);
  } catch (error) {
    console.warn('[SW] Erreur requête dynamique:', error);
    // Fallback: essayer de servir depuis le cache sans conditions
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Si pas de cache, retourner une réponse d'erreur personnalisée
    return new Response('Service temporairement indisponible', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// ===== STRATÉGIES DE CACHE IMPLÉMENTATIONS =====

/**
 * Stratégie Network First avec fallback cache
 */
async function networkFirst(request, cacheName, ttl = 300000) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = response.clone();
      
      // Ajouter timestamp pour TTL
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: {
          ...Object.fromEntries(responseToCache.headers),
          'sw-cached-at': Date.now().toString()
        }
      });
      
      cache.put(request, cachedResponse);
    }
    
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse && !isCacheExpired(cachedResponse, ttl)) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Stratégie Cache First avec update background
 */
async function cacheFirst(request, cacheName, ttl = 3600000) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse && !isCacheExpired(cachedResponse, ttl)) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = response.clone();
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: {
          ...Object.fromEntries(responseToCache.headers),
          'sw-cached-at': Date.now().toString()
        }
      });
      
      cache.put(request, cachedResponse);
    }
    
    return response;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * Stratégie Stale While Revalidate
 */
async function staleWhileRevalidate(request, cacheName, ttl = 1800000) {
  // Vérifier que la requête est cachable
  if (request.method !== 'GET') {
    return fetch(request);
  }

  const cachedResponse = await caches.match(request);
  
  // Toujours essayer de revalider en arrière-plan
  const fetchPromise = fetch(request).then(response => {
    // Seulement cacher les réponses valides GET
    if (response.ok && request.method === 'GET') {
      const cache = caches.open(cacheName);
      const responseToCache = response.clone();
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: {
          ...Object.fromEntries(responseToCache.headers),
          'sw-cached-at': Date.now().toString()
        }
      });
      
      cache.then(c => c.put(request, cachedResponse)).catch(err => {
        console.warn('[SW] Erreur cache:', err);
      });
    }
    return response;
  }).catch(error => {
    console.warn('[SW] Erreur fetch:', error);
    // Retourner le cache en cas d'erreur réseau
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  });
  
  // Retourner immédiatement le cache si disponible et valide
  if (cachedResponse && !isCacheExpired(cachedResponse, ttl)) {
    return cachedResponse;
  }
  
  // Sinon attendre la réponse réseau
  return fetchPromise;
}

// ===== UTILITAIRES =====

/**
 * Vérifier si un asset est statique
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.woff2', '.woff'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Récupérer la configuration de cache pour une API
 */
function getAPIConfig(pathname) {
  for (const [pattern, config] of Object.entries(API_CACHE_CONFIG)) {
    if (pathname.startsWith(pattern)) {
      return config;
    }
  }
  return null;
}

/**
 * Vérifier si le cache a expiré
 */
function isCacheExpired(response, ttl) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return true;
  
  const age = Date.now() - parseInt(cachedAt);
  return age > ttl;
}

// ===== BACKGROUND SYNC =====
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync:", event.tag);
  
  if (event.tag === "background-sync-exercises") {
    event.waitUntil(syncExerciseResults());
  }
  
  if (event.tag === "background-sync-progress") {
    event.waitUntil(syncProgressData());
  }
});

/**
 * Synchroniser les résultats d'exercices en arrière-plan
 */
async function syncExerciseResults() {
  try {
    // Récupérer les données en attente depuis IndexedDB
    const pendingResults = await getPendingExerciseResults();
    
    for (const result of pendingResults) {
      try {
        await fetch("/api/exercises/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result)
        });
        
        // Supprimer de la queue si succès
        await removePendingExerciseResult(result.id);
      } catch (error) {
        console.error("[SW] Erreur sync exercice:", error);
      }
    }
  } catch (error) {
    console.error("[SW] Erreur background sync:", error);
  }
}

/**
 * Synchroniser les données de progression
 */
async function syncProgressData() {
  try {
    const pendingProgress = await getPendingProgressData();
    
    for (const progress of pendingProgress) {
      try {
        await fetch("/api/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(progress)
        });
        
        await removePendingProgressData(progress.id);
      } catch (error) {
        console.error("[SW] Erreur sync progression:", error);
      }
    }
  } catch (error) {
    console.error("[SW] Erreur sync progression:", error);
  }
}

// ===== PLACEHOLDERS INDEXEDDB =====
// Fonctions IndexedDB pour background sync

async function getPendingExerciseResults() {
  try {
    // Ouvrir IndexedDB
    const db = await openIndexedDB();
    const transaction = db.transaction(['exerciseResults'], 'readonly');
    const store = transaction.objectStore('exerciseResults');
    const index = store.index('synced');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(false));
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erreur getPendingExerciseResults:', error);
    return [];
  }
}

async function removePendingExerciseResult(id) {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['exerciseResults'], 'readwrite');
    const store = transaction.objectStore('exerciseResults');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erreur removePendingExerciseResult:', error);
  }
}

async function getPendingProgressData() {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['progress'], 'readonly');
    const store = transaction.objectStore('progress');
    const index = store.index('synced');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(false));
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erreur getPendingProgressData:', error);
    return [];
  }
}

async function removePendingProgressData(id) {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['progress'], 'readwrite');
    const store = transaction.objectStore('progress');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[SW] Erreur removePendingProgressData:', error);
  }
}

// Ouvrir la base IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FunLearningDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

console.log("[SW] Service Worker Phase 10 chargé ✅");
