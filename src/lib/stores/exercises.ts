// 🎯 FunLearning V3.0 - Phase 10.2 Store Exercices avec Offline
// Store réactif pour gestion des exercices et validation + IndexedDB

import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import type {
  Exercise,
  QCMExercise,
  UserAnswer,
  ExerciseResult,
  ExerciseCollection,
  QCMAnswer,
} from "../types/exercise";
import { 
  saveExerciseResult, 
  getOfflineExercises, 
  getExerciseById,
  saveExerciseOffline,
  type OfflineExercise 
} from "./indexeddb";
import { isOnline } from "./pwa";
import { get } from "svelte/store";

// État global des exercices
interface ExercisesState {
  currentExercise: Exercise | null;
  userAnswer: UserAnswer | null;
  result: ExerciseResult | null;
  isSubmitting: boolean;
  timeStarted: Date | null;
  collection: ExerciseCollection | null;
  currentIndex: number;
  offlineMode: boolean;
  offlineExercises: OfflineExercise[];
}

// Store principal
const initialState: ExercisesState = {
  currentExercise: null,
  userAnswer: null,
  result: null,
  isSubmitting: false,
  timeStarted: null,
  collection: null,
  currentIndex: 0,
  offlineMode: false,
  offlineExercises: [],
};

export const exercisesStore = writable<ExercisesState>(initialState);

// Stores dérivés
export const currentExercise = derived(
  exercisesStore,
  ($store) => $store.currentExercise
);
export const isExerciseActive = derived(
  exercisesStore,
  ($store) => $store.currentExercise !== null
);
export const exerciseProgress = derived(exercisesStore, ($store) => {
  if (!$store.collection) return { current: 0, total: 0, percentage: 0 };

  return {
    current: $store.currentIndex + 1,
    total: $store.collection.exercises.length,
    percentage: Math.round(
      ($store.currentIndex / $store.collection.exercises.length) * 100
    ),
  };
});

// Actions du store
export const exerciseActions = {
  // Charger une collection d'exercices
  loadCollection: (collection: ExerciseCollection) => {
    exercisesStore.update((state) => ({
      ...state,
      collection,
      currentIndex: 0,
      currentExercise: collection.exercises[0] || null,
      userAnswer: null,
      result: null,
      timeStarted: new Date(),
    }));
  },

  // Passer à l'exercice suivant
  nextExercise: () => {
    exercisesStore.update((state) => {
      if (!state.collection) return state;

      const nextIndex = state.currentIndex + 1;
      const nextExercise = state.collection.exercises[nextIndex] || null;

      return {
        ...state,
        currentIndex: nextIndex,
        currentExercise: nextExercise,
        userAnswer: null,
        result: null,
        timeStarted: nextExercise ? new Date() : null,
      };
    });
  },

  // Soumettre une réponse QCM
  submitQCMAnswer: async (
    selectedOptions: string[]
  ): Promise<ExerciseResult | null> => {
    return new Promise((resolve) => {
      exercisesStore.update((state) => {
        if (!state.currentExercise || state.currentExercise.type !== "qcm") {
          resolve(null);
          return state;
        }

        const exercise = state.currentExercise as QCMExercise;
        const timeSpent = state.timeStarted
          ? Math.floor((Date.now() - state.timeStarted.getTime()) / 1000)
          : 0;

        const userAnswer: UserAnswer = {
          exerciseId: exercise.id,
          type: "qcm",
          answer: { selectedOptions } as QCMAnswer,
          timeSpent,
          submittedAt: new Date(),
        };

        const result = validateQCMAnswer(exercise, selectedOptions, userAnswer);

        resolve(result);

        return {
          ...state,
          userAnswer,
          result,
          isSubmitting: false,
        };
      });
    });
  },

  // Soumettre une réponse Vrai/Faux
  submitTrueFalseAnswer: async (
    answer: boolean
  ): Promise<ExerciseResult | null> => {
    return new Promise((resolve) => {
      exercisesStore.update((state) => {
        if (
          !state.currentExercise ||
          state.currentExercise.type !== "true-false"
        ) {
          resolve(null);
          return state;
        }

        const exercise = state.currentExercise;
        const timeSpent = state.timeStarted
          ? Math.floor((Date.now() - state.timeStarted.getTime()) / 1000)
          : 0;

        const userAnswer: UserAnswer = {
          exerciseId: exercise.id,
          type: "true-false",
          answer,
          timeSpent,
          submittedAt: new Date(),
        };

        const isCorrect = answer === exercise.correctAnswer;
        const score = isCorrect ? exercise.points : 0;

        const result: ExerciseResult = {
          exerciseId: exercise.id,
          userId: "current-user", // TODO: Récupérer depuis auth store
          answer: userAnswer,
          isCorrect,
          score,
          maxScore: exercise.points,
          feedback: isCorrect ? "Correct ! 🎉" : "Incorrect 😔",
          explanation: exercise.explanation,
          completedAt: new Date(),
        };

        resolve(result);

        return {
          ...state,
          userAnswer,
          result,
          isSubmitting: false,
        };
      });
    });
  },

    // Réinitialiser complètement les exercices
  resetExercises: () => {
    exercisesStore.set(initialState);
  },

    // ===== MÉTHODES OFFLINE ÉTENDUES =====
  
  async cachePopularExercises(): Promise<void> {
    if (!browser) return;
    
    try {
      // Récupérer les exercices populaires (par exemple les plus récents)
      const response = await fetch('/api/exercises?popular=true&limit=10');
      if (!response.ok) throw new Error('Erreur API');
      
      const popularExercises = await response.json();
      
      for (const exercise of popularExercises) {
        await this.cacheExerciseOffline(exercise.id);
      }
      
      console.log(`✅ ${popularExercises.length} exercices populaires mis en cache`);
    } catch (error) {
      console.error('❌ Erreur cache exercices populaires:', error);
      throw error;
    }
  },
  
  async cacheExercisesByDifficulty(maxDifficulty: number): Promise<void> {
    if (!browser) return;
    
    try {
      const response = await fetch(`/api/exercises?difficulty_max=${maxDifficulty}&limit=5`);
      if (!response.ok) throw new Error('Erreur API');
      
      const exercises = await response.json();
      
      for (const exercise of exercises) {
        await this.cacheExerciseOffline(exercise.id);
      }
      
      console.log(`✅ ${exercises.length} exercices (difficulté ≤${maxDifficulty}) mis en cache`);
    } catch (error) {
      console.error(`❌ Erreur cache exercices difficulté ${maxDifficulty}:`, error);
      throw error;
    }
  },

  // Charger les exercices disponibles offline
  loadOfflineExercises: async () => {
    try {
      const offlineExercises = await getOfflineExercises();
      exercisesStore.update(state => ({
        ...state,
        offlineExercises,
        offlineMode: !get(isOnline)
      }));
      console.log(`[Exercises] ${offlineExercises.length} exercices offline chargés`);
    } catch (error) {
      console.error('[Exercises] Erreur chargement exercices offline:', error);
    }
  },

  // Sauvegarder un exercice pour utilisation offline
  cacheExerciseOffline: async (exercise: Exercise) => {
    try {
      // Mapper les niveaux de difficulté
      const difficultyMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
        'debutant': 'beginner',
        'intermediaire': 'intermediate', 
        'avance': 'advanced',
        'beginner': 'beginner',
        'intermediate': 'intermediate',
        'advanced': 'advanced'
      };

      const offlineExercise: OfflineExercise = {
        id: exercise.id,
        type: exercise.type,
        title: exercise.title,
        content: exercise,
        difficulty: difficultyMap[exercise.difficulty as string] || 'intermediate',
        tags: exercise.tags || [],
        cachedAt: Date.now(),
        offline: true
      };

      await saveExerciseOffline(offlineExercise);
      
      // Mettre à jour la liste locale
      exercisesStore.update(state => ({
        ...state,
        offlineExercises: [...state.offlineExercises, offlineExercise]
      }));

      console.log(`[Exercises] Exercice ${exercise.id} mis en cache offline`);
    } catch (error) {
      console.error('[Exercises] Erreur cache exercice offline:', error);
    }
  },

  // Charger un exercice offline par ID
  loadOfflineExercise: async (exerciseId: string) => {
    try {
      const offlineExercise = await getExerciseById(exerciseId);
      if (offlineExercise) {
        exercisesStore.update(state => ({
          ...state,
          currentExercise: offlineExercise.content,
          timeStarted: new Date(),
          offlineMode: true
        }));
        console.log(`[Exercises] Exercice offline ${exerciseId} chargé`);
      }
    } catch (error) {
      console.error('[Exercises] Erreur chargement exercice offline:', error);
    }
  },

  // Soumettre une réponse en mode offline
  submitAnswerOffline: async (answer: any): Promise<ExerciseResult | null> => {
    return new Promise(async (resolve) => {
      const currentState = get(exercisesStore);
      
      if (!currentState.currentExercise) {
        resolve(null);
        return;
      }

      const exercise = currentState.currentExercise;
      const timeSpent = currentState.timeStarted
        ? Math.floor((Date.now() - currentState.timeStarted.getTime()) / 1000)
        : 0;

      const userAnswer: UserAnswer = {
        exerciseId: exercise.id,
        type: exercise.type,
        answer,
        timeSpent,
        submittedAt: new Date(),
      };

      // Valider selon le type d'exercice
      let result: ExerciseResult | null = null;
      
      if (exercise.type === 'qcm') {
        result = validateQCMAnswer(exercise as QCMExercise, answer.selectedOptions, userAnswer);
      }
      // TODO: Ajouter validation pour autres types

      if (result) {
        try {
          // Sauvegarder le résultat en IndexedDB (sera syncé plus tard)
          await saveExerciseResult({
            exerciseId: result.exerciseId,
            userId: result.userId,
            answers: answer,
            score: result.score,
            isCorrect: result.isCorrect
          });

          console.log(`[Exercises] Résultat sauvé offline pour exercice ${exercise.id}`);
        } catch (error) {
          console.error('[Exercises] Erreur sauvegarde résultat offline:', error);
        }
      }

      // Mettre à jour le store
      exercisesStore.update(state => ({
        ...state,
        userAnswer,
        result,
        isSubmitting: false,
      }));

      resolve(result);
    });
  },

  // Basculer en mode offline/online
  toggleOfflineMode: () => {
    exercisesStore.update(state => ({
      ...state,
      offlineMode: !state.offlineMode
    }));
  },

  // Synchroniser les exercices depuis le serveur
  syncExercisesFromServer: async () => {
    if (!get(isOnline)) {
      console.log('[Exercises] Sync impossible: hors ligne');
      return;
    }

    try {
      // TODO: Récupérer les exercices depuis l'API
      const response = await fetch('/api/exercises');
      if (response.ok) {
        const exercises = await response.json();
        
        // Mettre en cache les exercices importants
        for (const exercise of exercises.slice(0, 10)) { // Limiter à 10 pour la démo
          await exerciseActions.cacheExerciseOffline(exercise);
        }

        console.log(`[Exercises] ${exercises.length} exercices synchronisés`);
      }
    } catch (error) {
      console.error('[Exercises] Erreur synchronisation exercices:', error);
    }
  },
};

// Fonction de validation QCM
function validateQCMAnswer(
  exercise: QCMExercise,
  selectedOptions: string[],
  userAnswer: UserAnswer
): ExerciseResult {
  const correctOptions = exercise.options
    .filter((opt) => opt.isCorrect)
    .map((opt) => opt.id);

  // Vérification de la réponse
  const isCorrect = exercise.multipleCorrect
    ? arraysEqual(selectedOptions.sort(), correctOptions.sort())
    : selectedOptions.length === 1 &&
      correctOptions.includes(selectedOptions[0]);

  // Calcul du score
  let score = 0;
  if (isCorrect) {
    score = exercise.points;
  } else if (exercise.multipleCorrect) {
    // Score partiel pour QCM multiples
    const correctSelected = selectedOptions.filter((opt) =>
      correctOptions.includes(opt)
    ).length;
    const incorrectSelected = selectedOptions.filter(
      (opt) => !correctOptions.includes(opt)
    ).length;
    score = Math.max(
      0,
      ((correctSelected - incorrectSelected) / correctOptions.length) *
        exercise.points
    );
  }

  // Génération du feedback
  const feedback = isCorrect
    ? "🎉 Excellent ! Réponse correcte."
    : score > 0
    ? `⚡ Partiellement correct. Score: ${Math.round(score)}/${exercise.points}`
    : "❌ Réponse incorrecte.";

  return {
    exerciseId: exercise.id,
    userId: "current-user", // TODO: Récupérer depuis auth store
    answer: userAnswer,
    isCorrect,
    score: Math.round(score),
    maxScore: exercise.points,
    feedback,
    explanation: exercise.explanation,
    completedAt: new Date(),
  };
}

// Utilitaire pour comparer des tableaux
function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}
