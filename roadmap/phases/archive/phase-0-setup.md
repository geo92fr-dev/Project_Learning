# 🚀 Phase 0 : Setup & Architecture (3 jours) - v1.0-alpha

## 🎯 Contexte IA

**Objectif** : Initialiser un projet SvelteKit avec TypeScript, tests, et déploiement automatique.
**Version cible** : v1.0-alpha (base technique)
**Pré-requis** : Node.js 18+, Git configuré, compte Vercel.

## 📝 Instructions granulaires

### Étape 0.1 : Initialisation SvelteKit

```bash
[CMD] npm create svelte@latest funlearning -- --template skeleton --types typescript
[CMD] cd funlearning
[CMD] npm install
```

**[CHECK]** Confirmer que le projet démarre avec `npm run dev` sur http://localhost:5173

### Étape 0.2 : Structure de dossiers

```bash
[CMD] mkdir -p src/lib/components src/lib/stores src/lib/utils src/lib/firebase
[CMD] mkdir -p src/routes/auth src/routes/admin src/routes/dashboard
[CMD] mkdir -p tests/unit tests/e2e static/icons
[CMD] mkdir -p config scripts
```

**[FILE]** Créer `src/lib/index.js` :

```js
// Exports centralisés
export { default as Header } from "./components/Header.svelte";
export { default as Footer } from "./components/Footer.svelte";
```

### Étape 0.3 : Configuration développement centralisée

```bash
[CMD] npm install -D vitest @vitest/ui jsdom @testing-library/svelte @testing-library/jest-dom
[CMD] npm install -D @playwright/test eslint prettier prettier-plugin-svelte
```

**[FILE]** Créer `config/vitest.config.js` :

```js
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

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
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'svelte/no-at-html-tags': 'error',
    'svelte/accessibility-label-has-associated-control': 'error'
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

### Étape 0.4 : Hooks de sécurité SvelteKit

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

### Étape 0.5 : Configuration Playwright

```bash
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

### Étape 0.6 : Script de validation centralisé

**[FILE]** Créer `scripts/validate-phase.js` - script unique avec paramètre :

```js
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PHASE_VALIDATIONS = {
  '0': ['lint', 'build', 'test'],
  '1': ['lint', 'build', 'test', 'test:auth'],
  '2': ['lint', 'build', 'test', 'test:content', 'test:security'],
  '2.1': ['lint', 'build', 'test', 'test:navigation'],
  '2.2': ['lint', 'build', 'test', 'test:firebase'],
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

### Étape 0.7 : Configuration package.json

**[FILE]** Modifier `package.json` section scripts :

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
    "test:navigation": "vitest --config config/vitest.config.js src/lib/navigation",
    "test:firebase": "vitest --config config/vitest.config.js src/lib/firebase",
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
    "validate": "node scripts/validate-phase.js",
    "release:prepare": "node scripts/prepare-release.js",
    "release:validate": "node scripts/validate-release.js", 
    "release:deploy": "node scripts/deploy-release.js"
  }
}
```

### Étape 0.8 : Test de base avec setup

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
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    environment: "jsdom",
    setupFiles: ["./src/test-setup.js"],
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: ["node_modules/", "src/test-setup.js"],
    },
  },
});
```

## 🧪 Tests de validation Phase 0

### Tests obligatoires

1. **[TEST]** `npm run dev` - Serveur de développement démarre
2. **[TEST]** `npm run build` - Build de production réussit
3. **[TEST]** `npm run test` - Tests unitaires passent
4. **[TEST]** `npm run lint` - Linting sans erreurs

### Critères de validation

- ✅ Structure de dossiers complète
- ✅ Configuration TypeScript opérationnelle
- ✅ Tests unitaires configurés
- ✅ Linting et formatage automatiques
- ✅ Build de production fonctionnel

**🚫 STOP** : Ne pas passer à Phase 1 sans validation complète de Phase 0.

### Commandes de validation

1. **[CMD]** `npm run validate -- 0` - Validation complète Phase 0
2. **[CMD]** `npm run test:coverage` - Couverture de tests
3. **[CMD]** `npm run build && npm run preview` - Test build production

---

**Phase 0 terminée** ✅ → Prête pour **Phase 1 : Firebase & Authentification**
