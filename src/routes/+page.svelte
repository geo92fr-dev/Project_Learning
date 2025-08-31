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
    <p><strong>Phase actuelle:</strong> Phase 2 - Contenu & Markdown</p>
    <p>
      <strong>Statut:</strong> ✅ Authentification + Système de cours opérationnels
    </p>
  </div>

  <div class="actions">
    <h3>Découvrir FunLearning</h3>
    <div class="buttons">
      <a href="/cours" class="btn primary">📚 Voir les cours</a>
      <a href="/auth" class="btn secondary">🔐 Se connecter</a>
      <a href="/dashboard" class="btn secondary">📊 Dashboard</a>
      <a href="/pedagogy" class="btn featured">🧠 Démo Pédagogie 2.5</a>
    </div>
  </div>

  <div class="info">
    <h3>Fonctionnalités disponibles</h3>
    <ul>
      <li>✅ Authentification Firebase</li>
      <li>✅ Système de cours Markdown</li>
      <li>✅ Routes dynamiques</li>
      <li>✅ Coloration syntaxique</li>
      <li>✅ Interface responsive</li>
      <li>🚀 Phase 2.5 : Pédagogie avancée (Nouveau !)</li>
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

  .actions {
    margin: 2rem 0;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .btn.primary {
    background: #ff3e00;
    color: white;
  }

  .btn.primary:hover {
    background: #e63900;
  }

  .btn.secondary {
    background: #ffffff;
    color: #333;
    border: 2px solid #ddd;
  }

  .btn.secondary:hover {
    border-color: #ff3e00;
    color: #ff3e00;
  }

  .btn.featured {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    position: relative;
    overflow: hidden;
  }

  .btn.featured:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  .btn.featured::before {
    content: "✨";
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 1.2rem;
    animation: sparkle 2s infinite;
  }

  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  }
</style>
