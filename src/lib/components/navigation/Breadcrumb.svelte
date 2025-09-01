<!--
  🍞 Breadcrumb Component - Phase 8.A Navigation System
  Navigation breadcrumb selon DOC_CoPilot_Practices
-->
<script>
  export let path = '/';
  export let separator = '/';
  export let maxItems = 5;

  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';

  // Mapping des segments vers des labels lisibles
  const segmentLabels = {
    '': 'Accueil',
    'cours': 'Cours',
    'exercices': 'Exercices',
    'progres': 'Progrès',
    'profil': 'Profil',
    'mathematiques': 'Mathématiques',
    'francais': 'Français',
    'sciences': 'Sciences',
    'histoire': 'Histoire',
    'geographie': 'Géographie',
    'cp': 'CP',
    'ce1': 'CE1',
    'ce2': 'CE2',
    'cm1': 'CM1',
    'cm2': 'CM2',
    '6eme': '6ème',
    '5eme': '5ème',
    '4eme': '4ème',
    '3eme': '3ème',
    'geometrie': 'Géométrie',
    'nombres': 'Nombres et Calculs',
    'mesures': 'Grandeurs et Mesures',
    'problemes': 'Résolution de Problèmes',
    'lecture': 'Lecture',
    'orthographe': 'Orthographe',
    'grammaire': 'Grammaire',
    'conjugaison': 'Conjugaison',
    'vocabulaire': 'Vocabulaire'
  };

  // Génération des breadcrumbs
  $: breadcrumbs = generateBreadcrumbs(path);

  function generateBreadcrumbs(currentPath) {
    if (!currentPath || currentPath === '/') {
      return [{ label: 'Accueil', path: '/', isLast: true }];
    }

    const segments = currentPath.split('/').filter(Boolean);
    const crumbs = [{ label: 'Accueil', path: '/', isLast: false }];

    let accumulatedPath = '';
    
    segments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      crumbs.push({
        label: segmentLabels[segment] || capitalize(segment),
        path: accumulatedPath,
        isLast
      });
    });

    // Limiter le nombre d'éléments si nécessaire
    if (crumbs.length > maxItems) {
      const start = crumbs.slice(0, 1); // Garder "Accueil"
      const end = crumbs.slice(-(maxItems - 2)); // Garder les derniers éléments
      const ellipsis = { label: '...', path: null, isEllipsis: true, isLast: false };
      return [...start, ellipsis, ...end];
    }

    return crumbs;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function handleBreadcrumbClick(breadcrumb) {
    if (breadcrumb.path && !breadcrumb.isEllipsis) {
      goto(breadcrumb.path);
    }
  }

  // Déterminer l'icône selon le type de page
  function getIcon(path, label) {
    if (path === '/') return '🏠';
    if (path.includes('/cours')) return '📚';
    if (path.includes('/exercices')) return '✏️';
    if (path.includes('/progres')) return '📊';
    if (path.includes('/profil')) return '👤';
    if (path.includes('/mathematiques')) return '🔢';
    if (path.includes('/francais')) return '📝';
    if (path.includes('/sciences')) return '🔬';
    return '📄';
  }
</script>

<nav class="breadcrumb" aria-label="Fil d'ariane">
  <ol class="breadcrumb-list">
    {#each breadcrumbs as breadcrumb, index}
      <li class="breadcrumb-item" class:is-last={breadcrumb.isLast}>
        {#if breadcrumb.isEllipsis}
          <span class="breadcrumb-ellipsis">
            {breadcrumb.label}
          </span>
        {:else if breadcrumb.isLast}
          <span class="breadcrumb-current" aria-current="page">
            <span class="breadcrumb-icon" aria-hidden="true">
              {getIcon(breadcrumb.path, breadcrumb.label)}
            </span>
            {breadcrumb.label}
          </span>
        {:else}
          <Button
            variant="ghost"
            size="sm"
            class="breadcrumb-link"
            on:click={() => handleBreadcrumbClick(breadcrumb)}
          >
            <span class="breadcrumb-icon" aria-hidden="true">
              {getIcon(breadcrumb.path, breadcrumb.label)}
            </span>
            {breadcrumb.label}
          </Button>
        {/if}

        {#if !breadcrumb.isLast}
          <span class="breadcrumb-separator" aria-hidden="true">
            {separator}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  /* ===== CONTAINER ===== */
  .breadcrumb {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem 1rem;
  }

  .breadcrumb-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ===== ITEMS ===== */
  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .breadcrumb-item:not(.is-last) {
    color: #6b7280;
  }

  .breadcrumb-item.is-last {
    color: #1f2937;
    font-weight: 500;
  }

  /* ===== LIENS ===== */
  .breadcrumb-item :global(.breadcrumb-link) {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    color: #6b7280;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }

  .breadcrumb-item :global(.breadcrumb-link:hover) {
    background-color: #e5e7eb;
    color: #374151;
  }

  /* ===== CURRENT PAGE ===== */
  .breadcrumb-current {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
  }

  /* ===== ICÔNES ===== */
  .breadcrumb-icon {
    font-size: 1rem;
    line-height: 1;
  }

  /* ===== SÉPARATEUR ===== */
  .breadcrumb-separator {
    color: #9ca3af;
    margin: 0 0.375rem;
    font-size: 0.875rem;
    user-select: none;
  }

  /* ===== ELLIPSIS ===== */
  .breadcrumb-ellipsis {
    color: #9ca3af;
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    user-select: none;
  }

  /* ===== MODE SOMBRE ===== */
  :global(.dark) .breadcrumb {
    background: #1f2937;
    border-bottom-color: #374151;
  }

  :global(.dark) .breadcrumb-item:not(.is-last) {
    color: #9ca3af;
  }

  :global(.dark) .breadcrumb-item.is-last {
    color: #f3f4f6;
  }

  :global(.dark) .breadcrumb-current {
    color: #f3f4f6;
  }

  :global(.dark) .breadcrumb-item :global(.breadcrumb-link) {
    color: #9ca3af;
  }

  :global(.dark) .breadcrumb-item :global(.breadcrumb-link:hover) {
    background-color: #374151;
    color: #d1d5db;
  }

  :global(.dark) .breadcrumb-separator,
  :global(.dark) .breadcrumb-ellipsis {
    color: #6b7280;
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 640px) {
    .breadcrumb {
      padding: 0.5rem 1rem;
    }

    .breadcrumb-list {
      gap: 0.125rem;
    }

    .breadcrumb-item :global(.breadcrumb-link),
    .breadcrumb-current {
      font-size: 0.8125rem;
    }

    .breadcrumb-icon {
      font-size: 0.875rem;
    }

    .breadcrumb-separator {
      margin: 0 0.25rem;
      font-size: 0.8125rem;
    }

    /* Masquer les icônes sur très petit écran */
    @media (max-width: 480px) {
      .breadcrumb-icon {
        display: none;
      }
    }
  }
</style>
