<!--
  🎯 Fill Blanks Exercise Card - Phase 9
  Composant pour exercices de texte à trous avec validation intelligente
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { FillBlanksExercise, UserAnswer, ExerciseResult } from '$lib/types/exercise.js';
  import { exerciseService } from '$lib/services/exerciseService.js';

  // Props
  export let exercise: FillBlanksExercise;
  export let showResult: boolean = false;
  export let timeLimit: number | null = null;

  // State
  let userAnswers: string[] = [];
  let submitted = false;
  let result: ExerciseResult | null = null;
  let timeRemaining = timeLimit;
  let timer: NodeJS.Timeout | null = null;
  let inputRefs: HTMLInputElement[] = [];

  const dispatch = createEventDispatcher<{
    submit: { exercise: FillBlanksExercise; result: ExerciseResult };
    timeUp: { exercise: FillBlanksExercise };
  }>();

  // Initialiser les réponses utilisateur
  $: if (exercise && userAnswers.length === 0) {
    userAnswers = new Array(exercise.blanks.length).fill('');
  }

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
    if (!submitted) {
      submitAnswer();
      dispatch('timeUp', { exercise });
    }
  }

  function updateAnswer(index: number, value: string) {
    if (submitted) return;
    userAnswers[index] = value;
    userAnswers = [...userAnswers]; // Réactivité Svelte
  }

  function submitAnswer() {
    if (submitted) return;

    const userAnswer: UserAnswer = {
      exerciseId: exercise.id,
      type: 'fill-blanks',
      answer: userAnswers,
      timeSpent: timeLimit ? (timeLimit - (timeRemaining || 0)) : 0,
      submittedAt: new Date()
    };

    result = exerciseService.evaluateUserAnswer(exercise, userAnswer);
    submitted = true;

    if (timer) clearInterval(timer);

    dispatch('submit', { exercise, result });
  }

  function getInputClass(index: number): string {
    const base = 'blank-input';
    
    if (!submitted) {
      return base;
    }

    // Après soumission, colorer selon la correction
    const userInput = userAnswers[index]?.toLowerCase() || '';
    const blank = exercise.blanks[index];
    const correctAnswers = blank.correctAnswers.map(answer => 
      exercise.caseSensitive ? answer : answer.toLowerCase()
    );
    
    const isCorrect = correctAnswers.includes(userInput);
    return `${base} ${isCorrect ? 'correct' : 'incorrect'}`;
  }

  function renderTextWithBlanks(): Array<{type: 'text' | 'blank', content: string, index?: number}> {
    const parts = exercise.text.split(/\{\{blank\}\}/);
    const result: Array<{type: 'text' | 'blank', content: string, index?: number}> = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        result.push({ type: 'text' as const, content: parts[i] });
      }
      
      if (i < parts.length - 1) {
        result.push({ type: 'blank' as const, content: '', index: i });
      }
    }
    
    return result;
  }

  function clearAnswers() {
    if (submitted) return;
    userAnswers = new Array(exercise.blanks.length).fill('');
    inputRefs.forEach(input => {
      if (input) input.value = '';
    });
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      const index = parseInt(target.dataset.index || '0');
      if (index < exercise.blanks.length - 1) {
        // Passer au champ suivant
        inputRefs[index + 1]?.focus();
      } else {
        // Dernier champ, soumettre si possible
        if (userAnswers.every(answer => answer.trim() !== '')) {
          submitAnswer();
        }
      }
    }
  }

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const input = target.closest('input');
    if (input) {
      const index = parseInt(input.dataset.index || '0');
      updateAnswer(index, target.value || '');
    }
  }

  // Nettoyage du timer
  $: if (submitted && timer) {
    clearInterval(timer);
    timer = null;
  }
</script>

<div class="fill-blanks-exercise">
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
      <span class="blanks-count">{exercise.blanks.length} mot{exercise.blanks.length > 1 ? 's' : ''} à compléter</span>
      {#if timeRemaining !== null}
        <span class="timer" class:warning={timeRemaining < 30}>
          ⏱️ {formatTime(timeRemaining)}
        </span>
      {/if}
    </div>
  </div>

  <!-- Instructions -->
  <div class="instructions">
    <p>📝 Complétez le texte en remplissant les mots manquants dans les cases ci-dessous.</p>
    {#if !exercise.caseSensitive}
      <p class="note">💡 La casse (majuscules/minuscules) n'est pas prise en compte.</p>
    {/if}
  </div>

  <!-- Texte avec trous -->
  <div class="text-container">
    <div class="text-content">
      {#each renderTextWithBlanks() as part}
        {#if part.type === 'text'}
          <span class="text-part">{part.content}</span>
        {:else if part.type === 'blank' && part.index !== undefined}
          <input
            bind:this={inputRefs[part.index]}
            type="text"
            class={getInputClass(part.index)}
            placeholder="..."
            disabled={submitted}
            data-index={part.index}
            on:input={handleInputChange}
            on:keypress={handleKeyPress}
            autocomplete="off"
            spellcheck="false"
          />
          {#if submitted && exercise.blanks[part.index].hint}
            <span class="hint">💡 {exercise.blanks[part.index].hint}</span>
          {/if}
        {/if}
      {/each}
    </div>
  </div>

  <!-- Indices -->
  {#if !submitted && exercise.blanks.some(blank => blank.hint)}
    <div class="hints-container">
      <h4>💡 Indices :</h4>
      <div class="hints-list">
        {#each exercise.blanks as blank, index}
          {#if blank.hint}
            <div class="hint-item">
              <span class="hint-number">Mot {index + 1} :</span>
              <span class="hint-text">{blank.hint}</span>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <!-- Actions -->
  {#if !submitted}
    <div class="actions">
      <button
        type="button"
        class="submit-btn"
        disabled={userAnswers.some(answer => answer.trim() === '')}
        on:click={submitAnswer}
      >
        Valider mes réponses
      </button>
      
      {#if userAnswers.some(answer => answer.trim() !== '')}
        <button
          type="button"
          class="clear-btn"
          on:click={clearAnswers}
        >
          Effacer tout
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
          <span class="result-text">Parfait !</span>
        {:else}
          <span class="result-icon">📝</span>
          <span class="result-text">Presque !</span>
        {/if}
        <span class="score">{result.score}/{result.maxScore} points</span>
      </div>
      
      <div class="feedback">
        <p>{result.feedback}</p>
        
        <!-- Correction détaillée -->
        <div class="corrections">
          <h5>✏️ Corrections :</h5>
          {#each exercise.blanks as blank, index}
            {@const userInput = userAnswers[index]?.toLowerCase() || ''}
            {@const correctAnswers = blank.correctAnswers.map(answer => 
              exercise.caseSensitive ? answer : answer.toLowerCase()
            )}
            {@const isCorrect = correctAnswers.includes(userInput)}
            
            <div class="correction-item" class:correct={isCorrect} class:incorrect={!isCorrect}>
              <span class="correction-number">Mot {index + 1} :</span>
              <span class="user-answer">"{userAnswers[index] || '(vide)'}"</span>
              {#if !isCorrect}
                <span class="correct-answer">→ "{blank.correctAnswers[0]}"</span>
              {:else}
                <span class="validation">✅</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .fill-blanks-exercise {
    max-width: 800px;
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

  .blanks-count {
    color: #666;
    font-weight: 500;
  }

  .timer {
    color: #e53e3e;
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }

  .timer.warning {
    animation: pulse 1s infinite;
  }

  .instructions {
    margin-bottom: 24px;
    padding: 16px;
    background: #f7fafc;
    border-radius: 8px;
    border-left: 4px solid #3182ce;
  }

  .instructions p {
    margin: 0 0 8px 0;
    color: #4a5568;
  }

  .instructions .note {
    color: #666;
    font-size: 0.925rem;
    font-style: italic;
    margin: 8px 0 0 0;
  }

  .text-container {
    margin-bottom: 24px;
  }

  .text-content {
    background: #fafafa;
    padding: 24px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    font-size: 1.125rem;
    line-height: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px;
  }

  .text-part {
    color: #2d3748;
  }

  .blank-input {
    display: inline-block;
    border: none;
    border-bottom: 3px solid #3182ce;
    background: white;
    padding: 4px 8px;
    font-size: 1.125rem;
    font-weight: 600;
    text-align: center;
    min-width: 80px;
    border-radius: 4px 4px 0 0;
    transition: all 0.2s ease;
  }

  .blank-input:focus {
    outline: none;
    border-bottom-color: #2c5282;
    background: #ebf8ff;
    box-shadow: 0 2px 8px rgba(49, 130, 206, 0.15);
  }

  .blank-input.correct {
    border-bottom-color: #38a169;
    background: #f0fff4;
    color: #2f855a;
  }

  .blank-input.incorrect {
    border-bottom-color: #e53e3e;
    background: #fed7d7;
    color: #c53030;
  }

  .blank-input:disabled {
    cursor: not-allowed;
  }

  .hint {
    display: block;
    font-size: 0.75rem;
    color: #666;
    font-style: italic;
    margin-top: 4px;
    background: white;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  .hints-container {
    margin-bottom: 24px;
    padding: 16px;
    background: #fffaf0;
    border-radius: 8px;
    border: 1px solid #fed7aa;
  }

  .hints-container h4 {
    margin: 0 0 12px 0;
    color: #744210;
    font-size: 1rem;
  }

  .hints-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hint-item {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .hint-number {
    color: #d69e2e;
    font-weight: 600;
    min-width: 70px;
  }

  .hint-text {
    color: #744210;
    flex: 1;
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
    margin-bottom: 16px;
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
    margin: 0 0 16px 0;
    line-height: 1.5;
  }

  .corrections {
    padding: 16px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
  }

  .corrections h5 {
    margin: 0 0 12px 0;
    color: #2d3748;
    font-size: 1rem;
  }

  .correction-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 6px;
  }

  .correction-item.correct {
    background: rgba(56, 161, 105, 0.1);
  }

  .correction-item.incorrect {
    background: rgba(229, 62, 62, 0.1);
  }

  .correction-number {
    font-weight: 600;
    color: #4a5568;
    min-width: 70px;
  }

  .user-answer {
    font-weight: 600;
    color: #2d3748;
  }

  .correct-answer {
    color: #38a169;
    font-weight: 600;
  }

  .validation {
    margin-left: auto;
    font-size: 1.2rem;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .fill-blanks-exercise {
      padding: 16px;
    }

    .exercise-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .text-content {
      padding: 16px;
      font-size: 1rem;
      line-height: 1.8;
    }

    .blank-input {
      font-size: 1rem;
      min-width: 60px;
    }

    .actions {
      flex-direction: column;
      align-items: stretch;
    }

    .submit-btn, .clear-btn {
      width: 100%;
    }

    .correction-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
</style>
