<script>
  // Test simple sans Firebase
</script>

<svelte:head>
  <title>Test Auth - FunLearning</title>
</svelte:head>

<main>
  <h1>🧪 Test Page d'Authentification</h1>
  <p>Cette page teste le rendu basique sans Firebase.</p>

  <div class="status">
    <h2>Status des tests :</h2>
    <ul>
      <li>✅ Rendu Svelte basique</li>
      <li>⏳ Import Firebase (à tester)</li>
      <li>⏳ Store d'authentification (à tester)</li>
    </ul>
  </div>
</main>

<style>
  main {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .status {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
  }
</style>
