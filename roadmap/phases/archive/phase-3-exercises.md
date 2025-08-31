# 🎯 Phase 3 : Exercices & Progression (1 semaine) - v1.3

## 🎯 Contexte IA

**Objectif** : Système de quiz interactif, suivi de progression et tableau de bord utilisateur.
**Version cible** : v1.3 (plateforme interactive complète)
**Pré-requis** : Phase 2.5 validée, Firestore configuré, auth fonctionnelle

## 📚 Références Modulaires

### **[REF]** Types de contenu : **[content-types.md](../references/data/content-types.md)**

- ✅ Types d'exercices (QCM, vrai/faux, texte à trous, etc.)
- ✅ Interface ExerciseContent et ses variantes
- ✅ Système de validation et scoring
- ✅ Types de progression utilisateur

### **[REF]** Composants UI spécialisés : **[component-patterns.md](../references/ui/component-patterns.md)**

- ✅ CompetenceCard pour affichage des compétences
- ✅ ProgressBar pour la progression
- ✅ Composants interactifs accessibles
- ✅ Patterns de validation et feedback

### **[REF]** Stores de progression : **[reactive-stores.md](../references/ui/reactive-stores.md)**

- ✅ LearningProgress avec compétences et stats
- ✅ updateCompetenceProgress et actions
- ✅ Système d'achievements et streaks
- ✅ Stores dérivés pour statistiques

## 🚀 Instructions d'implémentation

### Étape 3.1 : Types d'exercices

**[FILE]** Étendre `src/lib/types/content.ts` :

```typescript
export interface Exercise {
  id: string;
  type: "qcm" | "true-false" | "fill-blank" | "text";
  question: string;
  options?: string[];
  correct: number | string;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}
```

### Étape 3.2 : Composants d'exercices

**[FILE]** Créer `src/lib/components/exercise/QuizComponent.svelte` :

```svelte
<script lang="ts">
  import type { Exercise } from "$lib/types/content";
  import { createEventDispatcher } from "svelte";

  export let exercise: Exercise;
  let selectedAnswer: number | null = null;
  let isAnswered = false;

  const dispatch = createEventDispatcher();

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    isAnswered = true;
    const isCorrect = selectedAnswer === exercise.correct;
    dispatch("answered", { isCorrect, exerciseId: exercise.id });
  };
</script>
```

### Étape 3.3 : Store de progression

**[FILE]** Créer `src/lib/stores/progress.ts` :

```typescript
import { writable, derived } from "svelte/store";

interface UserProgress {
  completedExercises: string[];
  correctAnswers: number;
  totalAnswers: number;
  streak: number;
  achievements: string[];
}

export const progressStore = writable<UserProgress>({
  completedExercises: [],
  correctAnswers: 0,
  totalAnswers: 0,
  streak: 0,
  achievements: [],
});

export const accuracy = derived(progressStore, ($progress) =>
  $progress.totalAnswers > 0
    ? ($progress.correctAnswers / $progress.totalAnswers) * 100
    : 0
);
```

### Étape 3.4 : Tableau de bord utilisateur

**[FILE]** Créer `src/routes/dashboard/+page.svelte`
**[FILE]** Créer `src/lib/components/dashboard/StatsCard.svelte`
**[FILE]** Créer `src/lib/components/dashboard/ProgressChart.svelte`

## 🧪 Tests de validation Phase 3

### Tests obligatoires

1. **[TEST]** `npm run test:exercises` - Tests exercices passent
2. **[TEST]** `npm run test:progression` - Tests progression passent
3. **[TEST]** `npm run test:interaction` - Tests interactions passent
4. **[CHECK]** `npm run validate 3` - Validation complète Phase 3

### Critères de validation obligatoires

- ✅ Exercices QCM interactifs fonctionnels
- ✅ Système de progression opérationnel
- ✅ Tableau de bord utilisateur affiché
- ✅ Statistiques de progression calculées
- ✅ Validation et feedback utilisateur
- ✅ Persistance des résultats dans Firestore

**🚫 STOP** : Ne pas passer à Phase 4 sans validation complète de Phase 3.

---

**Phase 3 terminée** ✅ → Prête pour **Phase 4 : PWA & Offline**
