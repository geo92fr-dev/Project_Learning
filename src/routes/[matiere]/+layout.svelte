<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Breadcrumbs from '$lib/components/navigation/Breadcrumbs.svelte';
  import MatiereHeader from '$lib/components/navigation/MatiereHeader.svelte';
  
  export let data;
  
  $: matiere = data.matiere;
  $: stats = data.stats;
  $: currentPath = $page.url.pathname;
  
  // Configuration CSS dynamique pour les couleurs de la matière
  $: matiereColors = getMatiereColors(matiere);
  
  function getMatiereColors(mat: string): { color: string; colorDark: string } {
    const colors: Record<string, { color: string; colorDark: string }> = {
      'mathematiques': { color: '#667eea', colorDark: '#764ba2' },
      'francais': { color: '#f093fb', colorDark: '#f5576c' },
      'anglais': { color: '#4facfe', colorDark: '#00f2fe' },
      'histoire': { color: '#fa709a', colorDark: '#fee140' },
      'geographie': { color: '#a8edea', colorDark: '#fed6e3' },
      'sciences': { color: '#d299c2', colorDark: '#fef9d7' }
    };
    return colors[mat] || { color: '#667eea', colorDark: '#764ba2' };
  }
  
  onMount(() => {
    // Appliquer les variables CSS pour la matière
    document.documentElement.style.setProperty('--matiere-color', matiereColors.color);
    document.documentElement.style.setProperty('--matiere-color-dark', matiereColors.colorDark);
  });
  
  // Nettoyer les variables CSS quand le composant est détruit
  import { onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  
  onDestroy(() => {
    if (browser) {
      document.documentElement.style.removeProperty('--matiere-color');
      document.documentElement.style.removeProperty('--matiere-color-dark');
    }
  });
</script>

<svelte:head>
  <title>{data.matiere} - FunLearning</title>
  <meta name="description" content="Cours et exercices de {data.matiere} pour le collège - 6ème à 3ème" />
</svelte:head>

<div class="matiere-layout">
  <!-- Breadcrumbs -->
  <Breadcrumbs {currentPath} {matiere} />
  
  <!-- En-tête de la matière -->
  <MatiereHeader 
    {matiere}
    totalCompetences={stats.totalCompetences}
    totalCours={stats.totalCours}
    progression={stats.progression}
  />
  
  <!-- Contenu principal -->
  <main class="matiere-content">
    <slot />
  </main>
</div>

<style>
  .matiere-layout {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--matiere-color, #667eea) 0%, var(--matiere-color-dark, #764ba2) 100%);
    position: relative;
  }
  
  .matiere-layout::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  .matiere-content {
    position: relative;
    z-index: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 1rem 1rem 0 0;
    min-height: 60vh;
    margin-top: -2rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .matiere-content {
      padding: 1rem;
      margin-top: -1rem;
      border-radius: 0.75rem 0.75rem 0 0;
    }
  }
  
  @media (max-width: 480px) {
    .matiere-content {
      padding: 0.75rem;
      border-radius: 0.5rem 0.5rem 0 0;
    }
  }
</style>
