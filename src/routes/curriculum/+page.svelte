<!-- 
📚 Dashboard Curriculum Generator - Phase 6 TDD Refactoring
Composant Svelte sécurisé selon DOC_CoPilot_Practices.md
-->
<script>
  import { onMount } from 'svelte';
  import { generateCurriculum, validateCurriculumData, CurriculumSchema } from '../../lib/curriculum/generator.js';

  // 🔒 État sécurisé avec validation
  let isGenerating = false;
  let generatedCurriculum = null;
  let error = null;
  let validationErrors = [];

  // Configuration par défaut sécurisée
  let config = {
    matiere: 'mathematiques',
    niveau: '6eme',
    competences: ['calcul-mental'],
    difficulte: 'standard',
    dureeEstimee: 45,
    objectifs: ['Apprendre les bases']
  };

  // 📊 Options pré-définies (sécurisées)
  const MATIERES = [
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'francais', label: 'Français' },
    { value: 'sciences', label: 'Sciences' },
    { value: 'histoire', label: 'Histoire' },
    { value: 'geographie', label: 'Géographie' }
  ];

  const NIVEAUX = [
    { value: 'cp', label: 'CP' },
    { value: 'ce1', label: 'CE1' },
    { value: 'ce2', label: 'CE2' },
    { value: 'cm1', label: 'CM1' },
    { value: 'cm2', label: 'CM2' },
    { value: '6eme', label: '6ème' },
    { value: '5eme', label: '5ème' },
    { value: '4eme', label: '4ème' },
    { value: '3eme', label: '3ème' }
  ];

  const DIFFICULTES = [
    { value: 'facile', label: 'Facile' },
    { value: 'standard', label: 'Standard' },
    { value: 'difficile', label: 'Difficile' }
  ];

  const COMPETENCES_PAR_MATIERE = {
    mathematiques: ['calcul-mental', 'geometrie-base', 'fractions', 'decimaux', 'mesures'],
    francais: ['lecture-comprehension', 'grammaire', 'orthographe', 'expression-ecrite'],
    sciences: ['corps-humain', 'environnement', 'physique-base', 'chimie-base'],
    histoire: ['antiquite', 'moyen-age', 'temps-modernes', 'epoque-contemporaine'],
    geographie: ['relief', 'climat', 'population', 'economie']
  };

  // 🔧 Compétences disponibles selon la matière
  $: competencesDisponibles = COMPETENCES_PAR_MATIERE[config.matiere] || [];

  // 🛡️ Validation en temps réel (Sécurité)
  $: {
    const validation = CurriculumSchema.safeParse(config);
    if (!validation.success) {
      validationErrors = validation.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
    } else {
      validationErrors = [];
    }
  }

  /**
   * 🎯 Génération sécurisée de curriculum
   * Suivant patterns DOC_CoPilot_Practices.md
   */
  async function handleGenerate() {
    if (validationErrors.length > 0) {
      error = 'Veuillez corriger les erreurs de validation';
      return;
    }

    isGenerating = true;
    error = null;
    generatedCurriculum = null;

    try {
      // Validation finale avant génération
      const configValidation = validateCurriculumData('curriculum_config', config);
      if (!configValidation.success) {
        throw new Error(`Configuration invalide: ${configValidation.error}`);
      }

      // Génération sécurisée
      const curriculum = await generateCurriculum(config);
      
      // Validation du curriculum généré
      const curriculumValidation = validateCurriculumData('curriculums', curriculum);
      if (!curriculumValidation.success) {
        throw new Error(`Curriculum généré invalide: ${curriculumValidation.error}`);
      }

      generatedCurriculum = curriculum;
      
    } catch (err) {
      error = err.message || 'Erreur lors de la génération';
      console.error('Erreur génération curriculum:', err);
    } finally {
      isGenerating = false;
    }
  }

  /**
   * 🔧 Gestion sécurisée des compétences multiples
   */
  function handleCompetenceChange(competence, isChecked) {
    if (isChecked) {
      if (!config.competences.includes(competence)) {
        config.competences = [...config.competences, competence];
      }
    } else {
      config.competences = config.competences.filter(c => c !== competence);
    }
  }

  /**
   * 📥 Export sécurisé du curriculum
   */
  function exportCurriculum() {
    if (!generatedCurriculum) return;

    const dataStr = JSON.stringify(generatedCurriculum, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `curriculum_${generatedCurriculum.matiere}_${generatedCurriculum.niveau}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  onMount(() => {
    console.log('🎓 Dashboard Curriculum Generator initialisé');
  });
</script>

<svelte:head>
  <title>Générateur de Curriculum - Phase 6</title>
</svelte:head>

<div class="curriculum-dashboard">
  <header class="dashboard-header">
    <h1>🎓 Générateur de Curriculum Éducatif</h1>
    <p class="subtitle">Création automatique de parcours pédagogiques personnalisés</p>
  </header>

  <div class="dashboard-content">
    <!-- 🔧 Configuration -->
    <div class="config-panel">
      <h2>⚙️ Configuration</h2>
      
      <!-- Validation Errors -->
      {#if validationErrors.length > 0}
        <div class="validation-errors">
          {#each validationErrors as error}
            <div class="error-item">
              <strong>{error.field}:</strong> {error.message}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Matière -->
      <div class="form-group">
        <label for="matiere">Matière</label>
        <select id="matiere" bind:value={config.matiere}>
          {#each MATIERES as matiere}
            <option value={matiere.value}>{matiere.label}</option>
          {/each}
        </select>
      </div>

      <!-- Niveau -->
      <div class="form-group">
        <label for="niveau">Niveau</label>
        <select id="niveau" bind:value={config.niveau}>
          {#each NIVEAUX as niveau}
            <option value={niveau.value}>{niveau.label}</option>
          {/each}
        </select>
      </div>

      <!-- Compétences -->
      <div class="form-group">
        <fieldset>
          <legend>Compétences à développer</legend>
          <div class="competences-grid">
            {#each competencesDisponibles as competence}
              <label class="competence-item">
                <input 
                  type="checkbox" 
                  checked={config.competences.includes(competence)}
                  on:change={(e) => handleCompetenceChange(competence, e.target.checked)}
                />
                <span>{competence.replace('-', ' ')}</span>
              </label>
            {/each}
          </div>
        </fieldset>
      </div>

      <!-- Difficulté -->
      <div class="form-group">
        <label for="difficulte">Niveau de difficulté</label>
        <select id="difficulte" bind:value={config.difficulte}>
          {#each DIFFICULTES as diff}
            <option value={diff.value}>{diff.label}</option>
          {/each}
        </select>
      </div>

      <!-- Durée -->
      <div class="form-group">
        <label for="duree">Durée estimée (minutes)</label>
        <input 
          id="duree" 
          type="number" 
          min="15" 
          max="600" 
          bind:value={config.dureeEstimee}
        />
      </div>

      <!-- Objectifs -->
      <div class="form-group">
        <label for="objectifs">Objectifs pédagogiques (un par ligne)</label>
        <textarea 
          id="objectifs" 
          rows="3"
          placeholder="Exemple: Maîtriser les opérations de base..."
          bind:value={config.objectifs[0]}
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button 
          class="btn-generate" 
          on:click={handleGenerate}
          disabled={isGenerating || validationErrors.length > 0}
        >
          {isGenerating ? '⏳ Génération...' : '🚀 Générer le Curriculum'}
        </button>
      </div>

      {#if error}
        <div class="error-message">
          ❌ {error}
        </div>
      {/if}
    </div>

    <!-- 📊 Résultats -->
    {#if generatedCurriculum}
      <div class="results-panel">
        <div class="results-header">
          <h2>📚 Curriculum Généré</h2>
          <button class="btn-export" on:click={exportCurriculum}>
            💾 Exporter JSON
          </button>
        </div>

        <div class="curriculum-overview">
          <div class="overview-stats">
            <div class="stat-item">
              <span class="stat-label">Modules</span>
              <span class="stat-value">{generatedCurriculum.modules.length}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Durée totale</span>
              <span class="stat-value">{generatedCurriculum.modules.reduce((sum, m) => sum + m.dureeEstimee, 0)} min</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Activités</span>
              <span class="stat-value">{generatedCurriculum.modules.reduce((sum, m) => sum + m.activites.length, 0)}</span>
            </div>
          </div>
        </div>

        <!-- Modules -->
        <div class="modules-list">
          {#each generatedCurriculum.modules as module, index}
            <div class="module-card">
              <div class="module-header">
                <h3>{module.titre}</h3>
                <span class="module-duration">{module.dureeEstimee} min</span>
              </div>
              
              <p class="module-description">{module.description}</p>
              
              <div class="module-competences">
                <strong>Compétences:</strong>
                {#each module.competences as competence}
                  <span class="competence-tag">{competence}</span>
                {/each}
              </div>

              <!-- Activités -->
              <div class="activities-section">
                <h4>🎯 Activités ({module.activites.length})</h4>
                <div class="activities-grid">
                  {#each module.activites as activite}
                    <div class="activity-card">
                      <div class="activity-type">{activite.type}</div>
                      <div class="activity-title">{activite.titre}</div>
                      <div class="activity-meta">
                        <span class="activity-difficulty">{activite.difficulte}</span>
                        <span class="activity-duration">{activite.dureeEstimee}min</span>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Évaluation -->
              <div class="evaluation-section">
                <h4>📝 Évaluation</h4>
                <div class="evaluation-info">
                  <span>Type: {module.evaluation.type}</span>
                  <span>Questions: {module.evaluation.questions.length}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .curriculum-dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .dashboard-header h1 {
    color: #1a365d;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #4a5568;
    font-size: 1.1rem;
  }

  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
  }

  .config-panel {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: fit-content;
  }

  .config-panel h2 {
    color: #2d3748;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #4a5568;
  }

  .form-group select,
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  .form-group select:focus,
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3182ce;
  }

  .competences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
  }

  .competence-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .competence-item:hover {
    background-color: #f7fafc;
  }

  .btn-generate {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #3182ce, #2c5aa0);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-generate:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(49, 130, 206, 0.4);
  }

  .btn-generate:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .validation-errors {
    background: #fed7d7;
    border: 1px solid #feb2b2;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .error-item {
    color: #c53030;
    margin-bottom: 0.5rem;
  }

  .error-message {
    background: #fed7d7;
    color: #c53030;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
  }

  .results-panel {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .btn-export {
    padding: 0.5rem 1rem;
    background: #38a169;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }

  .btn-export:hover {
    background: #2f855a;
  }

  .curriculum-overview {
    padding: 2rem;
  }

  .overview-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: #edf2f7;
    border-radius: 8px;
  }

  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: #4a5568;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
  }

  .modules-list {
    padding: 0 2rem 2rem;
  }

  .module-card {
    background: #f9f9f9;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-left: 4px solid #3182ce;
  }

  .module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .module-header h3 {
    color: #2d3748;
    margin: 0;
  }

  .module-duration {
    background: #3182ce;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .module-description {
    color: #4a5568;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .module-competences {
    margin-bottom: 1.5rem;
  }

  .competence-tag {
    display: inline-block;
    background: #bee3f8;
    color: #2a69ac;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    margin-right: 0.5rem;
    margin-top: 0.25rem;
  }

  .activities-section h4 {
    color: #2d3748;
    margin-bottom: 1rem;
  }

  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .activity-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .activity-type {
    background: #48bb78;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    display: inline-block;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    font-weight: 600;
  }

  .activity-title {
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .activity-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: #4a5568;
  }

  .evaluation-section {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .evaluation-section h4 {
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .evaluation-info {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #4a5568;
  }

  fieldset {
    border: none;
    margin: 0;
    padding: 0;
  }

  legend {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #4a5568;
  }

  @media (max-width: 768px) {
    .dashboard-content {
      grid-template-columns: 1fr;
    }
    
    .overview-stats {
      grid-template-columns: 1fr;
    }
    
    .activities-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
