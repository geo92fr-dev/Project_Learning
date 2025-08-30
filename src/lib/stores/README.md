# 🏪 Stores - FunLearning

> **Phase 1** - Stores Svelte réactifs pour la gestion d'état

## 📁 Structure

```
stores/
├── README.md    # Ce fichier
└── auth.ts      # Store d'authentification principal
```

## 🎯 Stores Disponibles

### 🔐 **auth.ts**

**Criticité:** HIGH  
**Dépendances:** `../firebase.js`, `firebase/auth`, `svelte/store`  
**Description:** Store réactif pour l'authentification Firebase avec TypeScript  
**Phase:** 1  
**Catégorie:** auth

#### 📊 **Interface TypeScript**

```typescript
interface AuthState {
  user: User | null; // Utilisateur Firebase ou null
  loading: boolean; // État de chargement
  error: string | null; // Message d'erreur
}
```

#### ⚡ **Méthodes Disponibles**

- **`subscribe`** - Souscription aux changements d'état
- **`init()`** - Initialisation avec surveillance Firebase
- **`signInWithGoogle()`** - Connexion Google OAuth
- **`signOut()`** - Déconnexion utilisateur
- **`clearError()`** - Effacement des erreurs

#### 🔌 **Usage**

```typescript
import { authStore } from "$lib/stores/auth";

// Réactivité automatique
$: ({ user, loading, error } = $authStore);

// Initialisation (à faire une seule fois)
onMount(() => {
  authStore.init();
});

// Actions
await authStore.signInWithGoogle();
await authStore.signOut();
authStore.clearError();
```

#### 🔒 **Sécurité**

- ✅ Types stricts TypeScript
- ✅ Gestion d'erreurs robuste
- ✅ État initial sécurisé (user: null)
- ✅ Validation des paramètres

#### 🧪 **Tests**

- **Fichier:** `tests/unit/auth.critical.test.js`
- **Coverage:** Initialisation, méthodes, sécurité
- **Type:** Tests critiques (bloquants)

#### 🔄 **États Réactifs**

```typescript
// État initial
{ user: null, loading: true, error: null }

// Connexion en cours
{ user: null, loading: true, error: null }

// Connecté
{ user: FirebaseUser, loading: false, error: null }

// Erreur
{ user: null, loading: false, error: "Message d'erreur" }
```

---

## 🚀 Prochaines Étapes (Phase 2)

- **content.ts** - Store pour le contenu pédagogique
- **progress.ts** - Store pour la progression utilisateur
- **settings.ts** - Store pour les préférences
- **offline.ts** - Store pour le mode hors ligne

---

**📝 Dernière mise à jour:** 30/08/2025 - Phase 1 Complete
