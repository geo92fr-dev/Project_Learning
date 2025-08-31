<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, loading } from '$lib/stores/googleAuth.js';
  
  export let data;
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
    
    // Vérifier l'authentification après le chargement
    const checkAuth = () => {
      if (!$loading && !$isAuthenticated) {
        console.log('🔒 Utilisateur non authentifié, redirection vers login');
        goto('/auth/login');
      }
    };
    
    // Vérification immédiate
    checkAuth();
    
    // Écouter les changements d'état d'authentification
    const unsubscribe = isAuthenticated.subscribe((authenticated) => {
      if (mounted && !$loading && !authenticated) {
        goto('/auth/login');
      }
    });
    
    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Dashboard - FunLearning</title>
</svelte:head>

{#if mounted}
  {#if $loading}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Vérification de l'authentification...</p>
    </div>
  {:else if $isAuthenticated}
    <div class="dashboard-layout">
      <header class="dashboard-header">
        <nav class="dashboard-nav">
          <div class="nav-brand">
            <h1>🎯 FunLearning</h1>
          </div>
          <div class="nav-user">
            <span>Bonjour, {$user?.displayName || $user?.email || 'Utilisateur'}</span>
            <button class="logout-btn" on:click={() => goto('/auth/login')}>
              Déconnexion
            </button>
          </div>
        </nav>
      </header>
      
      <main class="dashboard-content">
        <slot />
      </main>
    </div>
  {:else}
    <div class="redirecting-container">
      <div class="spinner"></div>
      <p>Redirection vers la page de connexion...</p>
    </div>
  {/if}
{:else}
  <div class="loading-container">
    <div class="spinner"></div>
    <p>Chargement...</p>
  </div>
{/if}

<style>
  .loading-container,
  .redirecting-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: #f7fafc;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .dashboard-layout {
    min-height: 100vh;
    background: #f7fafc;
  }

  .dashboard-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .dashboard-nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-brand h1 {
    color: #2d3748;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-user span {
    color: #4a5568;
    font-weight: 500;
  }

  .logout-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .logout-btn:hover {
    background: #5a67d8;
  }

  .dashboard-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .dashboard-nav {
      padding: 1rem;
      flex-direction: column;
      gap: 1rem;
    }
    
    .dashboard-content {
      padding: 1rem;
    }
  }
</style>
