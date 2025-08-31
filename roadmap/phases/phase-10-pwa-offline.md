# 📱 Phase 10 : PWA & Offline Features (3 jours) - v1.8

## 📋 **Vue d'Ensemble**

**Objectif** : Application Web Progressive avec fonctionnalités offline complètes  
**Version cible** : v1.8 (app native-like)  
**Groupe** : 🏗️ ÉCOSYSTÈME - Exercices & PWA  
**Prérequis** : Phase 9 (Exercises System) validée ✅

---

## 🎯 **Principes Fondamentaux & Architecture**

### 📱 **Progressive Web App (PWA)**

**Caractéristiques PWA :**

- **App-like Experience** : Interface native sur mobile/desktop
- **Offline-First Strategy** : Fonctionnement sans connexion
- **Background Sync** : Synchronisation automatique des données
- **Push Notifications** : Engagement utilisateur proactif
- **Installation Native** : Ajout à l'écran d'accueil

**Service Worker Architecture :**

- **Caching Strategy** : Cache intelligent multi-niveau
- **Network-First/Cache-First** : Stratégies adaptatives
- **Background Tasks** : Sync différé et retry automatique
- **Update Management** : Mise à jour transparente de l'app
- **Offline Fallbacks** : Expérience dégradée gracieuse

### 🔄 **Synchronisation Offline/Online**

**Stratégie de Cache :**

- **Critical Resources** : Cache immédiat (CSS, JS, fonts)
- **Content Cache** : Mise en cache intelligent du contenu
- **API Cache** : Cache réponses avec TTL adaptatif
- **User Data** : Persistance locale avec IndexedDB
- **Conflict Resolution** : Gestion collisions données

**Sync Patterns :**

- **Immediate Sync** : Actions temps réel quand connecté
- **Deferred Sync** : Queue actions offline pour sync ultérieure
- **Optimistic Updates** : UI optimiste avec rollback
- **Conflict Detection** : Détection et résolution automatique
- **Delta Sync** : Synchronisation incrémentale efficace

### 🔔 **Engagement & Notifications**

**Push Notifications :**

- **Learning Reminders** : Rappels adaptatifs d'apprentissage
- **Progress Achievements** : Notifications de progression
- **New Content** : Alertes nouveau contenu personnalisé
- **Social Interactions** : Notifications communautaires
- **System Updates** : Mises à jour importantes

**Engagement Features :**

- **Offline Learning** : Apprentissage continu sans réseau
- **Quick Actions** : Actions rapides depuis l'écran d'accueil
- **App Shortcuts** : Raccourcis contextuels natifs
- **Share Integration** : Partage natif OS
- **File Handling** : Association types de fichiers

### 🏗️ **Approche Qualité & Performance**

**Performance PWA :**

- **Loading Performance** : < 3s First Contentful Paint
- **Runtime Performance** : 60fps animations natives
- **Cache Efficiency** : Ratio cache hit > 90%
- **Bundle Optimization** : Code splitting agressif
- **Network Resilience** : Tolérance aux connexions instables

---

## 📚 **Références Modulaires**

### **[REF]** PWA Foundation : **[pwa-foundation.md](../references/pwa/pwa-foundation.md)**

- ✅ Service Worker complet avec caching intelligent
- ✅ Manifest PWA optimisé pour tous devices
- ✅ Installation et mise à jour automatique
- ✅ Offline-first architecture robuste

### **[REF]** Offline Sync : **[offline-sync.md](../references/pwa/offline-sync.md)**

- ✅ Stratégies synchronisation avancées
- ✅ Gestion conflicts résolution automatique
- ✅ Queue actions avec retry intelligent
- ✅ Delta sync optimisé performance

---

## 📝 **Instructions d'Implémentation**

### 📱 **Étape 10.1 : PWA Core Setup**

**[FILE]** Créer `src/app.html` (mise à jour) :

```html
<!DOCTYPE html>
<html lang="fr" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- PWA Meta Tags -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="FunLearning" />
    <meta name="application-name" content="FunLearning" />
    <meta name="theme-color" content="#6366f1" />
    <meta name="background-color" content="#ffffff" />

    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json" />

    <!-- Icons -->
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/icons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/icons/favicon-16x16.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/icons/apple-touch-icon.png"
    />
    <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#6366f1" />

    <!-- Preload Critical Resources -->
    <link
      rel="preload"
      href="/fonts/inter-var.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link rel="preload" href="/css/critical.css" as="style" />

    <!-- Critical CSS -->
    <link rel="stylesheet" href="/css/critical.css" />

    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover" class="loading">
    <div style="display: contents">%sveltekit.body%</div>

    <!-- Service Worker Registration -->
    <script>
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("SW registered: ", registration);

              // Écouter les mises à jour
              registration.addEventListener("updatefound", () => {
                const newWorker = registration.installing;
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // Nouvelle version disponible
                    showUpdateNotification();
                  }
                });
              });
            })
            .catch((registrationError) => {
              console.log("SW registration failed: ", registrationError);
            });
        });
      }

      function showUpdateNotification() {
        // Afficher notification mise à jour
        if (confirm("Une nouvelle version est disponible. Recharger ?")) {
          window.location.reload();
        }
      }
    </script>
  </body>
</html>
```

**[FILE]** Créer `static/manifest.json` :

```json
{
  "name": "FunLearning - Formation Interactive",
  "short_name": "FunLearning",
  "description": "Plateforme d'apprentissage interactif avec IA",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "categories": ["education", "productivity"],
  "lang": "fr",
  "dir": "ltr",

  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],

  "shortcuts": [
    {
      "name": "Nouveau Cours",
      "short_name": "Cours",
      "description": "Commencer un nouveau cours",
      "url": "/courses/new",
      "icons": [
        {
          "src": "/icons/shortcut-course.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Exercices",
      "short_name": "Exercices",
      "description": "Pratiquer des exercices",
      "url": "/exercises",
      "icons": [
        {
          "src": "/icons/shortcut-exercise.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Progression",
      "short_name": "Stats",
      "description": "Voir ma progression",
      "url": "/progress",
      "icons": [
        {
          "src": "/icons/shortcut-stats.png",
          "sizes": "96x96"
        }
      ]
    }
  ],

  "file_handlers": [
    {
      "action": "/import",
      "accept": {
        "application/json": [".json"],
        "text/markdown": [".md"],
        "text/plain": [".txt"]
      }
    }
  ],

  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "files",
          "accept": ["image/*", "text/*"]
        }
      ]
    }
  },

  "protocol_handlers": [
    {
      "protocol": "web+funlearning",
      "url": "/app?action=%s"
    }
  ]
}
```

### 🔄 **Étape 10.2 : Service Worker Avancé**

**[FILE]** Créer `static/sw.js` :

```javascript
// ===== CONFIGURATION =====
const CACHE_VERSION = "v1.8.0";
const STATIC_CACHE = `funlearning-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `funlearning-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `funlearning-offline-${CACHE_VERSION}`;

// Ressources critiques à mettre en cache immédiatement
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/css/critical.css",
  "/js/app.js",
  "/fonts/inter-var.woff2",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Pages importantes pour navigation offline
const OFFLINE_PAGES = ["/", "/courses", "/exercises", "/progress", "/profile"];

// APIs à mettre en cache avec TTL
const API_CACHE_CONFIG = {
  "/api/courses": { ttl: 3600000, strategy: "stale-while-revalidate" }, // 1h
  "/api/exercises": { ttl: 1800000, strategy: "cache-first" }, // 30min
  "/api/user/progress": { ttl: 300000, strategy: "network-first" }, // 5min
  "/api/content": { ttl: 7200000, strategy: "stale-while-revalidate" }, // 2h
};

// ===== INSTALLATION =====
self.addEventListener("install", (event) => {
  console.log("[SW] Installation...");

  event.waitUntil(
    (async () => {
      // Cache des ressources statiques
      const staticCache = await caches.open(STATIC_CACHE);
      await staticCache.addAll(STATIC_ASSETS);

      // Cache des pages offline
      const offlineCache = await caches.open(OFFLINE_CACHE);
      await offlineCache.addAll(OFFLINE_PAGES);

      // Activation forcée
      await self.skipWaiting();

      console.log("[SW] Installation terminée");
    })()
  );
});

// ===== ACTIVATION =====
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation...");

  event.waitUntil(
    (async () => {
      // Nettoyage des anciens caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(
        (name) => name.includes("funlearning") && !name.includes(CACHE_VERSION)
      );

      await Promise.all(oldCaches.map((cacheName) => caches.delete(cacheName)));

      // Prise de contrôle des clients
      await self.clients.claim();

      console.log("[SW] Activation terminée");
    })()
  );
});

// ===== INTERCESSION FETCH =====
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!url.protocol.startsWith("http")) return;

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

  switch (config.strategy) {
    case "network-first":
      return networkFirst(request, DYNAMIC_CACHE, config.ttl);
    case "cache-first":
      return cacheFirst(request, DYNAMIC_CACHE, config.ttl);
    case "stale-while-revalidate":
      return staleWhileRevalidate(request, DYNAMIC_CACHE, config.ttl);
    default:
      return networkOnly(request);
  }
}

/**
 * Gestion des pages avec fallback offline
 */
async function handlePageRequest(request) {
  try {
    // Essayer le réseau d'abord
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Mettre en cache la page
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error("Network response not ok");
  } catch (error) {
    // Fallback vers le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback vers page offline
    const offlineCache = await caches.open(OFFLINE_CACHE);
    return (
      offlineCache.match("/offline") ||
      new Response("Page non disponible hors ligne")
    );
  }
}

/**
 * Gestion des ressources statiques (cache-first)
 */
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse && !isExpired(cachedResponse)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    return cachedResponse || new Response("Ressource non disponible");
  } catch (error) {
    return cachedResponse || new Response("Ressource non disponible");
  }
}

/**
 * Gestion des ressources dynamiques
 */
async function handleDynamicRequest(request) {
  return staleWhileRevalidate(request, DYNAMIC_CACHE, 3600000); // 1h par défaut
}

// ===== STRATÉGIES DÉTAILLÉES =====

/**
 * Network-First: Réseau prioritaire avec fallback cache
 */
async function networkFirst(request, cacheName, ttl) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await updateCache(request, networkResponse.clone(), cacheName, ttl);
      return networkResponse;
    }
    throw new Error("Network response not ok");
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return (
      cachedResponse || new Response("Service non disponible", { status: 503 })
    );
  }
}

/**
 * Cache-First: Cache prioritaire avec mise à jour en arrière-plan
 */
async function cacheFirst(request, cacheName, ttl) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse && !isExpired(cachedResponse, ttl)) {
    // Mettre à jour en arrière-plan si nécessaire
    if (shouldUpdateInBackground(cachedResponse, ttl)) {
      updateInBackground(request, cacheName, ttl);
    }
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await updateCache(request, networkResponse.clone(), cacheName, ttl);
      return networkResponse;
    }
    return (
      cachedResponse || new Response("Service non disponible", { status: 503 })
    );
  } catch (error) {
    return (
      cachedResponse || new Response("Service non disponible", { status: 503 })
    );
  }
}

/**
 * Stale-While-Revalidate: Cache immédiat + mise à jour arrière-plan
 */
async function staleWhileRevalidate(request, cacheName, ttl) {
  const cachedResponse = await caches.match(request);

  // Toujours essayer de mettre à jour en arrière-plan
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      updateCache(request, response.clone(), cacheName, ttl);
    }
    return response;
  });

  // Retourner le cache immédiatement si disponible
  if (cachedResponse) {
    return cachedResponse;
  }

  // Sinon attendre le réseau
  try {
    return await networkPromise;
  } catch (error) {
    return new Response("Service non disponible", { status: 503 });
  }
}

/**
 * Network-Only: Réseau uniquement (pas de cache)
 */
async function networkOnly(request) {
  return fetch(request);
}

// ===== UTILITAIRES =====

function getAPIConfig(pathname) {
  for (const [path, config] of Object.entries(API_CACHE_CONFIG)) {
    if (pathname.startsWith(path)) {
      return config;
    }
  }
  return { ttl: 300000, strategy: "network-first" }; // 5min par défaut
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/);
}

async function updateCache(request, response, cacheName, ttl) {
  const cache = await caches.open(cacheName);
  const responseToCache = response.clone();

  // Ajouter timestamp pour TTL
  responseToCache.headers.set("sw-cache-timestamp", Date.now().toString());
  responseToCache.headers.set("sw-cache-ttl", ttl.toString());

  await cache.put(request, responseToCache);
}

function isExpired(response, ttl) {
  const timestamp = response.headers.get("sw-cache-timestamp");
  const cacheTtl = response.headers.get("sw-cache-ttl");

  if (!timestamp || !cacheTtl) return false;

  const age = Date.now() - parseInt(timestamp);
  return age > parseInt(cacheTtl);
}

function shouldUpdateInBackground(response, ttl) {
  const timestamp = response.headers.get("sw-cache-timestamp");
  if (!timestamp) return true;

  const age = Date.now() - parseInt(timestamp);
  return age > ttl * 0.7; // Mettre à jour à 70% du TTL
}

async function updateInBackground(request, cacheName, ttl) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await updateCache(request, response, cacheName, ttl);
    }
  } catch (error) {
    console.log("[SW] Background update failed:", error);
  }
}

// ===== BACKGROUND SYNC =====
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log("[SW] Background sync...");

  try {
    // Synchroniser les données en attente
    await syncPendingData();

    // Mettre à jour le contenu critique
    await updateCriticalContent();

    console.log("[SW] Background sync terminé");
  } catch (error) {
    console.error("[SW] Background sync échoué:", error);
    throw error; // Retry automatique
  }
}

async function syncPendingData() {
  // Récupérer les données en attente depuis IndexedDB
  const pendingActions = await getPendingActions();

  for (const action of pendingActions) {
    try {
      await fetch(action.url, {
        method: action.method,
        headers: action.headers,
        body: action.body,
      });

      // Marquer comme synchronisé
      await markActionSynced(action.id);
    } catch (error) {
      console.error("[SW] Sync action failed:", action, error);
    }
  }
}

async function updateCriticalContent() {
  // Mettre à jour le contenu critique en arrière-plan
  const criticalUrls = [
    "/api/user/progress",
    "/api/courses/latest",
    "/api/exercises/featured",
  ];

  for (const url of criticalUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(url, response.clone());
      }
    } catch (error) {
      console.log("[SW] Failed to update:", url, error);
    }
  }
}

// Fonctions IndexedDB simplifiées (à implémenter selon besoin)
async function getPendingActions() {
  // Récupérer actions en attente depuis IndexedDB
  return [];
}

async function markActionSynced(actionId) {
  // Marquer action comme synchronisée dans IndexedDB
}

// ===== PUSH NOTIFICATIONS =====
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    tag: data.tag || "general",
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {},
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  event.waitUntil(clients.openWindow(data.url || "/"));
});

// ===== MESSAGE HANDLING =====
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
```

### 🔄 **Étape 10.3 : Offline Data Management**

**[FILE]** Créer `src/lib/offline/offlineManager.ts` :

```ts
import { writable } from "svelte/store";
import { browser } from "$app/environment";

// ===== TYPES =====
export interface OfflineAction {
  id: string;
  type: string;
  endpoint: string;
  method: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingActions: number;
  lastSync: Date | null;
  syncErrors: string[];
}

// ===== STORES =====
export const syncStatus = writable<SyncStatus>({
  isOnline: browser ? navigator.onLine : true,
  isSyncing: false,
  pendingActions: 0,
  lastSync: null,
  syncErrors: [],
});

// ===== OFFLINE MANAGER =====
export class OfflineManager {
  private db: IDBDatabase | null = null;
  private syncInProgress = false;
  private retryTimeout: number | null = null;

  constructor() {
    if (browser) {
      this.initializeDB();
      this.setupNetworkListeners();
      this.startPeriodicSync();
    }
  }

  // ===== INITIALISATION =====
  private async initializeDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("FunLearningOffline", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store pour actions en attente
        if (!db.objectStoreNames.contains("pendingActions")) {
          const store = db.createObjectStore("pendingActions", {
            keyPath: "id",
          });
          store.createIndex("timestamp", "timestamp");
          store.createIndex("type", "type");
        }

        // Store pour données en cache
        if (!db.objectStoreNames.contains("cachedData")) {
          const store = db.createObjectStore("cachedData", { keyPath: "key" });
          store.createIndex("timestamp", "timestamp");
          store.createIndex("expiry", "expiry");
        }

        // Store pour état de synchronisation
        if (!db.objectStoreNames.contains("syncState")) {
          db.createObjectStore("syncState", { keyPath: "key" });
        }
      };
    });
  }

  private setupNetworkListeners() {
    window.addEventListener("online", () => {
      this.updateOnlineStatus(true);
      this.triggerSync();
    });

    window.addEventListener("offline", () => {
      this.updateOnlineStatus(false);
    });
  }

  private updateOnlineStatus(isOnline: boolean) {
    syncStatus.update((status) => ({
      ...status,
      isOnline,
    }));
  }

  // ===== GESTION ACTIONS OFFLINE =====
  async queueAction(
    action: Omit<OfflineAction, "id" | "timestamp" | "retryCount">
  ): Promise<string> {
    const actionWithId: OfflineAction = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0,
      ...action,
    };

    await this.storeAction(actionWithId);
    this.updatePendingCount();

    // Essayer de synchroniser immédiatement si en ligne
    if (navigator.onLine) {
      this.triggerSync();
    }

    return actionWithId.id;
  }

  private async storeAction(action: OfflineAction): Promise<void> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingActions"], "readwrite");
      const store = transaction.objectStore("pendingActions");

      const request = store.add(action);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingActions(): Promise<OfflineAction[]> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingActions"], "readonly");
      const store = transaction.objectStore("pendingActions");

      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async removeAction(actionId: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingActions"], "readwrite");
      const store = transaction.objectStore("pendingActions");

      const request = store.delete(actionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ===== SYNCHRONISATION =====
  async triggerSync(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) return;

    this.syncInProgress = true;
    syncStatus.update((status) => ({
      ...status,
      isSyncing: true,
      syncErrors: [],
    }));

    try {
      const actions = await this.getPendingActions();
      const errors: string[] = [];

      for (const action of actions) {
        try {
          await this.executeAction(action);
          await this.removeAction(action.id);
        } catch (error) {
          await this.handleActionError(action, error as Error);
          errors.push(`${action.type}: ${(error as Error).message}`);
        }
      }

      syncStatus.update((status) => ({
        ...status,
        lastSync: new Date(),
        syncErrors: errors,
      }));

      this.updatePendingCount();
    } finally {
      this.syncInProgress = false;
      syncStatus.update((status) => ({ ...status, isSyncing: false }));
    }
  }

  private async executeAction(action: OfflineAction): Promise<void> {
    const response = await fetch(action.endpoint, {
      method: action.method,
      headers: {
        "Content-Type": "application/json",
        // Ajouter headers d'authentification si nécessaire
      },
      body: action.data ? JSON.stringify(action.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  private async handleActionError(
    action: OfflineAction,
    error: Error
  ): Promise<void> {
    const updatedAction = {
      ...action,
      retryCount: action.retryCount + 1,
    };

    if (updatedAction.retryCount >= action.maxRetries) {
      // Abandonner après max retries
      await this.removeAction(action.id);
      console.error("Action abandonnée après max retries:", action, error);
    } else {
      // Programmer un retry avec backoff exponential
      const delay = Math.min(
        1000 * Math.pow(2, updatedAction.retryCount),
        30000
      );

      setTimeout(() => {
        this.updateStoredAction(updatedAction);
        this.triggerSync();
      }, delay);
    }
  }

  private async updateStoredAction(action: OfflineAction): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["pendingActions"], "readwrite");
      const store = transaction.objectStore("pendingActions");

      const request = store.put(action);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async updatePendingCount(): Promise<void> {
    const actions = await this.getPendingActions();
    syncStatus.update((status) => ({
      ...status,
      pendingActions: actions.length,
    }));
  }

  // ===== SYNC PÉRIODIQUE =====
  private startPeriodicSync(): void {
    // Sync toutes les 5 minutes si en ligne
    setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.triggerSync();
      }
    }, 5 * 60 * 1000);
  }

  // ===== CACHE MANAGEMENT =====
  async cacheData(
    key: string,
    data: unknown,
    ttl: number = 3600000
  ): Promise<void> {
    if (!this.db) await this.initializeDB();

    const cacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cachedData"], "readwrite");
      const store = transaction.objectStore("cachedData");

      const request = store.put(cacheEntry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cachedData"], "readonly");
      const store = transaction.objectStore("cachedData");

      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }

        // Vérifier expiration
        if (Date.now() > result.expiry) {
          this.removeCachedData(key);
          resolve(null);
          return;
        }

        resolve(result.data);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async removeCachedData(key: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cachedData"], "readwrite");
      const store = transaction.objectStore("cachedData");

      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ===== NETTOYAGE =====
  async cleanup(): Promise<void> {
    // Nettoyer les données expirées
    await this.cleanupExpiredCache();

    // Nettoyer les actions échouées anciennes
    await this.cleanupOldFailedActions();
  }

  private async cleanupExpiredCache(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cachedData"], "readwrite");
      const store = transaction.objectStore("cachedData");
      const index = store.index("expiry");

      const range = IDBKeyRange.upperBound(Date.now());
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async cleanupOldFailedActions(): Promise<void> {
    const actions = await this.getPendingActions();
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (const action of actions) {
      if (
        action.timestamp < oneWeekAgo &&
        action.retryCount >= action.maxRetries
      ) {
        await this.removeAction(action.id);
      }
    }
  }
}

// Instance globale
export const offlineManager = new OfflineManager();

// ===== HELPERS =====
export function createOfflineAction(
  type: string,
  endpoint: string,
  method: string = "POST",
  data?: unknown,
  maxRetries: number = 3
): Omit<OfflineAction, "id" | "timestamp" | "retryCount"> {
  return {
    type,
    endpoint,
    method,
    data,
    maxRetries,
  };
}

// ===== API WRAPPER OFFLINE-FIRST =====
export async function offlineFirstRequest<T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  ttl: number = 3600000
): Promise<T> {
  // Essayer le cache d'abord si offline
  if (!navigator.onLine && cacheKey) {
    const cached = await offlineManager.getCachedData<T>(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Mettre en cache si succès
    if (cacheKey) {
      await offlineManager.cacheData(cacheKey, data, ttl);
    }

    return data;
  } catch (error) {
    // Fallback vers cache si erreur réseau
    if (cacheKey) {
      const cached = await offlineManager.getCachedData<T>(cacheKey);
      if (cached) return cached;
    }

    throw error;
  }
}
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:pwa             # Tests fonctionnalités PWA
[TEST] npm run test:offline         # Tests comportement offline
[TEST] npm run test:sync            # Tests synchronisation
[TEST] npm run validate 10          # Validation complète Phase 10
```

---

## ✅ **Critères de Validation Obligatoires**

- [ ] **[CHECK]** Manifest PWA complet et valide
- [ ] **[CHECK]** Service Worker avec stratégies cache avancées
- [ ] **[CHECK]** Fonctionnement offline complet
- [ ] **[CHECK]** Synchronisation background automatique
- [ ] **[CHECK]** Installation native mobile/desktop
- [ ] **[CHECK]** Push notifications fonctionnelles
- [ ] **[CHECK]** Performance Lighthouse PWA > 90
- [ ] **[CHECK]** Gestion erreurs et états réseau

---

## 🏷️ **Processus de Release v1.8**

```bash
[CMD] npm run validate 10            # Validation complète Phase 10
[CMD] git add . && git commit -m "feat: Phase 10 - PWA & Offline complete"
[CMD] git tag v1.8                  # Tag release PWA
```

**🚫 STOP** : Ne pas passer à Phase 11 sans validation PWA audit Lighthouse.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [⚙️ Phase 11 : Admin Dashboard](phase-11-admin-dashboard.md)  
**Groupe suivant** : 🚀 PRODUCTION - Admin & Déploiement  
**Dépendance** : Phase 10 (PWA & Offline) validée ✅
