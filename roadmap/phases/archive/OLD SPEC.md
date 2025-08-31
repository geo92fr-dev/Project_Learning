# FunLearning - Roadmap IA-Optimisée 🤖



> **Approche IA-First** : Instructions granulaires, commandes précises, validation automatisée pour assistant Copilot.



---



## 🏷️ **Système de Versioning - Releases Progressives**



| Version | Phase(s) | Fonctionnalités | Status |

|---------|----------|-----------------|--------|

| **1.0** | P0 + P1 | Setup + Auth | 🎯 **Release MVP** |

| **1.1** | P2 | Contenu Markdown | 📚 Release Contenu |

| **1.2** | P2.5 | Pédagogie Avancée | 🧠 Release Pédagogique |

| **1.3** | P3 | Exercices & Progression | 🎮 Release Interactive |

| **1.4** | P4 | PWA & Offline | 📱 Release Mobile |

| **1.5** | P5 | Admin & Import | ⚙️ Release Pro |

| **2.0** | P6 | Polish & Performance | 🚀 **Release Production** |



### 🎯 **Stratégie de Release**

- **Versions mineures (1.x)** : Nouvelles fonctionnalités majeures par phase

- **Versions patch (1.x.y)** : Corrections de bugs et améliorations

- **Version majeure (2.0)** : Plateforme production-ready complète



### 📦 **Gestion des Releases**

```bash

# Process de release automatisé

[CMD] npm run release:prepare <version>  # Prépare la release

[CMD] npm run release:validate <version> # Valide tous les tests

[CMD] npm run release:deploy <version>   # Déploie et tag

```



### 🎯 **Jalons Critiques**

- **v1.0** 🎯 : Premier MVP public (Auth + Interface)

- **v1.2** 🧠 : Innovation pédagogique (Pré-éval + Métacognition)

- **v1.4** 📱 : Expérience mobile native (PWA)

- **v2.0** 🚀 : Solution production complète



---



## 🚀 **État Actuel du Projet - 30 Août 2025**



Le projet va démarrer du début. Toutes les phases précédentes sont réinitialisées.



### 🟢 **Prochaine étape : Phase 0**

**Initialisation complète du projet** :

- Création du projet SvelteKit

- Mise en place de l’architecture de base

- Aucun développement n’a encore été réalisé



---



## 📚 **Architecture Modulaire - Références Techniques**



> **⚡ Nouveau** : Architecture modulaire avec références séparées pour une meilleure maintenabilité.



### 🔗 **Index des Références**

Toutes les implémentations techniques sont désormais organisées en modules réutilisables :



| Module | Référence | Status | Description |

|--------|-----------|--------|-------------|

| **🔐 Auth** | [firebase-auth.md](roadmap/references/auth/firebase-auth.md) | ✅ | Authentification Firebase complète avec stores et composants |

| **📊 Data** | [content-types.md](roadmap/references/data/content-types.md) | ✅ | Types TypeScript + validation Zod pour contenu éducatif |

| **⚡ Realtime** | [realtime-system.md](roadmap/references/data/realtime-system.md) | ✅ | Cache intelligent + synchronisation temps réel |

| **🎨 UI Stores** | [reactive-stores.md](roadmap/references/ui/reactive-stores.md) | ✅ | Stores Svelte avec persistence et réactivité |

| **🧩 Components** | [component-patterns.md](roadmap/references/ui/component-patterns.md) | ✅ | Design system + composants réutilisables |

| **🧪 Testing** | [testing-strategy.md](roadmap/references/testing/testing-strategy.md) | ✅ | Stratégie complète (unit, intégration, E2E) |



### 📁 **Navigation Rapide**

- **[Index Central](roadmap/README.md)** - Navigation complète des références

- **[Guides d'implémentation](roadmap/implementations/)** - Guides par phase

- **[Troubleshooting](roadmap/guides/troubleshooting.md)** - Résolution de problèmes



### 🎯 **Utilisation**

1. **Consulter** l'index central : `roadmap/README.md`

2. **Choisir** la référence technique appropriée

3. **Implémenter** selon les patterns documentés

4. **Tester** avec les stratégies fournies



---



## 🎯 Guide d'utilisation avec Assistant IA



### 📋 Syntaxe des commandes

- **[CMD]** : Commande terminal à exécuter

- **[FILE]** : Fichier à créer/modifier avec chemin exact

- **[TEST]** : Test de validation à lancer

- **[CHECK]** : Point de contrôle obligatoire

- **[REF]** : Référence technique modulaire à consulter



### 🔄 Processus de validation

1. **Consulter** les références modulaires appropriées ([REF])

2. **Confirmer** chaque étape avant de passer à la suivante

3. **Copier-coller** les erreurs pour débogage assisté

4. **Valider** les tests avant progression



---



## 📅 Vue d'ensemble



| Phase | Durée | Objectif | Version | Validation |

|-------|-------|----------|---------|------------|

| **P0** | 3 jours | Setup & Architecture | **v1.0-alpha** | `npm run dev` + déploiement |

| **P1** | ✅ 1 semaine | Firebase & Auth Google | **v1.0** 🎯 | ✅ Tests auth passants |

| **P2** | ✅ 1 semaine | Contenu & Markdown + Interface Dynamique | **v1.1** 📚 | ✅ Affichage dynamique Firebase |

| **P2.5** | 3 jours | Pédagogie Avancée | **v1.2** 🧠 | Pré-éval + Métacognition + Ressources |

| **P3** | 1 semaine | Exercices & Progression | **v1.3** 🎮 | QCM interactifs OK |

| **P4** | 1 semaine | PWA & Offline | **v1.4** 📱 | App installable |

| **P5** | 1 semaine | Admin & Import | **v1.5** ⚙️ | Interface admin fonctionnelle |

| **P6** | 1 semaine | Polish & Performance | **v2.0** 🚀 | Lighthouse > 90 |



---



## 🚀 Phase 0 : Setup & Architecture (3 jours) - v1.0-alpha



### 🎯 Contexte IA

**Objectif** : Initialiser un projet SvelteKit avec TypeScript, tests, et déploiement automatique.

**Version cible** : v1.0-alpha (base technique)

**Pré-requis** : Node.js 18+, Git configuré, compte Vercel.



### 📝 Instructions granulaires



#### Étape 0.1 : Initialisation SvelteKit

```bash

[CMD] npm create svelte@latest funlearning -- --template skeleton --types typescript

[CMD] cd funlearning

[CMD] npm install

```



**[CHECK]** Confirmer que le projet démarre avec `npm run dev` sur http://localhost:5173



#### Étape 0.2 : Structure de dossiers

```bash

[CMD] mkdir -p src/lib/components src/lib/stores src/lib/utils src/lib/firebase

[CMD] mkdir -p src/routes/auth src/routes/admin src/routes/dashboard

[CMD] mkdir -p tests/unit tests/e2e static/icons

```



**[FILE]** Créer `src/lib/index.js` :

```js

// Exports centralisés

export { default as Header } from './components/Header.svelte';

export { default as Footer } from './components/Footer.svelte';

```



#### Étape 0.3 : Configuration développement centralisée

```bash

[CMD] npm install -D vitest @vitest/ui jsdom @testing-library/svelte @testing-library/jest-dom

[CMD] mkdir -p config

```



**[FILE]** Créer `config/vitest.config.js` :

```js

import { sveltekit } from '@sveltejs/kit/vite';

import { defineConfig } from 'vitest/config';



export default defineConfig({

  plugins: [sveltekit()],

  test: {

    include: ['src/**/*.{test,spec}.{js,ts}'],

    environment: 'jsdom',

    setupFiles: ['./src/test-setup.js'],

    coverage: {

      reporter: ['text', 'html', 'lcov'],

      exclude: ['node_modules/', 'src/test-setup.js']

    }

  }

});

```



**[FILE]** Créer `config/.eslintrc.cjs` :

```js

module.exports = {

  root: true,

  extends: [

    'eslint:recommended',

    '@typescript-eslint/recommended',

    'plugin:svelte/recommended'

  ],

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint'],

  parserOptions: {

    sourceType: 'module',

    ecmaVersion: 2020,

    extraFileExtensions: ['.svelte']

  },

  env: {

    browser: true,

    es2017: true,

    node: true

  },

  overrides: [

    {

      files: ['*.svelte'],

      parser: 'svelte-eslint-parser',

      parserOptions: {

        parser: '@typescript-eslint/parser'

      }

    }

  ],

  rules: {

    // Règles strictes pour la qualité

    '@typescript-eslint/no-unused-vars': 'error',

    '@typescript-eslint/explicit-function-return-type': 'warn',

    'svelte/no-at-html-tags': 'error',

    'svelte/accessibility-label-has-associated-control': 'error',

    'svelte/accessibility-missing-attribute': 'error'

  }

};

```



**[FILE]** Créer `config/.prettierrc` :

```json

{

  "useTabs": false,

  "singleQuote": true,

  "trailingComma": "es5",

  "printWidth": 100,

  "plugins": ["prettier-plugin-svelte"],

  "overrides": [

    { 

      "files": "*.svelte", 

      "options": { 

        "parser": "svelte",

        "svelteStrictMode": true,

        "svelteAllowShorthand": false

      } 

    }

  ]

}

```



**[FILE]** Modifier `package.json` pour pointer vers les configs :

```json

{

  "scripts": {

    "dev": "vite dev",

    "build": "vite build",

    "preview": "vite preview",

    "test": "vitest --config config/vitest.config.js",

    "test:ui": "vitest --ui --config config/vitest.config.js",

    "test:e2e": "playwright test",

    "lint": "eslint --config config/.eslintrc.cjs .",

    "format": "prettier --config config/.prettierrc --write .",

    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",

    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",

    "validate": "node scripts/validate-phase.js"

  }

}

```



#### Étape 0.4 : Hooks de sécurité SvelteKit



**[FILE]** Créer `src/hooks.server.ts` pour la protection serveur :

```ts

import type { Handle } from '@sveltejs/kit';

import { adminAuth } from '$lib/firebase/admin';



const protectedRoutes = ['/dashboard', '/admin', '/cours'];



export const handle: Handle = async ({ event, resolve }) => {

  const { url, cookies } = event;

  

  // Vérifier si la route nécessite une authentification

  const isProtectedRoute = protectedRoutes.some(route => 

    url.pathname.startsWith(route)

  );

  

  if (isProtectedRoute) {

    const sessionCookie = cookies.get('session');

    

    if (!sessionCookie) {

      return new Response(null, {

        status: 302,

        headers: { Location: '/auth/login' }

      });

    }

    

    try {

      // Vérifier le token côté serveur

      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);

      event.locals.user = {

        uid: decodedToken.uid,

        email: decodedToken.email,

        role: decodedToken.role || 'student'

      };

    } catch (error) {

      console.error('Session invalide:', error);

      cookies.delete('session');

      return new Response(null, {

        status: 302,

        headers: { Location: '/auth/login' }

      });

    }

  }

  

  return resolve(event);

};

```



**[FILE]** Créer `src/lib/firebase/admin.ts` :

```ts

import { getAuth } from 'firebase-admin/auth';

import { initializeApp, getApps, cert } from 'firebase-admin/app';

import { FIREBASE_ADMIN_SDK_KEY } from '$env/static/private';



// Initialiser Firebase Admin si pas déjà fait

if (!getApps().length) {

  initializeApp({

    credential: cert(JSON.parse(FIREBASE_ADMIN_SDK_KEY))

  });

}



export const adminAuth = getAuth();

```



**[FILE]** Créer `src/app.d.ts` pour typer les locals :

```ts

declare global {

  namespace App {

    interface Error {}

    interface Locals {

      user?: {

        uid: string;

        email: string | null;

        role: string;

      };

    }

    interface PageData {}

    interface Platform {}

  }

}



export {};

```



#### Étape 0.5 : Configuration Playwright

```bash

[CMD] npm install -D @playwright/test

[CMD] npx playwright install

```



**[FILE]** Créer `playwright.config.ts` :

```ts

import { defineConfig, devices } from '@playwright/test';



export default defineConfig({

  testDir: './tests/e2e',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {

    baseURL: 'http://localhost:5173',

    trace: 'on-first-retry',

  },

  projects: [

    {

      name: 'chromium',

      use: { ...devices['Desktop Chrome'] },

    },

  ],

  webServer: {

    command: 'npm run build && npm run preview',

    port: 5173,

  },

});

```



#### Étape 0.6 : Script de validation centralisé

```bash

[CMD] mkdir scripts

```



**[FILE]** Créer `scripts/validate-phase.js` - script unique avec paramètre :

```js

import { exec } from 'child_process';

import { promisify } from 'util';

import { readFileSync } from 'fs';



const execAsync = promisify(exec);



const PHASE_VALIDATIONS = {

  '0': ['lint', 'build', 'test'],

  '1': ['lint', 'build', 'test', 'test:auth'],

  '2': ['lint', 'build', 'test', 'test:content', 'test:security'],

  '3': ['lint', 'build', 'test', 'test:exercises', 'test:performance'],

  '4': ['lint', 'build', 'test', 'test:pwa', 'test:offline'],

  '5': ['lint', 'build', 'test', 'test:admin', 'test:e2e'],

  '6': ['lint', 'build', 'test', 'test:e2e', 'test:lighthouse']

};



async function runCommand(command, description) {

  console.log(`🔍 ${description}...`);

  try {

    const { stdout } = await execAsync(`npm run ${command}`);

    console.log(`✅ ${description} réussi`);

    return true;

  } catch (error) {

    console.error(`❌ ${description} échoué:`, error.message);

    return false;

  }

}



async function validatePhase(phase) {

  console.log(`🚀 Validation Phase ${phase} - FunLearning V1.0`);

  console.log('='.repeat(50));

  

  const validations = PHASE_VALIDATIONS[phase];

  if (!validations) {

    console.error(`❌ Phase ${phase} non reconnue`);

    process.exit(1);

  }

  

  let success = true;

  

  for (const validation of validations) {

    const result = await runCommand(validation, validation.replace(':', ' '));

    if (!result) success = false;

  }

  

  if (success) {

    console.log(`🎉 Phase ${phase} validée avec succès !`);

    console.log(`📊 ${validations.length} vérifications passées`);

  } else {

    console.error(`💥 Phase ${phase} a échoué`);

    process.exit(1);

  }

}



const phase = process.argv[2] || '0';

validatePhase(phase);

```



#### Étape 0.7 : Configuration package.json

**[FILE]** Modifier complètement `package.json` section scripts avec configurations centralisées :

```json

{

  "scripts": {

    "dev": "vite dev",

    "build": "vite build",

    "preview": "vite preview",

    "test": "vitest --config config/vitest.config.js",

    "test:ui": "vitest --ui --config config/vitest.config.js",

    "test:e2e": "playwright test",

    "test:auth": "vitest --config config/vitest.config.js src/lib/auth",

    "test:content": "vitest --config config/vitest.config.js src/lib/content",

    "test:exercises": "vitest --config config/vitest.config.js src/lib/exercises",

    "test:pwa": "vitest --config config/vitest.config.js src/lib/pwa",

    "test:offline": "vitest --config config/vitest.config.js src/lib/offline",

    "test:admin": "vitest --config config/vitest.config.js src/lib/admin",

    "test:security": "vitest --config config/vitest.config.js src/lib/security",

    "test:performance": "lighthouse http://localhost:5173 --output html --output-path ./reports/lighthouse.html",

    "test:lighthouse": "npm run test:performance",

    "lint": "eslint --config config/.eslintrc.cjs .",

    "format": "prettier --config config/.prettierrc --write .",

    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",

    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",

    "validate": "node scripts/validate-phase.js",

    "release:prepare": "node scripts/prepare-release.js",

    "release:validate": "node scripts/validate-release.js", 

    "release:deploy": "node scripts/deploy-release.js",

    "version:bump": "npm version"

  }

}

```



#### Étape 0.8 : Test de base avec setup

**[FILE]** Créer `src/test-setup.js` :

```js

import '@testing-library/jest-dom';



// Configuration globale pour les tests

global.ResizeObserver = class ResizeObserver {

  constructor(cb) {

    this.cb = cb;

  }

  observe() {}

  unobserve() {}

  disconnect() {}

};



// Mock des APIs du navigateur

Object.defineProperty(window, 'matchMedia', {

  writable: true,

  value: vi.fn().mockImplementation(query => ({

    matches: false,

    media: query,

    onchange: null,

    addListener: vi.fn(),

    removeListener: vi.fn(),

    addEventListener: vi.fn(),

    removeEventListener: vi.fn(),

    dispatchEvent: vi.fn(),

  })),

});

```



**[FILE]** Créer `src/lib/utils/helpers.test.ts` :

```ts

import { describe, it, expect } from 'vitest';



// Fonction utilitaire simple pour tester

export function formatDate(date: Date): string {

  return date.toLocaleDateString('fr-FR');

}



describe('helpers', () => {

  it('should format date correctly', () => {

    const date = new Date('2024-01-15');

    expect(formatDate(date)).toBe('15/01/2024');

  });

});

```



#### Étape 0.8 : Test E2E de base

**[FILE]** Créer `tests/e2e/basic.spec.ts` :

```ts

import { test, expect } from '@playwright/test';



test('homepage loads correctly', async ({ page }) => {

  await page.goto('/');

  await expect(page).toHaveTitle(/Welcome to SvelteKit/);

  await expect(page.locator('h1')).toBeVisible();

});

```



#### Étape 0.9 : Configuration Vercel

**[FILE]** Créer `vercel.json` :

```json

{

  "buildCommand": "npm run build",

  "outputDirectory": "build",

  "framework": "sveltekit"

}

```



**[CMD]** Installer Vercel CLI et déployer :

```bash

[CMD] npm install -g vercel

[CMD] vercel --prod

```



#### Étape 0.10 : Documentation

**[FILE]** Créer `README.md` :

```md

# FunLearning V1.0



## Installation

```bash

npm install

npm run dev

```



## Tests

```bash

npm run test        # Tests unitaires

npm run test:e2e    # Tests E2E

npm run lint        # Linting

```



## Déploiement

```bash

npm run build

vercel --prod

```

```



### 🧪 Tests de validation Phase 0

```bash

[TEST] npm run test          # Tous tests passent

[TEST] npm run lint          # Aucune erreur

[TEST] npm run build         # Build réussi

[TEST] npm run test:e2e      # E2E passent

```



### ✅ Critères de validation obligatoires

- [ ] **[CHECK]** `npm run dev` démarre sur localhost:5173

- [ ] **[CHECK]** `npm run test` : 1+ test passe

- [ ] **[CHECK]** `npm run lint` : 0 erreur

- [ ] **[CHECK]** `npm run build` : succès

- [ ] **[CHECK]** Déploiement Vercel accessible

- [ ] **[CHECK]** Test E2E passe



**🚫 STOP** : Ne pas passer à Phase 1 sans validation complète de Phase 0.



### 🏷️ **Processus de Release v1.0-alpha**

1. **[CMD]** `npm run validate -- 0` - Validation complète Phase 0

2. **[CMD]** `git tag v1.0-alpha` - Tag de version

3. **[CMD]** `vercel --prod` - Déploiement production

4. **[CHECK]** URL publique accessible et fonctionnelle



---



## 🔐 Phase 1 : Firebase & Authentification ✅ COMPLÈTE - v1.0 MVP

*Durée réelle : 1 semaine - Migration Google Auth*



### 🎯 Contexte IA

**Objectif** : ✅ Authentification Google OAuth avec popup moderne et protection des routes.

**Version cible** : v1.0 (MVP avec auth fonctionnelle)

**Résultat** : ✅ Système d'authentification simplifié et sécurisé opérationnel.



### 📚 **Référence Modulaire**

**[REF]** Toute l'implémentation est documentée dans : **[firebase-auth.md](roadmap/references/auth/firebase-auth.md)**



Cette référence contient :

- ✅ Configuration Firebase complète avec variables d'environnement

- ✅ Types TypeScript étendus et évolutifs

- ✅ Store d'authentification réactif avec persistance

- ✅ Composants de connexion/inscription avec gestion d'erreurs

- ✅ Protection des routes avec redirections automatiques

- ✅ Hooks et utilitaires pour l'intégration

- ✅ Tests unitaires et d'intégration complets

- ✅ Guide de déploiement et configuration production



### 🚀 **Instructions d'implémentation**

1. **[REF]** Consulter [firebase-auth.md](roadmap/references/auth/firebase-auth.md) pour l'implémentation complète

2. **[CMD]** Suivre les commandes de configuration Firebase

3. **[FILE]** Créer les fichiers selon la structure documentée

4. **[TEST]** Exécuter les tests de validation fournis



### ✅ **Validation Phase 1**

```bash

[TEST] npm run test:auth           # Tests authentification passent

[TEST] npm run test:e2e:auth      # Tests E2E auth passent

[TEST] npm run build              # Build sans erreur

[CHECK] npm run validate 1        # Validation complète Phase 1

```



### 🎯 **Critères de validation obligatoires**

- [ ] **[CHECK]** Configuration Firebase opérationnelle

- [ ] **[CHECK]** Authentification Google fonctionnelle

- [ ] **[CHECK]** Protection des routes active

- [ ] **[CHECK]** Store d'authentification réactif

- [ ] **[CHECK]** Interface utilisateur accessible

- [ ] **[CHECK]** Tests de sécurité passants



---



## 📚 Phase 2 : Contenu & Markdown (1 semaine) - v1.1



### 🎯 Contexte IA

**Objectif** : Système de contenu Markdown avec conversion HTML sécurisée et routes dynamiques.

**Version cible** : v1.1 (plateforme de contenu fonctionnelle)

**Pré-requis** : Firebase configuré, auth fonctionnelle.



### 📚 **Références Modulaires**



#### **[REF]** Gestion des données : **[content-types.md](roadmap/references/data/content-types.md)**

- ✅ Types TypeScript pour contenu éducatif

- ✅ Validation Zod et système de migration

- ✅ Structure évolutive pour compétences et cours

- ✅ Interfaces pour exercices et progression



#### **[REF]** Système temps réel : **[realtime-system.md](roadmap/references/data/realtime-system.md)**

- ✅ Cache intelligent avec TTL et invalidation

- ✅ RealtimeDataManager pour Firestore

- ✅ Stores réactifs avec cleanup automatique

- ✅ Optimisations de performance



#### **[REF]** Composants UI : **[component-patterns.md](roadmap/references/ui/component-patterns.md)**

- ✅ Design system avec tokens CSS

- ✅ Composants de base (Button, Card, Input, Modal)

- ✅ Composants spécialisés pour l'apprentissage

- ✅ Patterns d'accessibilité et responsive



#### **[REF]** Stores réactifs : **[reactive-stores.md](roadmap/references/ui/reactive-stores.md)**

- ✅ Stores persistants avec localStorage

- ✅ Gestion des préférences utilisateur

- ✅ Progression d'apprentissage

- ✅ Système de notifications



### 🚀 **Instructions d'implémentation**

1. **[REF]** Consulter les références modulaires appropriées

2. **[CMD]** Implémenter selon les patterns documentés

3. **[FILE]** Créer les fichiers selon les structures définies

4. **[TEST]** Utiliser les stratégies de test fournies



### ✅ **Validation Phase 2**

```bash

[TEST] npm run test:content          # Tests contenu passent

[TEST] npm run test:ui              # Tests composants passent

[TEST] npm run test:stores          # Tests stores passent

[CHECK] npm run validate 2          # Validation complète Phase 2

```



### 🎯 **Critères de validation obligatoires**

- [ ] **[CHECK]** Contenu Markdown affiché dynamiquement

- [ ] **[CHECK]** Interface responsive et accessible

- [ ] **[CHECK]** Système de navigation fonctionnel

- [ ] **[CHECK]** Stores réactifs opérationnels

- [ ] **[CHECK]** Cache et synchronisation temps réel

- [ ] **[CHECK]** Types TypeScript validés



---



## 🧠 Phase 2.5 : Pédagogie Avancée (3 jours) - v1.2



### 🎯 Contexte IA

**Objectif** : Innovation pédagogique avec pré-évaluation, métacognition et ressources adaptatives.

**Version cible** : v1.2 (plateforme pédagogique innovante)

**Pré-requis** : Phase 2 validée, interface dynamique opérationnelle.



### 📚 **Références Modulaires**



#### **[REF]** Tests et validation : **[testing-strategy.md](roadmap/references/testing/testing-strategy.md)**

- ✅ Stratégie complète (unit, intégration, E2E)

- ✅ Configuration Vitest + Testing Library + Playwright

- ✅ Tests Firebase et mocks avancés

- ✅ CI/CD avec GitHub Actions

- ✅ Tests de performance et bundle size



#### **[REF]** Stores réactifs avancés : **[reactive-stores.md](roadmap/references/ui/reactive-stores.md)**

- ✅ Progression d'apprentissage avec adaptation

- ✅ Système de préférences pédagogiques

- ✅ Notifications intelligentes

- ✅ Hooks personnalisés pour composants



### 🚀 **Instructions d'implémentation**

1. **[REF]** Implémenter les features pédagogiques avancées

2. **[CMD]** Intégrer système d'évaluation adaptatif

3. **[FILE]** Créer modules de métacognition

4. **[TEST]** Valider innovations pédagogiques



### ✅ **Validation Phase 2.5**

```bash

[TEST] npm run test:pedagogy        # Tests pédagogie passent

[TEST] npm run test:adaptive        # Tests adaptatifs passent

[CHECK] npm run validate 2.5        # Validation complète Phase 2.5

```



### 🎯 **Critères de validation obligatoires**

- [ ] **[CHECK]** Système de pré-évaluation fonctionnel

- [ ] **[CHECK]** Module de métacognition intégré

- [ ] **[CHECK]** Ressources adaptatives opérationnelles

- [ ] **[CHECK]** Progression personnalisée active

  [key: string]: boolean; // Extensibilité future

}



export interface DataStructureConfig {

  version: string;

  supportedMigrations: string[];

  customFields: CustomFieldDefinition[];

  validationRules: ValidationRule[];

  cachingStrategy: CachingStrategy;

}



export interface CustomFieldDefinition {

  id: string;

  name: string;

  type: 'string' | 'number' | 'boolean' | 'date' | 'reference' | 'array' | 'object';

  entityTypes: string[]; // competences, courses, etc.

  required: boolean;

  defaultValue?: any;

  validationSchema?: any;

  metadata: {

    description: string;

    version: string;

    addedIn: string;

  };

}



export interface ValidationRule {

  id: string;

  field: string;

  entityType: string;

  rule: 'required' | 'min' | 'max' | 'pattern' | 'custom';

  parameters: Record<string, any>;

  errorMessage: string;

  active: boolean;

}



export interface CachingStrategy {

  defaultTTL: number;

  specificTTLs: Record<string, number>;

  invalidationRules: InvalidationRule[];

  compressionEnabled: boolean;

}



export interface InvalidationRule {

  trigger: 'update' | 'delete' | 'time' | 'dependency';

  target: string;

  pattern?: string;

  cascadeRules?: string[];

}



// ============= CONFIGURATION UI =============



export interface UIConfiguration {

  theme: ThemeConfiguration;

  layout: LayoutConfiguration;

  accessibility: AccessibilityConfiguration;

  responsive: ResponsiveConfiguration;

  customizations: UICustomization[];

}



export interface ThemeConfiguration {

  primaryColors: ColorPalette;

  secondaryColors: ColorPalette;

  semanticColors: SemanticColors;

  typography: TypographyConfiguration;

  spacing: SpacingConfiguration;

  animations: AnimationConfiguration;

}



export interface ColorPalette {

  50: string;

  100: string;

  200: string;

  300: string;

  400: string;

  500: string;

  600: string;

  700: string;

  800: string;

  900: string;

}



export interface SemanticColors {

  success: ColorPalette;

  warning: ColorPalette;

  error: ColorPalette;

  info: ColorPalette;

  neutral: ColorPalette;

}



export interface TypographyConfiguration {

  fontFamilies: {

    sans: string[];

    serif: string[];

    mono: string[];

  };

  fontSizes: Record<string, string>;

  fontWeights: Record<string, number>;

  lineHeights: Record<string, number>;

}



export interface SpacingConfiguration {

  unit: number;

  scale: number[];

  breakpoints: Record<string, string>;

}



export interface AnimationConfiguration {

  durations: Record<string, string>;

  easings: Record<string, string>;

  reducedMotion: boolean;

}



// ============= PERFORMANCE & MONITORING =============



export interface PerformanceConfig {

  caching: CachingConfig;

  optimization: OptimizationConfig;

  monitoring: MonitoringConfig;

  limits: PerformanceLimits;

}



export interface CachingConfig {

  strategy: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';

  maxSize: number;

  ttlDefault: number;

  compressionEnabled: boolean;

  prefetchStrategies: PrefetchStrategy[];

}



export interface PrefetchStrategy {

  trigger: 'navigation' | 'idle' | 'interaction' | 'time';

  targets: string[];

  priority: 'low' | 'normal' | 'high';

  conditions?: Record<string, any>;

}



export interface OptimizationConfig {

  lazyLoading: {

    images: boolean;

    components: boolean;

    routes: boolean;

  };

  bundleOptimization: {

    codesplitting: boolean;

    treeshaking: boolean;

    minification: boolean;

  };

  resourceOptimization: {

    imageCompression: boolean;

    fontOptimization: boolean;

    cssOptimization: boolean;

  };

}



export interface MonitoringConfig {

  analytics: AnalyticsConfig;

  errorTracking: ErrorTrackingConfig;

  performanceMetrics: PerformanceMetricsConfig;

  userBehavior: UserBehaviorConfig;

}



export interface AnalyticsConfig {

  provider: 'google' | 'plausible' | 'matomo' | 'custom';

  trackingId?: string;

  customEvents: CustomEventDefinition[];

  privacyMode: boolean;

}



export interface CustomEventDefinition {

  name: string;

  category: string;

  parameters: Record<string, string>;

  conditions?: Record<string, any>;

}



// ============= DONNÉES DE RÉFÉRENCE ÉTENDUES =============



export interface ExtendedNiveauEducatif extends BaseEntity {

  nom: string;

  code: string;

  ordre: number;

  cycleId?: string;

  ageMin?: number;

  ageMax?: number;

  description?: string;

  competencesTransversales?: string[];

  couleur?: string;

  icone?: string;

  configuration: NiveauConfiguration;

}



export interface NiveauConfiguration {

  evaluationMode: 'continue' | 'periodique' | 'finale';

  notationSystem: 'competences' | 'notes' | 'mixte';

  difficulteDefault: string;

  dureeSessionRecommandee: number;

  objectifsSeuils: {

    acquisition: number;

    maitrise: number;

    expertise: number;

  };

}



export interface ExtendedMatiere extends BaseEntity {

  nom: string;

  code: string;

  couleur: string;

  icone: string;

  description?: string;

  domaineId?: string;

  niveauxCompatibles: string[];

  prerequisGeneraux?: string[];

  ressourcesExterne?: RessourceExterne[];

  configuration: MatiereConfiguration;

}



export interface MatiereConfiguration {

  typeEvaluations: TypeEvaluation[];

  modalitesPedagogiques: ModalitePedagogique[];

  competencesTransversales: string[];

  outilsRecommandes: OutilRecommande[];

  adaptationDifficulte: AdaptationDifficulte;

}



export interface TypeEvaluation {

  id: string;

  nom: string;

  description: string;

  format: 'qcm' | 'texte' | 'numerique' | 'production' | 'oral';

  dureeTypique: number;

  critereEvaluation: CritereEvaluation[];

}



export interface ModalitePedagogique {

  id: string;

  nom: string;

  description: string;

  type: 'individuel' | 'collectif' | 'autonome' | 'guide';

  ressourcesNecessaires: string[];

  dureeTypique: number;

}



export interface OutilRecommande {

  nom: string;

  type: 'logiciel' | 'ressource' | 'manuel' | 'site';

  url?: string;

  description: string;

  niveauxCibles: string[];

}



export interface AdaptationDifficulte {

  algorithme: 'lineaire' | 'adaptatif' | 'personalise';

  facteurs: FacteurAdaptation[];

  seuilsProgression: Record<string, number>;

}



export interface FacteurAdaptation {

  nom: string;

  poids: number;

  type: 'performance' | 'temps' | 'erreurs' | 'engagement';

  mesure: string;

}



// ============= GESTION AVANCÉE DES UTILISATEURS =============



export interface ExtendedUserProfile extends BaseEntity {

  authId: string;

  email: string;

  displayName: string;

  avatar?: string;

  role: UserRole;

  preferences: UserPreferences;

  progression: UserProgression;

  statistiques: UserStatistiques;

  parametres: UserParametres;

  abonnement?: AbonnementInfo;

}



export interface UserRole {

  type: 'eleve' | 'enseignant' | 'parent' | 'administrateur';

  permissions: Permission[];

  restrictions?: Restriction[];

  niveauAcces: number;

}



export interface Permission {

  ressource: string;

  actions: ('read' | 'write' | 'delete' | 'share' | 'admin')[];

  conditions?: Record<string, any>;

}



export interface Restriction {

  type: 'temps' | 'contenu' | 'fonctionnalite';

  parametres: Record<string, any>;

  actif: boolean;

}



export interface UserPreferences {

  theme: 'auto' | 'light' | 'dark';

  langue: string;

  notifications: NotificationPreferences;

  affichage: AffichagePreferences;

  accessibilite: AccessibilitePreferences;

  pedagogie: PedagogiePreferences;

}



export interface NotificationPreferences {

  email: boolean;

  push: boolean;

  types: Record<string, boolean>;

  frequence: 'immediate' | 'quotidienne' | 'hebdomadaire';

  horaires?: PlageHoraire[];

}



export interface PlageHoraire {

  debut: string;

  fin: string;

  jours: number[];

}



export interface PedagogiePreferences {

  styleApprentissage: 'visuel' | 'auditif' | 'kinesthesique' | 'mixte';

  rythmePreference: 'lent' | 'normal' | 'rapide';

  typeExercicesPreference: string[];

  niveauDefiPreference: 'facile' | 'modere' | 'difficile' | 'adaptatif';

  objectifsPersonnels: ObjectifPersonnel[];

}



export interface ObjectifPersonnel {

  id: string;

  nom: string;

  description: string;

  matiereId?: string;

  competenceIds: string[];

  echeance?: string;

  progres: number;

  actif: boolean;

}