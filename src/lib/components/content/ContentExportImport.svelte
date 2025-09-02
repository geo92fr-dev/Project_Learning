<script lang="ts">
  import { onMount } from 'svelte';
  import { contentVersioningService } from '$lib/services/content-versioning';
  import type { ContentVersion } from '$lib/types/content-versioning';
  import { EXPORT_FORMATS } from '$lib/types/content-versioning';

  // 🎯 Props
  export let contentId: string = '';
  export let contentType: 'course' | 'exercise' | 'series' = 'course';

  // 🎨 State management
  let versions: ContentVersion[] = [];
  let selectedVersion: ContentVersion | null = null;
  let selectedExportFormat = 'json';
  let loading = false;
  let error = '';
  let success = '';
  
  // 📤 Export state
  let exportResult = '';
  let showExportModal = false;
  let aiExportData = '';

  // 📥 Import state 
  let showImportModal = false;
  let importFile: File | null = null;
  let importMetadata = {
    title: '',
    description: '',
    comment: '',
    authorId: 'test-author',
    authorName: 'Test Author',
    authorEmail: 'test@example.com'
  };

  // 🚀 Initialization
  onMount(() => {
    loadMockVersions();
  });

  // 📚 Load mock versions for demo
  async function loadMockVersions() {
    loading = true;
    try {
      // Créer des versions de test avec la nouvelle API
      const version1 = await contentVersioningService.createVersion({
        contentId: contentId || 'test-content-001',
        contentType,
        content: {
          title: 'Introduction au TypeScript',
          body: 'Les bases des types TypeScript avec des exemples pratiques et des exercices.',
          tags: ['typescript', 'programmation', 'bases']
        },
        metadata: {
          contentId: contentId || 'test-content-001',
          version: 1,
          isActive: false,
          isDraft: false,
          createdAt: new Date(Date.now() - 86400000), // Hier
          updatedAt: new Date(Date.now() - 86400000),
          createdBy: 'author-001',
          approvalStatus: 'approved'
        }
      });

      const version2 = await contentVersioningService.createVersion({
        contentId: contentId || 'test-content-001',
        contentType,
        content: {
          title: 'Introduction au TypeScript - Édition avancée',
          body: 'Version enrichie avec POO, interfaces, classes et héritage. Inclut des exemples avancés et plus d\'exercices pratiques.',
          tags: ['typescript', 'programmation', 'avancé', 'poo', 'interfaces']
        },
        metadata: {
          contentId: contentId || 'test-content-001',
          version: 2,
          isActive: true,
          isDraft: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'author-001',
          approvalStatus: 'approved'
        }
      });

      versions = [version1, version2];
      
      // 🔒 Déduplication des versions par ID pour éviter les erreurs Svelte
      const uniqueVersions = versions.filter((version, index, arr) => 
        arr.findIndex(v => v.id === version.id) === index
      );
      versions = uniqueVersions;
      
      selectedVersion = version2; // Sélectionner la dernière version
      success = `${versions.length} versions chargées avec succès`;
    } catch (err) {
      error = `Erreur lors du chargement: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      loading = false;
    }
  }

  // 📤 Export functions
  async function exportVersion() {
    if (!selectedVersion) {
      error = 'Aucune version sélectionnée';
      return;
    }

    loading = true;
    error = '';
    try {
      const format = EXPORT_FORMATS.find(f => f.id === selectedExportFormat);
      if (!format) {
        throw new Error('Format d\'export non supporté');
      }

      if (selectedExportFormat === 'ai_analysis') {
        // Export spécial pour IA
        const aiData = await contentVersioningService.generateAIExport(
          selectedVersion.id!,
          selectedVersion.contentType
        );
        exportResult = aiData.content;
      } else {
        // Export standard
        const exportData = await contentVersioningService.exportVersion(
          selectedVersion.id!,
          selectedExportFormat as 'json' | 'markdown' | 'package' | 'ai_analysis'
        );
        exportResult = exportData.content;
      }

      showExportModal = true;
      success = `Export ${format.name} généré avec succès`;
    } catch (err) {
      error = `Erreur lors de l'export: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      loading = false;
    }
  }

  async function downloadExport() {
    const format = EXPORT_FORMATS.find(f => f.id === selectedExportFormat);
    if (!format || !exportResult) return;

    const blob = new Blob([exportResult], { type: format.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedVersion?.content?.title || 'export'}.${format.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    success = 'Fichier téléchargé avec succès';
  }

  // 📥 Import functions
  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      importFile = input.files[0];
    }
  }

  async function importContent() {
    if (!importFile) {
      error = 'Aucun fichier sélectionné';
      return;
    }

    loading = true;
    error = '';
    try {
      const content = await importFile.text();
      let parsedContent;

      try {
        parsedContent = JSON.parse(content);
      } catch {
        throw new Error('Fichier JSON invalide');
      }

      // Simuler une analyse IA
      const aiAnalysisData = {
        analysis_summary: {
          overall_score: 8.5,
          strengths: ['Contenu bien structuré', 'Exemples pertinents'],
          weaknesses: ['Manque d\'interactivité', 'Exercices trop simples'],
          priority_improvements: [
            'Ajouter des exemples interactifs',
            'Complexifier les exercices',
            'Intégrer des vidéos explicatives'
          ]
        },
        content_suggestions: {
          modifications: [
            { type: 'enhancement', description: 'Ajout d\'exemples interactifs' },
            { type: 'restructure', description: 'Réorganisation des sections' }
          ]
        },
        original_content: parsedContent,
        content_id: contentId || 'imported-content',
        content_type: contentType
      };

      // Import avec améliorations IA
      const newVersion = await contentVersioningService.importAndEnhance(
        aiAnalysisData,
        {
          preserveMetadata: false,
          autoEnhance: true,
          targetContentId: contentId || 'imported-content'
        }
      );

      versions = [...versions, newVersion];
      selectedVersion = newVersion;
      showImportModal = false;
      success = 'Contenu importé avec améliorations IA appliquées';
    } catch (err) {
      error = `Erreur lors de l'import: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      loading = false;
    }
  }

  // 🎨 UI helpers
  function clearMessages() {
    error = '';
    success = '';
  }

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
</script>

<!-- 🎨 Interface principale -->
<div class="content-export-import">
  <div class="header">
    <h2>🔄 Gestion Export/Import - Phase 11.5</h2>
    <p class="subtitle">
      Versioning sécurisé avec intégration IA pour {contentType} 
      <code>{contentId || 'demo'}</code>
    </p>
  </div>

  <!-- 🚨 Messages d'état -->
  {#if error}
    <div class="alert alert-error" role="alert">
      <span class="icon">⚠️</span>
      {error}
      <button class="close-btn" on:click={clearMessages}>×</button>
    </div>
  {/if}

  {#if success}
    <div class="alert alert-success" role="alert">
      <span class="icon">✅</span>
      {success}
      <button class="close-btn" on:click={clearMessages}>×</button>
    </div>
  {/if}

  <!-- 📚 Sélection de version -->
  <section class="version-selector">
    <h3>📚 Versions disponibles</h3>
    <div class="versions-list">
      {#each versions as version (version.id)}
        <div 
          class="version-card {selectedVersion?.id === version.id ? 'selected' : ''}"
          on:click={() => selectedVersion = version}
          on:keydown={(e) => e.key === 'Enter' && (selectedVersion = version)}
          role="button"
          tabindex="0"
        >
          <div class="version-header">
            <span class="version-number">v{version.metadata.version}</span>
            <span class="version-status status-{version.metadata.approvalStatus}">
              {version.metadata.approvalStatus}
            </span>
          </div>
          <h4>{version.content?.title || 'Sans titre'}</h4>
          <p class="version-description">{version.content?.body || 'Aucune description'}</p>
          <div class="version-meta">
            <span class="author">👤 {version.metadata.createdBy}</span>
            <span class="date">📅 {formatDate(version.metadata.createdAt)}</span>
          </div>
          <div class="version-stats">
            <span class="checksum">🔒 {version.id}</span>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 📤 Export Section -->
  <section class="export-section">
    <h3>📤 Export de version</h3>
    <div class="export-controls">
      <div class="form-group">
        <label for="export-format">Format d'export :</label>
        <select 
          id="export-format" 
          bind:value={selectedExportFormat}
          disabled={!selectedVersion || loading}
        >
          {#each EXPORT_FORMATS as format}
            <option value={format.id}>
              {format.name} (.{format.extension})
              {format.id === 'ai_analysis' ? ' 🤖' : ''}
            </option>
          {/each}
        </select>
      </div>

      <button 
        class="btn btn-primary"
        on:click={exportVersion}
        disabled={!selectedVersion || loading}
      >
        {loading ? '⏳ Export...' : '📤 Exporter'}
      </button>
    </div>

    {#if selectedVersion}
      <div class="selected-version-info">
        <h4>Version sélectionnée :</h4>
        <p><strong>{selectedVersion.content?.title || 'Sans titre'}</strong> (v{selectedVersion.metadata.version})</p>
        <p>Type: <code>{selectedVersion.contentType}</code></p>
        <p>Taille: {JSON.stringify(selectedVersion.content).length} caractères</p>
      </div>
    {/if}
  </section>

  <!-- 📥 Import Section -->
  <section class="import-section">
    <h3>📥 Import avec IA</h3>
    <div class="import-controls">
      <button 
        class="btn btn-secondary"
        on:click={() => showImportModal = true}
        disabled={loading}
      >
        📥 Importer un fichier
      </button>
      <p class="import-description">
        Formats supportés: JSON, avec analyse IA automatique pour améliorer le contenu
      </p>
    </div>
  </section>

  <!-- 📊 Statistics -->
  <section class="statistics">
    <h3>📊 Statistiques</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{versions.length}</div>
        <div class="stat-label">Versions</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">
          {versions.filter(v => v.metadata.approvalStatus === 'approved').length}
        </div>
        <div class="stat-label">Approuvées</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">
          {EXPORT_FORMATS.length}
        </div>
        <div class="stat-label">Formats</div>
      </div>
    </div>
  </section>
</div>

<!-- 📤 Modal Export -->
{#if showExportModal}
  <div 
    class="modal-overlay" 
    on:click={() => showExportModal = false}
    on:keydown={(e) => e.key === 'Escape' && (showExportModal = false)}
    role="button"
    tabindex="0"
  >
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div 
      class="modal" 
      on:click|stopPropagation
      on:keydown={(e) => e.key === 'Escape' && (showExportModal = false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div class="modal-header">
        <h3 id="export-modal-title">📤 Résultat de l'export</h3>
        <button class="close-btn" on:click={() => showExportModal = false}>×</button>
      </div>
      <div class="modal-body">
        <div class="export-preview">
          <pre class="code-block">{exportResult}</pre>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" on:click={downloadExport}>
          💾 Télécharger
        </button>
        <button class="btn btn-secondary" on:click={() => showExportModal = false}>
          Fermer
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- 📥 Modal Import -->
{#if showImportModal}
  <div 
    class="modal-overlay" 
    on:click={() => showImportModal = false}
    on:keydown={(e) => e.key === 'Escape' && (showImportModal = false)}
    role="button"
    tabindex="0"
  >
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div 
      class="modal" 
      on:click|stopPropagation
      on:keydown={(e) => e.key === 'Escape' && (showImportModal = false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div class="modal-header">
        <h3 id="import-modal-title">📥 Import avec analyse IA</h3>
        <button class="close-btn" on:click={() => showImportModal = false}>×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="import-file">Fichier à importer :</label>
          <input 
            id="import-file"
            type="file" 
            accept=".json,.md,.txt"
            on:change={handleFileSelect}
          />
        </div>

        <div class="metadata-form">
          <h4>Métadonnées de la version :</h4>
          <div class="form-group">
            <label for="import-title">Titre :</label>
            <input 
              id="import-title"
              type="text" 
              bind:value={importMetadata.title}
              placeholder="Titre de la nouvelle version"
            />
          </div>
          <div class="form-group">
            <label for="import-description">Description :</label>
            <textarea 
              id="import-description"
              bind:value={importMetadata.description}
              placeholder="Description des changements"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="import-comment">Commentaire :</label>
            <input 
              id="import-comment"
              type="text" 
              bind:value={importMetadata.comment}
              placeholder="Commentaire sur l'import"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button 
          class="btn btn-primary"
          on:click={importContent}
          disabled={!importFile || loading}
        >
          {loading ? '⏳ Import...' : '🤖 Importer avec IA'}
        </button>
        <button class="btn btn-secondary" on:click={() => showImportModal = false}>
          Annuler
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .content-export-import {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
  }

  .header h2 {
    margin: 0 0 10px 0;
    font-size: 2rem;
  }

  .subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }

  .subtitle code {
    background: rgba(255,255,255,0.2);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
  }

  .alert {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
  }

  .alert-error {
    background-color: #fee;
    color: #c53030;
    border: 1px solid #fed7d7;
  }

  .alert-success {
    background-color: #f0fff4;
    color: #2f855a;
    border: 1px solid #c6f6d5;
  }

  .close-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.7;
  }

  .close-btn:hover {
    opacity: 1;
  }

  section {
    background: white;
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0;
  }

  section h3 {
    margin: 0 0 20px 0;
    color: #2d3748;
    font-size: 1.4rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
  }

  .versions-list {
    display: grid;
    gap: 15px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .version-card {
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #fafafa;
  }

  .version-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .version-card.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  }

  .version-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .version-number {
    font-weight: bold;
    font-size: 1.1rem;
    color: #667eea;
  }

  .version-status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  .status-pending { background: #fef5e7; color: #d69e2e; }
  .status-approved { background: #f0fff4; color: #2f855a; }
  .status-rejected { background: #fee; color: #c53030; }
  .status-draft { background: #edf2f7; color: #4a5568; }

  .version-card h4 {
    margin: 0 0 8px 0;
    color: #2d3748;
  }

  .version-description {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 10px;
  }

  .version-meta {
    display: flex;
    gap: 15px;
    font-size: 0.8rem;
    color: #718096;
    margin-bottom: 8px;
  }

  .version-stats {
    font-size: 0.7rem;
    color: #a0aec0;
  }

  .export-controls, .import-controls {
    display: flex;
    gap: 20px;
    align-items: end;
    margin-bottom: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-weight: 600;
    color: #4a5568;
  }

  .form-group select,
  .form-group input,
  .form-group textarea {
    padding: 10px;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
  }

  .form-group select:focus,
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .btn {
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #edf2f7;
    color: #4a5568;
    border: 2px solid #e2e8f0;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e2e8f0;
  }

  .selected-version-info {
    background: #f7fafc;
    padding: 15px;
    border-radius: 6px;
    border-left: 4px solid #667eea;
  }

  .selected-version-info h4 {
    margin: 0 0 10px 0;
    color: #2d3748;
  }

  .selected-version-info p {
    margin: 5px 0;
    color: #4a5568;
  }

  .import-description {
    color: #718096;
    font-style: italic;
    margin: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
  }

  .stat-card {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 5px;
  }

  .stat-label {
    color: #718096;
    font-weight: 600;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 10px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .modal-header {
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    margin: 0;
    color: #2d3748;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 20px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 15px;
    justify-content: flex-end;
  }

  .export-preview {
    max-height: 400px;
    overflow-y: auto;
  }

  .code-block {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 15px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .metadata-form {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
  }

  .metadata-form h4 {
    margin: 0 0 15px 0;
    color: #2d3748;
  }

  @media (max-width: 768px) {
    .content-export-import {
      padding: 10px;
    }
    
    .export-controls, .import-controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .versions-list {
      grid-template-columns: 1fr;
    }
    
    .modal {
      width: 95%;
      margin: 10px;
    }
  }
</style>
