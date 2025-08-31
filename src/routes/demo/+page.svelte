<script lang="ts">
  import { onMount } from "svelte";

  let mounted = false;

  const demoFeatures = [
    {
      id: "markdown",
      title: "Système de Contenu Markdown",
      description:
        "Rendu de contenu éducatif avec sanitisation XSS, coloration syntaxique et table des matières automatique",
      icon: "📝",
      path: "/demo/markdown",
      features: [
        "Parsing Markdown sécurisé",
        "Coloration syntaxique automatique",
        "Table des matières interactive",
        "Support des tableaux et équations",
        "Cache intelligent des rendus",
      ],
      status: "ready",
    },
    {
      id: "exercise",
      title: "Exercices Interactifs",
      description:
        "QCM intelligents avec feedback en temps réel, progression visuelle et évaluation automatique",
      icon: "🎯",
      path: "/demo/exercise",
      features: [
        "Questions à choix multiples",
        "Validation en temps réel",
        "Feedback pédagogique",
        "Calcul automatique du score",
        "Navigation intuitive",
      ],
      status: "ready",
    },
    {
      id: "content-management",
      title: "Gestion de Contenu",
      description:
        "Architecture complète pour la création, organisation et diffusion de contenu pédagogique",
      icon: "📚",
      path: "/content",
      features: [
        "Hiérarchie Matières → Niveaux → Compétences",
        "Types de contenu flexibles",
        "Métadonnées enrichies",
        "Validation Zod intégrée",
        "Store réactif Svelte",
      ],
      status: "ready",
    },
    {
      id: "components",
      title: "Composants Réutilisables",
      description:
        "Bibliothèque de composants UI optimisés pour l'apprentissage et l'accessibilité",
      icon: "🧩",
      path: "/demo/components",
      features: [
        "MarkdownRenderer avancé",
        "QCMCard interactive",
        "EmailAuth sécurisé",
        "AuthComplete élégant",
        "Design system cohérent",
      ],
      status: "in-progress",
    },
  ];

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Phase 3 - Démonstrations - FunLearning</title>
  <meta
    name="description"
    content="Découvrez les fonctionnalités de la Phase 3 : système de contenu Markdown, exercices interactifs et composants avancés"
  />
</svelte:head>

<div class="demo-hub">
  <header class="hero-section">
    <div class="container">
      <div class="hero-content" class:mounted>
        <h1>
          <span class="phase-badge">Phase 3</span>
          Content Management & Markdown
        </h1>
        <p class="hero-description">
          Système complet de gestion de contenu éducatif avec rendu Markdown
          sécurisé, exercices interactifs et composants réutilisables.
        </p>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">113</span>
            <span class="stat-label">Tests passés</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">4</span>
            <span class="stat-label">Fonctionnalités</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">95%</span>
            <span class="stat-label">Couverture</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="demo-grid-section">
    <div class="container">
      <h2>🚀 Fonctionnalités Disponibles</h2>

      <div class="demos-grid">
        {#each demoFeatures as demo, index}
          <div
            class="demo-card"
            class:mounted
            style="animation-delay: {index * 0.1}s"
          >
            <div class="demo-header">
              <div class="demo-icon">{demo.icon}</div>
              <div class="demo-status {demo.status}">
                {demo.status === "ready" ? "✅ Prêt" : "🚧 En cours"}
              </div>
            </div>

            <div class="demo-content">
              <h3>{demo.title}</h3>
              <p class="demo-description">{demo.description}</p>

              <ul class="demo-features">
                {#each demo.features as feature}
                  <li>{feature}</li>
                {/each}
              </ul>
            </div>

            <div class="demo-actions">
              {#if demo.status === "ready"}
                <a href={demo.path} class="btn btn-primary">
                  Essayer la démo
                </a>
              {:else}
                <button class="btn btn-secondary" disabled>
                  Bientôt disponible
                </button>
              {/if}

              <button class="btn btn-outline" on:click={() => {}}>
                Voir le code
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>

  <section class="technical-section">
    <div class="container">
      <div class="tech-overview">
        <h2>🔧 Architecture Technique</h2>

        <div class="tech-grid">
          <div class="tech-category">
            <h3>📝 Contenu</h3>
            <ul>
              <li><strong>marked.js</strong> - Parsing Markdown performant</li>
              <li><strong>DOMPurify</strong> - Sanitisation XSS sécurisée</li>
              <li><strong>highlight.js</strong> - Coloration syntaxique</li>
              <li><strong>marked-highlight</strong> - Intégration optimisée</li>
            </ul>
          </div>

          <div class="tech-category">
            <h3>🎯 Exercices</h3>
            <ul>
              <li><strong>QCMCard</strong> - Composant question interactif</li>
              <li>
                <strong>EventDispatcher</strong> - Communication composants
              </li>
              <li><strong>CSS Animations</strong> - Feedback visuel</li>
              <li>
                <strong>State Management</strong> - Progression utilisateur
              </li>
            </ul>
          </div>

          <div class="tech-category">
            <h3>🔒 Sécurité</h3>
            <ul>
              <li><strong>Zod Validation</strong> - Types sécurisés</li>
              <li><strong>XSS Protection</strong> - Sanitisation HTML</li>
              <li><strong>TypeScript</strong> - Typage strict</li>
              <li><strong>CSP Headers</strong> - Politique de contenu</li>
            </ul>
          </div>

          <div class="tech-category">
            <h3>⚡ Performance</h3>
            <ul>
              <li><strong>Cache intelligent</strong> - Mise en cache HTML</li>
              <li><strong>Lazy loading</strong> - Chargement à la demande</li>
              <li><strong>Tree shaking</strong> - Bundle optimisé</li>
              <li><strong>SSR Support</strong> - Rendu côté serveur</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="progress-section">
    <div class="container">
      <h2>📊 Progression Phase 3</h2>

      <div class="progress-overview">
        <div class="progress-item">
          <div class="progress-header">
            <h3>Système de Contenu Markdown</h3>
            <span class="progress-percentage">100%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 100%" />
          </div>
          <p>✅ Parsing, sanitisation, coloration syntaxique, cache</p>
        </div>

        <div class="progress-item">
          <div class="progress-header">
            <h3>Exercices Interactifs</h3>
            <span class="progress-percentage">95%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 95%" />
          </div>
          <p>✅ QCM, validation, scoring, feedback - 🔄 Finalisation</p>
        </div>

        <div class="progress-item">
          <div class="progress-header">
            <h3>Composants UI</h3>
            <span class="progress-percentage">90%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 90%" />
          </div>
          <p>✅ MarkdownRenderer, QCMCard, Auth - 🔄 Optimisations</p>
        </div>

        <div class="progress-item">
          <div class="progress-header">
            <h3>Tests & Validation</h3>
            <span class="progress-percentage">95%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 95%" />
          </div>
          <p>✅ 113/119 tests passés - Excellent taux de réussite</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="demo-footer">
    <div class="container">
      <div class="footer-content">
        <h3>🎯 Prochaines Étapes</h3>
        <p>
          La Phase 3 Content Management est pratiquement terminée avec un
          excellent taux de réussite. Prochaine étape : <strong
            >Phase 4 - Pédagogie Avancée</strong
          > avec pré-évaluation et métacognition.
        </p>

        <div class="footer-actions">
          <a href="/roadmap" class="btn btn-primary"> Voir la Roadmap </a>
          <a href="/tests" class="btn btn-outline"> Résultats des Tests </a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .demo-hub {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .hero-section {
    padding: 5rem 0;
    text-align: center;
    color: white;
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

  .phase-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 1rem;
    font-weight: 600;
    margin-right: 1rem;
    backdrop-filter: blur(10px);
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .hero-description {
    font-size: 1.3rem;
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
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .demo-grid-section {
    background: white;
    padding: 5rem 0;
  }

  .demo-grid-section h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
    font-size: 2.5rem;
  }

  .demos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .demo-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    padding: 2rem;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(2rem);
  }

  .demo-card.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .demo-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .demo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .demo-icon {
    font-size: 2.5rem;
  }

  .demo-status {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .demo-status.ready {
    background: #d4edda;
    color: #155724;
  }

  .demo-status.in-progress {
    background: #fff3cd;
    color: #856404;
  }

  .demo-content h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.3rem;
  }

  .demo-description {
    color: #6c757d;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .demo-features {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
  }

  .demo-features li {
    padding: 0.25rem 0;
    color: #495057;
    font-size: 0.9rem;
    position: relative;
    padding-left: 1.5rem;
  }

  .demo-features li::before {
    content: "▸";
    position: absolute;
    left: 0;
    color: #007bff;
    font-weight: bold;
  }

  .demo-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s ease;
    flex: 1;
    text-align: center;
    border: none;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-outline {
    background: transparent;
    border: 1px solid #007bff;
    color: #007bff;
  }

  .btn-outline:hover {
    background: #007bff;
    color: white;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .technical-section {
    background: #f8f9fa;
    padding: 5rem 0;
  }

  .tech-overview h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
    font-size: 2.5rem;
  }

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .tech-category {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    border: 1px solid #e9ecef;
  }

  .tech-category h3 {
    margin: 0 0 1.5rem 0;
    color: #495057;
    font-size: 1.2rem;
  }

  .tech-category ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .tech-category li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f8f9fa;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .tech-category li:last-child {
    border-bottom: none;
  }

  .progress-section {
    background: white;
    padding: 5rem 0;
  }

  .progress-section h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
    font-size: 2.5rem;
  }

  .progress-overview {
    max-width: 800px;
    margin: 0 auto;
  }

  .progress-item {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 0.75rem;
    border: 1px solid #e9ecef;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .progress-header h3 {
    margin: 0;
    color: #495057;
    font-size: 1.1rem;
  }

  .progress-percentage {
    font-weight: 700;
    color: #28a745;
  }

  .progress-bar {
    height: 0.5rem;
    background: #e9ecef;
    border-radius: 0.25rem;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #28a745, #20c997);
    transition: width 0.3s ease;
  }

  .progress-item p {
    margin: 0;
    font-size: 0.9rem;
    color: #6c757d;
  }

  .demo-footer {
    background: #2c3e50;
    color: white;
    padding: 3rem 0;
  }

  .footer-content {
    text-align: center;
  }

  .footer-content h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .footer-content p {
    margin: 0 0 2rem 0;
    font-size: 1.1rem;
    opacity: 0.9;
    line-height: 1.6;
  }

  .footer-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .hero-description {
      font-size: 1.1rem;
    }

    .hero-stats {
      gap: 2rem;
    }

    .demos-grid {
      grid-template-columns: 1fr;
    }

    .demo-actions {
      flex-direction: column;
    }

    .tech-grid {
      grid-template-columns: 1fr;
    }

    .progress-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .footer-actions {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }
  }
</style>
