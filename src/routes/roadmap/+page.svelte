<script lang="ts">
  import { onMount } from "svelte";

  let mounted = false;

  const phases = [
    {
      id: "phase-1",
      title: "Phase 1",
      subtitle: "Framework & Fondations",
      status: "completed",
      progress: 100,
      description: "Infrastructure technique de base et architecture SvelteKit",
      duration: "Terminée",
      features: [
        "Architecture SvelteKit avec TypeScript",
        "Configuration Vite optimisée",
        "Structure modulaire des composants",
        "System de routing dynamique",
        "Configuration des outils de développement",
      ],
      technologies: ["SvelteKit", "TypeScript", "Vite", "Node.js"],
      deliverables: [
        "Architecture projet",
        "Configuration build",
        "Structure de base",
      ],
    },
    {
      id: "phase-2",
      title: "Phase 2",
      subtitle: "Authentication & Firebase",
      status: "completed",
      progress: 100,
      description:
        "Système d'authentification complet avec Google OAuth et Email",
      duration: "Terminée",
      features: [
        "Authentification Google OAuth",
        "Authentification par Email/Mot de passe",
        "Gestion des états utilisateur",
        "Stores réactifs Svelte",
        "Protection des routes",
        "Interface utilisateur complète",
      ],
      technologies: ["Firebase Auth", "Google OAuth", "Svelte Stores", "CSS3"],
      deliverables: [
        "Composants Auth",
        "Stores utilisateur",
        "Pages authentification",
      ],
    },
    {
      id: "phase-3",
      title: "Phase 3",
      subtitle: "Content Management & Markdown",
      status: "current",
      progress: 95,
      description: "Système de gestion de contenu avec rendu Markdown sécurisé",
      duration: "En finalisation",
      features: [
        "Parsing Markdown avec marked.js",
        "Sanitisation XSS avec DOMPurify",
        "Coloration syntaxique automatique",
        "Exercices interactifs (QCM)",
        "Composants de contenu réutilisables",
        "Cache intelligent des rendus",
      ],
      technologies: ["marked.js", "DOMPurify", "highlight.js", "Zod"],
      deliverables: ["Système Markdown", "Composants exercices", "Pages démo"],
    },
    {
      id: "phase-4",
      title: "Phase 4",
      subtitle: "Pédagogie Avancée",
      status: "planned",
      progress: 0,
      description:
        "Outils pédagogiques avancés avec pré-évaluation et métacognition",
      duration: "À venir",
      features: [
        "Pré-évaluation des compétences",
        "Parcours adaptatifs personnalisés",
        "Outils de métacognition",
        "Feedback pédagogique intelligent",
        "Analytics d'apprentissage",
        "Recommandations automatiques",
      ],
      technologies: [
        "ML/AI Integration",
        "Analytics",
        "Adaptive Learning",
        "Data Viz",
      ],
      deliverables: [
        "Moteur adaptatif",
        "Outils métacognition",
        "Dashboard analytics",
      ],
    },
    {
      id: "phase-5",
      title: "Phase 5",
      subtitle: "Production & Performance",
      status: "planned",
      progress: 0,
      description: "Optimisation, déploiement et mise en production",
      duration: "À planifier",
      features: [
        "Optimisation des performances",
        "Configuration de production",
        "Monitoring et observabilité",
        "Système de cache avancé",
        "CDN et distribution globale",
        "Tests de charge et stress",
      ],
      technologies: ["Docker", "CI/CD", "Monitoring", "CDN", "Load Balancing"],
      deliverables: ["Build production", "Pipeline CI/CD", "Infrastructure"],
    },
  ];

  const currentStats = {
    totalTests: 119,
    passingTests: 113,
    coverage: 95,
    components: 12,
    features: 8,
    phases: 5,
  };

  onMount(() => {
    mounted = true;
  });

  function getStatusColor(status: string): string {
    switch (status) {
      case "completed":
        return "#28a745";
      case "current":
        return "#007bff";
      case "planned":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case "completed":
        return "✅ Terminée";
      case "current":
        return "🚧 En cours";
      case "planned":
        return "📋 Planifiée";
      default:
        return "Non définie";
    }
  }
</script>

<svelte:head>
  <title>Roadmap - FunLearning Project</title>
  <meta
    name="description"
    content="Roadmap complète du projet FunLearning : de l'architecture aux fonctionnalités avancées"
  />
</svelte:head>

<div class="roadmap-page">
  <header class="roadmap-header">
    <div class="container">
      <div class="header-content" class:mounted>
        <h1>
          <span class="icon">🗺️</span>
          Roadmap FunLearning
        </h1>
        <p class="header-description">
          Parcours de développement complet : de l'infrastructure technique aux
          fonctionnalités pédagogiques avancées, découvrez notre approche
          structurée et progressive.
        </p>

        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-number">
              {currentStats.passingTests}/{currentStats.totalTests}
            </div>
            <div class="stat-label">Tests réussis</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{currentStats.coverage}%</div>
            <div class="stat-label">Couverture</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{currentStats.components}</div>
            <div class="stat-label">Composants</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{currentStats.features}</div>
            <div class="stat-label">Fonctionnalités</div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="roadmap-content">
    <div class="container">
      <div class="phases-timeline">
        {#each phases as phase, index}
          <div
            class="phase-card"
            class:mounted
            class:completed={phase.status === "completed"}
            class:current={phase.status === "current"}
            class:planned={phase.status === "planned"}
            style="animation-delay: {index * 0.2}s"
          >
            <div class="phase-timeline-marker">
              <div
                class="timeline-dot"
                style="background-color: {getStatusColor(phase.status)}"
              />
              {#if index < phases.length - 1}
                <div class="timeline-line" />
              {/if}
            </div>

            <div class="phase-content">
              <div class="phase-header">
                <div class="phase-title-section">
                  <h2 class="phase-title">{phase.title}</h2>
                  <h3 class="phase-subtitle">{phase.subtitle}</h3>
                </div>
                <div class="phase-status">
                  <span
                    class="status-badge"
                    style="background-color: {getStatusColor(phase.status)}"
                  >
                    {getStatusText(phase.status)}
                  </span>
                  <span class="phase-duration">{phase.duration}</span>
                </div>
              </div>

              <div class="phase-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    style="width: {phase.progress}%; background-color: {getStatusColor(
                      phase.status
                    )}"
                  />
                </div>
                <span class="progress-text">{phase.progress}%</span>
              </div>

              <p class="phase-description">{phase.description}</p>

              <div class="phase-details">
                <div class="features-section">
                  <h4>🎯 Fonctionnalités clés</h4>
                  <ul class="features-list">
                    {#each phase.features as feature}
                      <li>{feature}</li>
                    {/each}
                  </ul>
                </div>

                <div class="tech-section">
                  <h4>🔧 Technologies</h4>
                  <div class="tech-tags">
                    {#each phase.technologies as tech}
                      <span class="tech-tag">{tech}</span>
                    {/each}
                  </div>
                </div>

                <div class="deliverables-section">
                  <h4>📦 Livrables</h4>
                  <div class="deliverables-tags">
                    {#each phase.deliverables as deliverable}
                      <span class="deliverable-tag">{deliverable}</span>
                    {/each}
                  </div>
                </div>
              </div>

              {#if phase.status === "completed"}
                <div class="phase-actions">
                  <a href="/demo" class="btn btn-success"> Voir les démos </a>
                  <button class="btn btn-outline"> Détails techniques </button>
                </div>
              {:else if phase.status === "current"}
                <div class="phase-actions">
                  <a href="/demo" class="btn btn-primary">
                    Tester les fonctionnalités
                  </a>
                  <button class="btn btn-outline">
                    Suivre le développement
                  </button>
                </div>
              {:else}
                <div class="phase-actions">
                  <button class="btn btn-secondary" disabled>
                    Planification en cours
                  </button>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>

  <section class="roadmap-insights">
    <div class="container">
      <h2>💡 Approche & Méthodologie</h2>

      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-icon">🏗️</div>
          <h3>Architecture Progressive</h3>
          <p>
            Chaque phase construit sur les fondations de la précédente,
            garantissant une architecture solide et évolutive.
          </p>
        </div>

        <div class="insight-card">
          <div class="insight-icon">🧪</div>
          <h3>Développement Piloté par les Tests</h3>
          <p>
            113 tests automatisés garantissent la fiabilité et facilitent les
            évolutions futures du code.
          </p>
        </div>

        <div class="insight-card">
          <div class="insight-icon">🔒</div>
          <h3>Sécurité by Design</h3>
          <p>
            Sanitisation XSS, authentification sécurisée et validation stricte
            des données à tous les niveaux.
          </p>
        </div>

        <div class="insight-card">
          <div class="insight-icon">⚡</div>
          <h3>Performance Optimisée</h3>
          <p>
            Cache intelligent, lazy loading et optimisations bundle pour une
            expérience utilisateur fluide.
          </p>
        </div>
      </div>
    </div>
  </section>

  <footer class="roadmap-footer">
    <div class="container">
      <div class="footer-content">
        <h3>🚀 État Actuel du Projet</h3>
        <p>
          <strong>Phase 3 bientôt terminée !</strong> Le système de gestion de contenu
          avec Markdown est opérationnel à 95%. Prochaine étape : les outils pédagogiques
          avancés de la Phase 4.
        </p>

        <div class="footer-actions">
          <a href="/demo" class="btn btn-primary"> Essayer les démos </a>
          <a href="/tests" class="btn btn-outline"> Voir les tests </a>
          <a href="/" class="btn btn-outline"> Retour accueil </a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .roadmap-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .roadmap-header {
    padding: 5rem 0;
    color: white;
    text-align: center;
  }

  .header-content {
    opacity: 0;
    transform: translateY(2rem);
    transition: all 0.8s ease;
  }

  .header-content.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .icon {
    font-size: 3rem;
    margin-right: 1rem;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .header-description {
    font-size: 1.3rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.15);
    padding: 1.5rem;
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .roadmap-content {
    background: white;
    padding: 5rem 0;
  }

  .phases-timeline {
    position: relative;
  }

  .phase-card {
    display: flex;
    margin-bottom: 4rem;
    opacity: 0;
    transform: translateX(-2rem);
    transition: all 0.6s ease;
  }

  .phase-card.mounted {
    opacity: 1;
    transform: translateX(0);
  }

  .phase-timeline-marker {
    position: relative;
    margin-right: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .timeline-dot {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 2;
  }

  .timeline-line {
    width: 2px;
    height: 100%;
    background: #e9ecef;
    margin-top: 1rem;
    min-height: 200px;
  }

  .phase-content {
    flex: 1;
    background: white;
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
  }

  .phase-card:hover .phase-content {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .phase-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .phase-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
  }

  .phase-subtitle {
    font-size: 1.2rem;
    font-weight: 500;
    color: #6c757d;
    margin: 0.25rem 0 0 0;
  }

  .phase-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 1.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .phase-duration {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
  }

  .phase-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
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
    transition: width 0.3s ease;
    border-radius: 0.25rem;
  }

  .progress-text {
    font-weight: 600;
    color: #495057;
    min-width: 3rem;
  }

  .phase-description {
    font-size: 1.1rem;
    color: #495057;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .phase-details {
    margin-bottom: 2rem;
  }

  .features-section,
  .tech-section,
  .deliverables-section {
    margin-bottom: 2rem;
  }

  .features-section h4,
  .tech-section h4,
  .deliverables-section h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #495057;
    margin: 0 0 1rem 0;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.5rem;
  }

  .features-list li {
    padding: 0.5rem 0;
    color: #495057;
    font-size: 0.95rem;
    position: relative;
    padding-left: 1.5rem;
  }

  .features-list li::before {
    content: "▸";
    position: absolute;
    left: 0;
    color: #007bff;
    font-weight: bold;
  }

  .tech-tags,
  .deliverables-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech-tag {
    background: #e7f3ff;
    color: #0066cc;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .deliverable-tag {
    background: #f0f9ff;
    color: #0369a1;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid #e0f2fe;
  }

  .phase-actions {
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
    border: none;
    font-size: 0.95rem;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  .btn-success {
    background: #28a745;
    color: white;
  }

  .btn-success:hover {
    background: #1e7e34;
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

  .roadmap-insights {
    background: #f8f9fa;
    padding: 5rem 0;
  }

  .roadmap-insights h2 {
    text-align: center;
    margin-bottom: 3rem;
    color: #2c3e50;
    font-size: 2.5rem;
  }

  .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .insight-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
  }

  .insight-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .insight-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .insight-card h3 {
    font-size: 1.3rem;
    color: #2c3e50;
    margin: 0 0 1rem 0;
  }

  .insight-card p {
    color: #6c757d;
    line-height: 1.6;
    margin: 0;
  }

  .roadmap-footer {
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
      font-size: 2.5rem;
    }

    .icon {
      font-size: 2rem;
    }

    .header-description {
      font-size: 1.1rem;
    }

    .stats-overview {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .phase-card {
      flex-direction: column;
    }

    .phase-timeline-marker {
      margin-right: 0;
      margin-bottom: 1rem;
      flex-direction: row;
      justify-content: center;
    }

    .timeline-line {
      display: none;
    }

    .phase-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .phase-status {
      align-items: flex-start;
    }

    .features-list {
      grid-template-columns: 1fr;
    }

    .phase-actions {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }

    .insights-grid {
      grid-template-columns: 1fr;
    }

    .footer-actions {
      flex-direction: column;
    }
  }
</style>
