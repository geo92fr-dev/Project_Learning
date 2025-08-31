<script lang="ts">
  import { onMount } from "svelte";

  let mounted = false;

  const quickLinks = [
    {
      title: "Authentification",
      icon: "🔐",
      href: "/auth",
      description: "Google OAuth & Email/Password",
    },
    {
      title: "Démonstrations",
      icon: "🚀",
      href: "/demo",
      description: "Fonctionnalités Phase 3",
    },
    {
      title: "Tests & Qualité",
      icon: "🧪",
      href: "/tests",
      description: "113/119 tests réussis",
    },
    {
      title: "Roadmap",
      icon: "🗺️",
      href: "/roadmap",
      description: "Progression du projet",
    },
    {
      title: "Exercices",
      icon: "🎯",
      href: "/demo/exercise",
      description: "QCM interactifs",
    },
    {
      title: "Contenu Markdown",
      icon: "📝",
      href: "/demo/markdown",
      description: "Rendu sécurisé",
    },
  ];

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>FunLearning V2.0 - Plateforme Éducative Intelligente</title>
  <meta
    name="description"
    content="Plateforme d'apprentissage personnalisée avec gestion de contenu avancée et exercices interactifs"
  />
</svelte:head>

<div class="home-page">
  <header class="hero-section">
    <div class="container">
      <div class="hero-content" class:mounted>
        <h1>
          <span class="logo-icon">🚀</span>
          FunLearning V2.0
        </h1>
        <p class="hero-subtitle">
          Plateforme d'apprentissage personnalisée et adaptive avec système de
          contenu intelligent
        </p>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">3</span>
            <span class="stat-label">Phases Complètes</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">95%</span>
            <span class="stat-label">Phase 3 Avancement</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">113</span>
            <span class="stat-label">Tests Réussis</span>
          </div>
        </div>

        <div class="hero-actions">
          <a href="/demo" class="btn btn-primary"> 🎮 Essayer les Démos </a>
          <a href="/auth" class="btn btn-secondary"> 🔐 Se Connecter </a>
        </div>
      </div>
    </div>
  </header>

  <main class="main-content">
    <div class="container">
      <section class="quick-access">
        <h2>⚡ Accès Rapide</h2>
        <div class="links-grid">
          {#each quickLinks as link, index}
            <a
              href={link.href}
              class="link-card"
              class:mounted
              style="animation-delay: {index * 0.1}s"
            >
              <div class="link-icon">{link.icon}</div>
              <div class="link-content">
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </div>
              <div class="link-arrow">→</div>
            </a>
          {/each}
        </div>
      </section>

      <section class="phases-overview">
        <h2>📊 État des Phases</h2>
        <div class="phases-grid">
          <div class="phase-card completed">
            <div class="phase-header">
              <h3>Phase 1 - Infrastructure</h3>
              <span class="phase-status">✅ Terminée</span>
            </div>
            <div class="phase-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 100%" />
              </div>
              <span class="progress-text">100%</span>
            </div>
            <p>Architecture SvelteKit, TypeScript, configuration complète</p>
          </div>

          <div class="phase-card completed">
            <div class="phase-header">
              <h3>Phase 2 - Authentification</h3>
              <span class="phase-status">✅ Terminée</span>
            </div>
            <div class="phase-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 100%" />
              </div>
              <span class="progress-text">100%</span>
            </div>
            <p>Google OAuth, Email/Password, gestion des utilisateurs</p>
          </div>

          <div class="phase-card current">
            <div class="phase-header">
              <h3>Phase 3 - Gestion de Contenu</h3>
              <span class="phase-status">🚧 En cours</span>
            </div>
            <div class="phase-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 95%" />
              </div>
              <span class="progress-text">95%</span>
            </div>
            <p>Markdown sécurisé, exercices interactifs, composants avancés</p>
          </div>

          <div class="phase-card planned">
            <div class="phase-header">
              <h3>Phase 4 - Pédagogie Avancée</h3>
              <span class="phase-status">📋 Planifiée</span>
            </div>
            <div class="phase-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 0%" />
              </div>
              <span class="progress-text">0%</span>
            </div>
            <p>Pré-évaluation, parcours adaptatifs, métacognition</p>
          </div>
        </div>
      </section>

      <section class="features-highlight">
        <h2>✨ Fonctionnalités Disponibles</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>Authentification Sécurisée</h3>
            <p>
              Connexion Google OAuth et Email/Password avec gestion complète des
              sessions utilisateur
            </p>
            <a href="/auth" class="feature-link">Tester →</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Contenu Markdown Avancé</h3>
            <p>
              Rendu sécurisé avec sanitisation XSS, coloration syntaxique et
              table des matières automatique
            </p>
            <a href="/demo/markdown" class="feature-link">Voir démo →</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Exercices Interactifs</h3>
            <p>
              QCM intelligents avec validation en temps réel, scoring
              automatique et feedback pédagogique
            </p>
            <a href="/demo/exercise" class="feature-link">Essayer →</a>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🧪</div>
            <h3>Qualité & Tests</h3>
            <p>
              113 tests automatisés, 95% de couverture, développement piloté par
              la qualité
            </p>
            <a href="/tests" class="feature-link">Voir résultats →</a>
          </div>
        </div>
      </section>
    </div>
  </main>

  <footer class="home-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>🎯 Développement Méthodique</h3>
          <p>
            Approche progressive en 5 phases pour construire une plateforme
            d'apprentissage robuste et évolutive.
          </p>
        </div>

        <div class="footer-section">
          <h3>🔗 Liens Rapides</h3>
          <div class="footer-links">
            <a href="/demo">Démonstrations</a>
            <a href="/roadmap">Roadmap</a>
            <a href="/tests">Tests</a>
            <a href="/auth">Authentification</a>
          </div>
        </div>

        <div class="footer-section">
          <h3>📊 Statistiques</h3>
          <div class="footer-stats">
            <div>113 tests passés</div>
            <div>95% couverture</div>
            <div>12 composants</div>
            <div>Phase 3 @ 95%</div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2024 FunLearning V2.0 - Plateforme d'apprentissage intelligente</p>
      </div>
    </div>
  </footer>
</div>

<style>
  .home-page {
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 5rem 0;
    text-align: center;
  }

  .hero-content {
    opacity: 0;
    transform: translateY(2rem);
    transition: all 0.8s ease;
  }

  .hero-content.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .logo-icon {
    font-size: 4rem;
    margin-right: 1rem;
  }

  h1 {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
  }

  .stat-label {
    font-size: 1rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .hero-actions {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 1.1rem;
    border: none;
  }

  .btn-primary {
    background: #28a745;
    color: white;
  }

  .btn-primary:hover {
    background: #218838;
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  .main-content {
    background: white;
    padding: 5rem 0;
  }

  .quick-access {
    margin-bottom: 5rem;
  }

  .quick-access h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
    font-size: 2.5rem;
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .link-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 1rem;
    padding: 2rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    opacity: 0;
    transform: translateY(1rem);
  }

  .link-card.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .link-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
  }

  .link-icon {
    font-size: 2.5rem;
    flex-shrink: 0;
  }

  .link-content {
    flex: 1;
  }

  .link-content h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.2rem;
  }

  .link-content p {
    margin: 0;
    color: #6c757d;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .link-arrow {
    font-size: 1.5rem;
    color: #007bff;
    font-weight: bold;
    flex-shrink: 0;
  }

  .phases-overview {
    margin-bottom: 5rem;
  }

  .phases-overview h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
    font-size: 2.5rem;
  }

  .phases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .phase-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .phase-card.completed {
    border-left: 4px solid #28a745;
  }

  .phase-card.current {
    border-left: 4px solid #007bff;
  }

  .phase-card.planned {
    border-left: 4px solid #6c757d;
  }

  .phase-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }

  .phase-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1rem;
    flex: 1;
  }

  .phase-status {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    white-space: nowrap;
  }

  .completed .phase-status {
    background: #d4edda;
    color: #155724;
  }

  .current .phase-status {
    background: #cce7ff;
    color: #004085;
  }

  .planned .phase-status {
    background: #f8f9fa;
    color: #495057;
  }

  .phase-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .progress-bar {
    flex: 1;
    height: 0.5rem;
    background: #e9ecef;
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #007bff, #0056b3);
    transition: width 0.3s ease;
    border-radius: 0.25rem;
  }

  .completed .progress-fill {
    background: linear-gradient(90deg, #28a745, #20c997);
  }

  .progress-text {
    font-weight: 600;
    color: #495057;
    min-width: 3rem;
  }

  .phase-card p {
    color: #6c757d;
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .features-highlight h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
    font-size: 2.5rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.3rem;
  }

  .feature-card p {
    color: #6c757d;
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
  }

  .feature-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .feature-link:hover {
    color: #0056b3;
  }

  .home-footer {
    background: #2c3e50;
    color: white;
    padding: 3rem 0 1rem;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .footer-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }

  .footer-section p {
    margin: 0;
    opacity: 0.9;
    line-height: 1.6;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-links a {
    color: #74b9ff;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .footer-links a:hover {
    color: white;
  }

  .footer-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-stats div {
    opacity: 0.9;
    font-size: 0.95rem;
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
    text-align: center;
  }

  .footer-bottom p {
    margin: 0;
    opacity: 0.7;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    .logo-icon {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
    }

    .hero-stats {
      gap: 2rem;
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 300px;
    }

    .links-grid {
      grid-template-columns: 1fr;
    }

    .link-card {
      flex-direction: column;
      text-align: center;
    }

    .phases-grid {
      grid-template-columns: 1fr;
    }

    .phase-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .footer-content {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .footer-links {
      align-items: center;
    }
  }
</style>
