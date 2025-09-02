<!-- 🎯 Route Exercices - Phase 9 -->
<!-- Page principale pour les exercices interactifs -->

<script lang="ts">
  import { onMount } from 'svelte';
  import type { Exercise, ExerciseCollection } from '$lib/types/exercise.js';
  import { exerciseService } from '$lib/services/exerciseService.js';
  import ExerciseSession from '$lib/components/exercises/ExerciseSession.svelte';
  import QCMCard from '$lib/components/exercises/QCMCard.svelte';

  // State
  let exercises: Exercise[] = [];
  let currentSession: Exercise[] | null = null;
  let sessionTitle = '';
  let showDemo = true;
  let stats = {
    total: 0,
    byType: {} as Record<string, number>,
    byDifficulty: {} as Record<string, number>
  };

  onMount(async () => {
    // Générer quelques exercices de démonstration
    generateDemoExercises();
    updateStats();
  });

  function generateDemoExercises() {
    // Générer des exercices QCM
    const qcm1 = exerciseService.generateQCMExercise('mathematiques', 'debutant');
    const qcm2 = exerciseService.generateQCMExercise('francais', 'intermediaire');
    
    // Générer des exercices Vrai/Faux
    const tf1 = exerciseService.generateTrueFalseExercise('mathematiques', 'debutant');
    const tf2 = exerciseService.generateTrueFalseExercise('francais', 'intermediaire');
    
    // Générer des exercices à trous
    const fb1 = exerciseService.generateFillBlanksExercise('mathematiques', 'avance');
    const fb2 = exerciseService.generateFillBlanksExercise('francais', 'avance');

    // Sauvegarder les exercices
    [qcm1, qcm2, tf1, tf2, fb1, fb2].forEach(exercise => {
      exerciseService.saveExercise(exercise);
    });

    exercises = [qcm1, qcm2, tf1, tf2, fb1, fb2];
  }

  function updateStats() {
    stats = exerciseService.getExerciseStats();
  }

  function startSession(sessionExercises: Exercise[], title: string) {
    currentSession = sessionExercises;
    sessionTitle = title;
    showDemo = false;
  }

  function handleSessionComplete(event: any) {
    const { results, stats: sessionStats } = event.detail;
    console.log('Session terminée :', { results, sessionStats });
    
    // Retourner à la vue principale après 3 secondes
    setTimeout(() => {
      currentSession = null;
      showDemo = true;
    }, 3000);
  }

  function handleSessionExit() {
    currentSession = null;
    showDemo = true;
  }

  function handleExerciseComplete(event: any) {
    const { exercise, result } = event.detail;
    console.log('Exercice complété :', { exercise: exercise.title, result });
  }

  // Sessions prédéfinies
  function startMathSession() {
    const mathExercises = exercises.filter(ex => ex.category === 'mathematiques');
    startSession(mathExercises, 'Session Mathématiques');
  }

  function startFrenchSession() {
    const frenchExercises = exercises.filter(ex => ex.category === 'francais');
    startSession(frenchExercises, 'Session Français');
  }

  function startMixedSession() {
    startSession([...exercises], 'Session Mixte');
  }

  function startByDifficulty(difficulty: string) {
    const filteredExercises = exercises.filter(ex => ex.difficulty === difficulty);
    startSession(filteredExercises, `Session ${difficulty}`);
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

  function getTypeIcon(type: string): string {
    const icons = {
      qcm: '📝',
      'true-false': '✅',
      'fill-blanks': '📋'
    };
    return icons[type as keyof typeof icons] || '📄';
  }
</script>

<svelte:head>
  <title>🎯 Exercices - FunLearning</title>
  <meta name="description" content="Exercices interactifs pour apprendre en s'amusant" />
</svelte:head>

{#if currentSession}
  <!-- Session d'exercices en cours -->
  <ExerciseSession
    exercises={currentSession}
    sessionTitle={sessionTitle}
    showProgress={true}
    allowSkip={false}
    timeLimit={120}
    on:sessionComplete={handleSessionComplete}
    on:sessionExit={handleSessionExit}
    on:exerciseComplete={handleExerciseComplete}
  />

{:else}
  <!-- Vue principale des exercices -->
  <div class="exercises-page">
    <!-- En-tête -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">🎯 Centre d'Exercices</h1>
        <p class="page-description">
          Testez vos connaissances avec des exercices interactifs adaptatifs !
        </p>
      </div>
      
      <!-- Statistiques rapides -->
      <div class="stats-overview">
        <div class="stat-card">
          <span class="stat-number">{stats.total}</span>
          <span class="stat-label">Exercices</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{Object.keys(stats.byType).length}</span>
          <span class="stat-label">Types</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{Object.keys(stats.byDifficulty).length}</span>
          <span class="stat-label">Niveaux</span>
        </div>
      </div>
    </div>

    <!-- Sessions rapides -->
    <section class="quick-sessions">
      <h2 class="section-title">🚀 Sessions rapides</h2>
      <div class="sessions-grid">
        <button class="session-card" on:click={startMathSession}>
          <div class="session-icon">🔢</div>
          <h3>Mathématiques</h3>
          <p>{exercises.filter(ex => ex.category === 'mathematiques').length} exercices</p>
          <span class="session-badge">Logique & Calcul</span>
        </button>

        <button class="session-card" on:click={startFrenchSession}>
          <div class="session-icon">📚</div>
          <h3>Français</h3>
          <p>{exercises.filter(ex => ex.category === 'francais').length} exercices</p>
          <span class="session-badge">Langue & Littérature</span>
        </button>

        <button class="session-card" on:click={startMixedSession}>
          <div class="session-icon">🎲</div>
          <h3>Session Mixte</h3>
          <p>{exercises.length} exercices</p>
          <span class="session-badge">Tous niveaux</span>
        </button>
      </div>
    </section>

    <!-- Filtres par difficulté -->
    <section class="difficulty-filters">
      <h2 class="section-title">📊 Par niveau de difficulté</h2>
      <div class="difficulty-grid">
        {#each Object.entries(stats.byDifficulty) as [difficulty, count]}
          <button 
            class="difficulty-card"
            style="border-color: {getDifficultyColor(difficulty)}"
            on:click={() => startByDifficulty(difficulty)}
          >
            <div class="difficulty-header">
              <span class="difficulty-name" style="color: {getDifficultyColor(difficulty)}">
                {difficulty}
              </span>
              <span class="difficulty-count">{count}</span>
            </div>
            <div class="difficulty-bar">
              <div 
                class="difficulty-fill"
                style="background: {getDifficultyColor(difficulty)}; width: {(count / stats.total) * 100}%"
              ></div>
            </div>
          </button>
        {/each}
      </div>
    </section>

    <!-- Aperçu des exercices -->
    <section class="exercises-preview">
      <h2 class="section-title">👀 Aperçu des exercices</h2>
      <div class="exercises-grid">
        {#each exercises.slice(0, 6) as exercise}
          <div class="exercise-preview-card">
            <div class="preview-header">
              <span class="exercise-type">{getTypeIcon(exercise.type)} {exercise.type}</span>
              <span 
                class="exercise-difficulty"
                style="color: {getDifficultyColor(exercise.difficulty)}"
              >
                {exercise.difficulty}
              </span>
            </div>
            
            <h3 class="exercise-title">{exercise.title}</h3>
            <p class="exercise-description">{exercise.description}</p>
            
            <div class="preview-footer">
              <span class="exercise-points">{exercise.points} points</span>
              <span class="exercise-category">#{exercise.category}</span>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Démo exercice unique -->
    {#if showDemo && exercises.length > 0}
      <section class="demo-section">
        <h2 class="section-title">🎮 Testez un exercice</h2>
        <p class="demo-description">
          Voici un aperçu de nos exercices interactifs. Essayez-le !
        </p>
        
        <div class="demo-container">
          <QCMCard
            exercise={exercises.find(ex => ex.type === 'qcm') || exercises[0]}
            showResult={true}
            timeLimit={null}
            on:submit={(e) => console.log('Démo soumise:', e.detail)}
          />
        </div>
      </section>
    {/if}

    <!-- Fonctionnalités Phase 9 -->
    <section class="features-highlight">
      <h2 class="section-title">✨ Fonctionnalités Phase 9</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Évaluation Automatique</h3>
          <p>Correction instantanée avec feedback personnalisé</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎲</div>
          <h3>Génération Intelligente</h3>
          <p>Exercices créés automatiquement selon vos besoins</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Suivi des Progrès</h3>
          <p>Statistiques détaillées et recommandations adaptées</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⏱️</div>
          <h3>Sessions Chronométrées</h3>
          <p>Entraînement avec contraintes de temps réalistes</p>
        </div>
      </div>
    </section>
  </div>
{/if}

<style>
  .exercises-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    padding: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    color: white;
  }

  .header-content h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 8px 0;
  }

  .header-content p {
    font-size: 1.25rem;
    opacity: 0.9;
    margin: 0;
  }

  .stats-overview {
    display: flex;
    gap: 20px;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 16px 20px;
    border-radius: 12px;
    min-width: 80px;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
  }

  .stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 24px 0;
  }

  .quick-sessions {
    margin-bottom: 48px;
  }

  .sessions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .session-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 24px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
  }

  .session-card:hover {
    border-color: #3182ce;
    box-shadow: 0 8px 32px rgba(49, 130, 206, 0.15);
    transform: translateY(-4px);
  }

  .session-icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }

  .session-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 8px 0;
  }

  .session-card p {
    color: #666;
    margin: 0 0 16px 0;
  }

  .session-badge {
    background: #3182ce;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .difficulty-filters {
    margin-bottom: 48px;
  }

  .difficulty-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .difficulty-card {
    padding: 20px;
    background: white;
    border: 2px solid;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .difficulty-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .difficulty-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .difficulty-name {
    font-weight: 700;
    text-transform: capitalize;
    font-size: 1.125rem;
  }

  .difficulty-count {
    background: #f7fafc;
    color: #4a5568;
    padding: 4px 8px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .difficulty-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .difficulty-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .exercises-preview {
    margin-bottom: 48px;
  }

  .exercises-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .exercise-preview-card {
    padding: 20px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .exercise-preview-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .exercise-type {
    background: #f7fafc;
    color: #4a5568;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .exercise-difficulty {
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: capitalize;
  }

  .exercise-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px 0;
  }

  .exercise-description {
    color: #666;
    margin: 0 0 16px 0;
    line-height: 1.5;
  }

  .preview-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .exercise-points {
    color: #3182ce;
    font-weight: 600;
  }

  .exercise-category {
    color: #666;
    font-size: 0.875rem;
  }

  .demo-section {
    margin-bottom: 48px;
  }

  .demo-description {
    color: #666;
    margin-bottom: 24px;
    font-size: 1.125rem;
  }

  .demo-container {
    max-width: 700px;
    margin: 0 auto;
  }

  .features-highlight {
    margin-bottom: 32px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .feature-card {
    text-align: center;
    padding: 24px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 16px;
  }

  .feature-card h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 8px 0;
  }

  .feature-card p {
    color: #666;
    margin: 0;
    line-height: 1.5;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .exercises-page {
      padding: 16px;
    }

    .page-header {
      flex-direction: column;
      gap: 24px;
      padding: 24px;
    }

    .stats-overview {
      width: 100%;
      justify-content: space-around;
    }

    .sessions-grid {
      grid-template-columns: 1fr;
    }

    .difficulty-grid {
      grid-template-columns: 1fr;
    }

    .exercises-grid {
      grid-template-columns: 1fr;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
