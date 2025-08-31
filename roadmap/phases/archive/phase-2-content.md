# 📚 Phase 2 : Contenu & Markdown (1 semaine) - v1.1

## 🎯 Contexte IA

**Objectif** : Système de contenu Markdown avec conversion HTML sécurisée et routes dynamiques.
**Version cible** : v1.1 (plateforme de contenu fonctionnelle)
**Pré-requis** : Phase 1 complétée, Firebase configuré, auth fonctionnelle

## 📚 Références Modulaires

### **[REF]** Gestion des données : **[content-types.md](../references/data/content-types.md)**

- ✅ Types TypeScript pour contenu éducatif
- ✅ Validation Zod et système de migration
- ✅ Structure évolutive pour compétences et cours
- ✅ Interfaces pour exercices et progression

### **[REF]** Système temps réel : **[realtime-system.md](../references/data/realtime-system.md)**

- ✅ Cache intelligent avec TTL et invalidation
- ✅ RealtimeDataManager pour Firestore
- ✅ Stores réactifs avec cleanup automatique
- ✅ Optimisations de performance

### **[REF]** Composants UI : **[component-patterns.md](../references/ui/component-patterns.md)**

- ✅ Design system avec tokens CSS
- ✅ Composants de base (Button, Card, Input, Modal)
- ✅ Composants spécialisés pour l'apprentissage
- ✅ Patterns d'accessibilité et responsive

### **[REF]** Stores réactifs : **[reactive-stores.md](../references/ui/reactive-stores.md)**

- ✅ Stores persistants avec localStorage
- ✅ Gestion des préférences utilisateur
- ✅ Progression d'apprentissage
- ✅ Système de notifications

## 🚀 Instructions d'implémentation

### Étape 2.1 : Installation des dépendances

```bash
[CMD] npm install marked dompurify highlight.js
[CMD] npm install -D @types/marked @types/dompurify
```

### Étape 2.2 : Types de contenu

**[FILE]** Créer `src/lib/types/content.ts` selon la référence content-types.md

### Étape 2.3 : Système de contenu Markdown

**[FILE]** Créer `src/lib/content/markdown.ts` :

```typescript
import { marked } from "marked";
import DOMPurify from "dompurify";

export function parseMarkdown(content: string): string {
  const html = marked(content);
  return DOMPurify.sanitize(html);
}
```

### Étape 2.4 : Routes dynamiques

**[FILE]** Créer `src/routes/course/[slug]/+page.svelte`
**[FILE]** Créer `src/routes/course/[slug]/+page.ts`

### Étape 2.5 : Composants UI de base

**[FILE]** Créer selon les patterns dans component-patterns.md :

- `src/lib/components/ui/Button.svelte`
- `src/lib/components/ui/Card.svelte`
- `src/lib/components/ui/Modal.svelte`

## 🧪 Tests de validation Phase 2

### Tests obligatoires

1. **[TEST]** `npm run test:content` - Tests contenu passent
2. **[TEST]** `npm run test:ui` - Tests composants passent
3. **[TEST]** `npm run test:stores` - Tests stores passent
4. **[CHECK]** `npm run validate 2` - Validation complète Phase 2

### Critères de validation obligatoires

- ✅ Contenu Markdown affiché dynamiquement
- ✅ Interface responsive et accessible
- ✅ Système de navigation fonctionnel
- ✅ Stores réactifs opérationnels
- ✅ Cache et synchronisation temps réel
- ✅ Types TypeScript validés

**🚫 STOP** : Ne pas passer à Phase 2.5 sans validation complète de Phase 2.

---

**Phase 2 terminée** ✅ → Prête pour **Phase 2.5 : Pédagogie Avancée**
