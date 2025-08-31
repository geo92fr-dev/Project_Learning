<script lang="ts">
  import { page } from '$app/stores';
  import Breadcrumbs from '$lib/components/navigation/Breadcrumbs.svelte';
  import NiveauHeader from '$lib/components/navigation/NiveauHeader.svelte';
  
  export let data;
  
  $: matiere = data.matiere;
  $: niveau = data.niveau;
  $: currentPath = $page.url.pathname;
</script>

<svelte:head>
  <title>{niveau} - {matiere} - FunLearning</title>
  <meta name="description" content="Cours et exercices de {matiere} niveau {niveau}" />
</svelte:head>

<div class="niveau-layout">
  <!-- Breadcrumbs avec navigation niveau -->
  <Breadcrumbs {currentPath} {matiere} {niveau} />
  
  <!-- En-tête du niveau -->
  <NiveauHeader 
    {matiere}
    {niveau}
    competences={data.competences}
    stats={data.stats}
  />
  
  <!-- Contenu principal -->
  <main class="niveau-content">
    <slot />
  </main>
</div>

<style>
  .niveau-layout {
    min-height: 100vh;
  }
  
  .niveau-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 1rem 1rem 0 0;
    min-height: 60vh;
    margin-top: -2rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    .niveau-content {
      padding: 1rem;
      margin-top: -1rem;
      border-radius: 0.75rem 0.75rem 0 0;
    }
  }
  
  @media (max-width: 480px) {
    .niveau-content {
      padding: 0.75rem;
      border-radius: 0.5rem 0.5rem 0 0;
    }
  }
</style>
