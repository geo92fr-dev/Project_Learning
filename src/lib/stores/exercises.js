/**
 * 💪 Stores Exercices - Phase 9
 * Store Svelte pour gestion d'état des exercices avec persistance locale
 * Suivant DOC_CoPilot_Practices : Stores réactifs, séparation des concerns
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// ===== STORES PRINCIPAUX =====

/**
 * Store principal des exercices disponibles
 */
export const exercisesStore = writable([]);

/**
 * Store de la session d'exercices courante
 */
export const currentSessionStore = writable({
  id: null,
  exercises: [],
  currentIndex: 0,
  startTime: null,
  endTime: null,
  isActive: false
});

/**
 * Store des résultats d'exercices avec persistance localStorage
 */
export const exerciseResultsStore = writable([]);

/**
 * Store de l'exercice actuellement en cours
 */
export const currentExerciseStore = writable(null);

// ===== STORES DÉRIVÉS =====

/**
 * Statistiques dérivées des exercices et résultats
 */
export const exerciseStatsStore = derived(
  [exercisesStore, exerciseResultsStore],
  ([$exercises, $results]) => {
    const totalExercises = $exercises.length;
    const completedCount = $results.length;
    const averageScore = $results.length > 0 
      ? Math.round($results.reduce((sum, r) => sum + r.score, 0) / $results.length)
      : 0;
    
    // Calcul par difficulté
    const statsByDifficulty = {};
    ['debutant', 'intermediaire', 'avance', 'expert'].forEach(level => {
      const levelResults = $results.filter(r => r.difficulty === level);
      statsByDifficulty[level] = {
        attempted: levelResults.length,
        averageScore: levelResults.length > 0 
          ? Math.round(levelResults.reduce((sum, r) => sum + r.score, 0) / levelResults.length)
          : 0
      };
    });
    
    return {
      totalExercises,
      completedCount,
      averageScore,
      completionRate: totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0,
      statsByDifficulty,
      lastActivity: $results.length > 0 
        ? Math.max(...$results.map(r => new Date(r.completedAt).getTime()))
        : null
    };
  }
);

/**
 * Store dérivé pour les recommandations d'exercices
 */
export const recommendedExercisesStore = derived(
  [exercisesStore, exerciseResultsStore],
  ([$exercises, $results]) => {
    // Logique de recommandation simple : exercices non faits ou avec score faible
    const attemptedIds = new Set($results.map(r => r.exerciseId));
    const lowScoreIds = new Set(
      $results.filter(r => r.score < 70).map(r => r.exerciseId)
    );
    
    const notAttempted = $exercises.filter(ex => !attemptedIds.has(ex.id));
    const needsImprovement = $exercises.filter(ex => lowScoreIds.has(ex.id));
    
    return {
      notAttempted: notAttempted.slice(0, 5),
      needsImprovement: needsImprovement.slice(0, 3),
      suggested: [...notAttempted, ...needsImprovement].slice(0, 6)
    };
  }
);

// ===== PERSISTANCE LOCALE =====

/**
 * Sauvegarde automatique en localStorage
 */
function saveToLocalStorage(key, data) {
  if (browser) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Erreur sauvegarde localStorage:', error);
    }
  }
}

/**
 * Chargement depuis localStorage
 */
function loadFromLocalStorage(key, defaultValue = []) {
  if (browser) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn('Erreur lecture localStorage:', error);
      return defaultValue;
    }
  }
  return defaultValue;
}

// Initialisation avec données persistées
if (browser) {
  exerciseResultsStore.set(loadFromLocalStorage('funlearning_exercise_results', []));
  
  // Auto-sauvegarde des résultats
  exerciseResultsStore.subscribe(results => {
    saveToLocalStorage('funlearning_exercise_results', results);
  });
}

// ===== ACTIONS =====

/**
 * Actions pour manipulation des stores
 */
export const exerciseActions = {
  /**
   * Démarre une nouvelle session d'exercices
   */
  startSession(exercises, sessionType = 'practice') {
    const sessionId = `session_${Date.now()}`;
    currentSessionStore.set({
      id: sessionId,
      exercises,
      currentIndex: 0,
      startTime: new Date().toISOString(),
      endTime: null,
      isActive: true,
      type: sessionType
    });
    
    if (exercises.length > 0) {
      currentExerciseStore.set(exercises[0]);
    }
    
    return sessionId;
  },

  /**
   * Passe à l'exercice suivant dans la session
   */
  nextExercise() {
    const session = get(currentSessionStore);
    if (!session.isActive) return false;
    
    const nextIndex = session.currentIndex + 1;
    if (nextIndex < session.exercises.length) {
      currentSessionStore.update(s => ({
        ...s,
        currentIndex: nextIndex
      }));
      currentExerciseStore.set(session.exercises[nextIndex]);
      return true;
    } else {
      // Fin de session
      this.endSession();
      return false;
    }
  },

  /**
   * Termine la session courante
   */
  endSession() {
    currentSessionStore.update(s => ({
      ...s,
      endTime: new Date().toISOString(),
      isActive: false
    }));
    currentExerciseStore.set(null);
  },

  /**
   * Enregistre le résultat d'un exercice
   */
  recordResult(exerciseId, score, timeSpent, answers, feedback = null) {
    const result = {
      id: `result_${Date.now()}`,
      exerciseId,
      score,
      timeSpent,
      answers,
      feedback,
      completedAt: new Date().toISOString(),
      difficulty: this.getExerciseDifficulty(exerciseId)
    };
    
    exerciseResultsStore.update(results => [...results, result]);
    return result;
  },

  /**
   * Récupère la difficulté d'un exercice par son ID
   */
  getExerciseDifficulty(exerciseId) {
    const exercises = get(exercisesStore);
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.difficulty : 'intermediaire';
  },

  /**
   * Nettoie les données locales (pour debug/reset)
   */
  clearLocalData() {
    if (browser) {
      localStorage.removeItem('funlearning_exercise_results');
      exerciseResultsStore.set([]);
    }
  },

  /**
   * Charge des exercices dans le store
   */
  loadExercises(exercises) {
    exercisesStore.set(exercises);
  },

  /**
   * Récupère les statistiques pour un type d'exercice
   */
  getTypeStats(exerciseType) {
    const results = get(exerciseResultsStore);
    const exercises = get(exercisesStore);
    
    const typeResults = results.filter(r => {
      const exercise = exercises.find(ex => ex.id === r.exerciseId);
      return exercise && exercise.type === exerciseType;
    });
    
    return {
      attempted: typeResults.length,
      averageScore: typeResults.length > 0 
        ? Math.round(typeResults.reduce((sum, r) => sum + r.score, 0) / typeResults.length)
        : 0,
      bestScore: typeResults.length > 0 ? Math.max(...typeResults.map(r => r.score)) : 0
    };
  }
};

// Export du store pour compatibilité
export default exercisesStore;