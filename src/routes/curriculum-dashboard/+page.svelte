<!-- 🤖 Curriculum Generation Dashboard - Phase 6 -->
<!-- Interface de visualisation et test du système de génération -->

<script>
  import { onMount } from 'svelte';
  import { curriculumEngine, curriculumStore, curriculumMetadata } from '$lib/curriculum/engine.js';
  import { mathematiques6eme, validationFunctions } from '$lib/curriculum/data/mathematiques-6eme.js';

  // États locaux
  let currentSubject = 'mathematiques';
  let currentLevel = '6eme';
  let generationStatus = 'idle'; // 'idle', 'generating', 'completed', 'error'
  let validationResults = null;
  let curriculumStats = null;
  let selectedCompetence = null;
  let generatedPath = null;
  let recommendations = [];

  // Configuration de test
  let testUserProfile = {
    preferredDifficulty: 3,
    preferredLevel: '6eme',
    favoriteSubjects: ['mathematiques'],
    availableTime: 90,
    learningStyle: 'visual'
  };

  // Initialisation
  onMount(async () => {
    console.log('🚀 Initialisation du Curriculum Dashboard');
    
    // Initialiser le moteur
    curriculumEngine.init();
    
    // Charger les données de test
    await loadTestData();
    
    // Valider le curriculum
    validateCurriculum();
    
    // Calculer les statistiques
    calculateStatistics();
  });

  /**
   * Charger les données de test dans le moteur
   */
  async function loadTestData() {
    try {
      generationStatus = 'generating';
      
      // Charger les compétences dans le graphe de connaissances
      for (const [id, competence] of Object.entries(mathematiques6eme.competences)) {
        curriculumEngine.knowledgeGraph.addCompetence(id, competence);
      }
      
      // Charger les relations
      for (const relation of mathematiques6eme.relations) {
        curriculumEngine.knowledgeGraph.addRelation(
          relation.from,
          relation.to,
          relation.type,
          relation.weight
        );
      }
      
      generationStatus = 'completed';
      console.log('✅ Données de test chargées');
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      generationStatus = 'error';
    }
  }

  /**
   * Valider la cohérence du curriculum
   */
  function validateCurriculum() {
    validationResults = validationFunctions.validateCurriculum(mathematiques6eme);
    console.log('🔍 Validation:', validationResults);
  }

  /**
   * Calculer les statistiques
   */
  function calculateStatistics() {
    curriculumStats = validationFunctions.getStatistics(mathematiques6eme);
    console.log('📊 Statistiques:', curriculumStats);
  }

  /**
   * Générer un parcours d'apprentissage
   */
  function generateLearningPath() {
    if (!selectedCompetence) return;
    
    const startCompetence = 'math6-nombres-entiers'; // Point de départ
    const targetCompetence = selectedCompetence;
    
    generatedPath = curriculumEngine.knowledgeGraph.findLearningPath(
      startCompetence,
      targetCompetence,
      testUserProfile
    );
    
    console.log('🛤️ Parcours généré:', generatedPath);
  }

  /**
   * Générer des recommandations
   */
  function generateRecommendations() {
    const userId = 'test-user-001';
    
    // Simuler un historique d'apprentissage
    const mockHistory = [
      { competenceId: 'math6-nombres-entiers', completedAt: new Date(), score: 0.85 }
    ];
    
    curriculumEngine.recommendationEngine.userProfiles.set(userId, testUserProfile);
    curriculumEngine.recommendationEngine.learningHistory.set(userId, mockHistory);
    
    recommendations = curriculumEngine.recommendationEngine.generateRecommendations(userId, {
      limit: 5,
      serendipityLevel: 0.1
    });
    
    console.log('💡 Recommandations générées:', recommendations);
  }

  /**
   * Sélectionner une compétence
   */
  function selectCompetence(competenceId) {
    selectedCompetence = competenceId;
    generateLearningPath();
  }

  /**
   * Obtenir la couleur selon la difficulté
   */
  function getDifficultyColor(difficulty) {
    const colors = {
      1: '#4ade80', // Vert - Très facile
      2: '#60a5fa', // Bleu - Facile
      3: '#fbbf24', // Jaune - Moyen
      4: '#f97316', // Orange - Difficile
      5: '#ef4444'  // Rouge - Très difficile
    };
    return colors[difficulty] || '#6b7280';
  }

  /**
   * Obtenir l'icône selon le type
   */
  function getTypeIcon(type) {
    const icons = {
      'fondamentale': '🏗️',
      'transversale': '🔄',
      'specifique': '🎯',
      'avancee': '🚀'
    };
    return icons[type] || '📚';
  }
</script>

<svelte:head>
  <title>Curriculum Generation Dashboard | FunLearning</title>
</svelte:head>

<div class="curriculum-dashboard">
  <!-- Header avec statut -->
  <header class="dashboard-header">
    <div class="header-title">
      <h1>🤖 Curriculum Generation Engine</h1>
      <div class="status-badge status-{generationStatus}">
        {#if generationStatus === 'generating'}
          ⏳ Génération en cours...
        {:else if generationStatus === 'completed'}
          ✅ Système opérationnel
        {:else if generationStatus === 'error'}
          ❌ Erreur système
        {:else}
          💤 En attente
        {/if}
      </div>
    </div>
    
    <div class="controls">
      <select bind:value={currentSubject}>
        <option value="mathematiques">📐 Mathématiques</option>
        <option value="francais">📝 Français</option>
        <option value="sciences">🔬 Sciences</option>
      </select>
      
      <select bind:value={currentLevel}>
        <option value="6eme">6ème</option>
        <option value="5eme">5ème</option>
        <option value="4eme">4ème</option>
        <option value="3eme">3ème</option>
      </select>
    </div>
  </header>

  <!-- Dashboard principal -->
  <main class="dashboard-main">
    
    <!-- Section Statistiques -->
    {#if curriculumStats}
    <section class="stats-section">
      <h2>📊 Statistiques du Curriculum</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <div class="stat-number">{curriculumStats.totalCompetences}</div>
            <div class="stat-label">Compétences</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-number">{Math.round(curriculumStats.totalDuration / 60)}h</div>
            <div class="stat-label">Durée totale</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔗</div>
          <div class="stat-content">
            <div class="stat-number">{curriculumStats.relationCount}</div>
            <div class="stat-label">Relations</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-number">{curriculumStats.averageDifficulty.toFixed(1)}</div>
            <div class="stat-label">Difficulté moy.</div>
          </div>
        </div>
      </div>
    </section>
    {/if}

    <!-- Section Validation -->
    {#if validationResults}
    <section class="validation-section">
      <h2>🔍 Validation du Curriculum</h2>
      
      <div class="validation-status">
        {#if validationResults.isValid}
          <div class="validation-success">
            ✅ Curriculum valide
          </div>
        {:else}
          <div class="validation-error">
            ❌ Erreurs détectées ({validationResults.errors.length})
          </div>
        {/if}
      </div>

      {#if validationResults.warnings.length > 0}
        <div class="warnings">
          <h3>⚠️ Avertissements</h3>
          <ul>
            {#each validationResults.warnings as warning}
              <li>{warning}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </section>
    {/if}

    <!-- Section Compétences -->
    <section class="competences-section">
      <h2>🎯 Compétences - {mathematiques6eme.title}</h2>
      
      <div class="competences-grid">
        {#each Object.entries(mathematiques6eme.competences) as [id, competence]}
          <div 
            class="competence-card" 
            class:selected={selectedCompetence === id}
            on:click={() => selectCompetence(id)}
          >
            <div class="competence-header">
              <div class="competence-type">
                {getTypeIcon(competence.type)}
                {competence.type}
              </div>
              <div 
                class="competence-difficulty"
                style="background-color: {getDifficultyColor(competence.difficulty)}"
              >
                {competence.difficulty}
              </div>
            </div>
            
            <h3>{competence.title}</h3>
            <p class="competence-description">{competence.description}</p>
            
            <div class="competence-meta">
              <span class="duration">⏱️ {competence.estimatedTime}min</span>
              <span class="objectives">🎯 {competence.learningObjectives.length} objectifs</span>
            </div>
            
            {#if competence.prerequisites.length > 0}
              <div class="prerequisites">
                <strong>Prérequis:</strong>
                <ul>
                  {#each competence.prerequisites as prerequis}
                    <li>{prerequis}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <!-- Section Parcours Générés -->
    {#if generatedPath}
    <section class="path-section">
      <h2>🛤️ Parcours d'Apprentissage Généré</h2>
      
      <div class="learning-path">
        {#each generatedPath as step, index}
          <div class="path-step">
            <div class="step-number">{index + 1}</div>
            <div class="step-content">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
              {#if step.adaptedDifficulty}
                <span class="adapted">
                  🎯 Adapté: difficulté {step.adaptedDifficulty}
                </span>
              {/if}
            </div>
            {#if index < generatedPath.length - 1}
              <div class="path-arrow">→</div>
            {/if}
          </div>
        {/each}
      </div>
    </section>
    {/if}

    <!-- Section Recommandations -->
    <section class="recommendations-section">
      <h2>💡 Système de Recommandation</h2>
      
      <div class="user-profile">
        <h3>👤 Profil Utilisateur Test</h3>
        <div class="profile-grid">
          <label>
            Difficulté préférée:
            <input type="range" min="1" max="5" bind:value={testUserProfile.preferredDifficulty}>
            <span>{testUserProfile.preferredDifficulty}</span>
          </label>
          
          <label>
            Temps disponible:
            <input type="range" min="30" max="180" step="15" bind:value={testUserProfile.availableTime}>
            <span>{testUserProfile.availableTime}min</span>
          </label>
          
          <label>
            Style d'apprentissage:
            <select bind:value={testUserProfile.learningStyle}>
              <option value="visual">👁️ Visuel</option>
              <option value="auditif">👂 Auditif</option>
              <option value="kinesthesique">✋ Kinesthésique</option>
              <option value="lecture">📖 Lecture</option>
            </select>
          </label>
        </div>
        
        <button class="btn-generate" on:click={generateRecommendations}>
          🎯 Générer des Recommandations
        </button>
      </div>

      {#if recommendations.length > 0}
        <div class="recommendations-list">
          <h3>🎯 Recommandations Personnalisées</h3>
          
          {#each recommendations as rec}
            <div class="recommendation-card">
              <div class="rec-header">
                <h4>{rec.competence.title}</h4>
                <div class="rec-score">
                  Score: {(rec.score * 100).toFixed(0)}%
                </div>
              </div>
              
              <p class="rec-reason">
                <span class="rec-type">{rec.type}</span>
                {rec.reason}
              </p>
              
              <div class="rec-meta">
                <span>Difficulté: {rec.competence.difficulty}/5</span>
                <span>Durée: {rec.competence.estimatedTime}min</span>
                <span class="rec-subject">{rec.competence.subject}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>

    <!-- Section Tests & Debug -->
    <section class="debug-section">
      <h2>🔧 Tests & Debug</h2>
      
      <div class="debug-actions">
        <button on:click={validateCurriculum}>
          🔍 Re-valider Curriculum
        </button>
        
        <button on:click={calculateStatistics}>
          📊 Recalculer Stats
        </button>
        
        <button on:click={loadTestData}>
          🔄 Recharger Données
        </button>
      </div>

      <details class="debug-data">
        <summary>📋 Données Debug</summary>
        <pre>{JSON.stringify({
          curriculumStats,
          validationResults,
          generatedPath: generatedPath?.length || 0,
          recommendations: recommendations.length
        }, null, 2)}</pre>
      </details>
    </section>

  </main>
</div>

<style>
  .curriculum-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
  }

  .dashboard-header {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header-title h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #1f2937;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .status-idle { background: #e5e7eb; color: #6b7280; }
  .status-generating { background: #fef3c7; color: #d97706; }
  .status-completed { background: #d1fae5; color: #047857; }
  .status-error { background: #fee2e2; color: #dc2626; }

  .controls {
    display: flex;
    gap: 1rem;
  }

  .controls select {
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    font-size: 1rem;
  }

  .dashboard-main {
    display: grid;
    gap: 2rem;
  }

  /* Sections */
  section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  section h2 {
    margin: 0 0 1.5rem 0;
    color: #1f2937;
    font-size: 1.5rem;
  }

  /* Statistiques */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.875rem;
    opacity: 0.9;
  }

  /* Validation */
  .validation-success {
    background: #d1fae5;
    color: #047857;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 600;
  }

  .validation-error {
    background: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    font-weight: 600;
  }

  .warnings {
    margin-top: 1rem;
    background: #fef3c7;
    padding: 1rem;
    border-radius: 8px;
  }

  .warnings h3 {
    margin: 0 0 0.5rem 0;
    color: #d97706;
  }

  /* Compétences */
  .competences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .competence-card {
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fafafa;
  }

  .competence-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .competence-card.selected {
    border-color: #667eea;
    background: #f0f9ff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .competence-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .competence-type {
    background: #f3f4f6;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .competence-difficulty {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
  }

  .competence-card h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1.125rem;
  }

  .competence-description {
    color: #6b7280;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .competence-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .prerequisites {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .prerequisites ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1rem;
  }

  /* Parcours d'apprentissage */
  .learning-path {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .path-step {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border-left: 4px solid #667eea;
  }

  .step-number {
    width: 2rem;
    height: 2rem;
    background: #667eea;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }

  .step-content h4 {
    margin: 0 0 0.25rem 0;
    color: #1f2937;
  }

  .step-content p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .adapted {
    background: #dcfce7;
    color: #166534;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    margin-top: 0.5rem;
    display: inline-block;
  }

  /* Recommandations */
  .user-profile {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .user-profile h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
  }

  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .profile-grid label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: 500;
    color: #374151;
  }

  .profile-grid input, .profile-grid select {
    padding: 0.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 4px;
    background: white;
  }

  .btn-generate {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .btn-generate:hover {
    background: #5a67d8;
  }

  .recommendations-list h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
  }

  .recommendation-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fafafa;
  }

  .rec-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .rec-header h4 {
    margin: 0;
    color: #1f2937;
  }

  .rec-score {
    background: #667eea;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .rec-reason {
    margin: 0.5rem 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .rec-type {
    background: #f3f4f6;
    padding: 0.125rem 0.5rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-right: 0.5rem;
  }

  .rec-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .rec-subject {
    background: #e0e7ff;
    color: #3730a3;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
  }

  /* Debug */
  .debug-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .debug-actions button {
    padding: 0.5rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .debug-actions button:hover {
    border-color: #667eea;
    background: #f0f9ff;
  }

  .debug-data {
    background: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
  }

  .debug-data summary {
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .debug-data pre {
    margin: 0;
    white-space: pre-wrap;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .curriculum-dashboard {
      padding: 1rem;
    }

    .dashboard-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .competences-grid {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .profile-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
