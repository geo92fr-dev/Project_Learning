<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let status = "Chargement...";
  let details: any = {};

  onMount(async () => {
    if (!browser) return;

    try {
      // Import dynamique pour éviter SSR
      const { testFirebaseConnection } = await import(
        "$lib/firebase/test-connection-new.js"
      );

      status = "Test en cours...";
      const results = await testFirebaseConnection();

      if (results.success) {
        status = "✅ Firebase fonctionne parfaitement !";
      } else {
        status = "❌ Problèmes détectés";
      }

      details = results;
    } catch (error: any) {
      status = `❌ Erreur: ${error.message}`;
      console.error("Erreur test Firebase:", error);
    }
  });
</script>

<svelte:head>
  <title>Test Firebase Simple - Phase 2</title>
</svelte:head>

<main>
  <div class="container">
    <h1>🔧 Test Firebase - Phase 2</h1>

    <div class="status-card">
      <h2>Statut</h2>
      <p class="status">{status}</p>
    </div>

    {#if details.results}
      <div class="results-card">
        <h3>Résultats détaillés</h3>
        <ul>
          <li>Firebase Auth: {details.results.auth ? "✅" : "❌"}</li>
          <li>Firestore: {details.results.firestore ? "✅" : "❌"}</li>
          <li>Auth anonyme: {details.results.anonymousAuth ? "✅" : "❌"}</li>
        </ul>

        {#if details.errors && details.errors.length > 0}
          <div class="errors">
            <h4>Erreurs:</h4>
            {#each details.errors as error}
              <p class="error">{error}</p>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <div class="next-steps">
      <h3>✅ Phase 2A - Configuration Firebase</h3>
      <p>
        Si ce test réussit, nous pouvons passer à la Phase 2B : Interface
        d'authentification
      </p>
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .status-card,
  .results-card,
  .next-steps {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .status {
    font-size: 1.2em;
    font-weight: bold;
    margin: 1rem 0;
  }

  .error {
    color: #dc2626;
    background: #fef2f2;
    padding: 0.5rem;
    border-radius: 4px;
    margin: 0.5rem 0;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 0.5rem;
    margin: 0.25rem 0;
    background: #f8fafc;
    border-radius: 4px;
  }
</style>
