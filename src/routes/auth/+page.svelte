<script>
  // 🚀 FunLearning V2.0 - Phase 1 Auth Page
  // Page d'authentification basique conforme roadmap Phase 1

  import { user, loading } from "$lib/stores/auth.js";
</script>

<svelte:head>
  <title>Authentification - FunLearning V2.0</title>
</svelte:head>

<main class="auth-container">
  <div class="auth-card">
    <header>
      <h1>🔐 Authentification</h1>
      <p>Phase 1 - Configuration de base</p>
    </header>

    <div class="auth-status">
      <h2>📋 État Authentication</h2>
      <div class="status-info">
        <p><strong>Phase actuelle:</strong> Phase 1 - Setup</p>
        <p><strong>Firebase Auth:</strong> Configuré (basique)</p>
        <p><strong>Prochaine phase:</strong> Phase 2 - Auth complète</p>
      </div>
    </div>

    <div class="phase-info">
      <h3>🎯 Fonctionnalités Phase 1</h3>
      <ul>
        <li>✅ Configuration Firebase basique</li>
        <li>✅ Structure auth store</li>
        <li>✅ Route d'authentification</li>
        <li>⏳ Login/Register (Phase 2)</li>
        <li>⏳ Gestion sessions (Phase 2)</li>
      </ul>
    </div>

    <div class="navigation">
      <a href="/" class="btn-secondary">← Retour accueil</a>
    </div>
  </div>
</main>

<style>
  .auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .auth-card {
    background: white;
    border-radius: 12px;
    padding: 2.5rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
  }

  header h1 {
    color: #2563eb;
    margin-bottom: 0.5rem;
  }

  .auth-status {
    background: #f0fdf4;
    border: 1px solid #10b981;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .status-info p {
    margin: 0.5rem 0;
  }

  .phase-info {
    background: #fffbeb;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .phase-info ul {
    margin: 1rem 0 0 1rem;
  }

  .phase-info li {
    margin: 0.5rem 0;
  }

  .navigation {
    text-align: center;
  }

  .btn-secondary {
    background: #6b7280;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s;
  }

  .btn-secondary:hover {
    background: #4b5563;
  }
</style>
