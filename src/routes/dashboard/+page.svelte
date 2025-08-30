<!-- Dashboard - FunLearning Phase 1 -->
<script lang="ts">
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  // Rediriger si non connecté
  $: if (!$authStore.loading && !$authStore.user) {
    goto("/auth");
  }

  // Initialiser le store d'auth
  onMount(() => {
    authStore.init();
  });

  async function handleSignOut() {
    try {
      await authStore.signOut();
      goto("/auth");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  }
</script>

<svelte:head>
  <title>Tableau de Bord - FunLearning</title>
  <meta
    name="description"
    content="Votre tableau de bord FunLearning - Accédez à vos cours et suivez votre progression."
  />
</svelte:head>

{#if $authStore.loading}
  <div class="loading-screen">
    <div class="loading-spinner" />
    <p>Chargement...</p>
  </div>
{:else if $authStore.user}
  <main class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>🎓 Tableau de Bord</h1>
        <div class="user-info">
          <img
            src={$authStore.user.photoURL || "/default-avatar.png"}
            alt="Avatar"
            class="user-avatar"
          />
          <div class="user-details">
            <span class="user-name"
              >{$authStore.user.displayName || "Utilisateur"}</span
            >
            <span class="user-email">{$authStore.user.email}</span>
          </div>
          <button
            class="sign-out-button"
            on:click={handleSignOut}
            aria-label="Se déconnecter"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <div class="dashboard-content">
      <section class="welcome-section">
        <div class="welcome-card">
          <h2>
            👋 Bienvenue {$authStore.user.displayName?.split(" ")[0] ||
              "sur FunLearning"} !
          </h2>
          <p>
            Vous êtes maintenant connecté à votre espace d'apprentissage
            personnel.
          </p>

          <div class="status-grid">
            <div class="status-item">
              <span class="status-icon">✅</span>
              <div class="status-info">
                <h3>Authentification</h3>
                <p>Configuration Firebase opérationnelle</p>
              </div>
            </div>

            <div class="status-item">
              <span class="status-icon">🔐</span>
              <div class="status-info">
                <h3>Sécurité</h3>
                <p>Connexion Google OAuth active</p>
              </div>
            </div>

            <div class="status-item">
              <span class="status-icon">📱</span>
              <div class="status-info">
                <h3>Interface</h3>
                <p>Interface utilisateur fonctionnelle</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="phase-status">
        <div class="phase-card">
          <h3>🚀 Phase 1 - État d'Avancement</h3>
          <div class="progress-list">
            <div class="progress-item completed">
              <span class="progress-icon">✅</span>
              <span>Configuration Firebase</span>
            </div>
            <div class="progress-item completed">
              <span class="progress-icon">✅</span>
              <span>Store d'authentification</span>
            </div>
            <div class="progress-item completed">
              <span class="progress-icon">✅</span>
              <span>Composants de connexion</span>
            </div>
            <div class="progress-item in-progress">
              <span class="progress-icon">🔄</span>
              <span>Protection des routes (en cours)</span>
            </div>
            <div class="progress-item pending">
              <span class="progress-icon">⏳</span>
              <span>Tests de sécurité</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
{:else}
  <div class="error-screen">
    <h2>❌ Accès non autorisé</h2>
    <p>Vous devez être connecté pour accéder à cette page.</p>
    <button on:click={() => goto("/auth")}>Se connecter</button>
  </div>
{/if}

<style>
  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .dashboard {
    min-height: 100vh;
    background: #f8fafc;
  }

  .dashboard-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 0;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .header-content h1 {
    margin: 0;
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 600;
    color: #1e293b;
  }

  .user-email {
    font-size: 0.875rem;
    color: #64748b;
  }

  .sign-out-button {
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .sign-out-button:hover {
    background: #dc2626;
  }

  .dashboard-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    gap: 2rem;
  }

  .welcome-card,
  .phase-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .welcome-card h2 {
    margin: 0 0 1rem;
    color: #1e293b;
    font-size: 1.5rem;
  }

  .welcome-card p {
    margin: 0 0 2rem;
    color: #64748b;
    line-height: 1.6;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
  }

  .status-icon {
    font-size: 1.5rem;
  }

  .status-info h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
  }

  .status-info p {
    margin: 0;
    font-size: 0.875rem;
    color: #64748b;
  }

  .phase-card h3 {
    margin: 0 0 1.5rem;
    color: #1e293b;
    font-size: 1.25rem;
  }

  .progress-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .progress-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 6px;
  }

  .progress-item.completed {
    background: #dcfce7;
    color: #166534;
  }

  .progress-item.in-progress {
    background: #fef3c7;
    color: #92400e;
  }

  .progress-item.pending {
    background: #f1f5f9;
    color: #64748b;
  }

  .progress-icon {
    font-size: 1.125rem;
  }

  .error-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
    text-align: center;
    padding: 2rem;
  }

  .error-screen h2 {
    color: #dc2626;
    margin: 0;
  }

  .error-screen button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .error-screen button:hover {
    background: #2563eb;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
      padding: 0 1rem;
    }

    .user-info {
      justify-content: center;
    }

    .dashboard-content {
      padding: 1rem;
    }

    .status-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
