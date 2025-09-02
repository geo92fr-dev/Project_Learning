<!--
  🎯 Layout Principal - Phase 10 PWA
  Layout global avec intégration PWA
-->

<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import PWAStatus from '$lib/components/PWAStatus.svelte';
  import { isOnline, addNotification } from '$lib/stores/pwa';
  
  // Écouter les changements de connexion pour notifier l'utilisateur
  if (browser) {
    window.addEventListener('online', () => {
      addNotification({
        type: 'sync',
        message: '🌐 Connexion rétablie ! Synchronisation en cours...'
      });
    });
    
    window.addEventListener('offline', () => {
      addNotification({
        type: 'offline',
        message: '📶 Mode hors ligne activé. Certaines fonctions sont limitées.'
      });
    });
  }
</script>

<svelte:head>
  <title>FunLearning{$page.data?.title ? ` - ${$page.data.title}` : ''}</title>
  <meta name="description" content="Plateforme d'apprentissage interactive avec exercices et suivi de progression" />
  
  <!-- PWA Meta Tags additionnels -->
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="format-detection" content="telephone=no" />
</svelte:head>

<!-- Barre de statut PWA -->
<PWAStatus />

<!-- Contenu principal avec marge pour la barre PWA -->
<main class="main-content">
  <slot />
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8fafc;
    color: #1f2937;
  }
  
  :global(*) {
    box-sizing: border-box;
  }
  
  .main-content {
    margin-top: 40px; /* Espace pour la barre PWA */
    min-height: calc(100vh - 40px);
    padding: 0;
  }
  
  /* Styles globaux pour l'amélioration PWA */
  :global(.pwa-enhanced) {
    /* Améliorer l'expérience tactile */
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  
  :global(.btn-pwa) {
    /* Styles pour les boutons PWA optimisés */
    min-height: 44px; /* Touch target minimum iOS */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    touch-action: manipulation;
  }
  
  :global(.btn-pwa:active) {
    transform: scale(0.98);
  }
  
  /* Mode sombre PWA */
  @media (prefers-color-scheme: dark) {
    :global(html, body) {
      background: #111827;
      color: #f9fafb;
    }
    
    .main-content {
      background: #111827;
    }
  }
  
  /* Optimisations pour devices PWA */
  @media (display-mode: standalone) {
    :global(body) {
      overflow-x: hidden;
    }
    
    .main-content {
      /* Ajustements pour l'app installée */
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }
  
  /* Mode paysage mobile */
  @media (orientation: landscape) and (max-height: 500px) {
    .main-content {
      margin-top: 35px; /* Barre PWA plus petite en paysage */
    }
  }
  
  /* Animations PWA */
  :global(.pwa-fade-in) {
    animation: pwaFadeIn 0.3s ease-out;
  }
  
  :global(.pwa-slide-up) {
    animation: pwaSlideUp 0.4s ease-out;
  }
  
  @keyframes pwaFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes pwaSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Amélioration de performance PWA */
  :global(img) {
    /* Images lazy par défaut */
    object-fit: cover;
  }
  
  :global(.critical-resource) {
    /* Pour les ressources critiques */
    will-change: transform;
  }
</style>
