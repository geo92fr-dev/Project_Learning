<!-- 🎯 FunLearning V3.0 - Phase 3 Composant QCM -->
<!-- Composant interactif pour Questions à Choix Multiples -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { QCMExercise, QCMOption } from "$lib/types/exercise";

  export let exercise: QCMExercise;
  export let disabled = false;
  export let showResult = false;
  export let selectedOptions: string[] = [];

  const dispatch = createEventDispatcher<{
    submit: { selectedOptions: string[] };
    optionChange: { selectedOptions: string[] };
  }>();

  let localSelected: string[] = [...selectedOptions];

  function handleOptionChange(optionId: string, isChecked: boolean) {
    if (disabled) return;

    if (exercise.multipleCorrect) {
      // QCM multiple : checkbox
      if (isChecked) {
        localSelected = [...localSelected, optionId];
      } else {
        localSelected = localSelected.filter((id) => id !== optionId);
      }
    } else {
      // QCM simple : radio
      localSelected = isChecked ? [optionId] : [];
    }

    dispatch("optionChange", { selectedOptions: localSelected });
  }

  function handleSubmit() {
    if (disabled || localSelected.length === 0) return;
    dispatch("submit", { selectedOptions: localSelected });
  }

  function getOptionClass(option: QCMOption): string {
    const baseClass = "option-card";
    const isSelected = localSelected.includes(option.id);

    if (!showResult) {
      return `${baseClass} ${isSelected ? "selected" : ""}`;
    }

    // Mode résultat : colorier selon correct/incorrect
    if (option.isCorrect) {
      return `${baseClass} correct ${isSelected ? "selected" : ""}`;
    } else if (isSelected) {
      return `${baseClass} incorrect selected`;
    }

    return `${baseClass} ${isSelected ? "selected" : ""}`;
  }

  $: canSubmit = !disabled && localSelected.length > 0;
</script>

<div class="qcm-exercise">
  <div class="exercise-header">
    <div class="exercise-meta">
      <span class="difficulty difficulty-{exercise.difficulty}"
        >{exercise.difficulty}</span
      >
      <span class="points">{exercise.points} pts</span>
      {#if exercise.timeLimit}
        <span class="time-limit">⏱️ {exercise.timeLimit}s</span>
      {/if}
    </div>
    <h3 class="exercise-title">{exercise.title}</h3>
    {#if exercise.description}
      <p class="exercise-description">{exercise.description}</p>
    {/if}
  </div>

  <div class="question-section">
    <h4 class="question">{exercise.question}</h4>
    <p class="instruction">
      {exercise.multipleCorrect
        ? "📝 Sélectionnez toutes les bonnes réponses"
        : "📝 Sélectionnez la bonne réponse"}
    </p>
  </div>

  <div class="options-list">
    {#each exercise.options as option (option.id)}
      <label class={getOptionClass(option)}>
        <input
          type={exercise.multipleCorrect ? "checkbox" : "radio"}
          name="qcm-{exercise.id}"
          value={option.id}
          checked={localSelected.includes(option.id)}
          {disabled}
          on:change={(e) =>
            handleOptionChange(option.id, e.currentTarget.checked)}
        />
        <div class="option-content">
          <span class="option-text">{option.text}</span>
          {#if showResult && localSelected.includes(option.id) && option.explanation}
            <div class="option-explanation">
              💡 {option.explanation}
            </div>
          {/if}
        </div>
        <div class="option-indicator">
          {#if showResult}
            {#if option.isCorrect}
              ✅
            {:else if localSelected.includes(option.id)}
              ❌
            {/if}
          {/if}
        </div>
      </label>
    {/each}
  </div>

  {#if !showResult}
    <div class="exercise-actions">
      <button
        class="submit-btn"
        class:disabled={!canSubmit}
        {disabled}
        on:click={handleSubmit}
      >
        {#if localSelected.length === 0}
          Sélectionnez une réponse
        {:else}
          Valider ({localSelected.length} sélectionnée{localSelected.length > 1
            ? "s"
            : ""})
        {/if}
      </button>
    </div>
  {/if}

  {#if showResult && exercise.explanation}
    <div class="exercise-explanation">
      <h5>💡 Explication</h5>
      <p>{exercise.explanation}</p>
    </div>
  {/if}
</div>

<style>
  .qcm-exercise {
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .exercise-header {
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
  }

  .exercise-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .difficulty {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-weight: 500;
    text-transform: capitalize;
  }

  .difficulty-debutant {
    background: #e8f5e8;
    color: #2d6b2d;
  }
  .difficulty-intermediaire {
    background: #fff3cd;
    color: #856404;
  }
  .difficulty-avance {
    background: #f8d7da;
    color: #721c24;
  }
  .difficulty-expert {
    background: #d1ecf1;
    color: #0c5460;
  }

  .points,
  .time-limit {
    padding: 0.25rem 0.75rem;
    background: #f8f9fa;
    border-radius: 20px;
    color: #6c757d;
  }

  .exercise-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .exercise-description {
    color: #6c757d;
    margin: 0.5rem 0 0 0;
    line-height: 1.5;
  }

  .question-section {
    margin-bottom: 1.5rem;
  }

  .question {
    font-size: 1.2rem;
    font-weight: 500;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
  }

  .instruction {
    color: #6c757d;
    font-style: italic;
    margin: 0;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .option-card {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
  }

  .option-card:hover {
    border-color: #007bff;
    background: #f8f9ff;
  }

  .option-card.selected {
    border-color: #007bff;
    background: #e7f3ff;
  }

  .option-card.correct {
    border-color: #28a745;
    background: #f8fff8;
  }

  .option-card.incorrect {
    border-color: #dc3545;
    background: #fff8f8;
  }

  .option-card input {
    margin-right: 1rem;
    margin-top: 0.1rem;
  }

  .option-content {
    flex: 1;
  }

  .option-text {
    display: block;
    font-weight: 500;
    color: #2c3e50;
    line-height: 1.4;
  }

  .option-explanation {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #6c757d;
  }

  .option-indicator {
    font-size: 1.2rem;
    margin-left: 0.5rem;
  }

  .exercise-actions {
    display: flex;
    justify-content: center;
    padding-top: 1rem;
  }

  .submit-btn {
    padding: 0.75rem 2rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:hover:not(.disabled) {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .submit-btn.disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .exercise-explanation {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #007bff;
  }

  .exercise-explanation h5 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }

  .exercise-explanation p {
    margin: 0;
    color: #6c757d;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .qcm-exercise {
      padding: 1rem;
    }

    .exercise-meta {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .exercise-title {
      font-size: 1.3rem;
    }

    .question {
      font-size: 1.1rem;
    }

    .option-card {
      padding: 0.75rem;
    }
  }
</style>
