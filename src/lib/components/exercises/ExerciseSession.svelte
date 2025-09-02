<!--
  🎯 Exercise Session Manager - Phase 9
  Gestionnaire de sessions d'exercices avec suivi des progrès
  Features: Navigation entre exercices, feedback immédiat, statistiques temps réel
-->

<script lang="ts">
  import type { Exercise, ExerciseResult, ExerciseCollection } from '$lib/types/exercise.js';
  import { exerciseService } from '$lib/services/exerciseService.js';
  import QCMCard from './QCMCard.svelte';
  import TrueFalseCard from './TrueFalseCard.svelte';
  import FillBlanksCard from './FillBlanksCard.svelte';
  import { createEventDispatcher } from 'svelte';

  // Props
  export let exercises: Exercise[] = [];
  export let sessionTitle: string = 'Session d\'exercices';
  export let showProgress: boolean = true;
  export let allowSkip: boolean = false;
  export let timeLimit: number | null = null; // temps par exercice en secondes

  // State
  let currentIndex = 0;
  let results: ExerciseResult[] = [];
  let sessionStartTime = Date.now();
  let sessionComplete = false;
  let showResults = false;

  const dispatch = createEventDispatcher<{
    sessionComplete: { results: ExerciseResult[]; stats: SessionStats };
    exerciseComplete: { exercise: Exercise; result: ExerciseResult };
    sessionExit: {};
  }>();

  interface SessionStats {
    totalExercises: number;
    completed: number;
    correctAnswers: number;
    totalScore: number;
    maxScore: number;
    accuracy: number;
    averageTime: number;
    timeSpent: number;
  }

  $: currentExercise = exercises[currentIndex];
  $: progress = exercises.length > 0 ? ((currentIndex + (sessionComplete ? 1 : 0)) / exercises.length) * 100 : 0;
  $: hasNext = currentIndex < exercises.length - 1;
  $: hasPrevious = currentIndex > 0;

  function handleExerciseAnswer(event: any) {
    const { exercise, result } = event.detail;
    
    results = [...results, result];
    dispatch('exerciseComplete', { exercise, result });

    // Attendre 2 secondes pour montrer le résultat, puis passer au suivant
    setTimeout(() => {
      if (hasNext) {
        nextExercise();
      } else {
        completeSession();
      }
    }, 2000);
  }

  function nextExercise() {
    if (hasNext) {
      currentIndex++;
    }
  }

  function previousExercise() {
    if (hasPrevious) {
      currentIndex--;
    }
  }

  function skipExercise() {
    if (allowSkip && hasNext) {
      nextExercise();
    }
  }

  function completeSession() {
    sessionComplete = true;
    showResults = true;
    
    const stats = calculateSessionStats();
    dispatch('sessionComplete', { results, stats });
  }

  function calculateSessionStats(): SessionStats {
    const totalExercises = exercises.length;
    const completed = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const maxScore = results.reduce((sum, r) => sum + r.maxScore, 0);
    const accuracy = completed > 0 ? (correctAnswers / completed) * 100 : 0;
    
    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
    const averageTime = completed > 0 ? timeSpent / completed : 0;

    return {
      totalExercises,
      completed,
      correctAnswers,
      totalScore,
      maxScore,
      accuracy,
      averageTime,
      timeSpent
    };
  }

  function restartSession() {
    currentIndex = 0;
    results = [];
    sessionStartTime = Date.now();
    sessionComplete = false;
    showResults = false;
  }

  function exitSession() {
    dispatch('sessionExit', {});
  }

  function getExerciseComponent(exercise: Exercise) {
    switch (exercise.type) {
      case 'qcm':
        return QCMCard;
      case 'true-false':
        return TrueFalseCard;
      case 'fill-blanks':
        return FillBlanksCard;
      default:
        return QCMCard;
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function getDifficultyColor(difficulty: string): string {
    const colors = {
      debutant: '#10B981',
      intermediaire: '#F59E0B',
      avance: '#EF4444',
      expert: '#8B5CF6'
    };
    return colors[difficulty as keyof typeof colors] || '#6B7280';
  }
</script>

{#if !sessionComplete}
  <div class="exercise-session">
    <!-- En-tête de session -->
    <div class="session-header">
      <div class="session-info">
        <h2 class="session-title">{sessionTitle}</h2>
        <div class="session-meta">
          <span class="exercise-counter">
            Exercice {currentIndex + 1} sur {exercises.length}
          </span>
          {#if timeLimit}
            <span class="time-limit">⏱️ {formatTime(timeLimit)} par exercice</span>
          {/if}
        </div>
      </div>

      <button type="button" class="exit-btn" on:click={exitSession} title="Quitter la session">
        ✕
      </button>
    </div>

    <!-- Barre de progression -->
    {#if showProgress}
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress}%"></div>
        </div>
        <span class="progress-text">{Math.round(progress)}% terminé</span>
      </div>
    {/if}

    <!-- Exercice actuel -->
    {#if currentExercise}
      <div class="exercise-container">
        {#if currentExercise.type === 'qcm'}
          <QCMCard 
            exercise={currentExercise}
            showResult={true}
            timeLimit={timeLimit}
            on:submit={handleExerciseAnswer}
            on:timeUp={handleExerciseAnswer}
          />
        {:else if currentExercise.type === 'true-false'}
          <TrueFalseCard 
            exercise={currentExercise}
            showResult={true}
            timeLimit={timeLimit}
            on:submit={handleExerciseAnswer}
            on:timeUp={handleExerciseAnswer}
          />
        {:else if currentExercise.type === 'fill-blanks'}
          <FillBlanksCard 
            exercise={currentExercise}
            showResult={true}
            timeLimit={timeLimit}
            on:submit={handleExerciseAnswer}
            on:timeUp={handleExerciseAnswer}
          />
        {/if}
      </div>
    {/if}

    <!-- Navigation -->
    <div class="navigation-controls">
      <button 
        type="button" 
        class="nav-btn secondary" 
        disabled={!hasPrevious}
        on:click={previousExercise}
      >
        ← Précédent
      </button>

      {#if allowSkip}
        <button 
          type="button" 
          class="nav-btn secondary" 
          on:click={skipExercise}
          disabled={!hasNext}
        >
          Passer
        </button>
      {/if}

      <button 
        type="button" 
        class="nav-btn primary" 
        disabled={!hasNext}
        on:click={nextExercise}
      >
        Suivant →
      </button>
    </div>

    <!-- Statistiques en temps réel -->
    <div class="live-stats">
      <div class="stat-item">
        <span class="stat-label">Réussis</span>
        <span class="stat-value">{results.filter(r => r.isCorrect).length}/{results.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Score</span>
        <span class="stat-value">{results.reduce((sum, r) => sum + r.score, 0)} pts</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Temps</span>
        <span class="stat-value">{formatTime(Math.floor((Date.now() - sessionStartTime) / 1000))}</span>
      </div>
    </div>
  </div>

{:else}
  <!-- Résultats de session -->
  {#if sessionComplete}
    {@const stats = calculateSessionStats()}
    <div class="session-results">
      <div class="results-header">
        <h2>🎉 Session terminée !</h2>
        <p>Voici un récapitulatif de vos performances</p>
      </div>
    
    <div class="results-grid">
      <div class="result-card">
        <div class="result-icon">📊</div>
        <div class="result-content">
          <h3>Score total</h3>
          <p class="result-main">{stats.totalScore} / {stats.maxScore}</p>
          <p class="result-sub">{Math.round((stats.totalScore / stats.maxScore) * 100)}%</p>
        </div>
      </div>

      <div class="result-card">
        <div class="result-icon">✅</div>
        <div class="result-content">
          <h3>Réussites</h3>
          <p class="result-main">{stats.correctAnswers} / {stats.completed}</p>
          <p class="result-sub">{Math.round(stats.accuracy)}% de réussite</p>
        </div>
      </div>

      <div class="result-card">
        <div class="result-icon">⏱️</div>
        <div class="result-content">
          <h3>Temps total</h3>
          <p class="result-main">{formatTime(stats.timeSpent)}</p>
          <p class="result-sub">{formatTime(Math.round(stats.averageTime))} en moyenne</p>
        </div>
      </div>

      <div class="result-card">
        <div class="result-icon">🎯</div>
        <div class="result-content">
          <h3>Progression</h3>
          <p class="result-main">{stats.completed} / {stats.totalExercises}</p>
          <p class="result-sub">exercices complétés</p>
        </div>
      </div>
    </div>

    <!-- Détail des exercices -->
    <div class="exercise-details">
      <h3>Détail par exercice</h3>
      <div class="detail-list">
        {#each results as result, index}
          {@const exercise = exercises[index]}
          <div class="detail-item" class:correct={result.isCorrect} class:incorrect={!result.isCorrect}>
            <div class="detail-info">
              <span class="detail-title">{exercise.title}</span>
              <span class="detail-difficulty" style="color: {getDifficultyColor(exercise.difficulty)}">
                {exercise.difficulty}
              </span>
            </div>
            <div class="detail-result">
              <span class="detail-score">{result.score}/{result.maxScore} pts</span>
              <span class="detail-icon">{result.isCorrect ? '✅' : '❌'}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Actions finales -->
    <div class="final-actions">
      <button type="button" class="action-btn primary" on:click={restartSession}>
        🔄 Recommencer
      </button>
      <button type="button" class="action-btn secondary" on:click={exitSession}>
        🏠 Retour au menu
      </button>
    </div>
  </div>
  {/if}
{/if}

<style>
  .exercise-session {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

  .session-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .session-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 8px 0;
  }

  .session-meta {
    display: flex;
    gap: 16px;
    color: #666;
    font-size: 0.925rem;
  }

  .exit-btn {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 1.2rem;
    color: #666;
    transition: all 0.2s ease;
  }

  .exit-btn:hover {
    background: #edf2f7;
    color: #e53e3e;
  }

  .progress-container {
    margin-bottom: 24px;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3182ce 0%, #63b3ed 100%);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #666;
    font-weight: 600;
  }

  .exercise-container {
    margin-bottom: 32px;
  }

  .navigation-controls {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .nav-btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .nav-btn.primary {
    background: #3182ce;
    color: white;
  }

  .nav-btn.primary:hover:not(:disabled) {
    background: #2c5282;
  }

  .nav-btn.secondary {
    background: #f7fafc;
    color: #4a5568;
    border: 1px solid #e2e8f0;
  }

  .nav-btn.secondary:hover:not(:disabled) {
    background: #edf2f7;
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .live-stats {
    display: flex;
    justify-content: center;
    gap: 32px;
    padding: 20px;
    background: #f7fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .stat-item {
    text-align: center;
  }

  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 4px;
  }

  .stat-value {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
  }

  /* Résultats de session */
  .session-results {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

  .results-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .results-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 8px 0;
  }

  .results-header p {
    color: #666;
    font-size: 1.125rem;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .result-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
  }

  .result-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .result-content h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #4a5568;
    margin: 0 0 4px 0;
  }

  .result-main {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
  }

  .result-sub {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
  }

  .exercise-details {
    margin-bottom: 32px;
  }

  .exercise-details h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 16px 0;
  }

  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .detail-item.correct {
    background: #f0fff4;
    border-color: #38a169;
  }

  .detail-item.incorrect {
    background: #fed7d7;
    border-color: #e53e3e;
  }

  .detail-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-title {
    font-weight: 600;
    color: #2d3748;
  }

  .detail-difficulty {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .detail-result {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .detail-score {
    font-weight: 600;
    color: #3182ce;
  }

  .detail-icon {
    font-size: 1.2rem;
  }

  .final-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .action-btn {
    padding: 16px 32px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .action-btn.primary {
    background: #3182ce;
    color: white;
  }

  .action-btn.primary:hover {
    background: #2c5282;
  }

  .action-btn.secondary {
    background: #f7fafc;
    color: #4a5568;
    border: 1px solid #e2e8f0;
  }

  .action-btn.secondary:hover {
    background: #edf2f7;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .exercise-session, .session-results {
      padding: 16px;
    }

    .session-header {
      flex-direction: column;
      gap: 16px;
    }

    .session-meta {
      flex-direction: column;
      gap: 8px;
    }

    .live-stats {
      flex-direction: column;
      gap: 16px;
    }

    .navigation-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .results-grid {
      grid-template-columns: 1fr;
    }

    .final-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
