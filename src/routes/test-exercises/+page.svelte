<!-- 🎯 FunLearning V3.0 - Test des Exercices Phase 3 -->
<script lang="ts">
  import { onMount } from "svelte";
  import QCMCard from "$lib/components/exercises/QCMCard.svelte";
  import {
    currentExercise,
    exerciseProgress,
    exerciseActions,
  } from "$lib/stores/exercises";
  import type { QCMExercise, ExerciseCollection } from "$lib/types/exercise";

  // État local
  let currentResult: any = null;
  let showResult = false;
  let selectedOptions: string[] = [];

  // Collection d'exercices de test
  const testCollection: ExerciseCollection = {
    id: "test-collection-1",
    title: "Quiz JavaScript Débutant",
    description: "Testez vos connaissances de base en JavaScript",
    totalPoints: 30,
    estimatedTime: 10,
    exercises: [
      {
        id: "js-1",
        title: "Variables JavaScript",
        description: "Connaissances de base sur les variables",
        type: "qcm",
        difficulty: "debutant",
        points: 10,
        category: "javascript",
        tags: ["variables", "fondamentaux"],
        question:
          "Quelle est la façon correcte de déclarer une variable en JavaScript moderne ?",
        options: [
          {
            id: "opt1",
            text: 'var myVariable = "Hello";',
            isCorrect: false,
            explanation: "var est l'ancienne syntaxe, pas recommandée",
          },
          {
            id: "opt2",
            text: 'let myVariable = "Hello";',
            isCorrect: true,
            explanation: "let est la syntaxe moderne recommandée",
          },
          {
            id: "opt3",
            text: 'variable myVariable = "Hello";',
            isCorrect: false,
            explanation: "Cette syntaxe n'existe pas en JavaScript",
          },
          {
            id: "opt4",
            text: 'const myVariable = "Hello";',
            isCorrect: true,
            explanation:
              "const est aussi recommandé pour les valeurs constantes",
          },
        ],
        explanation:
          "En JavaScript moderne, utilisez let pour les variables qui changent et const pour les constantes.",
        multipleCorrect: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as QCMExercise,
    ],
  };

  onMount(() => {
    console.log("🎯 Initialisation du test des exercices");
    exerciseActions.loadCollection(testCollection);
  });

  async function handleSubmit(
    event: CustomEvent<{ selectedOptions: string[] }>
  ) {
    const result = await exerciseActions.submitQCMAnswer(
      event.detail.selectedOptions
    );
    if (result) {
      currentResult = result;
      showResult = true;
      selectedOptions = event.detail.selectedOptions;
    }
  }

  function handleNext() {
    showResult = false;
    currentResult = null;
    selectedOptions = [];
    exerciseActions.nextExercise();
  }

  function handleRestart() {
    showResult = false;
    currentResult = null;
    selectedOptions = [];
    exerciseActions.loadCollection(testCollection);
  }

  // Reactive statements
  $: progress = $exerciseProgress;
  $: exercise = $currentExercise as QCMExercise;
  $: isLastExercise = progress.current === progress.total;
  $: isCollectionComplete = !exercise && progress.current > 0;
</script>

<svelte:head>
  <title>Test Exercices - FunLearning V3.0</title>
</svelte:head>

<div class="test-exercises-page">
  <header class="page-header">
    <h1>🎯 Test des Exercices - Phase 3</h1>
    <p>Système d'exercices QCM interactifs avec validation automatique</p>
  </header>

  <div class="container">
    {#if exercise}
      <!-- Barre de progression -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-text">
            Question {progress.current} sur {progress.total}
          </span>
          <span class="progress-percentage">{progress.percentage}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progress.percentage}%" />
        </div>
      </div>

      <!-- Exercice actuel -->
      <div class="exercise-section">
        <QCMCard
          {exercise}
          disabled={showResult}
          {showResult}
          {selectedOptions}
          on:submit={handleSubmit}
        />
      </div>

      <!-- Résultat -->
      {#if showResult && currentResult}
        <div class="result-section">
          <div class="result-card" class:correct={currentResult.isCorrect}>
            <div class="result-header">
              <div class="result-icon">
                {currentResult.isCorrect ? "🎉" : "💪"}
              </div>
              <div class="result-info">
                <h3 class="result-title">{currentResult.feedback}</h3>
                <p class="result-score">
                  Score: {currentResult.score}/{currentResult.maxScore} points
                </p>
              </div>
            </div>

            {#if currentResult.explanation}
              <div class="result-explanation">
                <strong>📖 Explication:</strong>
                <p>{currentResult.explanation}</p>
              </div>
            {/if}

            <div class="result-actions">
              {#if isLastExercise}
                <button class="btn btn-primary" on:click={handleRestart}>
                  🔄 Recommencer le quiz
                </button>
              {:else}
                <button class="btn btn-primary" on:click={handleNext}>
                  ➡️ Question suivante
                </button>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    {:else if isCollectionComplete}
      <!-- Quiz terminé -->
      <div class="completion-section">
        <div class="completion-card">
          <div class="completion-icon">🏆</div>
          <h2>Quiz terminé !</h2>
          <p>
            Félicitations ! Vous avez terminé tous les exercices de cette
            collection.
          </p>

          <div class="completion-stats">
            <div class="stat">
              <span class="stat-label">Questions</span>
              <span class="stat-value">{progress.total}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Progression</span>
              <span class="stat-value">{progress.percentage}%</span>
            </div>
          </div>

          <button class="btn btn-secondary" on:click={handleRestart}>
            🔄 Recommencer
          </button>
        </div>
      </div>
    {:else}
      <!-- Chargement -->
      <div class="loading-section">
        <div class="loading-spinner">⏳</div>
        <p>Chargement des exercices...</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .test-exercises-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
  }

  .page-header {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .page-header p {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  .progress-section {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .progress-text {
    font-weight: 600;
    color: #2c3e50;
  }

  .progress-percentage {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .progress-bar {
    background: #e9ecef;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    background: linear-gradient(135deg, #667eea, #764ba2);
    height: 100%;
    transition: width 0.5s ease;
  }

  .exercise-section {
    margin-bottom: 2rem;
  }

  .result-section {
    margin-top: 2rem;
  }

  .result-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #e74c3c;
    transition: all 0.3s ease;
  }

  .result-card.correct {
    border-left-color: #27ae60;
  }

  .result-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .result-icon {
    font-size: 2rem;
    margin-right: 1rem;
  }

  .result-title {
    margin: 0;
    color: #2c3e50;
    font-size: 1.3rem;
  }

  .result-score {
    margin: 0.5rem 0 0 0;
    font-weight: 600;
    color: #7f8c8d;
  }

  .result-explanation {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border-left: 3px solid #3498db;
  }

  .result-explanation strong {
    color: #2c3e50;
    display: block;
    margin-bottom: 0.5rem;
  }

  .result-actions {
    text-align: center;
  }

  .completion-section {
    text-align: center;
  }

  .completion-card {
    background: white;
    padding: 3rem 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .completion-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .completion-card h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  .completion-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0;
  }

  .stat {
    text-align: center;
  }

  .stat-label {
    display: block;
    font-size: 0.9rem;
    color: #7f8c8d;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
  }

  .loading-section {
    text-align: center;
    padding: 3rem;
    color: white;
  }

  .loading-spinner {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  }

  .btn-secondary:hover {
    box-shadow: 0 8px 25px rgba(149, 165, 166, 0.4);
  }

  @media (max-width: 768px) {
    .test-exercises-page {
      padding: 1rem 0.5rem;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .progress-section {
      padding: 1rem;
    }

    .completion-stats {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
