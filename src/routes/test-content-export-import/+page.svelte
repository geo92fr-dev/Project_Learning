<script lang="ts">
  import ContentExportImport from '$lib/components/content/ContentExportImport.svelte';
  import { onMount } from 'svelte';

  // Configuration de test
  let contentId = 'typescript-course-001';
  let contentType: 'course' | 'exercise' | 'series' = 'course';
  let testMode = 'demo';

  // État de la page
  let pageReady = false;

  onMount(() => {
    // Simulation d'initialisation
    setTimeout(() => {
      pageReady = true;
    }, 500);
  });

  function switchContentType(type: 'course' | 'exercise' | 'series') {
    contentType = type;
    contentId = type === 'course' ? 'typescript-course-001' : 
                type === 'exercise' ? 'typescript-exercise-001' : 
                'typescript-series-001';
  }
</script>

<svelte:head>
  <title>Test ContentExportImport - Phase 11.5</title>
  <meta name="description" content="Interface de test pour l'export/import de contenu avec versioning et IA" />
</svelte:head>

<main class="test-page">
  <div class="test-header">
    <h1>🧪 Test Interface ContentExportImport</h1>
    <p class="test-description">
      Interface complète de la <strong>Phase 11.5</strong> - Content Versioning & Export/Import avec analyse IA
    </p>
    
    <!-- Contrôles de test -->
    <div class="test-controls">
      <fieldset class="control-group">
        <legend>Type de contenu :</legend>
        <div class="button-group">
          <button 
            class="btn {contentType === 'course' ? 'active' : ''}"
            on:click={() => switchContentType('course')}
          >
            📚 Course
          </button>
          <button 
            class="btn {contentType === 'exercise' ? 'active' : ''}"
            on:click={() => switchContentType('exercise')}
          >
            📝 Exercise
          </button>
          <button 
            class="btn {contentType === 'series' ? 'active' : ''}"
            on:click={() => switchContentType('series')}
          >
            📖 Series
          </button>
        </div>
      </fieldset>

      <div class="control-group">
        <label for="content-id">ID du contenu :</label>
        <input 
          id="content-id"
          type="text" 
          bind:value={contentId}
          placeholder="Entrez un ID de contenu"
        />
      </div>
    </div>

    <!-- Informations de test -->
    <div class="test-info">
      <h3>🔍 Fonctionnalités testées :</h3>
      <ul class="features-list">
        <li>✅ Création automatique de versions de test</li>
        <li>✅ Export vers formats multiples (JSON, PDF, AI Analysis)</li>
        <li>✅ Sanitisation de sécurité (XSS, injection)</li>
        <li>✅ Import avec améliorations IA automatiques</li>
        <li>✅ Gestion des métadonnées et checksums</li>
        <li>✅ Interface responsive et accessible</li>
        <li>✅ Validation Zod et TypeScript strict</li>
      </ul>
    </div>
  </div>

  {#if pageReady}
    <div class="component-container">
      <!-- Interface principale -->
      <ContentExportImport 
        {contentId}
        {contentType}
      />
    </div>
  {:else}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Initialisation de l'interface de test...</p>
    </div>
  {/if}

  <!-- Informations techniques -->
  <footer class="test-footer">
    <div class="tech-info">
      <h3>🔧 Informations techniques</h3>
      <div class="tech-grid">
        <div class="tech-item">
          <strong>Service :</strong>
          <code>ContentVersioningService</code>
        </div>
        <div class="tech-item">
          <strong>Types :</strong>
          <code>ContentVersion, ContentVersionInput</code>
        </div>
        <div class="tech-item">
          <strong>Validation :</strong>
          <code>Zod + DOMPurify</code>
        </div>
        <div class="tech-item">
          <strong>Sécurité :</strong>
          <code>XSS Protection + Input Sanitization</code>
        </div>
        <div class="tech-item">
          <strong>Tests :</strong>
          <code>15/15 passants (TDD)</code>
        </div>
        <div class="tech-item">
          <strong>Framework :</strong>
          <code>SvelteKit + TypeScript</code>
        </div>
      </div>
    </div>

    <div class="test-commands">
      <h3>🎯 Tests recommandés</h3>
      <ol class="test-steps">
        <li>Sélectionnez différentes versions dans la liste</li>
        <li>Testez l'export "AI Analysis" pour voir les prompts IA</li>
        <li>Créez un fichier JSON simple et testez l'import</li>
        <li>Vérifiez que les caractères malveillants sont sanitisés</li>
        <li>Testez la responsivité sur différentes tailles d'écran</li>
        <li>Vérifiez les statistiques et informations de version</li>
      </ol>
    </div>
  </footer>
</main>

<style>
  .test-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .test-header {
    max-width: 1200px;
    margin: 0 auto 30px auto;
    text-align: center;
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .test-header h1 {
    margin: 0 0 15px 0;
    font-size: 2.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .test-description {
    font-size: 1.2rem;
    color: #4a5568;
    margin-bottom: 25px;
    line-height: 1.6;
  }

  .test-controls {
    display: flex;
    gap: 30px;
    justify-content: center;
    align-items: end;
    margin-bottom: 25px;
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    border: none;
    margin: 0;
    padding: 0;
  }

  .control-group legend {
    font-weight: 600;
    color: #2d3748;
    font-size: 0.9rem;
    padding: 0;
    margin-bottom: 8px;
  }

  .control-group label {
    font-weight: 600;
    color: #2d3748;
    font-size: 0.9rem;
  }

  .button-group {
    display: flex;
    gap: 5px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }

  .button-group .btn {
    border: none;
    border-radius: 0;
    margin: 0;
    transition: all 0.2s ease;
  }

  .button-group .btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: none;
  }

  .btn {
    padding: 8px 16px;
    background: #f7fafc;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    font-size: 0.9rem;
  }

  .btn:hover {
    background: #edf2f7;
    transform: translateY(-1px);
  }

  #content-id {
    padding: 8px 12px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.9rem;
    min-width: 200px;
  }

  #content-id:focus {
    outline: none;
    border-color: #667eea;
  }

  .test-info {
    background: #f0fff4;
    border: 1px solid #c6f6d5;
    border-radius: 8px;
    padding: 20px;
    text-align: left;
    max-width: 600px;
    margin: 0 auto;
  }

  .test-info h3 {
    margin: 0 0 15px 0;
    color: #2f855a;
  }

  .features-list {
    margin: 0;
    padding-left: 20px;
    color: #2f855a;
  }

  .features-list li {
    margin-bottom: 5px;
    line-height: 1.4;
  }

  .component-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: #718096;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .test-footer {
    max-width: 1200px;
    margin: 40px auto 0 auto;
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }

  .tech-info h3,
  .test-commands h3 {
    margin: 0 0 20px 0;
    color: #2d3748;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
  }

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }

  .tech-item {
    padding: 12px;
    background: #f7fafc;
    border-radius: 6px;
    border-left: 4px solid #667eea;
  }

  .tech-item strong {
    display: block;
    color: #2d3748;
    margin-bottom: 5px;
  }

  .tech-item code {
    background: #edf2f7;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85rem;
    color: #4a5568;
  }

  .test-steps {
    color: #4a5568;
    line-height: 1.6;
  }

  .test-steps li {
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    .test-page {
      padding: 10px;
    }
    
    .test-header {
      padding: 20px;
    }
    
    .test-header h1 {
      font-size: 2rem;
    }
    
    .test-controls {
      flex-direction: column;
      gap: 15px;
    }
    
    .tech-grid {
      grid-template-columns: 1fr;
    }
    
    #content-id {
      min-width: 250px;
    }
  }
</style>
