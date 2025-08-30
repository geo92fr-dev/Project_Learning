# 📁 Source Code Architecture - FunLearning V1.0

_🤖 Généré automatiquement le 2025-08-30_

## 🎯 Vue d'Ensemble

Structure du code source organisée par domaines fonctionnels

## 📋 Inventaire par Criticité

### 🚨 FICHIERS CRITIQUES - Modifications avec EXTRÊME PRÉCAUTION

| Fichier                                | Rôle                                                                       | Phase    | Dépendances |
| -------------------------------------- | -------------------------------------------------------------------------- | -------- | ----------- |
| `app.html`                             | Module app                                                                 | PUnknown | 0 deps      |
| `lib\components\auth\LoginForm.svelte` | Interface de connexion Google OAuth avec gestion d'erreurs complète        | P1       | 2 deps      |
| `lib\firebase.js`                      | Configuration Firebase production avec services Auth, Firestore, Analytics | P1       | 0 deps      |
| `lib\stores\auth.js`                   | Store Svelte auth                                                          | PUnknown | 1 deps      |
| `lib\stores\auth.ts`                   | Store réactif pour l'authentification Firebase avec TypeScript strict      | P1       | 1 deps      |
| `routes\auth\+page.svelte`             | Route +page                                                                | PUnknown | 3 deps      |

### ⚠️ FICHIERS IMPORTANTS - Modifications avec PRÉCAUTION

| Fichier                         | Rôle         | Phase    | Catégorie |
| ------------------------------- | ------------ | -------- | --------- |
| `lib\index.js`                  | Module index | PUnknown | general   |
| `routes\+page.svelte`           | Route +page  | PUnknown | routing   |
| `routes\dashboard\+page.svelte` | Route +page  | PUnknown | routing   |

### ✅ FICHIERS STANDARD - Modifications Normales

| Fichier | Rôle | Catégorie |
| ------- | ---- | --------- |

## 🔗 Matrice des Dépendances

### Fichiers avec le Plus de Dépendances

- **+page.svelte** (3 deps): $lib/components/auth/LoginForm.svelte, $lib/stores/auth, $app/navigation
- **LoginForm.svelte** (2 deps): ../../stores/auth, ../../firebase.js
- **+page.svelte** (2 deps): $lib/stores/auth, $app/navigation
- **auth.js** (1 deps): ../firebase.js
- **auth.ts** (1 deps): ../firebase.js

## 📏 Guidelines de Modification

### 🚨 Avant de Modifier un Fichier CRITIQUE :

1. **Lire la documentation** complète du composant
2. **Créer des tests** qui reproduisent le comportement actuel
3. **Planifier les tests** de non-régression
4. **Prévoir rollback** en cas de problème
5. **Tester dans environnement** isolé d'abord

### ⚠️ Pour les Fichiers IMPORTANTS :

1. **Tests unitaires** avant modification
2. **Validation manuelle** des flows impactés
3. **Review** par second développeur si possible

### ✅ Pour les Fichiers STANDARD :

1. **Tests appropriés** selon la complexité
2. **Validation automatique** suffisante

## 📊 Statistiques du Code

- **Total fichiers**: 9
- **Fichiers critiques**: 6
- **Fichiers importants**: 3
- **Fichiers standard**: 0

---

_Mise à jour automatique via `npm run docs:generate`_
