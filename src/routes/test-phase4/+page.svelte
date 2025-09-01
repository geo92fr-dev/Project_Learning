<script lang="ts">
  import { onMount } from 'svelte';
  import { AdaptiveEngine } from '$lib/pedagogy/preAssessment.js';
  import { metacognitionService } from '$lib/pedagogy/metacognition.js';
  import PreEvaluationQuiz from '$lib/components/PreEvaluationQuiz.svelte';

  let studentId = 'test-student-' + Date.now();
  let currentStep = 'assessment'; // assessment, metacognition, results
  let assessmentResults: any = null;
  let metacognitionPrompts: any[] = [];
  let metacognitionResults: any = null;

  onMount(() => {
    console.log('Phase 4 Test Component mounted');
  });

  function handleAssessmentComplete(event: CustomEvent) {
    console.log('Assessment completed:', event.detail);
    assessmentResults = event.detail;
    
    // Générer des prompts de métacognition basés sur les résultats
    metacognitionPrompts = [
      {
        id: 'strategy',
        category: 'Stratégie d\'apprentissage',
        text: 'Quelle stratégie avez-vous utilisée pour répondre aux questions ?',
        userResponse: ''
      },
      {
        id: 'difficulty',
        category: 'Perception de difficulté',
        text: 'Quelles questions vous ont semblé les plus difficiles et pourquoi ?',
        userResponse: ''
      },
      {
        id: 'confidence',
        category: 'Confiance',
        text: 'À quel point étiez-vous confiant dans vos réponses ?',
        userResponse: ''
      }
    ];
    
    currentStep = 'metacognition';
  }

  function handleMetacognitionComplete() {
    // Analyser les réponses de métacognition
    const responses = metacognitionPrompts.map(prompt => ({
      promptId: prompt.id,
      response: prompt.userResponse || ''
    }));
    
    metacognitionResults = {
      strategies: ['Réflexion analytique', 'Utilisation des connaissances antérieures'],
      awarenessLevel: 'Élevé',
      recommendations: [
        'Continuer à utiliser l\'analyse structurée',
        'Approfondir les concepts de base en biologie',
        'Pratiquer davantage les questions de difficulté élevée'
      ]
    };
    currentStep = 'results';
  }

  function resetTest() {
    currentStep = 'assessment';
    assessmentResults = null;
    metacognitionPrompts = [];
    metacognitionResults = null;
    studentId = 'test-student-' + Date.now();
  }
</script>

<svelte:head>
  <title>Test Phase 4 - Pédagogie Adaptative</title>
</svelte:head>

<div class="test-container">
  <header class="test-header">
    <h1>🧪 Test Phase 4 - Système de Pédagogie Adaptative</h1>
    <p>Test des fonctionnalités d'évaluation adaptative et de métacognition</p>
    
    <div class="steps-indicator">
      <div class="step" class:active={currentStep === 'assessment'}>
        1. Évaluation Adaptative
      </div>
      <div class="step" class:active={currentStep === 'metacognition'}>
        2. Métacognition
      </div>
      <div class="step" class:active={currentStep === 'results'}>
        3. Résultats
      </div>
    </div>
  </header>

  <main class="test-content">
    {#if currentStep === 'assessment'}
      <section class="assessment-section">
        <h2>📝 Évaluation Pré-Adaptative</h2>
        <p>Cette évaluation adaptera automatiquement la difficulté selon vos réponses</p>
        
        <PreEvaluationQuiz
          userId={studentId}
          competence="biologie"
          onComplete={handleAssessmentComplete}
        />
      </section>

    {:else if currentStep === 'metacognition'}
      <section class="metacognition-section">
        <h2>🤔 Réflexion Métacognitive</h2>
        <p>Réfléchissez sur votre processus d'apprentissage</p>
        
        <div class="prompts-container">
          {#each metacognitionPrompts as prompt, index}
            <div class="prompt-card">
              <h3>{prompt.category}</h3>
              <p>{prompt.text}</p>
              <textarea
                bind:value={prompt.userResponse}
                placeholder="Votre réflexion..."
                rows="3"
              ></textarea>
            </div>
          {/each}
        </div>
        
        <button 
          class="complete-btn"
          on:click={handleMetacognitionComplete}
          disabled={!metacognitionPrompts.every(p => p.userResponse?.trim())}
        >
          Terminer la réflexion
        </button>
      </section>

    {:else if currentStep === 'results'}
      <section class="results-section">
        <h2>📊 Résultats et Analyse</h2>
        
        <div class="results-grid">
          <div class="result-card">
            <h3>🎯 Évaluation Adaptative</h3>
            <div class="result-content">
              <p><strong>Niveau détecté:</strong> {assessmentResults?.level || 'Non déterminé'}</p>
              <p><strong>Score:</strong> {assessmentResults?.score || 0}/100</p>
              <p><strong>Questions répondues:</strong> {assessmentResults?.answers?.length || 0}</p>
              
              <h4>Recommandations:</h4>
              <ul>
                {#each assessmentResults?.recommendations || [] as rec}
                  <li>{rec}</li>
                {/each}
              </ul>
            </div>
          </div>

          <div class="result-card">
            <h3>🧠 Analyse Métacognitive</h3>
            <div class="result-content">
              <p><strong>Stratégies identifiées:</strong></p>
              <ul>
                {#each metacognitionResults?.strategies || [] as strategy}
                  <li>{strategy}</li>
                {/each}
              </ul>
              
              <p><strong>Niveau de conscience:</strong> {metacognitionResults?.awarenessLevel || 'Non évalué'}</p>
              
              <h4>Recommandations métacognitives:</h4>
              <ul>
                {#each metacognitionResults?.recommendations || [] as rec}
                  <li>{rec}</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>

        <div class="debug-section">
          <h3>🔧 Données de Debug</h3>
          <details>
            <summary>Voir les données brutes</summary>
            <pre>{JSON.stringify({ assessmentResults, metacognitionResults }, null, 2)}</pre>
          </details>
        </div>

        <button class="reset-btn" on:click={resetTest}>
          🔄 Recommencer le test
        </button>
      </section>
    {/if}
  </main>
</div>

<style>
  .test-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .test-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .test-header h1 {
    color: #2563eb;
    margin-bottom: 0.5rem;
  }

  .steps-indicator {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .step {
    padding: 0.75rem 1.5rem;
    background: #f1f5f9;
    border-radius: 0.5rem;
    color: #64748b;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .step.active {
    background: #2563eb;
    color: white;
    transform: scale(1.05);
  }

  .test-content {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .assessment-section h2,
  .metacognition-section h2,
  .results-section h2 {
    color: #1e293b;
    margin-bottom: 1rem;
  }

  .prompts-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .prompt-card {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border-left: 4px solid #3b82f6;
  }

  .prompt-card h3 {
    color: #1e40af;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .prompt-card textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-family: inherit;
    resize: vertical;
    margin-top: 1rem;
  }

  .prompt-card textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .complete-btn, .reset-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  .complete-btn:hover, .reset-btn:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .complete-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  .results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 2rem 0;
  }

  .result-card {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
  }

  .result-card h3 {
    color: #1e40af;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  .result-content p {
    margin-bottom: 0.5rem;
  }

  .result-content ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .result-content li {
    margin-bottom: 0.25rem;
  }

  .debug-section {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #e2e8f0;
  }

  .debug-section h3 {
    color: #7c3aed;
    margin-bottom: 1rem;
  }

  .debug-section pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    font-size: 0.875rem;
    max-height: 400px;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    .test-container {
      padding: 1rem;
    }

    .steps-indicator {
      flex-direction: column;
      align-items: center;
    }

    .results-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
