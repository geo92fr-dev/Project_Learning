<script lang="ts">
  import { onMount } from "svelte";
  import {
    matieres,
    // competences, // Non utilisé pour l'instant
    courses,
    contentActions,
  } from "$lib/stores/content";
  import { markdownToHtml, processCourse } from "$lib/utils/content";

  let selectedCourse: any = null;
  let renderedHtml = "";
  let processingTime = 0;

  onMount(() => {
    contentActions.loadMockData();
  });

  function testMarkdownRendering(course: any) {
    const startTime = performance.now();

    selectedCourse = course;
    renderedHtml = markdownToHtml(course.contenuMarkdown);

    const endTime = performance.now();
    processingTime = endTime - startTime;
  }

  function testCourseProcessing(course: any) {
    const startTime = performance.now();

    const processedCourse = processCourse(course);
    selectedCourse = processedCourse;
    renderedHtml = processedCourse.contenuHtml || "";

    const endTime = performance.now();
    processingTime = endTime - startTime;
  }
</script>

<svelte:head>
  <title>Test Contenu Markdown - FunLearning</title>
</svelte:head>

<div class="test-container">
  <header>
    <h1>🧪 Test du système de contenu Markdown</h1>
    <p>Validation du rendu sécurisé et des performances</p>
  </header>

  <section class="data-section">
    <h2>📚 Matières disponibles</h2>
    <div class="matieres-list">
      {#each $matieres || [] as matiere (matiere.id)}
        <div class="matiere-chip" style="--couleur: {matiere.couleur}">
          {matiere.icone}
          {matiere.nom}
        </div>
      {/each}
    </div>
  </section>

  <section class="courses-section">
    <h2>📖 Cours de test</h2>
    <div class="courses-grid">
      {#each $courses || [] as course (course.id)}
        <div class="course-card">
          <h3>{course.titre}</h3>
          <p>{course.description}</p>
          <div class="course-meta">
            <span class="duration">⏱️ {course.dureeEstimee} min</span>
            <span class="difficulty">📚 {course.type}</span>
          </div>
          <div class="actions">
            <button on:click={() => testMarkdownRendering(course)}>
              Test Markdown
            </button>
            <button on:click={() => testCourseProcessing(course)}>
              Test Cache
            </button>
          </div>
        </div>
      {/each}
    </div>
  </section>

  {#if selectedCourse}
    <section class="render-section">
      <h2>🎨 Rendu du cours : {selectedCourse.titre}</h2>

      <div class="performance-info">
        <strong>⚡ Temps de traitement:</strong>
        {processingTime.toFixed(2)}ms
      </div>

      <div class="content-comparison">
        <div class="markdown-source">
          <h3>📝 Source Markdown</h3>
          <pre><code>{selectedCourse.contenuMarkdown}</code></pre>
        </div>

        <div class="html-render">
          <h3>🌐 Rendu HTML</h3>
          <div class="rendered-content">
            <!-- Note: Contenu de test sécurisé -->
            {@html renderedHtml}
          </div>
        </div>
      </div>

      <div class="security-info">
        <h3>🔒 Informations de sécurité</h3>
        <ul>
          <li>✅ Contenu sanitisé avec DOMPurify</li>
          <li>✅ Tags HTML dangereux supprimés</li>
          <li>✅ Coloration syntaxique sécurisée</li>
          <li>✅ Cache optimisé pour les performances</li>
        </ul>
      </div>
    </section>
  {/if}
</div>

<style>
  .test-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "Segoe UI", system-ui, sans-serif;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
  }

  header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  header p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin: 0;
  }

  section {
    margin-bottom: 3rem;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 1.8rem;
    color: #374151;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .matieres-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .matiere-chip {
    background: var(--couleur, #3b82f6);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .course-card {
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .course-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .course-card h3 {
    font-size: 1.2rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .course-card p {
    color: #6b7280;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .course-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #6b7280;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .actions button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.3s ease;
  }

  .actions button:hover {
    background: #2563eb;
  }

  .performance-info {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 2rem;
    color: #0c4a6e;
  }

  .content-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .markdown-source,
  .html-render {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }

  .markdown-source h3,
  .html-render h3 {
    background: #f8fafc;
    margin: 0;
    padding: 1rem;
    font-size: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .markdown-source pre {
    margin: 0;
    padding: 1rem;
    background: #1f2937;
    color: #f9fafb;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .rendered-content {
    padding: 1rem;
    max-height: 400px;
    overflow-y: auto;
  }

  .security-info {
    background: #f0fdf4;
    border: 1px solid #22c55e;
    padding: 1.5rem;
    border-radius: 6px;
  }

  .security-info h3 {
    color: #166534;
    margin-bottom: 1rem;
  }

  .security-info ul {
    margin: 0;
    padding-left: 1rem;
  }

  .security-info li {
    color: #166534;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    .test-container {
      padding: 1rem;
    }

    .content-comparison {
      grid-template-columns: 1fr;
    }

    header h1 {
      font-size: 2rem;
    }
  }
</style>
