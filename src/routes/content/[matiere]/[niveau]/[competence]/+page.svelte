<script>
  // 🧪 TDD - Page Compétence Dynamique selon DOC_CoPilot_Practices
  // Route: /content/[matiere]/[niveau]/[competence]

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte";

  // Import du store content pour mettre à jour l'état
  import contentStore from "$lib/stores/content";

  // Props depuis +page.ts
  export let data;

  let { matiere, niveau, competence, courses, relatedCompetences, stats } =
    data;

  onMount(() => {
    // Mettre à jour le store avec la sélection complète
    contentStore.contentActions.selectMatiere(matiere.id);
    contentStore.contentActions.selectNiveau(niveau.id);
    contentStore.contentActions.selectCompetence(competence.id);
  });

  // Navigation vers un cours spécifique
  function navigateToCourse(courseId) {
    goto(
      `/content/${matiere.id}/${niveau.id}/${competence.id}/cours/${courseId}`
    );
  }

  // Navigation vers une compétence related
  function navigateToRelatedCompetence(relatedCompetenceId) {
    goto(`/content/${matiere.id}/${niveau.id}/${relatedCompetenceId}`);
  }

  // Commencer le premier cours disponible
  function startFirstCourse() {
    if (courses.length > 0) {
      navigateToCourse(courses[0].id);
    }
  }

  // Calculer la difficulté en couleur
  function getDifficultyColor(difficulte) {
    switch (difficulte) {
      case "facile":
        return "#10b981";
      case "moyen":
        return "#f59e0b";
      case "difficile":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  }
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={data.description} />
</svelte:head>

<main class="competence-page">
  <!-- Header de la compétence -->
  <header class="competence-header">
    <div class="breadcrumb">
      <a href="/content">📚 Contenu</a>
      <span class="separator">›</span>
      <a href="/content/{matiere.id}">{matiere.icone} {matiere.nom}</a>
      <span class="separator">›</span>
      <a href="/content/{matiere.id}/{niveau.id}">📚 {niveau.nom}</a>
      <span class="separator">›</span>
      <span class="current">🎯 {competence.nom}</span>
    </div>

    <div class="competence-info">
      <div class="competence-title">
        <h1>{competence.nom}</h1>
        <div class="competence-badges">
          <span
            class="difficulte-badge"
            style="background-color: {getDifficultyColor(
              competence.difficulte
            )}15; color: {getDifficultyColor(competence.difficulte)}"
          >
            {competence.difficulte}
          </span>
          <span class="duree-badge">
            ⏱️ {competence.dureeEstimee} min
          </span>
        </div>
      </div>

      <p class="competence-description">{competence.description}</p>

      <div class="competence-stats">
        <div class="stat-card">
          <span class="stat-number">{stats.nombreCours}</span>
          <span class="stat-label">Cours</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{Math.round(stats.dureeTotal / 60)}h</span>
          <span class="stat-label">Durée</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{stats.progression}%</span>
          <span class="stat-label">Progression</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Objectifs de la compétence -->
  {#if competence.objectifs && competence.objectifs.length > 0}
    <section class="objectifs-section">
      <h2>📋 Objectifs d'apprentissage</h2>
      <div class="objectifs-grid">
        {#each competence.objectifs as objectif, index}
          <div class="objectif-card">
            <span class="objectif-number">{index + 1}</span>
            <p>{objectif}</p>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Prérequis -->
  {#if competence.prerequis && competence.prerequis.length > 0}
    <section class="prerequis-section">
      <h2>📚 Prérequis</h2>
      <div class="prerequis-list">
        {#each competence.prerequis as prerequis}
          <div class="prerequis-item">
            <span class="prerequis-icon">✅</span>
            <span>{prerequis}</span>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Cours disponibles -->
  <section class="courses-section">
    <div class="section-header">
      <h2>📖 Cours et leçons</h2>
      {#if courses.length > 0}
        <button class="start-learning-btn" on:click={startFirstCourse}>
          🚀 Commencer l'apprentissage
        </button>
      {/if}
    </div>

    {#if courses.length > 0}
      <div class="courses-list">
        {#each courses as course, index}
          <div
            class="course-item"
            role="button"
            tabindex="0"
            on:click={() => navigateToCourse(course.id)}
            on:keydown={(e) => e.key === "Enter" && navigateToCourse(course.id)}
          >
            <div class="course-number">
              {course.ordre || index + 1}
            </div>
            <div class="course-content">
              <h3>{course.titre}</h3>
              <p class="course-description">{course.description}</p>

              {#if course.contenuMarkdown}
                <div class="course-preview">
                  <MarkdownRenderer
                    content={course.contenuMarkdown.substring(0, 200) + "..."}
                    showToc={false}
                    compact={true}
                  />
                </div>
              {/if}

              <div class="course-meta">
                <span class="course-type">{course.type}</span>
                <span class="course-duration">⏱️ {course.dureeEstimee}min</span>
              </div>
            </div>
            <div class="course-action">
              <span class="action-arrow">→</span>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="empty-courses">
        <p>Aucun cours disponible pour cette compétence pour le moment.</p>
        <p>Revenez plus tard ou explorez d'autres compétences.</p>
      </div>
    {/if}
  </section>

  <!-- Compétences connexes -->
  {#if relatedCompetences.length > 0}
    <section class="related-section">
      <h2>🔗 Compétences connexes</h2>
      <div class="related-grid">
        {#each relatedCompetences as related}
          <div
            class="related-card"
            role="button"
            tabindex="0"
            on:click={() => navigateToRelatedCompetence(related.id)}
            on:keydown={(e) =>
              e.key === "Enter" && navigateToRelatedCompetence(related.id)}
          >
            <h3>{related.nom}</h3>
            <p>{related.description}</p>
            <div class="related-meta">
              <span
                class="related-difficulte"
                style="color: {getDifficultyColor(related.difficulte)}"
              >
                {related.difficulte}
              </span>
              <span class="related-duree">⏱️ {related.dureeEstimee}min</span>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Tags -->
  {#if competence.tags && competence.tags.length > 0}
    <section class="tags-section">
      <h3>🏷️ Mots-clés</h3>
      <div class="tags-list">
        {#each competence.tags as tag}
          <span class="tag">#{tag}</span>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Navigation et actions -->
  <section class="actions-section">
    <div class="navigation-actions">
      <a href="/content/{matiere.id}/{niveau.id}" class="btn-secondary">
        ← Retour au {niveau.nom}
      </a>
      <a href="/content/{matiere.id}" class="btn-secondary">
        {matiere.icone}
        {matiere.nom}
      </a>
      <a href="/content" class="btn-secondary"> 📚 Tout le contenu </a>
    </div>
  </section>
</main>

<style>
  .competence-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Header */
  .breadcrumb {
    margin-bottom: 1rem;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .breadcrumb a {
    text-decoration: none;
    color: #3b82f6;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .separator {
    margin: 0 0.5rem;
  }

  .current {
    font-weight: 500;
  }

  .competence-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 3rem;
  }

  .competence-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .competence-title h1 {
    margin: 0;
    font-size: 2.5rem;
    color: #1f2937;
    flex: 1;
  }

  .competence-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .difficulte-badge,
  .duree-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .duree-badge {
    background: #f3f4f6;
    color: #374151;
  }

  .competence-description {
    color: #6b7280;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .competence-stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stat-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    min-width: 80px;
  }

  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #6b7280;
  }

  /* Sections */
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }

  /* Objectifs */
  .objectifs-section {
    margin-bottom: 3rem;
  }

  .objectifs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .objectif-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .objectif-number {
    background: #3b82f6;
    color: white;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .objectif-card p {
    margin: 0;
    color: #374151;
    line-height: 1.4;
  }

  /* Prérequis */
  .prerequis-section {
    margin-bottom: 3rem;
  }

  .prerequis-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .prerequis-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f0fdf4;
    border-radius: 6px;
    border-left: 3px solid #10b981;
  }

  .prerequis-icon {
    font-size: 1.1rem;
  }

  /* Cours */
  .courses-section {
    margin-bottom: 3rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .start-learning-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .start-learning-btn:hover {
    background: #059669;
  }

  .courses-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .course-item {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .course-item:hover {
    border-color: #3b82f6;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .course-number {
    background: #3b82f6;
    color: white;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }

  .course-content {
    flex: 1;
  }

  .course-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    color: #1f2937;
  }

  .course-description {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .course-preview {
    background: #f8fafc;
    border-left: 3px solid #3b82f6;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    color: #6b7280;
  }

  .course-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
  }

  .course-type {
    background: #e0e7ff;
    color: #3730a3;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .course-duration {
    color: #6b7280;
  }

  .course-action {
    display: flex;
    align-items: center;
  }

  .action-arrow {
    font-size: 1.5rem;
    color: #6b7280;
    transition: color 0.2s;
  }

  .course-item:hover .action-arrow {
    color: #3b82f6;
  }

  .empty-courses {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }

  /* Compétences connexes */
  .related-section {
    margin-bottom: 3rem;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .related-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .related-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }

  .related-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #1f2937;
  }

  .related-card p {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .related-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
  }

  /* Tags */
  .tags-section {
    margin-bottom: 3rem;
  }

  .tags-section h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  .tags-list {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tag {
    background: #f3f4f6;
    color: #6b7280;
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
  }

  /* Actions */
  .actions-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 2rem;
  }

  .navigation-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    transition: background 0.2s;
    text-align: center;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .competence-page {
      padding: 1rem;
    }

    .competence-title {
      flex-direction: column;
      text-align: center;
    }

    .competence-stats {
      justify-content: center;
    }

    .section-header {
      flex-direction: column;
      text-align: center;
    }

    .course-item {
      flex-direction: column;
      text-align: center;
    }

    .navigation-actions {
      flex-direction: column;
    }
  }
</style>
