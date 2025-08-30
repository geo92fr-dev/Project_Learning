# 🔐 Phase 1 : Firebase & Authentification (1 semaine) - v1.0 MVP

## 🎯 Contexte IA
**Objectif** : Authentification Google OAuth avec popup moderne et protection des routes.
**Version cible** : v1.0 (MVP avec auth fonctionnelle)
**Pré-requis** : Phase 0 complétée, projet SvelteKit configuré

## 📚 Référence Modulaire
**[REF]** Toute l'implémentation est documentée dans : **[firebase-auth.md](../references/auth/firebase-auth.md)**

Cette référence contient :
- ✅ Configuration Firebase complète avec variables d'environnement
- ✅ Types TypeScript étendus et évolutifs
- ✅ Store d'authentification réactif avec persistance
- ✅ Composants de connexion/inscription avec gestion d'erreurs
- ✅ Protection des routes avec redirections automatiques
- ✅ Hooks et utilitaires pour l'intégration
- ✅ Tests unitaires et d'intégration complets
- ✅ Guide de déploiement et configuration production

## 🚀 Instructions d'implémentation

### Étape 1.1 : Configuration Firebase
```bash
[CMD] npm install firebase
[CMD] npm install -D @types/firebase
```

**[FILE]** Créer `.env.local` :
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Étape 1.2 : Store d'authentification
**[FILE]** Créer `src/lib/stores/auth.ts` :
```typescript
import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const authStore = writable<AuthState>({
  user: null,
  loading: true,
  error: null
});
```

### Étape 1.3 : Configuration Firebase
**[FILE]** Créer `src/lib/firebase/config.ts` selon la référence modulaire

### Étape 1.4 : Composants d'authentification
**[FILE]** Créer `src/lib/components/auth/LoginForm.svelte`
**[FILE]** Créer `src/lib/components/auth/SignupForm.svelte`

## 🧪 Tests de validation Phase 1

### Tests obligatoires
1. **[TEST]** `npm run test:auth` - Tests authentification passent
2. **[TEST]** `npm run test:e2e:auth` - Tests E2E auth passent
3. **[TEST]** `npm run build` - Build sans erreur
4. **[CHECK]** `npm run validate 1` - Validation complète Phase 1

### Critères de validation obligatoires
- ✅ Configuration Firebase opérationnelle
- ✅ Authentification Google fonctionnelle
- ✅ Protection des routes active
- ✅ Store d'authentification réactif
- ✅ Interface utilisateur accessible
- ✅ Tests de sécurité passants

**🚫 STOP** : Ne pas passer à Phase 2 sans validation complète de Phase 1.

---

**Phase 1 terminée** ✅ → Prête pour **Phase 2 : Contenu & Markdown**
