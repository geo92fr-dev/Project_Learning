<!--
  ⚡ NavigationPreloader Component - Phase 8.A Navigation System
  Préchargement intelligent des routes selon DOC_CoPilot_Practices
-->
<script>
  export let preloadDelay = 100; // Délai en ms avant préchargement
  export let enableHoverPreload = true;
  export let enableVisibilityPreload = true;
  export let priority = 'low'; // 'low' | 'high' | 'auto'
  export let routes = []; // Routes à précharger

  import { onMount, createEventDispatcher } from 'svelte';
  import { preloadData, preloadCode } from '$app/navigation';
  import { page } from '$app/stores';

  const dispatch = createEventDispatcher();

  // États du preloader
  let preloadedRoutes = new Set();
  let preloadQueue = [];
  let isPreloading = false;
  let preloadStats = {
    total: 0,
    success: 0,
    errors: 0,
    startTime: null,
    endTime: null
  };

  // Routes critiques à précharger en priorité
  const criticalRoutes = [
    '/',
    '/cours',
    '/exercices',
    '/progres'
  ];

  // Routes prédictives basées sur la route actuelle
  const routePredictions = {
    '/': ['/cours', '/exercices', '/progres'],
    '/cours': ['/cours/mathematiques', '/cours/francais', '/exercices'],
    '/cours/mathematiques': ['/cours/mathematiques/cp', '/cours/mathematiques/ce1'],
    '/exercices': ['/exercices/additions', '/exercices/multiplication'],
    '/progres': ['/badges', '/planning']
  };

  // Utilisation d'Intersection Observer pour le préchargement par visibilité
  let intersectionObserver;
  
  // Performance monitoring
  let performanceMetrics = {
    memoryUsage: 0,
    networkStatus: 'unknown',
    connectionType: 'unknown'
  };

  // Fonctions utilitaires
  function shouldPreload(route) {
    // Vérifications de base
    if (preloadedRoutes.has(route)) return false;
    if (!route || route === ($page?.url?.pathname || '/')) return false;
    
    // Vérifier les contraintes de performance
    if (performanceMetrics.networkStatus === 'slow') {
      return criticalRoutes.includes(route);
    }
    
    // Vérifier la mémoire disponible
    if (performanceMetrics.memoryUsage > 0.8) {
      return false;
    }
    
    return true;
  }

  function getPreloadPriority(route) {
    if (criticalRoutes.includes(route)) return 'high';
    if (routePredictions[$page?.url?.pathname || '/']?.includes(route)) return 'high';
    return priority;
  }

  async function preloadRoute(route, options = {}) {
    if (!shouldPreload(route)) return false;

    const routePriority = options.priority || getPreloadPriority(route);
    
    try {
      preloadStats.total++;
      if (!preloadStats.startTime) preloadStats.startTime = Date.now();
      
      isPreloading = true;
      
      // Précharger les données et le code
      const preloadPromises = [];
      
      if (options.preloadData !== false) {
        preloadPromises.push(preloadData(route));
      }
      
      if (options.preloadCode !== false) {
        preloadPromises.push(preloadCode(route));
      }
      
      await Promise.all(preloadPromises);
      
      preloadedRoutes.add(route);
      preloadStats.success++;
      
      dispatch('routePreloaded', {
        route,
        priority: routePriority,
        success: true,
        timestamp: Date.now()
      });
      
      return true;
      
    } catch (error) {
      preloadStats.errors++;
      
      dispatch('preloadError', {
        route,
        error: error.message,
        timestamp: Date.now()
      });
      
      console.warn(`Failed to preload route ${route}:`, error);
      return false;
      
    } finally {
      isPreloading = false;
      preloadStats.endTime = Date.now();
    }
  }

  async function processPreloadQueue() {
    if (preloadQueue.length === 0 || isPreloading) return;
    
    // Trier par priorité
    preloadQueue.sort((a, b) => {
      const priorityOrder = { high: 3, auto: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    const nextItem = preloadQueue.shift();
    if (nextItem) {
      await preloadRoute(nextItem.route, nextItem.options);
      
      // Continuer avec le prochain item après un délai
      if (preloadQueue.length > 0) {
        setTimeout(processPreloadQueue, 50);
      }
    }
  }

  function queuePreload(route, options = {}) {
    if (!shouldPreload(route)) return;
    
    const existingIndex = preloadQueue.findIndex(item => item.route === route);
    if (existingIndex >= 0) {
      // Mettre à jour la priorité si elle est plus élevée
      const existing = preloadQueue[existingIndex];
      const newPriority = options.priority || getPreloadPriority(route);
      const currentPriority = existing.options.priority || 'low';
      
      if (newPriority === 'high' && currentPriority !== 'high') {
        preloadQueue[existingIndex].options.priority = newPriority;
      }
      return;
    }
    
    preloadQueue.push({
      route,
      options: {
        priority: getPreloadPriority(route),
        ...options
      }
    });
    
    // Démarrer le traitement de la queue
    setTimeout(processPreloadQueue, preloadDelay);
  }

  // Préchargement au hover
  function handleLinkHover(event) {
    if (!enableHoverPreload) return;
    
    const link = event.target.closest('a[href]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
      queuePreload(href, { priority: 'auto' });
    }
  }

  // Préchargement prédictif basé sur la route actuelle
  function preloadPredictiveRoutes() {
    const currentPath = $page?.url?.pathname || '/';
    const predicted = routePredictions[currentPath] || [];
    
    predicted.forEach(route => {
      queuePreload(route, { priority: 'low' });
    });
  }

  // Setup de l'Intersection Observer
  function setupIntersectionObserver() {
    if (!enableVisibilityPreload || !window.IntersectionObserver) return;
    
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target.closest('a[href]');
            if (link) {
              const href = link.getAttribute('href');
              if (href && href.startsWith('/')) {
                queuePreload(href, { priority: 'auto' });
              }
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );
    
    // Observer tous les liens existants
    observeLinks();
  }

  function observeLinks() {
    if (!intersectionObserver) return;
    
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
      intersectionObserver.observe(link);
    });
  }

  // Monitoring des performances
  function updatePerformanceMetrics() {
    // Mémoire
    if ('memory' in performance) {
      const memory = performance.memory;
      performanceMetrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    
    // Connexion réseau
    if ('connection' in navigator) {
      const connection = navigator.connection;
      performanceMetrics.networkStatus = connection.effectiveType === '4g' ? 'fast' : 'slow';
      performanceMetrics.connectionType = connection.effectiveType || 'unknown';
    }
  }

  // API publique
  export function preloadRoutes(routesToPreload) {
    routesToPreload.forEach(route => {
      queuePreload(route, { priority: 'high' });
    });
  }

  export function clearPreloadCache() {
    preloadedRoutes.clear();
    preloadQueue.length = 0;
    preloadStats = {
      total: 0,
      success: 0,
      errors: 0,
      startTime: null,
      endTime: null
    };
  }

  export function getPreloadStats() {
    return {
      ...preloadStats,
      queueLength: preloadQueue.length,
      preloadedCount: preloadedRoutes.size,
      successRate: preloadStats.total > 0 ? (preloadStats.success / preloadStats.total) * 100 : 0
    };
  }

  // Lifecycle
  onMount(() => {
    // Setup initial
    updatePerformanceMetrics();
    setupIntersectionObserver();
    
    // Précharger les routes critiques
    criticalRoutes.forEach(route => {
      queuePreload(route, { priority: 'high' });
    });
    
    // Event listeners
    if (enableHoverPreload) {
      document.addEventListener('mouseover', handleLinkHover);
    }
    
    // Mise à jour périodique des métriques
    const metricsInterval = setInterval(updatePerformanceMetrics, 5000);
    
    // Préchargement prédictif
    preloadPredictiveRoutes();
    
    // Nettoyage
    return () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      document.removeEventListener('mouseover', handleLinkHover);
      clearInterval(metricsInterval);
    };
  });

  // Réactivité
  $: if ($page?.url?.pathname) {
    // Nouvelle route = nouvelles prédictions
    setTimeout(preloadPredictiveRoutes, 100);
    
    // Re-observer les nouveaux liens
    setTimeout(observeLinks, 200);
  }

  // Dispatcher les événements de routes
  $: if (routes.length > 0) {
    preloadRoutes(routes);
  }
</script>

<!-- Indicateur de préchargement (optionnel) -->
{#if isPreloading}
  <div class="preloader-indicator" transition:fade={{ duration: 200 }}>
    <div class="preloader-content">
      <div class="preloader-spinner"></div>
      <span class="preloader-text">Préchargement...</span>
    </div>
  </div>
{/if}

<!-- Statistiques de préchargement (dev mode) -->
{#if import.meta.env.DEV}
  <div class="preloader-stats">
    <details class="stats-details">
      <summary class="stats-summary">
        🚀 Navigation Preloader Stats
      </summary>
      <div class="stats-content">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Préchargées:</span>
            <span class="stat-value">{preloadedRoutes.size}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">En queue:</span>
            <span class="stat-value">{preloadQueue.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Succès:</span>
            <span class="stat-value">{preloadStats.success}/{preloadStats.total}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Erreurs:</span>
            <span class="stat-value">{preloadStats.errors}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Mémoire:</span>
            <span class="stat-value">{Math.round(performanceMetrics.memoryUsage * 100)}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Réseau:</span>
            <span class="stat-value">{performanceMetrics.connectionType}</span>
          </div>
        </div>
        
        <div class="preloaded-routes">
          <strong>Routes préchargées:</strong>
          <ul class="routes-list">
            {#each Array.from(preloadedRoutes) as route}
              <li class="route-item">{route}</li>
            {/each}
          </ul>
        </div>
      </div>
    </details>
  </div>
{/if}

<style>
  /* ===== INDICATEUR DE PRÉCHARGEMENT ===== */
  .preloader-indicator {
    position: fixed;
    top: 1rem;
    right: 1rem;
    background: rgba(59, 130, 246, 0.9);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .preloader-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .preloader-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .preloader-text {
    font-size: 0.875rem;
    font-weight: 500;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ===== STATISTIQUES (DEV MODE) ===== */
  .preloader-stats {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    max-width: 300px;
    z-index: 999;
  }

  .stats-details {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 0.375rem;
    backdrop-filter: blur(4px);
  }

  .stats-summary {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 0.375rem;
    user-select: none;
  }

  .stats-summary:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .stats-content {
    padding: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.75rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-label {
    color: rgba(255, 255, 255, 0.7);
  }

  .stat-value {
    font-weight: 600;
    color: #60a5fa;
  }

  .preloaded-routes {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 0.75rem;
  }

  .routes-list {
    list-style: none;
    margin: 0.25rem 0 0 0;
    padding: 0;
    max-height: 100px;
    overflow-y: auto;
  }

  .route-item {
    padding: 0.125rem 0;
    color: rgba(255, 255, 255, 0.8);
    font-family: monospace;
    font-size: 0.625rem;
  }

  /* ===== SCROLLBAR CUSTOM ===== */
  .routes-list::-webkit-scrollbar {
    width: 4px;
  }

  .routes-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  .routes-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  .routes-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 640px) {
    .preloader-indicator {
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.375rem 0.5rem;
    }
    
    .preloader-text {
      display: none;
    }
    
    .preloader-stats {
      bottom: 0.5rem;
      left: 0.5rem;
      max-width: calc(100vw - 1rem);
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ===== MODE SOMBRE ===== */
  :global(.dark) .preloader-indicator {
    background: rgba(31, 41, 55, 0.9);
  }

  :global(.dark) .stats-details {
    background: rgba(31, 41, 55, 0.9);
  }

  /* ===== ANIMATION D'ENTRÉE ===== */
  .preloader-indicator {
    animation: slideInRight 0.3s ease-out;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* ===== MASQUER EN PRODUCTION ===== */
  @media (min-width: 0px) {
    .preloader-stats {
      display: var(--show-dev-stats, block);
    }
  }
</style>
