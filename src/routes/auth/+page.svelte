<!-- Page de connexion - FunLearning Phase 1 -->
<script lang="ts">
  import LoginForm from "$lib/components/auth/LoginForm.svelte";
  import { authStore } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  // Rediriger si déjà connecté
  $: if ($authStore.user && !$authStore.loading) {
    goto("/dashboard");
  }

  // Initialiser le store d'auth
  onMount(() => {
    authStore.init();
  });

  function handleLoginSuccess(event: CustomEvent) {
    console.log("Connexion réussie:", event.detail);
    // Redirection automatique gérée par le store
  }

  function handleLoginError(event: CustomEvent) {
    console.error("Erreur de connexion:", event.detail);
  }
</script>

<svelte:head>
  <title>Connexion - FunLearning</title>
  <meta
    name="description"
    content="Connectez-vous à FunLearning pour accéder à vos cours et exercices."
  />
</svelte:head>

<main>
  {#if $authStore.loading}
    <div class="loading-screen">
      <div class="loading-content">
        <div class="loading-spinner" />
        <p>Initialisation...</p>
      </div>
    </div>
  {:else if !$authStore.user}
    <LoginForm on:success={handleLoginSuccess} on:error={handleLoginError} />
  {:else}
    <div class="redirect-screen">
      <div class="redirect-content">
        <h2>✅ Connexion réussie</h2>
        <p>Redirection vers votre tableau de bord...</p>
        <div class="loading-spinner" />
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-screen,
  .redirect-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .loading-content,
  .redirect-content {
    text-align: center;
    color: white;
    padding: 2rem;
  }

  .loading-content h2,
  .redirect-content h2 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .loading-content p,
  .redirect-content p {
    margin: 0 0 1.5rem;
    opacity: 0.9;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
