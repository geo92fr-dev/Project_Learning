<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import GoogleAuth from "$lib/components/GoogleAuth.svelte";
  import { user, isAuthenticated } from "$lib/stores/googleAuth.js";

  let mounted = false;
  let successMessage = "";
  let errorMessage = "";

  onMount(() => {
    mounted = true;
    console.log("✅ Page de connexion chargée");

    // Rediriger si déjà connecté
    if ($isAuthenticated) {
      goto("/dashboard");
    }
  });

  // Réagir aux changements d'état d'authentification
  $: if (mounted && $isAuthenticated) {
    goto("/dashboard");
  }

  function handleAuthSuccess(event) {
    console.log("🎉 Succès d'authentification:", event.detail);
    successMessage = `Bienvenue ${
      event.detail.user?.displayName || event.detail.user?.email || ""
    }!`;
    errorMessage = "";

    // Redirection automatique vers dashboard
    setTimeout(() => {
      goto("/dashboard");
    }, 1000);
  }

  function handleAuthError(event) {
    console.error("❌ Erreur d'authentification:", event.detail);
    errorMessage = event.detail.error || "Erreur inconnue";
    successMessage = "";
  }
</script>

<svelte:head>
  <title>Connexion - FunLearning</title>
  <meta
    name="description"
    content="Connectez-vous à FunLearning avec votre compte Google"
  />
</svelte:head>

<main class="login-container">
  {#if mounted}
    <div class="login-card">
      <header class="login-header">
        <h1>🔐 Connexion FunLearning</h1>
        <p>Connectez-vous pour accéder à votre espace d'apprentissage</p>
      </header>

      {#if successMessage}
        <div class="message success" role="alert">
          {successMessage}
          <div class="loading-indicator">Redirection en cours...</div>
        </div>
      {/if}

      {#if errorMessage}
        <div class="message error" role="alert">
          {errorMessage}
        </div>
      {/if}

      <div class="auth-section">
        <GoogleAuth
          buttonText="Se connecter avec Google"
          size="large"
          showUserInfo={false}
          on:success={handleAuthSuccess}
          on:error={handleAuthError}
        />
      </div>

      <footer class="login-footer">
        <p>En vous connectant, vous acceptez nos conditions d'utilisation.</p>
        <a href="/">← Retour à l'accueil</a>
      </footer>
    </div>
  {:else}
    <div class="loading-container">
      <div class="spinner" />
      <p>Chargement...</p>
    </div>
  {/if}
</main>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }

  .login-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    animation: slideUp 0.6s ease-out;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-header h1 {
    color: #2d3748;
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .login-header p {
    color: #718096;
    font-size: 1rem;
  }

  .message {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .message.success {
    background-color: #f0fff4;
    border: 1px solid #9ae6b4;
    color: #276749;
  }

  .message.error {
    background-color: #fed7d7;
    border: 1px solid #feb2b2;
    color: #c53030;
  }

  .loading-indicator {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #4a5568;
  }

  .auth-section {
    margin-bottom: 2rem;
  }

  .login-footer {
    text-align: center;
    font-size: 0.875rem;
    color: #718096;
  }

  .login-footer a {
    color: #667eea;
    text-decoration: none;
    margin-top: 1rem;
    display: inline-block;
    transition: color 0.2s;
  }

  .login-footer a:hover {
    color: #5a67d8;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: white;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 1.5rem;
      margin: 0.5rem;
    }

    .login-header h1 {
      font-size: 1.5rem;
    }
  }
</style>
