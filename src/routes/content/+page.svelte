<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { matieres, niveaux, contentActions } from "$lib/stores/content";
  import type { Matiere, NiveauEducatif } from '$lib/types/content';

  onMount(() => {
    contentActions.loadMockData();
  });

  // Fonctions de navigation requises pour la validation Phase 3
  function navigateToMatiere(matiere: Matiere) {
    contentActions.selectMatiere(matiere.id);
    goto(`/content/${matiere.code.toLowerCase()}`);
  }

  function navigateToNiveau(niveau: NiveauEducatif) {
    contentActions.selectNiveau(niveau.id);
    goto(`/content/niveau/${niveau.code.toLowerCase()}`);
  }
</script>

<svelte:head>
  <title>Contenu - FunLearning</title>
</svelte:head>

<div class="content-hub">
  <!-- Breadcrumb navigation -->
  <nav class="breadcrumb">
    <span class="breadcrumb-current">Explorer le contenu</span>
  </nav>
  
  <header>
    <h1>Explorer le contenu</h1>
    <p>Découvrez nos matières et niveaux d'apprentissage</p>
  </header>

  <section class="matieres-grid">
    <h2>Matières disponibles</h2>
    <div class="grid">
      {#each $matieres || [] as matiere (matiere.id)}
        <div
          class="matiere-card"
          style="--couleur: {matiere.couleur}"
          on:click={() => navigateToMatiere(matiere)}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === 'Enter' && navigateToMatiere(matiere)}
        >
          <div class="icone">{matiere.icone}</div>
          <h3>{matiere.nom}</h3>
          <p>{matiere.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="niveaux-section">
    <h2>Niveaux d'apprentissage</h2>
    <div class="niveaux-list">
      {#each $niveaux || [] as niveau (niveau.id)}
        <div 
          class="niveau-card"
          on:click={() => navigateToNiveau(niveau)}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === 'Enter' && navigateToNiveau(niveau)}
        >
          <strong>{niveau.nom}</strong>
          <span>Ages {niveau.ageMin}-{niveau.ageMax} ans</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="stats-section">
    <h2>Progression</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-number">{($matieres || []).length}</span>
        <span class="stat-label">Matières</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{($niveaux || []).length}</span>
        <span class="stat-label">Niveaux</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">12</span>
        <span class="stat-label">Cours terminés</span>
      </div>
    </div>
  </section>
</div>

<style>
  .content-hub {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: "Segoe UI", system-ui, sans-serif;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
  }

  header h1 {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  header p {
    font-size: 1.2rem;
    color: #6b7280;
    margin: 0;
  }

  section {
    margin-bottom: 3rem;
  }

  h2 {
    font-size: 1.8rem;
    color: #374151;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .matiere-card {
    background: linear-gradient(
      135deg,
      var(--couleur, #3b82f6) 0%,
      var(--couleur, #3b82f6) 88 20%
    );
    color: white;
    padding: 2rem;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .matiere-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }

  .matiere-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .icone {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  .matiere-card h3 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }

  .matiere-card p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .niveaux-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .niveau-item {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 120px;
    transition: all 0.3s ease;
  }

  .niveau-item:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .niveau-item strong {
    font-size: 1.1rem;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .niveau-item span {
    font-size: 0.85rem;
    color: #6b7280;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 768px) {
    .content-hub {
      padding: 1rem;
    }

    header h1 {
      font-size: 2rem;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .niveaux-list {
      justify-content: center;
    }
  }
</style>
