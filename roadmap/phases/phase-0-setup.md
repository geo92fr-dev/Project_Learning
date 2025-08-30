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
[CMD] mkdir -p config
```

**[FILE]** Créer `config/vitest.config.js` :

```js
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
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
