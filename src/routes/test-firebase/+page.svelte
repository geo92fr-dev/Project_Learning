<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import {
    testFirebaseConnection,
    getFirebaseStatus,
  } from "$lib/firebase/test-connection-new.js";
  import { authStore, initAuth } from "$lib/stores/auth.js";

  let testResults: any = null;
  let loading = false;
  let firebaseStatus: any = null;
  let mounted = false;

  onMount(async () => {
    mounted = true;
    if (browser) {
      // Initialiser l'authentification
      await initAuth();

      // Obtenir le statut Firebase
      firebaseStatus = getFirebaseStatus();
    }
  });

  async function runFirebaseTest() {
    loading = true;
    try {
      testResults = await testFirebaseConnection();
      console.log("🔧 Résultats test Firebase:", testResults);
    } catch (error: any) {
      console.error("❌ Erreur test Firebase:", error);
      testResults = {
        success: false,
        results: { auth: false, firestore: false, anonymousAuth: false },
        errors: [`Erreur critique: ${error?.message || "Erreur inconnue"}`],
      };
    }
    loading = false;
  }
</script>

<svelte:head>
  <title>Test Firebase - Phase 2</title>
</svelte:head>

<main class="test-container">
  <div class="test-card">
    <header>
      <h1>🔧 Test Firebase - Phase 2</h1>
      <p>Validation de l'intégration Firebase Auth + Firestore</p>
    </header>

    <!-- Statut Firebase -->
    <section class="status-section">
      <h2>📊 Statut Firebase</h2>
      {#if firebaseStatus}
        <div class="status-grid">
          <div class="status-item" class:success={firebaseStatus.app}>
            <span class="icon">{firebaseStatus.app ? "✅" : "❌"}</span>
            <span
              >Firebase App: {firebaseStatus.app
                ? "Initialisé"
                : "Non initialisé"}</span
            >
          </div>
          <div class="status-item" class:success={firebaseStatus.auth}>
            <span class="icon">{firebaseStatus.auth ? "✅" : "❌"}</span>
            <span
              >Firebase Auth: {firebaseStatus.auth ? "Actif" : "Inactif"}</span
            >
          </div>
          <div class="status-item" class:success={firebaseStatus.firestore}>
            <span class="icon">{firebaseStatus.firestore ? "✅" : "❌"}</span>
            <span
              >Firestore: {firebaseStatus.firestore
                ? "Connecté"
                : "Déconnecté"}</span
            >
          </div>
        </div>
      {:else}
        <p>Chargement du statut Firebase...</p>
      {/if}
    </section>

    <!-- État d'authentification -->
    <section class="auth-section">
      <h2>🔐 État Authentification</h2>
      {#if mounted && browser}
        <div class="auth-info">
          <div class="info-item">
            <strong>Chargement:</strong>
            {$authStore.loading ? "Oui" : "Non"}
          </div>
          <div class="info-item">
            <strong>Authentifié:</strong>
            {$authStore.user ? "Oui" : "Non"}
          </div>
          <div class="info-item">
            <strong>Utilisateur:</strong>
            {$authStore.user ? $authStore.user.email || "Anonyme" : "Aucun"}
          </div>
          {#if $authStore.error}
            <div class="info-item error">
              <strong>Erreur:</strong>
              {$authStore.error}
            </div>
          {/if}
        </div>
      {:else}
        <p>Chargement de l'état d'authentification...</p>
      {/if}
    </section>

    <!-- Test de connexion -->
    <section class="test-section">
      <h2>🧪 Test de Connexion</h2>
      <button class="test-btn" on:click={runFirebaseTest} disabled={loading}>
        {loading ? "⏳ Test en cours..." : "🚀 Lancer le test"}
      </button>

      {#if testResults}
        <div class="test-results">
          <h3>📋 Résultats</h3>
          <div
            class="result-summary"
            class:success={testResults.success}
            class:error={!testResults.success}
          >
            <span class="icon">{testResults.success ? "✅" : "❌"}</span>
            <span
              >{testResults.success
                ? "Tous les tests réussis"
                : "Certains tests ont échoué"}</span
            >
          </div>

          <div class="test-details">
            <h4>Détails des tests:</h4>
            <ul>
              <li class:success={testResults.results.auth}>
                {testResults.results.auth ? "✅" : "❌"} Firebase Auth
              </li>
              <li class:success={testResults.results.firestore}>
                {testResults.results.firestore ? "✅" : "❌"} Firestore
              </li>
              <li class:success={testResults.results.anonymousAuth}>
                {testResults.results.anonymousAuth ? "✅" : "❌"} Authentification
                anonyme
              </li>
            </ul>
          </div>

          {#if testResults.errors.length > 0}
            <div class="error-list">
              <h4>❌ Erreurs détectées:</h4>
              <ul>
                {#each testResults.errors as error}
                  <li class="error">{error}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/if}
    </section>

    <!-- Instructions Phase 2 -->
    <section class="instructions">
      <h2>📋 Phase 2 - Prochaines étapes</h2>
      <div class="checklist">
        <div class="check-item">
          <span class="check">{testResults?.success ? "✅" : "⏳"}</span>
          <span>Configuration Firebase fonctionnelle</span>
        </div>
        <div class="check-item">
          <span class="check">⏳</span>
          <span>Interface d'authentification (login/register)</span>
        </div>
        <div class="check-item">
          <span class="check">⏳</span>
          <span>Protection des routes</span>
        </div>
        <div class="check-item">
          <span class="check">⏳</span>
          <span>Tests complets Phase 2</span>
        </div>
      </div>
    </section>
  </div>
</main>

<style>
  .test-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .test-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
  }

  h1 {
    color: #2563eb;
    margin-bottom: 0.5rem;
  }

  section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 8px;
  }

  .status-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
    border: 2px solid #e5e7eb;
  }

  .status-item.success {
    border-color: #10b981;
    background: #f0fdf4;
  }

  .auth-info {
    display: grid;
    gap: 0.5rem;
  }

  .info-item {
    padding: 0.5rem;
    background: white;
    border-radius: 4px;
  }

  .info-item.error {
    background: #fef2f2;
    color: #dc2626;
  }

  .test-btn {
    background: #2563eb;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .test-btn:hover:not(:disabled) {
    background: #1d4ed8;
  }

  .test-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .test-results {
    margin-top: 1.5rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
  }

  .result-summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 6px;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .result-summary.success {
    background: #f0fdf4;
    color: #166534;
    border: 2px solid #10b981;
  }

  .result-summary.error {
    background: #fef2f2;
    color: #dc2626;
    border: 2px solid #ef4444;
  }

  .test-details ul,
  .error-list ul {
    margin: 0.5rem 0;
    padding-left: 1rem;
  }

  .test-details li.success {
    color: #166534;
  }

  .error-list li.error {
    color: #dc2626;
  }

  .checklist {
    display: grid;
    gap: 0.5rem;
  }

  .check-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
  }

  .icon {
    font-size: 1.2em;
  }
</style>
