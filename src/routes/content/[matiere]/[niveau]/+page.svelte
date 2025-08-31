<script>
  // 🧪 TDD - Page Niveau Dynamique selon DOC_CoPilot_Practices
  // Route: /content/[matiere]/[niveau]

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // Import du store content pour mettre à jour l'état
  import contentStore from "$lib/stores/content";

  // Props depuis +page.ts
  export let data;

  let { matiere, niveau, competences, courses, stats } = data;

  onMount(() => {
    // Mettre à jour le store avec la sélection
    contentStore.contentActions.selectMatiere(matiere.id);
    contentStore.contentActions.selectNiveau(niveau.id);
  });

  // Navigation vers une compétence spécifique
  function navigateToCompetence(competenceId) {
    goto(`/content/${matiere.id}/${niveau.id}/${competenceId}`);
  }

  // Navigation vers un cours spécifique
  function navigateToCourse(courseId) {
    goto(`/content/${matiere.id}/${niveau.id}/cours/${courseId}`);
  }
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={data.description} />
</svelte:head>

<main class="niveau-page">
  <!-- Header du niveau -->
  <header class="niveau-header">
    <div class="breadcrumb">
      <a href="/content">📚 Contenu</a>
      <span class="separator">›</span>
      <a href="/content/{matiere.id}">{matiere.icone} {matiere.nom}</a>
      <span class="separator">›</span>
      <span class="current">📚 {niveau.nom}</span>
    </div>

    <div class="niveau-info">
      <div class="niveau-title">
        <h1>{niveau.nom} - {matiere.nom}</h1>
        <p class="niveau-meta">
          👶 Ages {niveau.ageMin}-{niveau.ageMax} ans
        </p>
      </div>

      <div class="niveau-stats">
        <div class="stat-card">
          <span class="stat-number">{stats.nombreCompetences}</span>
          <span class="stat-label">Compétences</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{stats.nombreCours}</span>
          <span class="stat-label">Cours</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{Math.round(stats.dureeTotal / 60)}h</span>
          <span class="stat-label">Durée totale</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Compétences disponibles -->
  <section class="competences-section">
    <h2>🎯 Compétences à maîtriser</h2>
    <div class="competences-grid">
      {#each competences as competence}
        <div
          class="competence-card"
          style="border-left-color: {matiere.couleur}"
        >
          <div class="competence-header">
            <h3>{competence.nom}</h3>
            <span class="difficulte difficulte-{competence.difficulte}">
              {competence.difficulte}
            </span>
          </div>
          <p class="competence-description">{competence.description}</p>

          <!-- Objectifs de la compétence -->
          {#if competence.objectifs && competence.objectifs.length > 0}
            <div class="objectifs">
              <h4>📋 Objectifs :</h4>
              <ul>
                {#each competence.objectifs as objectif}
                  <li>{objectif}</li>
                {/each}
              </ul>
            </div>
          {/if}

          <div class="competence-meta">
            <span class="duree">⏱️ {competence.dureeEstimee}min</span>
            {#if competence.tags && competence.tags.length > 0}
              <div class="tags">
                {#each competence.tags as tag}
                  <span class="tag">#{tag}</span>
                {/each}
              </div>
            {/if}
          </div>

          <button
            class="competence-btn"
            style="background-color: {matiere.couleur}"
            on:click={() => navigateToCompetence(competence.id)}
          >
            Explorer cette compétence →
          </button>
        </div>
      {/each}
    </div>
  </section>

  <!-- Cours recommandés -->
  {#if courses.length > 0}
    <section class="courses-section">
      <h2>📖 Cours recommandés</h2>
      <div class="courses-grid">
        {#each courses as course}
          <div
            class="course-card"
            role="button"
            tabindex="0"
            on:click={() => navigateToCourse(course.id)}
            on:keydown={(e) => e.key === "Enter" && navigateToCourse(course.id)}
          >
            <div class="course-header">
              <h3>{course.titre}</h3>
              <span class="course-type">{course.type}</span>
            </div>
            <p class="course-description">{course.description}</p>

            <div class="course-meta">
              <span class="duree">⏱️ {course.dureeEstimee}min</span>
              <span class="ordre">📊 Ordre {course.ordre}</span>
            </div>

            <button class="course-btn"> Commencer le cours </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Navigation et actions -->
  <section class="actions-section">
    <div class="navigation-actions">
      <a href="/content/{matiere.id}" class="btn-secondary">
        ← Retour à {matiere.nom}
      </a>
      <a href="/content" class="btn-secondary"> 📚 Tout le contenu </a>
      <a href="/dashboard" class="btn-secondary"> 📊 Tableau de bord </a>
    </div>
  </section>
</main>

<style>
  .niveau-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Header */
  .breadcrumb {
    margin-bottom: 1rem;
    color: #6b7280;
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

  .niveau-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 3rem;
  }

  .niveau-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .niveau-title h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    color: #1f2937;
  }

  .niveau-meta {
    color: #6b7280;
    font-size: 1.1rem;
    margin: 0;
  }

  .niveau-stats {
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

  /* Compétences */
  .competences-section {
    margin-bottom: 3rem;
  }

  .competences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .competence-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-left: 4px solid;
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.2s;
  }

  .competence-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .competence-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .competence-header h3 {
    margin: 0;
    font-size: 1.2rem;
    flex: 1;
    color: #1f2937;
  }

  .difficulte {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    margin-left: 0.5rem;
  }

  .difficulte-facile {
    background: #d1fae5;
    color: #065f46;
  }

  .difficulte-moyen {
    background: #fef3c7;
    color: #92400e;
  }

  .difficulte-difficile {
    background: #fee2e2;
    color: #991b1b;
  }

  .competence-description {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .objectifs {
    margin-bottom: 1rem;
  }

  .objectifs h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #374151;
  }

  .objectifs ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #6b7280;
    font-size: 0.85rem;
  }

  .objectifs li {
    margin-bottom: 0.25rem;
  }

  .competence-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .duree {
    color: #6b7280;
    font-size: 0.85rem;
  }

  .tags {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .tag {
    background: #f3f4f6;
    color: #6b7280;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .competence-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: opacity 0.2s;
    width: 100%;
  }

  .competence-btn:hover {
    opacity: 0.9;
  }

  /* Cours */
  .courses-section {
    margin-bottom: 3rem;
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .course-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .course-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .course-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #1f2937;
    flex: 1;
  }

  .course-type {
    background: #e0e7ff;
    color: #3730a3;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
  }

  .course-description {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .course-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #6b7280;
  }

  .course-btn {
    background: #f3f4f6;
    color: #374151;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
    width: 100%;
  }

  .course-btn:hover {
    background: #e5e7eb;
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
    .niveau-page {
      padding: 1rem;
    }

    .niveau-info {
      flex-direction: column;
      text-align: center;
    }

    .niveau-stats {
      justify-content: center;
    }

    .navigation-actions {
      flex-direction: column;
    }

    .competences-grid {
      grid-template-columns: 1fr;
    }

    .courses-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
