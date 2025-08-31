<script lang="ts">
  import { page } from '$app/stores';
  
  export let currentPath: string = '';
  export let matiere: string = '';
  export let niveau: string = '';
  export let competence: string = '';
  
  // Mapping des noms affichables
  const matiereLabels: Record<string, string> = {
    'mathematiques': '📊 Mathématiques',
    'francais': '📚 Français', 
    'anglais': '🌍 Anglais',
    'histoire': '🏛️ Histoire',
    'geographie': '🗺️ Géographie',
    'sciences': '🔬 Sciences'
  };
  
  const niveauLabels: Record<string, string> = {
    '6eme': '6ème',
    '5eme': '5ème',
    '4eme': '4ème',
    '3eme': '3ème'
  };
  
  // Construire le fil d'Ariane
  $: breadcrumbs = buildBreadcrumbs(currentPath, matiere, niveau, competence);
  
  function buildBreadcrumbs(path: string, mat: string, niv: string, comp: string) {
    const crumbs = [
      { label: '🏠 Accueil', href: '/', current: false }
    ];
    
    if (mat) {
      crumbs.push({
        label: matiereLabels[mat] || mat,
        href: `/${mat}`,
        current: !niv && !comp
      });
    }
    
    if (niv) {
      crumbs.push({
        label: niveauLabels[niv] || niv,
        href: `/${mat}/${niv}`,
        current: !comp
      });
    }
    
    if (comp) {
      crumbs.push({
        label: formatCompetence(comp),
        href: `/${mat}/${niv}/${comp}`,
        current: true
      });
    }
    
    return crumbs;
  }
  
  function formatCompetence(comp: string): string {
    return comp
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
</script>

<nav class="breadcrumbs" aria-label="Fil d'Ariane">
  <div class="container mx-auto px-4 py-3">
    <ol class="breadcrumb-list">
      {#each breadcrumbs as crumb, index}
        <li class="breadcrumb-item" class:current={crumb.current}>
          {#if crumb.current}
            <span class="breadcrumb-current" aria-current="page">
              {crumb.label}
            </span>
          {:else}
            <a 
              href={crumb.href} 
              class="breadcrumb-link"
              data-sveltekit-preload-data="hover"
            >
              {crumb.label}
            </a>
          {/if}
          
          {#if index < breadcrumbs.length - 1}
            <span class="breadcrumb-separator" aria-hidden="true">→</span>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</nav>

<style>
  .breadcrumbs {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .breadcrumb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .breadcrumb-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }
  
  .breadcrumb-link:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .breadcrumb-current {
    color: white;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .breadcrumb-separator {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
    margin: 0 0.25rem;
  }
  
  @media (max-width: 640px) {
    .breadcrumb-list {
      font-size: 0.75rem;
    }
    
    .breadcrumb-link,
    .breadcrumb-current {
      padding: 0.125rem 0.375rem;
      font-size: 0.75rem;
    }
  }
</style>
