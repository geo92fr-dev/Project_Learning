<!-- 🔐 FunLearning V2.0 - Phase 2 Test Auth Page -->
<!-- Page de test pour l'authentification email/password -->

<script lang="ts">
  import { onMount } from "svelte";
  import {
    initAuth,
    signOut,
    user,
    loading,
    isAuthenticated,
  } from "$lib/stores/auth.js";
  import AuthComplete from "$lib/components/auth/AuthComplete.svelte";

  // Initialisation de l'authentification au montage
  onMount(async () => {
    await initAuth();
  });

  function handleAuthSuccess(event: CustomEvent) {
    console.log("Authentification réussie:", event.detail);
  }

  function handleAuthError(event: CustomEvent) {
    console.error("Erreur authentification:", event.detail);
  }

  async function handleSignOut() {
    try {
      await signOut();
      console.log("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  }
</script>

<svelte:head>
  <title>Phase 2 - Auth Test | FunLearning</title>
</svelte:head>

<main class="auth-test-page">
  <div class="container">
    <header>
      <h1>🔐 Phase 2 - Test Authentification</h1>
      <p>Test du système d'authentification email/password Firebase</p>
    </header>

    {#if $loading}
      <div class="loading-state">
        <div class="spinner" />
        <p>Initialisation de l'authentification...</p>
      </div>
    {:else if $isAuthenticated && $user}
      <!-- État connecté -->
      <div class="authenticated-state">
        <div class="user-info">
          <h2>👋 Bienvenue, {$user.displayName || $user.email}!</h2>
          <div class="user-details">
            <p><strong>Email:</strong> {$user.email}</p>
            <p><strong>ID:</strong> {$user.uid}</p>
            <p>
              <strong>Email vérifié:</strong>
              {$user.emailVerified ? "✅ Oui" : "❌ Non"}
            </p>
            <p>
              <strong>Créé le:</strong>
              {new Date($user.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Dernière connexion:</strong>
              {new Date($user.lastLoginAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div class="actions">
          <button class="signout-btn" on:click={handleSignOut}>
            Se déconnecter
          </button>
        </div>

        <div class="success-message">
          <h3>✅ Phase 2 - Succès!</h3>
          <ul>
            <li>Configuration Firebase TypeScript ✅</li>
            <li>Auth store avancé ✅</li>
            <li>Google OAuth ✅</li>
            <li>Composant email/password ✅</li>
            <li>Interface auth complète ✅</li>
            <li>Gestion des états ✅</li>
            <li>Validation des formulaires ✅</li>
          </ul>
        </div>
      </div>
    {:else}
      <!-- État non connecté -->
      <div class="unauthenticated-state">
        <AuthComplete
          on:success={handleAuthSuccess}
          on:error={handleAuthError}
        />

        <div class="phase-info">
          <h3>🚀 Phase 2 - Authentification Complète</h3>
          <div class="features">
            <h4>Nouvelles fonctionnalités:</h4>
            <ul>
              <li>✨ Authentification Google OAuth</li>
              <li>✨ Authentification email/password Firebase</li>
              <li>🔒 Configuration TypeScript sécurisée</li>
              <li>📝 Formulaires de connexion et inscription</li>
              <li>🔄 Réinitialisation de mot de passe</li>
              <li>✅ Validation en temps réel</li>
              <li>📱 Design responsive moderne</li>
              <li>🛡️ Gestion d'erreurs complète</li>
            </ul>
          </div>
        </div>
      </div>
    {/if}

    <footer class="test-footer">
      <p>
        📋 <strong>Phase Status:</strong> ✅ Phase 2 - Authentification complète
        (Google + Email/Password)
      </p>
      <p>🔥 Powered by Firebase + SvelteKit + TypeScript</p>
    </footer>
  </div>
</main>

<style>
  .auth-test-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  header {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
  }

  header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  header p {
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .loading-state {
    text-align: center;
    color: white;
    padding: 3rem;
  }

  .loading-state .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .authenticated-state {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .user-info h2 {
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }

  .user-details {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .user-details p {
    margin: 0.5rem 0;
    color: #555;
  }

  .user-details strong {
    color: #333;
  }

  .actions {
    text-align: center;
    margin-bottom: 2rem;
  }

  .signout-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .signout-btn:hover {
    background: #c82333;
  }

  .success-message {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 1.5rem;
    border-radius: 8px;
  }

  .success-message h3 {
    margin-bottom: 1rem;
    color: #155724;
  }

  .success-message ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .success-message li {
    margin: 0.25rem 0;
  }

  .unauthenticated-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .phase-info {
    max-width: 600px;
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .phase-info h3 {
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .features h4 {
    color: #555;
    margin-bottom: 1rem;
  }

  .features ul {
    list-style: none;
    padding: 0;
  }

  .features li {
    margin: 0.75rem 0;
    padding-left: 0.5rem;
    color: #666;
  }

  .test-footer {
    text-align: center;
    color: white;
    margin-top: 3rem;
    opacity: 0.9;
  }

  .test-footer p {
    margin: 0.5rem 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .unauthenticated-state {
      flex-direction: column;
    }

    header h1 {
      font-size: 2rem;
    }

    .auth-test-page {
      padding: 1rem;
    }
  }
</style>
