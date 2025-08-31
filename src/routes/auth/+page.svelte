<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, isAuthenticated } from "$lib/stores/googleAuth";
  import GoogleAuth from "$lib/components/GoogleAuth.svelte";
  import EmailAuth from "$lib/components/auth/EmailAuth.svelte";

  let currentTab: "google" | "email" = "google";

  // Redirection si déjà connecté
  $: if ($isAuthenticated) {
    goto("/dashboard");
  }

  function switchTab(tab: "google" | "email") {
    currentTab = tab;
  }

  function handleAuthSuccess() {
    goto("/dashboard");
  }
</script>

<svelte:head>
  <title>Se connecter - FunLearning</title>
  <meta
    name="description"
    content="Connectez-vous à votre compte FunLearning pour accéder à vos cours et suivre votre progression."
  />
</svelte:head>

<div class="auth-page">
  <div class="auth-container">
    <header class="auth-header">
      <div class="logo">
        <h1>🎓 FunLearning</h1>
      </div>
      <h2>Connectez-vous à votre compte</h2>
      <p>Accédez à votre parcours d'apprentissage personnalisé</p>
    </header>

    <div class="auth-tabs">
      <button
        class="tab-button"
        class:active={currentTab === "google"}
        on:click={() => switchTab("google")}
      >
        <svg class="tab-icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>

      <button
        class="tab-button"
        class:active={currentTab === "email"}
        on:click={() => switchTab("email")}
      >
        <svg
          class="tab-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        Email
      </button>
    </div>

    <div class="auth-content">
      {#if currentTab === "google"}
        <div class="auth-method">
          <div class="method-description">
            <h3>Connexion rapide avec Google</h3>
            <p>
              Utilisez votre compte Google pour vous connecter en un clic.
              Sécurisé et pratique.
            </p>
          </div>

          <GoogleAuth on:success={handleAuthSuccess} />
        </div>
      {:else}
        <div class="auth-method">
          <EmailAuth
            on:login={handleAuthSuccess}
            on:register={handleAuthSuccess}
          />
        </div>
      {/if}
    </div>

    <footer class="auth-footer">
      <div class="footer-links">
        <a href="/" class="footer-link">← Retour à l'accueil</a>
        <a href="/help" class="footer-link">Besoin d'aide ?</a>
      </div>

      <div class="footer-info">
        <p>
          En vous connectant, vous acceptez nos
          <a href="/terms" class="link">conditions d'utilisation</a>
          et notre
          <a href="/privacy" class="link">politique de confidentialité</a>.
        </p>
      </div>
    </footer>
  </div>

  <div class="auth-sidebar">
    <div class="sidebar-content">
      <h3>Pourquoi FunLearning ?</h3>

      <div class="feature-list">
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <div class="feature-text">
            <h4>Apprentissage personnalisé</h4>
            <p>Des cours adaptés à votre niveau et à votre rythme</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <div class="feature-text">
            <h4>Suivi de progression</h4>
            <p>Visualisez vos progrès et vos réussites</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🎮</div>
          <div class="feature-text">
            <h4>Exercices interactifs</h4>
            <p>Apprenez en vous amusant avec nos exercices ludiques</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🏆</div>
          <div class="feature-text">
            <h4>Récompenses</h4>
            <p>Débloquez des badges et célébrez vos achievements</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 400px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .auth-container {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
  }

  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
    color: white;
  }

  .logo h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .auth-header h2 {
    margin: 1rem 0 0.5rem 0;
    font-size: 1.75rem;
    font-weight: 600;
  }

  .auth-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }

  .auth-tabs {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 0.25rem;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
  }

  .tab-button {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    color: white;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  .tab-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .tab-button.active {
    background: white;
    color: #667eea;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tab-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .auth-content {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }

  .auth-method {
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .method-description {
    text-align: center;
    margin-bottom: 2rem;
  }

  .method-description h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.25rem;
  }

  .method-description p {
    margin: 0;
    color: #6c757d;
    line-height: 1.5;
  }

  .auth-footer {
    margin-top: 2rem;
    text-align: center;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .footer-link {
    color: white;
    text-decoration: none;
    opacity: 0.9;
    transition: opacity 0.2s ease;
  }

  .footer-link:hover {
    opacity: 1;
    text-decoration: underline;
  }

  .footer-info {
    color: white;
    opacity: 0.8;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .footer-info .link {
    color: white;
    text-decoration: underline;
  }

  .auth-sidebar {
    background: rgba(255, 255, 255, 0.95);
    padding: 3rem 2rem;
    display: flex;
    align-items: center;
    backdrop-filter: blur(10px);
  }

  .sidebar-content h3 {
    margin: 0 0 2rem 0;
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .feature-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .feature-icon {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .feature-text h4 {
    margin: 0 0 0.25rem 0;
    color: #2c3e50;
    font-size: 1rem;
    font-weight: 600;
  }

  .feature-text p {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  @media (max-width: 1024px) {
    .auth-page {
      grid-template-columns: 1fr;
    }

    .auth-sidebar {
      order: -1;
      padding: 2rem;
    }

    .sidebar-content h3 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .feature-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    .auth-container {
      padding: 1rem;
    }

    .auth-content {
      padding: 1.5rem;
    }

    .footer-links {
      flex-direction: column;
      gap: 1rem;
    }

    .feature-list {
      grid-template-columns: 1fr;
    }

    .feature-item {
      gap: 0.75rem;
    }

    .feature-icon {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1rem;
    }
  }
</style>
