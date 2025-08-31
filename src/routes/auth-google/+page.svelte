<script>
  import { onMount } from 'svelte';
  import GoogleAuth from '$lib/components/GoogleAuth.svelte';
  import { user, isAuthenticated } from '$lib/stores/googleAuth.js';
  
  let mounted = false;
  let successMessage = '';
  let errorMessage = '';
  
  onMount(() => {
    mounted = true;
    console.log('✅ Page d\'authentification Google chargée');
  });
  
  function handleAuthSuccess(event) {
    console.log('🎉 Succès d\'authentification:', event.detail);
    successMessage = `Bienvenue ${event.detail.user?.displayName || event.detail.user?.email || ''}!`;
    errorMessage = '';
    
    // Auto-hide success message after 3s
    setTimeout(() => {
      successMessage = '';
    }, 3000);
  }
  
  function handleAuthError(event) {
    console.error('❌ Erreur d\'authentification:', event.detail);
    errorMessage = event.detail.error || 'Erreur inconnue';
    successMessage = '';
  }
</script>

<svelte:head>
  <title>Authentification Google - FunLearning</title>
  <meta name="description" content="Test de l'authentification Google selon TDD et DOC_CoPilot_Practices" />
</svelte:head>

<main class="auth-page" data-testid="auth-page">
  <div class="container">
    <!-- Header -->
    <header class="page-header">
      <h1>🔐 Authentification Google</h1>
      <p>Test de l'implémentation TDD selon DOC_CoPilot_Practices</p>
    </header>

    <!-- Messages -->
    {#if successMessage}
      <div class="message success" data-testid="success-message">
        ✅ {successMessage}
      </div>
    {/if}
    
    {#if errorMessage}
      <div class="message error" data-testid="error-message">
        ❌ {errorMessage}
      </div>
    {/if}

    <!-- Auth Component -->
    {#if mounted}
      <section class="auth-section">
        <div class="auth-card">
          <GoogleAuth
            buttonText="Se connecter avec Google"
            showUserInfo={true}
            size="medium"
            on:success={handleAuthSuccess}
            on:error={handleAuthError}
          />
        </div>
        
        <!-- Debug Info -->
        <div class="debug-info">
          <h3>🐛 Informations de débogage</h3>
          <div class="debug-item">
            <strong>État d'authentification:</strong>
            <span class="status" class:authenticated={$isAuthenticated}>
              {$isAuthenticated ? '✅ Connecté' : '❌ Non connecté'}
            </span>
          </div>
          
          {#if $user}
            <div class="debug-item">
              <strong>Utilisateur:</strong>
              <pre>{JSON.stringify($user, null, 2)}</pre>
            </div>
          {/if}
        </div>
      </section>
    {:else}
      <div class="loading-section">
        <div class="loading-spinner"></div>
        <p>Chargement de l'authentification...</p>
      </div>
    {/if}

    <!-- Navigation -->
    <nav class="page-nav">
      <a href="/" class="nav-link">🏠 Retour à l'accueil</a>
      <a href="/dashboard" class="nav-link">📊 Dashboard</a>
    </nav>
  </div>
</main>

<style>
  .auth-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
  }

  .page-header {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .page-header p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }

  .message {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .message.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .message.error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fca5a5;
  }

  .auth-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .auth-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .debug-info {
    background: rgba(255, 255, 255, 0.95);
    padding: 1.5rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .debug-info h3 {
    margin: 0 0 1rem 0;
    color: #374151;
  }

  .debug-item {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .debug-item strong {
    color: #4b5563;
  }

  .status {
    font-weight: 600;
  }

  .status.authenticated {
    color: #059669;
  }

  .debug-item pre {
    background: #f3f4f6;
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    overflow-x: auto;
    border: 1px solid #e5e7eb;
  }

  .loading-section {
    background: white;
    padding: 3rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f1f5f9;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .page-nav {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .nav-link {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .page-header h1 {
      font-size: 2rem;
    }
    
    .auth-card {
      padding: 1.5rem;
    }
    
    .page-nav {
      flex-direction: column;
    }
  }
</style>
