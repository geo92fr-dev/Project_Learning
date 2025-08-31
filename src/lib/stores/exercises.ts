// 🎯 FunLearning V3.0 - Phase 3 Store Exercices
// Store réactif pour gestion des exercices et validation

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

// État global des exercices
interface ExercisesState {
  currentExercise: Exercise | null;
  userAnswer: UserAnswer | null;
  result: ExerciseResult | null;
  isSubmitting: boolean;
  timeStarted: Date | null;
  collection: ExerciseCollection | null;
  currentIndex: number;
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

  // Réinitialiser l'état
  reset: () => {
    exercisesStore.set(initialState);
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
