<script>
  import { version, phase } from "$lib/index.js";
</script>

<svelte:head>
  <title>FunLearning - {phase}</title>
  <meta name="description" content="Application d'apprentissage interactive" />
</svelte:head>

<main>
  <h1>🎓 FunLearning</h1>

  <div class="status">
    <h2>Statut du Projet</h2>
    <p><strong>Version:</strong> {version}</p>
    <p><strong>Phase actuelle:</strong> {phase}</p>
    <p><strong>Statut:</strong> ✅ Configuration de base terminée</p>
  </div>

  <div class="info">
    <h3>Phase 0 - Setup & Architecture</h3>
    <ul>
      <li>✅ SvelteKit configuré</li>
      <li>✅ Structure de dossiers créée</li>
      <li>✅ Tests unitaires configurés (Vitest)</li>
      <li>✅ TypeScript configuré</li>
      <li>🎯 Prêt pour Phase 1 (Firebase & Auth)</li>
    </ul>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2.5rem;
    font-weight: 100;
    margin-bottom: 2rem;
  }

  .info {
    background: #f9f9f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 2rem;
  }

  .info p {
    margin: 0.5rem 0;
  }
</style>
