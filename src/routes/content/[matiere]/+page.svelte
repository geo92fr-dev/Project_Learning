<script>
  // 🧪 TDD - Page Matière Dynamique selon DOC_CoPilot_Practices
  // Route: /content/[matiere]

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // Import du store content pour mettre à jour l'état
  import { contentActions } from "$lib/stores/content";

  // Props depuis +page.ts
  export let data;

  let { matiere, niveaux, competences, stats } = data;

  onMount(() => {
    // Mettre à jour le store avec la matière sélectionnée
    contentActions.selectMatiere(matiere.id);
  });

  // Navigation vers un niveau spécifique
  function navigateToNiveau(niveauId) {
    goto(`/content/${matiere.id}/${niveauId}`);
  }

  // Navigation vers une compétence spécifique
  function navigateToCompetence(competenceId) {
    const competence = competences.find((c) => c.id === competenceId);
    if (competence) {
      goto(`/content/${matiere.id}/${competence.niveauId}/${competenceId}`);
    }
  }
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={data.description} />
</svelte:head>

<main class="matiere-page">
  <!-- Header de la matière -->
  <header class="matiere-header">
    <div class="breadcrumb">
      <a href="/content">📚 Contenu</a>
      <span class="separator">›</span>
      <span class="current">{matiere.icone} {matiere.nom}</span>
    </div>

    <div class="matiere-info">
      <div class="matiere-icon">{matiere.icone}</div>
      <div class="matiere-details">
        <h1>{matiere.nom}</h1>
        <p class="description">{matiere.description}</p>
        <div class="stats">
          <span class="stat-item">
            📊 {stats.nombreNiveaux} niveaux
          </span>
          <span class="stat-item">
            🎯 {stats.nombreCompetences} compétences
          </span>
          <span class="stat-item">
            📖 {stats.nombreCours} cours
          </span>
        </div>
      </div>
    </div>
  </header>

  <!-- Navigation par niveaux -->
  <section class="niveaux-section">
    <h2>🎚️ Choisir un niveau</h2>
    <div class="niveaux-grid">
      {#each niveaux as niveau}
        <button
          class="niveau-card"
          style="border-color: {matiere.couleur}"
          on:click={() => navigateToNiveau(niveau.id)}
        >
          <div class="niveau-info">
            <h3>{niveau.nom}</h3>
            <p>Ages {niveau.ageMin}-{niveau.ageMax} ans</p>
          </div>
          <div class="niveau-stats">
            {competences.filter((c) => c.niveauId === niveau.id).length} compétences
          </div>
          <div class="niveau-arrow">→</div>
        </button>
      {/each}
    </div>
  </section>

  <!-- Aperçu des compétences -->
  <section class="competences-section">
    <h2>🎯 Compétences disponibles</h2>
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
          <div class="competence-meta">
            <span class="duree">⏱️ {competence.dureeEstimee}min</span>
            <span class="niveau"
              >📚 {niveaux.find((n) => n.id === competence.niveauId)?.nom}</span
            >
          </div>
          <button
            class="competence-btn"
            style="background-color: {matiere.couleur}"
            on:click={() => navigateToCompetence(competence.id)}
          >
            Commencer
          </button>
        </div>
      {/each}
    </div>
  </section>

  <!-- Actions rapides -->
  <section class="actions-section">
    <div class="quick-actions">
      <a href="/content" class="btn-secondary"> ← Retour au contenu </a>
      <a href="/dashboard" class="btn-secondary"> 📊 Tableau de bord </a>
    </div>
  </section>
</main>

<style>
  .matiere-page {
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

  .matiere-header {
    margin-bottom: 3rem;
  }

  .matiere-info {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .matiere-icon {
    font-size: 4rem;
    line-height: 1;
  }

  .matiere-details h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    color: #1f2937;
  }

  .description {
    color: #6b7280;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .stats {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .stat-item {
    background: #f3f4f6;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #374151;
  }

  /* Sections */
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }

  /* Niveaux */
  .niveaux-section {
    margin-bottom: 3rem;
  }

  .niveaux-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .niveau-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }

  .niveau-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: currentColor;
  }

  .niveau-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
  }

  .niveau-info p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .niveau-stats {
    color: #6b7280;
    font-size: 0.85rem;
  }

  .niveau-arrow {
    font-size: 1.5rem;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .niveau-card:hover .niveau-arrow {
    opacity: 1;
  }

  /* Compétences */
  .competences-section {
    margin-bottom: 3rem;
  }

  .competences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .competence-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-left: 4px solid;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s;
  }

  .competence-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .competence-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .competence-header h3 {
    margin: 0;
    font-size: 1.1rem;
    flex: 1;
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

  .competence-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    color: #6b7280;
  }

  .competence-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
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

  /* Actions */
  .actions-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 2rem;
  }

  .quick-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .matiere-page {
      padding: 1rem;
    }

    .matiere-info {
      flex-direction: column;
      text-align: center;
    }

    .stats {
      justify-content: center;
    }

    .quick-actions {
      flex-direction: column;
    }
  }
</style>
