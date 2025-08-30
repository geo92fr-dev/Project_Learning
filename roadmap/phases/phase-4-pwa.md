# 📱 Phase 4 : PWA & Offline (1 semaine) - v1.4

## 🎯 Contexte IA
**Objectif** : Transformer l'application en PWA avec fonctionnalités offline et notifications push.
**Version cible** : v1.4 (expérience mobile native)
**Pré-requis** : Phase 3 validée, exercices et progression fonctionnels

## 🚀 Instructions d'implémentation

### Étape 4.1 : Configuration PWA
```bash
[CMD] npm install @vite-pwa/sveltekit
[CMD] npm install -D vite-plugin-pwa workbox-precaching workbox-routing
```

**[FILE]** Configurer `vite.config.js` :
```javascript
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default {
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      manifest: {
        name: 'FunLearning',
        short_name: 'FunLearning',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
};
```

### Étape 4.2 : Service Worker
**[FILE]** Créer `src/sw.js` :
```javascript
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Cache des ressources statiques
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [{
      cacheWillUpdate: async ({ response }) => {
        return response.status === 200 ? response : null;
      }
    }]
  })
);

// Cache des données Firebase
registerRoute(
  ({ url }) => url.origin === 'https://firestore.googleapis.com',
  new NetworkFirst({
    cacheName: 'firestore-cache',
    networkTimeoutSeconds: 3
  })
);
```

### Étape 4.3 : Stockage offline
**[FILE]** Créer `src/lib/offline/storage.ts` :
```typescript
interface OfflineData {
  courses: Course[];
  exercises: Exercise[];
  progress: UserProgress;
  lastSync: number;
}

export class OfflineStorage {
  private readonly dbName = 'funlearning-offline';
  private readonly version = 1;

  async saveForOffline(data: OfflineData): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(['data'], 'readwrite');
    const store = transaction.objectStore('data');
    await store.put(data, 'offline-data');
  }

  async getOfflineData(): Promise<OfflineData | null> {
    const db = await this.getDB();
    const transaction = db.transaction(['data'], 'readonly');
    const store = transaction.objectStore('data');
    return await store.get('offline-data');
  }
}
```

### Étape 4.4 : Interface mobile responsive
**[FILE]** Créer `src/lib/components/mobile/MobileNavigation.svelte`
**[FILE]** Créer `src/lib/components/mobile/TouchGestures.svelte`
**[FILE]** Améliorer `src/app.css` avec media queries mobile

### Étape 4.5 : Notifications push
**[FILE]** Créer `src/lib/notifications/pushManager.ts` :
```typescript
export class PushNotificationManager {
  async requestPermission(): Promise<NotificationPermission> {
    return await Notification.requestPermission();
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
  }

  scheduleProgressReminder(userId: string, delay: number): void {
    // Logique de rappel de progression
  }
}
```

## 🧪 Tests de validation Phase 4

### Tests obligatoires
1. **[TEST]** `npm run test:pwa` - Tests PWA passent
2. **[TEST]** `npm run test:offline` - Tests offline passent
3. **[TEST]** `npm run test:mobile` - Tests responsive passent
4. **[CHECK]** `npm run validate 4` - Validation complète Phase 4

### Critères de validation obligatoires
- ✅ Manifest PWA configuré et valide
- ✅ Service Worker fonctionnel
- ✅ Cache offline opérationnel
- ✅ Interface mobile responsive
- ✅ Notifications push configurées
- ✅ Installation PWA possible

**🚫 STOP** : Ne pas passer à Phase 5 sans validation complète de Phase 4.

---

**Phase 4 terminée** ✅ → Prête pour **Phase 5 : Admin & Import**
