<script>
  // 🚀 FunLearning V2.0 - Phase 1 Home Page
  // Page d'accueil basique conforme roadmap Phase 1

  // Pas d'authentification pour le moment
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

      <div class="status-card">
        <h3>🔧 Phase 2 - Interface Simple</h3>
        <p>Interface de base sans authentification</p>
        <div class="quick-actions">
          <a href="/dashboard" class="btn primary">� Voir le dashboard</a>
        </div>
      </div>

      <div class="status-card">
        <h3>🔄 Phase 3 - Contenus</h3>
        <p>Structure des cours & Markdown</p>
        <div class="links">
          <a href="/test-exercises">🧪 Test Exercices</a>
          <a href="/test-content">🧪 Test Contenu</a>
          <a href="/test-markdown">🧪 Test MarkdownRenderer</a>
          <a href="/content">📚 Explorer Contenu</a>
        </div>
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

  /* .status-card.pending {
    border-color: #f59e0b;
    background: #fffbeb;
  } */

  .links {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .links a {
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.85rem;
    text-align: center;
    transition: background 0.3s ease;
  }

  .links a:hover {
    background: #2563eb;
  }

  .status-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  .quick-actions {
    margin-top: 1rem;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    text-align: center;
  }

  .btn.primary {
    background: #3b82f6;
    color: white;
  }

  .btn.primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
    color: #6b7280;
  }
</style>
