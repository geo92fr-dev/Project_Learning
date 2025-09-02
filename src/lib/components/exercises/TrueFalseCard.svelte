<!--
  🎯 True/False Exercise Card - Phase 9
  Composant pour exercices Vrai/Faux avec feedback immédiat
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TrueFalseExercise, UserAnswer, ExerciseResult } from '$lib/types/exercise.js';
  import { exerciseService } from '$lib/services/exerciseService.js';

  // Props
  export let exercise: TrueFalseExercise;
  export let showResult: boolean = false;
  export let timeLimit: number | null = null;

  // State
  let selectedAnswer: boolean | null = null;
  let submitted = false;
  let result: ExerciseResult | null = null;
  let timeRemaining = timeLimit;
  let timer: NodeJS.Timeout | null = null;

  const dispatch = createEventDispatcher<{
    submit: { exercise: TrueFalseExercise; result: ExerciseResult };
    timeUp: { exercise: TrueFalseExercise };
  }>();

  // Démarrer le timer si une limite de temps est définie
  $: if (timeLimit && !submitted) {
    startTimer();
  }

  function startTimer() {
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
      if (timeRemaining && timeRemaining > 0) {
        timeRemaining--;
      } else {
        handleTimeUp();
      }
    }, 1000);
  }

  function handleTimeUp() {
    if (timer) clearInterval(timer);
    if (!submitted && selectedAnswer !== null) {
      submitAnswer();
      dispatch('timeUp', { exercise });
    }
  }

  function selectAnswer(answer: boolean) {
    if (submitted) return;
    selectedAnswer = answer;
  }

  function submitAnswer() {
    if (submitted || selectedAnswer === null) return;

    const userAnswer: UserAnswer = {
      exerciseId: exercise.id,
      type: 'true-false',
      answer: selectedAnswer,
      timeSpent: timeLimit ? (timeLimit - (timeRemaining || 0)) : 0,
      submittedAt: new Date()
    };

    result = exerciseService.evaluateUserAnswer(exercise, userAnswer);
    submitted = true;

    if (timer) clearInterval(timer);

    dispatch('submit', { exercise, result });
  }

  function getButtonClass(answer: boolean): string {
    const base = 'answer-button';
    const isSelected = selectedAnswer === answer;
    
    if (!submitted) {
      return `${base} ${isSelected ? 'selected' : 'unselected'}`;
    }

    // Après soumission, colorer selon la correction
    if (answer === exercise.correctAnswer) {
      return `${base} correct`;
    } else if (isSelected && answer !== exercise.correctAnswer) {
      return `${base} incorrect`;
    } else {
      return `${base} neutral`;
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Nettoyage du timer
  $: if (submitted && timer) {
    clearInterval(timer);
    timer = null;
  }
</script>

<div class="true-false-exercise">
  <!-- En-tête de l'exercice -->
  <div class="exercise-header">
    <h3 class="exercise-title">{exercise.title}</h3>
    {#if exercise.description}
      <p class="exercise-description">{exercise.description}</p>
    {/if}
    
    <div class="exercise-meta">
      <span class="difficulty difficulty-{exercise.difficulty}">
        {exercise.difficulty}
      </span>
      <span class="points">{exercise.points} points</span>
      {#if timeRemaining !== null}
        <span class="timer" class:warning={timeRemaining < 30}>
          ⏱️ {formatTime(timeRemaining)}
        </span>
      {/if}
    </div>
  </div>

  <!-- Énoncé -->
  <div class="statement-container">
    <h4 class="statement">{exercise.statement}</h4>
    <p class="instruction">📝 Cette affirmation est-elle vraie ou fausse ?</p>
  </div>

  <!-- Boutons de réponse -->
  <div class="answers-container">
    <button
      type="button"
      class={getButtonClass(true)}
      disabled={submitted}
      on:click={() => selectAnswer(true)}
    >
      <span class="answer-icon">
        {#if submitted}
          {#if exercise.correctAnswer === true}
            ✅
          {:else if selectedAnswer === true}
            ❌
          {:else}
            ⚪
          {/if}
        {:else}
          {#if selectedAnswer === true}
            ✅
          {:else}
            ⚪
          {/if}
        {/if}
      </span>
      <span class="answer-text">VRAI</span>
    </button>

    <button
      type="button"
      class={getButtonClass(false)}
      disabled={submitted}
      on:click={() => selectAnswer(false)}
    >
      <span class="answer-icon">
        {#if submitted}
          {#if exercise.correctAnswer === false}
            ✅
          {:else if selectedAnswer === false}
            ❌
          {:else}
            ⚪
          {/if}
        {:else}
          {#if selectedAnswer === false}
            ✅
          {:else}
            ⚪
          {/if}
        {/if}
      </span>
      <span class="answer-text">FAUX</span>
    </button>
  </div>

  <!-- Actions -->
  {#if !submitted}
    <div class="actions">
      <button
        type="button"
        class="submit-btn"
        disabled={selectedAnswer === null}
        on:click={submitAnswer}
      >
        Valider ma réponse
      </button>
      
      {#if selectedAnswer !== null}
        <button
          type="button"
          class="clear-btn"
          on:click={() => selectedAnswer = null}
        >
          Effacer
        </button>
      {/if}
    </div>
  {/if}

  <!-- Résultat et feedback -->
  {#if submitted && result && showResult}
    <div class="result-container">
      <div class="result-header" class:success={result.isCorrect} class:error={!result.isCorrect}>
        {#if result.isCorrect}
          <span class="result-icon">🎉</span>
          <span class="result-text">Correct !</span>
        {:else}
          <span class="result-icon">💡</span>
          <span class="result-text">Pas tout à fait</span>
        {/if}
        <span class="score">{result.score}/{result.maxScore} points</span>
      </div>
      
      <div class="feedback">
        <p>{result.feedback}</p>
        {#if result.explanation}
          <div class="explanation">
            <strong>💡 Explication :</strong>
            <p>{result.explanation}</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .true-false-exercise {
    max-width: 700px;
    margin: 0 auto;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .exercise-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
  }

  .exercise-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 8px 0;
  }

  .exercise-description {
    color: #666;
    margin: 0 0 16px 0;
    line-height: 1.5;
  }

  .exercise-meta {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }

  .difficulty {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .difficulty-debutant { background: #e6fffa; color: #234e52; }
  .difficulty-intermediaire { background: #fef5e7; color: #744210; }
  .difficulty-avance { background: #fef2f2; color: #7f1d1d; }
  .difficulty-expert { background: #f3e8ff; color: #581c87; }

  .points {
    color: #3182ce;
    font-weight: 600;
  }

  .timer {
    color: #e53e3e;
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }

  .timer.warning {
    animation: pulse 1s infinite;
  }

  .statement-container {
    margin-bottom: 32px;
    text-align: center;
  }

  .statement {
    font-size: 1.375rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 12px 0;
    line-height: 1.4;
    padding: 20px;
    background: #f7fafc;
    border-radius: 12px;
    border-left: 4px solid #3182ce;
  }

  .instruction {
    color: #666;
    font-style: italic;
    margin: 0;
    font-size: 0.925rem;
  }

  .answers-container {
    display: flex;
    gap: 24px;
    justify-content: center;
    margin-bottom: 32px;
  }

  .answer-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px 32px;
    border: 3px solid #e2e8f0;
    border-radius: 16px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;
    font-weight: 600;
  }

  .answer-button:hover:not(:disabled) {
    border-color: #3182ce;
    box-shadow: 0 4px 20px rgba(49, 130, 206, 0.2);
    transform: translateY(-2px);
  }

  .answer-button.selected {
    border-color: #3182ce;
    background: #ebf8ff;
    box-shadow: 0 4px 20px rgba(49, 130, 206, 0.2);
  }

  .answer-button.correct {
    border-color: #38a169;
    background: #f0fff4;
    box-shadow: 0 4px 20px rgba(56, 161, 105, 0.2);
  }

  .answer-button.incorrect {
    border-color: #e53e3e;
    background: #fed7d7;
    box-shadow: 0 4px 20px rgba(229, 62, 62, 0.2);
  }

  .answer-button.neutral {
    opacity: 0.6;
  }

  .answer-button:disabled {
    cursor: not-allowed;
  }

  .answer-icon {
    font-size: 2rem;
  }

  .answer-text {
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    align-items: center;
  }

  .submit-btn {
    background: #3182ce;
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: #2c5282;
    transform: translateY(-1px);
  }

  .submit-btn:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
  }

  .clear-btn {
    background: transparent;
    color: #666;
    border: 1px solid #e2e8f0;
    padding: 14px 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-btn:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  .result-container {
    margin-top: 24px;
    padding: 20px;
    border-radius: 12px;
    border: 2px solid;
  }

  .result-container.success {
    border-color: #38a169;
    background: #f0fff4;
  }

  .result-container.error {
    border-color: #e53e3e;
    background: #fed7d7;
  }

  .result-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .result-icon {
    font-size: 1.5rem;
  }

  .result-text {
    font-weight: 700;
    font-size: 1.125rem;
  }

  .score {
    margin-left: auto;
    font-weight: 600;
    color: #3182ce;
  }

  .feedback p {
    margin: 0 0 12px 0;
    line-height: 1.5;
  }

  .explanation {
    padding: 16px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    border-left: 4px solid #3182ce;
  }

  .explanation strong {
    color: #2d3748;
  }

  .explanation p {
    margin: 8px 0 0 0;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .true-false-exercise {
      padding: 16px;
    }

    .answers-container {
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .answer-button {
      min-width: 200px;
    }

    .exercise-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .actions {
      flex-direction: column;
      align-items: stretch;
    }

    .submit-btn, .clear-btn {
      width: 100%;
    }
  }
</style>
