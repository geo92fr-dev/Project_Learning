<script lang="ts">
  import { onMount } from "svelte";
  import { pedagogy, pedagogyState, assessmentProgress } from "$lib/stores/pedagogy.js";

  // Props
  export let domain: string = "javascript";
  export let questionCount: number = 3;

  // État local
  let currentQuestion: any = null;
  let selectedAnswer: string | number | null = null;
  let showResult = false;

  // Stores réactifs
  $: assessmentState = $pedagogyState;
  $: progress = $assessmentProgress;
  $: result = assessmentState.lastAssessmentResult;

  // Lifecycle
  onMount(() => {
    // Auto-démarrer l'évaluation pour la démo
    startAssessment();
  });

  // Fonctions
  async function startAssessment() {
    await pedagogy.assessment.startAssessment(domain, questionCount);
  }

  function submitAnswer() {
    if (selectedAnswer !== null) {
      pedagogy.assessment.answerQuestion(selectedAnswer);
      selectedAnswer = null;
    }
  }

  function restartAssessment() {
    showResult = false;
    startAssessment();
  }

  // Réactivité
  $: if (assessmentState.currentAssessment) {
    const { questions, currentQuestionIndex } = assessmentState.currentAssessment;
    currentQuestion = questions[currentQuestionIndex] || null;
    
    // Vérifier si l'évaluation est terminée
    if (currentQuestionIndex >= questions.length) {
      showResult = true;
    }
  }

  // Formater le niveau pour l'affichage
  function formatLevel(level: string): string {
    const levels = {
      beginner: "🟢 Débutant",
      intermediate: "🟡 Intermédiaire", 
      advanced: "🔴 Avancé"
    };
    return levels[level] || level;
  }

  // Obtenir la couleur selon le score
  function getScoreColor(percentage: number): string {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning";
    return "text-error";
  }
</script>

<div class="assessment-container bg-base-100 rounded-lg shadow-lg p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold mb-2">
      🧠 Évaluation : {domain}
    </h2>
    <p class="text-base-content/70">
      Répondez aux questions pour adapter votre parcours d'apprentissage
    </p>
  </div>

  {#if !assessmentState.assessmentInProgress && !showResult}
    <!-- État initial -->
    <div class="text-center py-8">
      <div class="mb-4">
        <span class="text-6xl">🎯</span>
      </div>
      <h3 class="text-xl font-semibold mb-4">Prêt pour l'évaluation ?</h3>
      <p class="mb-6 text-base-content/70">
        Cette évaluation nous aidera à personnaliser votre expérience d'apprentissage
      </p>
      <button 
        class="btn btn-primary btn-lg"
        on:click={startAssessment}
      >
        🚀 Commencer l'évaluation
      </button>
    </div>

  {:else if assessmentState.assessmentInProgress && currentQuestion && !showResult}
    <!-- Évaluation en cours -->
    <div class="assessment-content">
      <!-- Barre de progression -->
      {#if progress}
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span>Question {progress.current} sur {progress.total}</span>
            <span>{progress.percentage}%</span>
          </div>
          <progress 
            class="progress progress-primary w-full" 
            value={progress.percentage} 
            max="100"
          ></progress>
        </div>
      {/if}

      <!-- Question -->
      <div class="question-card bg-base-200 rounded-lg p-6 mb-6">
        <div class="flex items-start gap-3 mb-4">
          <span class="badge badge-outline">
            {currentQuestion.difficulty}
          </span>
          <span class="badge badge-primary">
            {currentQuestion.concept}
          </span>
        </div>
        
        <h3 class="text-lg font-semibold mb-4">
          {currentQuestion.question}
        </h3>

        <!-- Options de réponse -->
        {#if currentQuestion.type === 'multiple-choice' && currentQuestion.options}
          <div class="space-y-3">
            {#each currentQuestion.options as option, index}
              <label class="cursor-pointer">
                <input 
                  type="radio" 
                  bind:group={selectedAnswer} 
                  value={index}
                  class="radio radio-primary mr-3"
                />
                <span class="text-base">{option}</span>
              </label>
            {/each}
          </div>
        {/if}

        {#if currentQuestion.type === 'true-false'}
          <div class="flex gap-4">
            <label class="cursor-pointer">
              <input 
                type="radio" 
                bind:group={selectedAnswer} 
                value="true"
                class="radio radio-primary mr-2"
              />
              <span>✅ Vrai</span>
            </label>
            <label class="cursor-pointer">
              <input 
                type="radio" 
                bind:group={selectedAnswer} 
                value="false"
                class="radio radio-primary mr-2"
              />
              <span>❌ Faux</span>
            </label>
          </div>
        {/if}
      </div>

      <!-- Actions -->
      <div class="flex justify-between">
        <button 
          class="btn btn-outline"
          on:click={() => pedagogy.assessment.cancelAssessment()}
        >
          Annuler
        </button>
        
        <button 
          class="btn btn-primary"
          disabled={selectedAnswer === null}
          on:click={submitAnswer}
        >
          {progress && progress.current === progress.total ? 'Terminer' : 'Suivant'}
          →
        </button>
      </div>
    </div>

  {:else if showResult && result}
    <!-- Résultats -->
    <div class="results-container">
      <!-- Score principal -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">
          {#if result.percentage >= 80}🎉
          {:else if result.percentage >= 60}👍
          {:else}💪{/if}
        </div>
        
        <h3 class="text-2xl font-bold mb-2">Évaluation terminée !</h3>
        
        <div class="stats bg-base-200 rounded-lg mb-4">
          <div class="stat">
            <div class="stat-title">Score</div>
            <div class="stat-value {getScoreColor(result.percentage)}">
              {result.score}/{result.maxScore}
            </div>
            <div class="stat-desc">{result.percentage}%</div>
          </div>
          
          <div class="stat">
            <div class="stat-title">Niveau</div>
            <div class="stat-value text-lg">
              {formatLevel(result.level)}
            </div>
          </div>
        </div>
      </div>

      <!-- Analyse détaillée -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Forces -->
        {#if result.strengths.length > 0}
          <div class="card bg-success/10 border border-success/20">
            <div class="card-body">
              <h4 class="card-title text-success">
                ✅ Vos forces
              </h4>
              <ul class="space-y-1">
                {#each result.strengths as strength}
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-success rounded-full"></span>
                    <span class="capitalize">{strength}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}

        <!-- Axes d'amélioration -->
        {#if result.weaknesses.length > 0}
          <div class="card bg-warning/10 border border-warning/20">
            <div class="card-body">
              <h4 class="card-title text-warning">
                🎯 À améliorer
              </h4>
              <ul class="space-y-1">
                {#each result.weaknesses as weakness}
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-warning rounded-full"></span>
                    <span class="capitalize">{weakness}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}
      </div>

      <!-- Recommandations -->
      {#if result.recommendations.length > 0}
        <div class="mb-8">
          <h4 class="text-xl font-semibold mb-4">📚 Cours recommandés</h4>
          <div class="space-y-3">
            {#each result.recommendations as rec}
              <div class="card bg-base-200">
                <div class="card-body p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-semibold">{rec.courseId}</h5>
                      <p class="text-sm text-base-content/70 mb-2">
                        {rec.reason}
                      </p>
                      <div class="flex gap-2">
                        <span class="badge badge-{rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'info'}">
                          {rec.priority}
                        </span>
                        <span class="badge badge-outline">
                          ⏱️ {rec.estimatedDuration}min
                        </span>
                      </div>
                    </div>
                    <button class="btn btn-sm btn-primary">
                      Commencer
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button 
          class="btn btn-outline"
          on:click={restartAssessment}
        >
          🔄 Refaire l'évaluation
        </button>
        
        <button 
          class="btn btn-primary"
          on:click={() => window.location.href = '/cours'}
        >
          🎓 Voir les cours recommandés
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .assessment-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .question-card {
    min-height: 200px;
  }

  .radio {
    transform: scale(1.1);
  }

  .stats {
    box-shadow: none;
  }

  .stat {
    padding: 1rem;
  }

  .progress {
    height: 8px;
  }

  .badge {
    font-size: 0.75rem;
  }

  .card {
    box-shadow: none;
    border: 1px solid hsl(var(--b3));
  }

  /* Animation pour les résultats */
  .results-container {
    animation: slideUp 0.5s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .stats {
      display: flex;
      flex-direction: column;
    }
    
    .stat {
      text-align: center;
    }
  }
</style>
