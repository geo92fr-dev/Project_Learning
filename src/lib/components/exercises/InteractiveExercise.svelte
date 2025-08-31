<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import QCMCard from "$lib/components/exercises/QCMCard.svelte";
  import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte";

  const dispatch = createEventDispatcher<{
    complete: { score: number; answers: Record<string, any> };
    progress: { current: number; total: number };
  }>();

  export let exerciseData = {
    id: "math-fractions-demo",
    title: "Les Fractions : Exercice Interactif",
    description:
      "Testez vos connaissances sur les fractions avec ces questions interactives",
    instruction: `# 🧮 Exercice : Les Fractions

Répondez aux questions suivantes pour tester votre compréhension des fractions.

**Consignes :**
- Lisez chaque question attentivement
- Choisissez la meilleure réponse
- Validez votre réponse avant de passer à la suivante

*Temps recommandé : 10 minutes*`,
    questions: [
      {
        id: "q1",
        question: "Quelle fraction représente la moitié d'une pizza ?",
        options: [
          { id: "a", text: "1/4", isCorrect: false },
          { id: "b", text: "1/2", isCorrect: true },
          { id: "c", text: "2/4", isCorrect: false },
          { id: "d", text: "1/3", isCorrect: false },
        ],
      },
      {
        id: "q2",
        question: "Comment simplifier la fraction 6/8 ?",
        options: [
          { id: "a", text: "2/3", isCorrect: false },
          { id: "b", text: "3/4", isCorrect: true },
          { id: "c", text: "1/2", isCorrect: false },
          { id: "d", text: "6/8 est déjà simplifiée", isCorrect: false },
        ],
      },
      {
        id: "q3",
        question: "Que donne 1/4 + 1/4 ?",
        options: [
          { id: "a", text: "2/8", isCorrect: false },
          { id: "b", text: "1/2", isCorrect: true },
          { id: "c", text: "2/4", isCorrect: false },
          { id: "d", text: "1/8", isCorrect: false },
        ],
      },
      {
        id: "q4",
        question: "Laquelle de ces fractions est la plus grande ?",
        options: [
          { id: "a", text: "1/3", isCorrect: false },
          { id: "b", text: "1/4", isCorrect: false },
          { id: "c", text: "1/2", isCorrect: true },
          { id: "d", text: "1/5", isCorrect: false },
        ],
      },
    ],
  };

  let currentQuestionIndex = 0;
  let answers: Record<string, any> = {};
  let showResults: Record<string, boolean> = {};
  let exerciseComplete = false;
  let score = 0;

  $: currentQuestion = exerciseData.questions[currentQuestionIndex];
  $: progress =
    ((currentQuestionIndex + 1) / exerciseData.questions.length) * 100;
  $: canProceed = answers[currentQuestion?.id];

  function handleAnswer(event: CustomEvent) {
    const { questionId, selectedOption, isCorrect } = event.detail;

    answers[questionId] = {
      selectedOption,
      isCorrect,
      timestamp: new Date().toISOString(),
    };

    // Dispatch progress
    dispatch("progress", {
      current: Object.keys(answers).length,
      total: exerciseData.questions.length,
    });
  }

  function validateCurrentAnswer() {
    if (!currentQuestion || !answers[currentQuestion.id]) return;

    showResults[currentQuestion.id] = true;

    setTimeout(() => {
      if (currentQuestionIndex < exerciseData.questions.length - 1) {
        nextQuestion();
      } else {
        completeExercise();
      }
    }, 2000);
  }

  function nextQuestion() {
    if (currentQuestionIndex < exerciseData.questions.length - 1) {
      currentQuestionIndex += 1;
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex -= 1;
    }
  }

  function completeExercise() {
    exerciseComplete = true;

    // Calculate score
    score = exerciseData.questions.reduce((total, question) => {
      const answer = answers[question.id];
      return total + (answer?.isCorrect ? 1 : 0);
    }, 0);

    const percentage = Math.round(
      (score / exerciseData.questions.length) * 100
    );

    dispatch("complete", { score: percentage, answers });
  }

  function resetExercise() {
    currentQuestionIndex = 0;
    answers = {};
    showResults = {};
    exerciseComplete = false;
    score = 0;
  }

  function goToQuestion(index: number) {
    currentQuestionIndex = index;
  }
</script>

<div class="interactive-exercise">
  <header class="exercise-header">
    <h1>{exerciseData.title}</h1>
    <p class="exercise-description">{exerciseData.description}</p>

    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress}%" />
      </div>
      <span class="progress-text">
        Question {currentQuestionIndex + 1} sur {exerciseData.questions.length}
      </span>
    </div>
  </header>

  {#if !exerciseComplete}
    <div class="exercise-content">
      <!-- Instructions (shown only on first question) -->
      {#if currentQuestionIndex === 0}
        <div class="instructions">
          <MarkdownRenderer content={exerciseData.instruction} />
        </div>
      {/if}

      <!-- Question Navigation -->
      <div class="question-navigation">
        <div class="question-tabs">
          {#each exerciseData.questions as question, index}
            <button
              class="question-tab"
              class:active={index === currentQuestionIndex}
              class:answered={answers[question.id]}
              class:correct={answers[question.id]?.isCorrect}
              class:incorrect={answers[question.id] &&
                !answers[question.id].isCorrect}
              on:click={() => goToQuestion(index)}
            >
              {index + 1}
              {#if answers[question.id]}
                <span class="tab-indicator">
                  {answers[question.id].isCorrect ? "✓" : "✗"}
                </span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Current Question -->
      {#if currentQuestion}
        <div class="question-container">
          <QCMCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedAnswer={answers[currentQuestion.id]?.selectedOption}
            showResults={showResults[currentQuestion.id] || false}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={exerciseData.questions.length}
            on:answer={handleAnswer}
            on:validate={validateCurrentAnswer}
          />
        </div>
      {/if}

      <!-- Navigation Controls -->
      <div class="exercise-controls">
        <button
          class="btn btn-secondary"
          disabled={currentQuestionIndex === 0}
          on:click={previousQuestion}
        >
          ← Précédent
        </button>

        {#if !showResults[currentQuestion?.id]}
          <button
            class="btn btn-primary"
            disabled={!canProceed}
            on:click={validateCurrentAnswer}
          >
            Valider la réponse
          </button>
        {:else if currentQuestionIndex < exerciseData.questions.length - 1}
          <button class="btn btn-primary" on:click={nextQuestion}>
            Question suivante →
          </button>
        {:else}
          <button class="btn btn-success" on:click={completeExercise}>
            Terminer l'exercice
          </button>
        {/if}
      </div>
    </div>
  {:else}
    <!-- Results -->
    <div class="exercise-results">
      <div class="results-header">
        <h2>🎉 Exercice terminé !</h2>
        <div class="score-display">
          <div class="score-circle">
            <span class="score-number"
              >{Math.round(
                (score / exerciseData.questions.length) * 100
              )}%</span
            >
            <span class="score-label">Score</span>
          </div>
        </div>
      </div>

      <div class="results-details">
        <h3>Détail de vos réponses</h3>
        <div class="results-grid">
          {#each exerciseData.questions as question, index}
            {@const answer = answers[question.id]}
            <div class="result-item">
              <div class="result-header">
                <span class="question-number">Q{index + 1}</span>
                <span
                  class="result-indicator {answer?.isCorrect
                    ? 'correct'
                    : 'incorrect'}"
                >
                  {answer?.isCorrect ? "✓" : "✗"}
                </span>
              </div>
              <p class="result-question">{question.question}</p>
              <div class="result-answer">
                <strong>Votre réponse :</strong>
                {question.options.find(
                  (opt) => opt.id === answer?.selectedOption
                )?.text}
              </div>
              {#if !answer?.isCorrect}
                <div class="result-correct">
                  <strong>Bonne réponse :</strong>
                  {question.options.find((opt) => opt.isCorrect)?.text}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <div class="results-actions">
        <button class="btn btn-primary" on:click={resetExercise}>
          Recommencer l'exercice
        </button>
        <button
          class="btn btn-secondary"
          on:click={() => window.history.back()}
        >
          Retour aux cours
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .interactive-exercise {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .exercise-header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e9ecef;
  }

  .exercise-header h1 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 2rem;
  }

  .exercise-description {
    color: #6c757d;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .progress-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .progress-bar {
    width: 100%;
    max-width: 400px;
    height: 0.5rem;
    background: #e9ecef;
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #007bff, #0056b3);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
  }

  .instructions {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 0.75rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .question-navigation {
    margin-bottom: 2rem;
  }

  .question-tabs {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .question-tab {
    width: 3rem;
    height: 3rem;
    border: 2px solid #e9ecef;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transition: all 0.2s ease;
    position: relative;
  }

  .question-tab:hover {
    border-color: #007bff;
  }

  .question-tab.active {
    border-color: #007bff;
    background: #007bff;
    color: white;
  }

  .question-tab.answered {
    border-color: #6c757d;
    background: #f8f9fa;
  }

  .question-tab.correct {
    border-color: #28a745;
    background: #28a745;
    color: white;
  }

  .question-tab.incorrect {
    border-color: #dc3545;
    background: #dc3545;
    color: white;
  }

  .tab-indicator {
    position: absolute;
    bottom: -0.25rem;
    right: -0.25rem;
    width: 1rem;
    height: 1rem;
    background: inherit;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    border: 2px solid white;
  }

  .question-container {
    margin-bottom: 2rem;
  }

  .exercise-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #545b62;
  }

  .btn-success {
    background: #28a745;
    color: white;
  }

  .btn-success:hover:not(:disabled) {
    background: #1e7e34;
  }

  .exercise-results {
    text-align: center;
  }

  .results-header {
    margin-bottom: 3rem;
  }

  .results-header h2 {
    margin: 0 0 2rem 0;
    color: #2c3e50;
    font-size: 2rem;
  }

  .score-display {
    display: flex;
    justify-content: center;
  }

  .score-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .score-number {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .score-label {
    font-size: 1rem;
    opacity: 0.9;
  }

  .results-details {
    margin-bottom: 3rem;
    text-align: left;
  }

  .results-details h3 {
    text-align: center;
    margin-bottom: 2rem;
    color: #495057;
  }

  .results-grid {
    display: grid;
    gap: 1.5rem;
  }

  .result-item {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 0.75rem;
    padding: 1.5rem;
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .question-number {
    background: #6c757d;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .result-indicator {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
  }

  .result-indicator.correct {
    background: #28a745;
  }

  .result-indicator.incorrect {
    background: #dc3545;
  }

  .result-question {
    font-weight: 600;
    margin-bottom: 1rem;
    color: #495057;
  }

  .result-answer,
  .result-correct {
    margin-bottom: 0.5rem;
    color: #6c757d;
  }

  .result-correct {
    color: #28a745;
  }

  .results-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .interactive-exercise {
      padding: 1rem;
      margin: 1rem;
    }

    .exercise-header h1 {
      font-size: 1.5rem;
    }

    .exercise-controls {
      flex-direction: column;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }

    .question-tabs {
      gap: 0.25rem;
    }

    .question-tab {
      width: 2.5rem;
      height: 2.5rem;
    }

    .score-circle {
      width: 120px;
      height: 120px;
    }

    .score-number {
      font-size: 2rem;
    }

    .results-actions {
      flex-direction: column;
    }
  }
</style>
