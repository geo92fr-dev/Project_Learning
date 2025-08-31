# 🔐 Phase 2 : Firebase & Authentification (1 semaine - Priorisation intelligente) - v1.0 MVP

## 📋 **Vue d'Ensemble**

**Objectif** : Authentification Google OAuth directe (approche simplifiée)
**Version cible** : v1.0 (MVP avec authentification Google fonctionnelle)  
**Groupe** : 🏗️ FONDATIONS  
**Prérequis** : Phase 1 (Setup) validée ✅
**🎯 Stratégie** : Google OAuth uniquement - configuration Firebase déjà opérationnelle ✅

---

## 🎯 **Principes Fondamentaux & Architecture**

### 🔐 **Architecture d'Authentification**

**Approche Technique :**

- **Firebase Auth** : Service managé avec Google OAuth
- **Store réactif** : Gestion d'état centralisée avec Svelte stores
- **Protection des routes** : Middleware SvelteKit avec hooks
- **Types sécurisés** : TypeScript strict pour User et AuthState
- **Persistence** : Session maintenue via Firebase SDK

**Principes de Sécurité :**

- **Zero Trust** : Vérification côté serveur obligatoire
- **Token validation** : Validation JWT côté serveur (hooks.server.ts)
- **Redirections sécurisées** : Protection contre les attaques de redirection
- **Variables d'environnement** : Clés API sécurisées
- **Gestion d'erreurs** : Messages d'erreur sécurisés (pas de leak d'info)

### ⚡ **Approche Qualité & Performance**

**Optimisations :**

- **Lazy loading** : Firebase SDK chargé à la demande
- **State management** : Store minimal et réactif
- **Cache intelligent** : Persistence automatique Firebase
- **Bundle size** : Import sélectif des modules Firebase
- **Error boundaries** : Gestion gracieuse des erreurs réseau

**Tests & Validation :**

- **Unit tests** : Store auth + utilities
- **Integration tests** : Flux complet login/logout
- **E2E tests** : Parcours utilisateur authentifié
- **Security tests** : Protection des routes

---

## 📚 **Référence Modulaire**

**[REF]** Documentation complète : **[firebase-auth.md](../references/auth/firebase-auth.md)**

Cette référence contient :

- ✅ Configuration Firebase production-ready
- ✅ Types TypeScript sécurisés et extensibles
- ✅ Store d'authentification avec persistence
- ✅ Composants UI avec gestion d'erreurs
- ✅ Protection des routes via SvelteKit hooks
- ✅ Tests complets (unit + E2E)
- ✅ Guide de déploiement sécurisé

---

## 📝 **Instructions d'Implémentation**

### 🎯 **Stratégie d'Authentification Simplifiée**

**⚡ Approche Directe (Configuration Actuelle) :**

1. **🚫 ~~Priorité 1 - Email/Password~~ ABANDONNÉ**

   - ~~Configuration Firebase la plus simple~~
   - ~~Pas de dépendances OAuth externes~~
   - ~~Validation immédiate du flux auth~~
   - **RAISON :** Configuration Firebase OAuth déjà fonctionnelle

2. **� Priorité Unique - Google OAuth** (Jours 1-5)

   - Configuration Firebase OAuth déjà opérationnelle ✅
   - Authentification Google directe
   - Système validé et testé

3. **🛡️ Avantages de cette approche simplifiée :**
   - Évite la redondance de deux systèmes d'auth
   - Focus sur la solution OAuth déjà implémentée
   - Gain de temps pour les phases suivantes

### 🔧 **Étape 2.1 : Installation & Configuration**

```bash
[CMD] npm install firebase
[CMD] npm install -D @types/firebase
```

**[FILE]** Créer `.env.local` - Variables sécurisées :

```env
# Firebase Configuration (Remplacer par vos valeurs)
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=funlearning-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=funlearning-dev
VITE_FIREBASE_STORAGE_BUCKET=funlearning-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin SDK (pour hooks.server.ts)
FIREBASE_ADMIN_SDK_KEY={"type":"service_account",...}
```

**[FILE]** Créer `src/lib/firebase/config.ts` :

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { browser } from "$app/environment";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialisation côté client seulement
export const app = browser ? initializeApp(firebaseConfig) : null;
export const auth = browser ? getAuth(app!) : null;
export const db = browser ? getFirestore(app!) : null;
```

### 🗄️ **Étape 2.2 : Store d'authentification réactif**

**[FILE]** Créer `src/lib/stores/auth.ts` :

```ts
import { writable, derived } from "svelte/store";
import { auth } from "$lib/firebase/config";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { browser } from "$app/environment";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  return {
    subscribe,

    // Initialiser l'écoute de l'état d'auth
    init: () => {
      if (!browser || !auth) return;

      return onAuthStateChanged(
        auth,
        (user) => {
          update((state) => ({
            ...state,
            user,
            loading: false,
            error: null,
          }));
        },
        (error) => {
          update((state) => ({
            ...state,
            user: null,
            loading: false,
            error: error.message,
          }));
        }
      );
    },

    // Déconnexion
    logout: async () => {
      if (!auth) return;
      try {
        await signOut(auth);
      } catch (error) {
        update((state) => ({
          ...state,
          error:
            error instanceof Error ? error.message : "Erreur de déconnexion",
        }));
      }
    },

    // Nettoyer les erreurs
    clearError: () => {
      update((state) => ({ ...state, error: null }));
    },
  };
}

export const authStore = createAuthStore();

// Store dérivés pour faciliter l'usage
export const user = derived(authStore, ($auth) => $auth.user);
export const isAuthenticated = derived(authStore, ($auth) => !!$auth.user);
export const isLoading = derived(authStore, ($auth) => $auth.loading);
```

### 🎨 **Étape 2.3 : Composants d'authentification**

**[FILE]** Créer `src/lib/components/auth/LoginForm.svelte` :

```svelte
<script lang="ts">
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth } from "$lib/firebase/config";
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";

  let loading = false;
  let error = "";

  async function loginWithGoogle() {
    if (!auth) return;

    loading = true;
    error = "";

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        // Redirection après connexion réussie
        goto("/dashboard");
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Erreur de connexion";
    } finally {
      loading = false;
    }
  }
</script>

<div class="login-form">
  <h2>Connexion à FunLearning</h2>

  {#if error}
    <div class="error" role="alert">
      {error}
    </div>
  {/if}

  <button
    type="button"
    class="google-btn"
    disabled={loading}
    on:click={loginWithGoogle}
  >
    {#if loading}
      <span class="spinner" />
      Connexion...
    {:else}
      <svg class="google-icon" viewBox="0 0 24 24">
        <!-- Google Icon SVG -->
      </svg>
      Se connecter avec Google
    {/if}
  </button>
</div>

<style>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .google-btn {
    width: 100%;
    padding: 12px 24px;
    border: 1px solid #dadce0;
    border-radius: 4px;
    background: white;
    color: #3c4043;
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.2s;
  }

  .google-btn:hover:not(:disabled) {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .google-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #b91c1c;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #4285f4;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
```

### 🛡️ **Étape 2.4 : Protection des routes**

**[FILE]** Créer `src/hooks.server.ts` :

```ts
import type { Handle } from "@sveltejs/kit";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialiser Firebase Admin (une seule fois)
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY || "{}");
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminAuth = getAuth();

export const handle: Handle = async ({ event, resolve }) => {
  // Récupérer le token de l'en-tête Authorization
  const authHeader = event.request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (token) {
    try {
      // Vérifier le token côté serveur
      const decodedToken = await adminAuth.verifyIdToken(token);
      event.locals.user = {
        id: decodedToken.uid,
        email: decodedToken.email || "",
        name: decodedToken.name || "",
      };
    } catch (error) {
      console.error("Token verification failed:", error);
      event.locals.user = undefined;
    }
  }

  return resolve(event);
};
```

**[FILE]** Créer `src/routes/dashboard/+layout.server.ts` :

```ts
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  // Rediriger vers login si non authentifié
  if (!locals.user) {
    throw redirect(302, "/auth/login");
  }

  return {
    user: locals.user,
  };
};
```

### 🎨 **Étape 2.5 : Pages d'authentification**

**[FILE]** Créer `src/routes/auth/login/+page.svelte` :

```svelte
<script lang="ts">
  import LoginForm from "$lib/components/auth/LoginForm.svelte";
  import { onMount } from "svelte";
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  onMount(() => {
    // Initialiser l'écoute de l'auth
    const unsubscribe = authStore.init();

    // Rediriger si déjà connecté
    const auth = get(authStore);
    if (auth.user) {
      goto("/dashboard");
    }

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Connexion - FunLearning</title>
</svelte:head>

<main>
  <LoginForm />
</main>
```

**[FILE]** Créer `src/routes/dashboard/+page.svelte` :

```svelte
<script lang="ts">
  import { authStore } from "$lib/stores/auth";
  import type { PageData } from "./$types";

  export let data: PageData;

  function handleLogout() {
    authStore.logout();
  }
</script>

<svelte:head>
  <title>Dashboard - FunLearning</title>
</svelte:head>

<div class="dashboard">
  <header>
    <h1>Bienvenue, {data.user.name} !</h1>
    <button on:click={handleLogout}>Déconnexion</button>
  </header>

  <main>
    <p>Vous êtes connecté avec succès à FunLearning.</p>
    <p>Email : {data.user.email}</p>
  </main>
</div>

<style>
  .dashboard {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  button {
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }
</style>
```

---

## 🧪 **Tests de Validation**

### 🔍 **Tests Obligatoires**

```bash
[TEST] npm run test:auth              # Tests store auth
[TEST] npm run test:e2e              # Tests E2E login/logout
[TEST] npm run build                 # Build sans erreur
[TEST] npm run validate 2            # Validation complète Phase 2
```

**[FILE]** Créer `src/lib/stores/auth.test.ts` :

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import { authStore } from "./auth";

// Mock Firebase
vi.mock("$lib/firebase/config", () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe("Auth Store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const state = get(authStore);
    expect(state.loading).toBe(true);
    expect(state.user).toBe(null);
    expect(state.error).toBe(null);
  });

  it("should handle logout", async () => {
    await authStore.logout();
    // Vérifier que signOut a été appelé
    expect(vi.mocked(auth.signOut)).toHaveBeenCalled();
  });
});
```

**[FILE]** Créer `tests/e2e/auth.spec.ts` :

```ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/auth/login");
  });

  test("should show login form", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("text=Se connecter avec Google")).toBeVisible();
  });
});
```

---

## ✅ **Critères de Validation Obligatoires**

- [x] **[CHECK]** Firebase configuré et fonctionnel ✅
- [x] **[CHECK]** Store d'authentification réactif ✅
- [x] **[CHECK]** Connexion Google OAuth opérationnelle ✅
- [ ] **[CHECK]** Protection des routes fonctionnelle
- [ ] **[CHECK]** Redirection automatique après login
- [ ] **[CHECK]** Déconnexion propre
- [ ] **[CHECK]** Tests d'authentification passent
- [ ] **[CHECK]** Pages /auth/login et /dashboard accessibles
- [x] **[CHECK]** ~~Email/Password auth~~ ABANDONNÉ - Focus OAuth uniquement ✅

---

## 🏷️ **Processus de Release v1.0**

```bash
[CMD] npm run validate 2              # Validation complète Phase 2
[CMD] git add . && git commit -m "feat: Phase 2 - Firebase Auth complete"
[CMD] git tag v1.0                   # Tag MVP
[CMD] npm run release:deploy         # Déploiement production
```

**🚫 STOP** : Ne pas passer à Phase 3 sans validation complète de Phase 2.

---

## 🔗 **Liens Vers Phase Suivante**

**Prochaine étape** : [📚 Phase 3 : Contenu & Markdown](phase-3-content.md)  
**Dépendance** : Phase 2 (Auth) validée ✅
