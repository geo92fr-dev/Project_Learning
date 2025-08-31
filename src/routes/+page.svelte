<script>
  // 🚀 FunLearning V2.0 - Phase 1 Home Page
  // Page d'accueil basique conforme roadmap Phase 1

  import { user } from "$lib/stores/auth.js";
</script>

<svelte:head>
  <title>FunLearning V2.0 - Plateforme Éducative</title>
  <meta name="description" content="Plateforme d'apprentissage personnalisée" />
</svelte:head>

<main class="container">
  <header class="hero">
    <h1>🚀 FunLearning V2.0</h1>
    <p>Plateforme d'apprentissage personnalisée et adaptive</p>
    <p class="phase-status">📋 Phase 1 : Setup & Architecture ✅</p>
  </header>

  <section class="status">
    <h2>🏗️ État du Projet</h2>
    <div class="status-grid">
      <div class="status-card">
        <h3>✅ Phase 1 - Setup</h3>
        <p>SvelteKit + TypeScript + Tests configurés</p>
      </div>

      <div class="status-card pending">
        <h3>⏳ Phase 2 - Auth Firebase</h3>
        <p>Authentification complète (à venir)</p>
      </div>

      <div class="status-card pending">
        <h3>⏳ Phase 3 - Contenus</h3>
        <p>Structure des cours (à venir)</p>
      </div>
    </div>
  </section>

  <footer>
    <p>🎯 Développement méthodique selon roadmap 12 phases</p>
  </footer>
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    margin-bottom: 3rem;
  }

  .hero h1 {
    font-size: 3rem;
    color: #2563eb;
    margin-bottom: 1rem;
  }

  .phase-status {
    background: #10b981;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    display: inline-block;
    margin-top: 1rem;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .status-card {
    border: 2px solid #10b981;
    border-radius: 8px;
    padding: 1.5rem;
    background: #f0fdf4;
  }

  .status-card.pending {
    border-color: #f59e0b;
    background: #fffbeb;
  }

  .status-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
    color: #6b7280;
  }
</style>
