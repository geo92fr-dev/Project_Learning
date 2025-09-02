<!--
  🔌 Page Offline - Phase 10 PWA
  Affichage gracieux en mode hors ligne
-->

<script lang="ts">
  import { onMount } from 'svelte';
  
  let isOnline = false;
  
  onMount(() => {
    isOnline = navigator.onLine;
    
    const handleOnline = () => {
      isOnline = true;
      // Rediriger vers la page demandée si possible
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    };
    
    const handleOffline = () => {
      isOnline = false;
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });
</script>

<svelte:head>
  <title>Hors ligne - FunLearning</title>
  <meta name="description" content="Vous êtes actuellement hors ligne" />
</svelte:head>

<div class="offline-container">
  <div class="offline-content">
    <!-- Icône offline -->
    <div class="offline-icon">
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>
    
    <!-- Message principal -->
    <h1>Vous êtes hors ligne</h1>
    <p>Il semble que vous n'ayez pas de connexion internet. Certaines fonctionnalités peuvent être limitées.</p>
    
    <!-- Fonctionnalités disponibles offline -->
    <div class="offline-features">
      <h2>Fonctionnalités disponibles :</h2>
      <ul>
        <li>📚 Consulter les cours déjà visités</li>
        <li>✏️ Continuer les exercices en cours</li>
        <li>📊 Voir votre progression locale</li>
        <li>⚙️ Accéder aux paramètres</li>
      </ul>
    </div>
    
    <!-- Actions -->
    <div class="offline-actions">
      <button class="btn-primary" on:click={() => window.location.reload()}>
        🔄 Réessayer
      </button>
      
      <button class="btn-secondary" on:click={() => window.location.href='/'}>
        🏠 Retour à l'accueil
      </button>
    </div>
    
    <!-- Status de connexion -->
    <div class="connection-status">
      <div class="status-indicator" class:online={isOnline} class:offline={!isOnline}>
        {#if isOnline}
          <span class="status-dot online"></span>
          Connexion rétablie
        {:else}
          <span class="status-dot offline"></span>
          Hors ligne
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .offline-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 20px;
  }
  
  .offline-content {
    max-width: 500px;
    width: 100%;
  }
  
  .offline-icon {
    margin-bottom: 2rem;
    opacity: 0.8;
  }
  
  .offline-icon svg {
    color: #fbbf24;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }
  
  .offline-features {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    margin: 2rem 0;
    backdrop-filter: blur(10px);
  }
  
  .offline-features h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #fbbf24;
  }
  
  .offline-features ul {
    list-style: none;
    padding: 0;
    text-align: left;
  }
  
  .offline-features li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .offline-features li:last-child {
    border-bottom: none;
  }
  
  .offline-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
    flex-wrap: wrap;
  }
  
  .btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
  }
  
  .btn-primary {
    background: #10b981;
    color: white;
  }
  
  .btn-primary:hover {
    background: #059669;
    transform: translateY(-2px);
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  .connection-status {
    margin-top: 2rem;
  }
  
  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .status-indicator.online {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
  
  .status-indicator.offline {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  .status-dot.online {
    background: #10b981;
  }
  
  .status-dot.offline {
    background: #ef4444;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 768px) {
    .offline-container {
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
    
    .offline-actions {
      flex-direction: column;
      align-items: center;
    }
    
    .btn-primary, .btn-secondary {
      width: 100%;
      max-width: 200px;
    }
  }
</style>
