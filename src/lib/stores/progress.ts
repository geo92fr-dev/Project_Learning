import { writable, type Writable } from 'svelte/store';

export interface Progress {
  current: number;
  total: number;
  percentage: number;
  label?: string;
}

export interface LearningProgress {
  phase1: Progress;
  phase2: Progress;
  phase3: Progress;
  overall: Progress;
}

// Store pour suivre la progression d'apprentissage
export const learningProgress: Writable<LearningProgress> = writable({
  phase1: { current: 0, total: 10, percentage: 0, label: 'Fondations' },
  phase2: { current: 0, total: 15, percentage: 0, label: 'Développement' },
  phase3: { current: 0, total: 20, percentage: 0, label: 'Contenu' },
  overall: { current: 0, total: 45, percentage: 0, label: 'Global' }
});

// Actions pour mettre à jour la progression
export const progressActions = {
  updatePhase: (phase: keyof LearningProgress, current: number) => {
    learningProgress.update(progress => {
      if (phase === 'overall') return progress;
      
      const phaseProgress = progress[phase];
      const newCurrent = Math.min(current, phaseProgress.total);
      const newPercentage = Math.round((newCurrent / phaseProgress.total) * 100);
      
      // Mise à jour de la phase
      progress[phase] = {
        ...phaseProgress,
        current: newCurrent,
        percentage: newPercentage
      };
      
      // Recalcul de la progression globale
      const totalCurrent = progress.phase1.current + progress.phase2.current + progress.phase3.current;
      const totalMax = progress.phase1.total + progress.phase2.total + progress.phase3.total;
      
      progress.overall = {
        ...progress.overall,
        current: totalCurrent,
        total: totalMax,
        percentage: Math.round((totalCurrent / totalMax) * 100)
      };
      
      return progress;
    });
  },

  incrementPhase: (phase: keyof LearningProgress, increment: number = 1) => {
    learningProgress.update(progress => {
      if (phase === 'overall') return progress;
      
      const current = progress[phase].current + increment;
      progressActions.updatePhase(phase, current);
      return progress;
    });
  },

  completePhase: (phase: keyof LearningProgress) => {
    learningProgress.update(progress => {
      if (phase === 'overall') return progress;
      
      progressActions.updatePhase(phase, progress[phase].total);
      return progress;
    });
  },

  reset: () => {
    learningProgress.set({
      phase1: { current: 0, total: 10, percentage: 0, label: 'Fondations' },
      phase2: { current: 0, total: 15, percentage: 0, label: 'Développement' },
      phase3: { current: 0, total: 20, percentage: 0, label: 'Contenu' },
      overall: { current: 0, total: 45, percentage: 0, label: 'Global' }
    });
  }
};
