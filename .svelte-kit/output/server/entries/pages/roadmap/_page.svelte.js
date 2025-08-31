import { c as create_ssr_component, e as escape, a as each } from "../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".roadmap-page.svelte-1vyn4vv.svelte-1vyn4vv{min-height:100vh;background:linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)}.container.svelte-1vyn4vv.svelte-1vyn4vv{max-width:1200px;margin:0 auto;padding:0 2rem}.roadmap-header.svelte-1vyn4vv.svelte-1vyn4vv{padding:5rem 0;color:white;text-align:center}.header-content.svelte-1vyn4vv.svelte-1vyn4vv{opacity:0;transform:translateY(2rem);transition:all 0.8s ease}.header-content.mounted.svelte-1vyn4vv.svelte-1vyn4vv{opacity:1;transform:translateY(0)}.icon.svelte-1vyn4vv.svelte-1vyn4vv{font-size:3rem;margin-right:1rem}h1.svelte-1vyn4vv.svelte-1vyn4vv{font-size:3.5rem;font-weight:700;margin-bottom:1.5rem;line-height:1.2}.header-description.svelte-1vyn4vv.svelte-1vyn4vv{font-size:1.3rem;margin-bottom:3rem;opacity:0.95;max-width:800px;margin-left:auto;margin-right:auto;line-height:1.6}.stats-overview.svelte-1vyn4vv.svelte-1vyn4vv{display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:2rem;max-width:600px;margin:0 auto}.stat-card.svelte-1vyn4vv.svelte-1vyn4vv{background:rgba(255, 255, 255, 0.15);padding:1.5rem;border-radius:1rem;backdrop-filter:blur(10px);border:1px solid rgba(255, 255, 255, 0.2)}.stat-number.svelte-1vyn4vv.svelte-1vyn4vv{font-size:2rem;font-weight:700;line-height:1;margin-bottom:0.5rem}.stat-label.svelte-1vyn4vv.svelte-1vyn4vv{font-size:0.9rem;opacity:0.9;text-transform:uppercase;letter-spacing:0.5px}.roadmap-content.svelte-1vyn4vv.svelte-1vyn4vv{background:white;padding:5rem 0}.phases-timeline.svelte-1vyn4vv.svelte-1vyn4vv{position:relative}.phase-card.svelte-1vyn4vv.svelte-1vyn4vv{display:flex;margin-bottom:4rem;opacity:0;transform:translateX(-2rem);transition:all 0.6s ease}.phase-card.mounted.svelte-1vyn4vv.svelte-1vyn4vv{opacity:1;transform:translateX(0)}.phase-timeline-marker.svelte-1vyn4vv.svelte-1vyn4vv{position:relative;margin-right:3rem;display:flex;flex-direction:column;align-items:center}.timeline-dot.svelte-1vyn4vv.svelte-1vyn4vv{width:1.5rem;height:1.5rem;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0, 0, 0, 0.1);z-index:2}.timeline-line.svelte-1vyn4vv.svelte-1vyn4vv{width:2px;height:100%;background:#e9ecef;margin-top:1rem;min-height:200px}.phase-content.svelte-1vyn4vv.svelte-1vyn4vv{flex:1;background:white;border-radius:1rem;padding:2.5rem;box-shadow:0 4px 6px rgba(0, 0, 0, 0.05);border:1px solid #e9ecef;transition:all 0.3s ease}.phase-card.svelte-1vyn4vv:hover .phase-content.svelte-1vyn4vv{transform:translateY(-2px);box-shadow:0 8px 25px rgba(0, 0, 0, 0.1)}.phase-header.svelte-1vyn4vv.svelte-1vyn4vv{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem}.phase-title.svelte-1vyn4vv.svelte-1vyn4vv{font-size:1.8rem;font-weight:700;color:#2c3e50;margin:0}.phase-subtitle.svelte-1vyn4vv.svelte-1vyn4vv{font-size:1.2rem;font-weight:500;color:#6c757d;margin:0.25rem 0 0 0}.phase-status.svelte-1vyn4vv.svelte-1vyn4vv{display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem}.status-badge.svelte-1vyn4vv.svelte-1vyn4vv{padding:0.5rem 1rem;border-radius:1.5rem;color:white;font-size:0.875rem;font-weight:600}.phase-duration.svelte-1vyn4vv.svelte-1vyn4vv{font-size:0.875rem;color:#6c757d;font-weight:500}.phase-progress.svelte-1vyn4vv.svelte-1vyn4vv{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}.progress-bar.svelte-1vyn4vv.svelte-1vyn4vv{flex:1;height:0.5rem;background:#e9ecef;border-radius:0.25rem;overflow:hidden}.progress-fill.svelte-1vyn4vv.svelte-1vyn4vv{height:100%;transition:width 0.3s ease;border-radius:0.25rem}.progress-text.svelte-1vyn4vv.svelte-1vyn4vv{font-weight:600;color:#495057;min-width:3rem}.phase-description.svelte-1vyn4vv.svelte-1vyn4vv{font-size:1.1rem;color:#495057;margin-bottom:2rem;line-height:1.6}.phase-details.svelte-1vyn4vv.svelte-1vyn4vv{margin-bottom:2rem}.features-section.svelte-1vyn4vv.svelte-1vyn4vv,.tech-section.svelte-1vyn4vv.svelte-1vyn4vv,.deliverables-section.svelte-1vyn4vv.svelte-1vyn4vv{margin-bottom:2rem}.features-section.svelte-1vyn4vv h4.svelte-1vyn4vv,.tech-section.svelte-1vyn4vv h4.svelte-1vyn4vv,.deliverables-section.svelte-1vyn4vv h4.svelte-1vyn4vv{font-size:1rem;font-weight:600;color:#495057;margin:0 0 1rem 0}.features-list.svelte-1vyn4vv.svelte-1vyn4vv{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:0.5rem}.features-list.svelte-1vyn4vv li.svelte-1vyn4vv{padding:0.5rem 0;color:#495057;font-size:0.95rem;position:relative;padding-left:1.5rem}.features-list.svelte-1vyn4vv li.svelte-1vyn4vv::before{content:'▸';position:absolute;left:0;color:#007bff;font-weight:bold}.tech-tags.svelte-1vyn4vv.svelte-1vyn4vv,.deliverables-tags.svelte-1vyn4vv.svelte-1vyn4vv{display:flex;flex-wrap:wrap;gap:0.5rem}.tech-tag.svelte-1vyn4vv.svelte-1vyn4vv{background:#e7f3ff;color:#0066cc;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.875rem;font-weight:500}.deliverable-tag.svelte-1vyn4vv.svelte-1vyn4vv{background:#f0f9ff;color:#0369a1;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.875rem;font-weight:500;border:1px solid #e0f2fe}.phase-actions.svelte-1vyn4vv.svelte-1vyn4vv{display:flex;gap:1rem;flex-wrap:wrap}.btn.svelte-1vyn4vv.svelte-1vyn4vv{padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;text-decoration:none;cursor:pointer;transition:all 0.15s ease;border:none;font-size:0.95rem}.btn-primary.svelte-1vyn4vv.svelte-1vyn4vv{background:#007bff;color:white}.btn-primary.svelte-1vyn4vv.svelte-1vyn4vv:hover{background:#0056b3}.btn-success.svelte-1vyn4vv.svelte-1vyn4vv{background:#28a745;color:white}.btn-success.svelte-1vyn4vv.svelte-1vyn4vv:hover{background:#1e7e34}.btn-secondary.svelte-1vyn4vv.svelte-1vyn4vv{background:#6c757d;color:white}.btn-outline.svelte-1vyn4vv.svelte-1vyn4vv{background:transparent;border:1px solid #007bff;color:#007bff}.btn-outline.svelte-1vyn4vv.svelte-1vyn4vv:hover{background:#007bff;color:white}.btn.svelte-1vyn4vv.svelte-1vyn4vv:disabled{opacity:0.6;cursor:not-allowed}.roadmap-insights.svelte-1vyn4vv.svelte-1vyn4vv{background:#f8f9fa;padding:5rem 0}.roadmap-insights.svelte-1vyn4vv h2.svelte-1vyn4vv{text-align:center;margin-bottom:3rem;color:#2c3e50;font-size:2.5rem}.insights-grid.svelte-1vyn4vv.svelte-1vyn4vv{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:2rem}.insight-card.svelte-1vyn4vv.svelte-1vyn4vv{background:white;padding:2rem;border-radius:1rem;text-align:center;border:1px solid #e9ecef;transition:all 0.3s ease}.insight-card.svelte-1vyn4vv.svelte-1vyn4vv:hover{transform:translateY(-4px);box-shadow:0 8px 25px rgba(0, 0, 0, 0.1)}.insight-icon.svelte-1vyn4vv.svelte-1vyn4vv{font-size:3rem;margin-bottom:1rem}.insight-card.svelte-1vyn4vv h3.svelte-1vyn4vv{font-size:1.3rem;color:#2c3e50;margin:0 0 1rem 0}.insight-card.svelte-1vyn4vv p.svelte-1vyn4vv{color:#6c757d;line-height:1.6;margin:0}.roadmap-footer.svelte-1vyn4vv.svelte-1vyn4vv{background:#2c3e50;color:white;padding:3rem 0}.footer-content.svelte-1vyn4vv.svelte-1vyn4vv{text-align:center}.footer-content.svelte-1vyn4vv h3.svelte-1vyn4vv{margin:0 0 1rem 0;font-size:1.5rem}.footer-content.svelte-1vyn4vv p.svelte-1vyn4vv{margin:0 0 2rem 0;font-size:1.1rem;opacity:0.9;line-height:1.6}.footer-actions.svelte-1vyn4vv.svelte-1vyn4vv{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap}@media(max-width: 768px){.container.svelte-1vyn4vv.svelte-1vyn4vv{padding:0 1rem}h1.svelte-1vyn4vv.svelte-1vyn4vv{font-size:2.5rem}.icon.svelte-1vyn4vv.svelte-1vyn4vv{font-size:2rem}.header-description.svelte-1vyn4vv.svelte-1vyn4vv{font-size:1.1rem}.stats-overview.svelte-1vyn4vv.svelte-1vyn4vv{grid-template-columns:repeat(2, 1fr);gap:1rem}.phase-card.svelte-1vyn4vv.svelte-1vyn4vv{flex-direction:column}.phase-timeline-marker.svelte-1vyn4vv.svelte-1vyn4vv{margin-right:0;margin-bottom:1rem;flex-direction:row;justify-content:center}.timeline-line.svelte-1vyn4vv.svelte-1vyn4vv{display:none}.phase-header.svelte-1vyn4vv.svelte-1vyn4vv{flex-direction:column;align-items:flex-start}.phase-status.svelte-1vyn4vv.svelte-1vyn4vv{align-items:flex-start}.features-list.svelte-1vyn4vv.svelte-1vyn4vv{grid-template-columns:1fr}.phase-actions.svelte-1vyn4vv.svelte-1vyn4vv{flex-direction:column}.btn.svelte-1vyn4vv.svelte-1vyn4vv{width:100%}.insights-grid.svelte-1vyn4vv.svelte-1vyn4vv{grid-template-columns:1fr}.footer-actions.svelte-1vyn4vv.svelte-1vyn4vv{flex-direction:column}}",
  map: null
};
function getStatusColor(status) {
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
function getStatusText(status) {
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
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
        "Configuration des outils de développement"
      ],
      technologies: ["SvelteKit", "TypeScript", "Vite", "Node.js"],
      deliverables: ["Architecture projet", "Configuration build", "Structure de base"]
    },
    {
      id: "phase-2",
      title: "Phase 2",
      subtitle: "Authentication & Firebase",
      status: "completed",
      progress: 100,
      description: "Système d'authentification complet avec Google OAuth et Email",
      duration: "Terminée",
      features: [
        "Authentification Google OAuth",
        "Authentification par Email/Mot de passe",
        "Gestion des états utilisateur",
        "Stores réactifs Svelte",
        "Protection des routes",
        "Interface utilisateur complète"
      ],
      technologies: ["Firebase Auth", "Google OAuth", "Svelte Stores", "CSS3"],
      deliverables: ["Composants Auth", "Stores utilisateur", "Pages authentification"]
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
        "Cache intelligent des rendus"
      ],
      technologies: ["marked.js", "DOMPurify", "highlight.js", "Zod"],
      deliverables: ["Système Markdown", "Composants exercices", "Pages démo"]
    },
    {
      id: "phase-4",
      title: "Phase 4",
      subtitle: "Pédagogie Avancée",
      status: "planned",
      progress: 0,
      description: "Outils pédagogiques avancés avec pré-évaluation et métacognition",
      duration: "À venir",
      features: [
        "Pré-évaluation des compétences",
        "Parcours adaptatifs personnalisés",
        "Outils de métacognition",
        "Feedback pédagogique intelligent",
        "Analytics d'apprentissage",
        "Recommandations automatiques"
      ],
      technologies: ["ML/AI Integration", "Analytics", "Adaptive Learning", "Data Viz"],
      deliverables: ["Moteur adaptatif", "Outils métacognition", "Dashboard analytics"]
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
        "Tests de charge et stress"
      ],
      technologies: ["Docker", "CI/CD", "Monitoring", "CDN", "Load Balancing"],
      deliverables: ["Build production", "Pipeline CI/CD", "Infrastructure"]
    }
  ];
  const currentStats = {
    totalTests: 119,
    passingTests: 113,
    coverage: 95,
    components: 12,
    features: 8,
    phases: 5
  };
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1s5gv47_START -->${$$result.title = `<title>Roadmap - FunLearning Project</title>`, ""}<meta name="description" content="Roadmap complète du projet FunLearning : de l'architecture aux fonctionnalités avancées"><!-- HEAD_svelte-1s5gv47_END -->`, ""} <div class="roadmap-page svelte-1vyn4vv"><header class="roadmap-header svelte-1vyn4vv"><div class="container svelte-1vyn4vv"><div class="${["header-content svelte-1vyn4vv", ""].join(" ").trim()}"><h1 class="svelte-1vyn4vv" data-svelte-h="svelte-139lpqo"><span class="icon svelte-1vyn4vv">🗺️</span>
          Roadmap FunLearning</h1> <p class="header-description svelte-1vyn4vv" data-svelte-h="svelte-17fk75h">Parcours de développement complet : de l&#39;infrastructure technique aux fonctionnalités 
          pédagogiques avancées, découvrez notre approche structurée et progressive.</p> <div class="stats-overview svelte-1vyn4vv"><div class="stat-card svelte-1vyn4vv"><div class="stat-number svelte-1vyn4vv">${escape(currentStats.passingTests)}/${escape(currentStats.totalTests)}</div> <div class="stat-label svelte-1vyn4vv" data-svelte-h="svelte-1qdcskl">Tests réussis</div></div> <div class="stat-card svelte-1vyn4vv"><div class="stat-number svelte-1vyn4vv">${escape(currentStats.coverage)}%</div> <div class="stat-label svelte-1vyn4vv" data-svelte-h="svelte-11dk6sm">Couverture</div></div> <div class="stat-card svelte-1vyn4vv"><div class="stat-number svelte-1vyn4vv">${escape(currentStats.components)}</div> <div class="stat-label svelte-1vyn4vv" data-svelte-h="svelte-1h3yj01">Composants</div></div> <div class="stat-card svelte-1vyn4vv"><div class="stat-number svelte-1vyn4vv">${escape(currentStats.features)}</div> <div class="stat-label svelte-1vyn4vv" data-svelte-h="svelte-1vuwuqk">Fonctionnalités</div></div></div></div></div></header> <main class="roadmap-content svelte-1vyn4vv"><div class="container svelte-1vyn4vv"><div class="phases-timeline svelte-1vyn4vv">${each(phases, (phase, index) => {
    return `<div class="${[
      "phase-card svelte-1vyn4vv",
      " " + (phase.status === "completed" ? "completed" : "") + " " + (phase.status === "current" ? "current" : "") + " " + (phase.status === "planned" ? "planned" : "")
    ].join(" ").trim()}" style="${"animation-delay: " + escape(index * 0.2, true) + "s"}"><div class="phase-timeline-marker svelte-1vyn4vv"><div class="timeline-dot svelte-1vyn4vv" style="${"background-color: " + escape(getStatusColor(phase.status), true)}"></div> ${index < phases.length - 1 ? `<div class="timeline-line svelte-1vyn4vv"></div>` : ``}</div> <div class="phase-content svelte-1vyn4vv"><div class="phase-header svelte-1vyn4vv"><div class="phase-title-section"><h2 class="phase-title svelte-1vyn4vv">${escape(phase.title)}</h2> <h3 class="phase-subtitle svelte-1vyn4vv">${escape(phase.subtitle)}</h3></div> <div class="phase-status svelte-1vyn4vv"><span class="status-badge svelte-1vyn4vv" style="${"background-color: " + escape(getStatusColor(phase.status), true)}">${escape(getStatusText(phase.status))}</span> <span class="phase-duration svelte-1vyn4vv">${escape(phase.duration)}</span> </div></div> <div class="phase-progress svelte-1vyn4vv"><div class="progress-bar svelte-1vyn4vv"><div class="progress-fill svelte-1vyn4vv" style="${"width: " + escape(phase.progress, true) + "%; background-color: " + escape(getStatusColor(phase.status), true)}"></div></div> <span class="progress-text svelte-1vyn4vv">${escape(phase.progress)}%</span></div> <p class="phase-description svelte-1vyn4vv">${escape(phase.description)}</p> <div class="phase-details svelte-1vyn4vv"><div class="features-section svelte-1vyn4vv"><h4 class="svelte-1vyn4vv" data-svelte-h="svelte-1mtjw1q">🎯 Fonctionnalités clés</h4> <ul class="features-list svelte-1vyn4vv">${each(phase.features, (feature) => {
      return `<li class="svelte-1vyn4vv">${escape(feature)}</li>`;
    })} </ul></div> <div class="tech-section svelte-1vyn4vv"><h4 class="svelte-1vyn4vv" data-svelte-h="svelte-woj8u0">🔧 Technologies</h4> <div class="tech-tags svelte-1vyn4vv">${each(phase.technologies, (tech) => {
      return `<span class="tech-tag svelte-1vyn4vv">${escape(tech)}</span>`;
    })} </div></div> <div class="deliverables-section svelte-1vyn4vv"><h4 class="svelte-1vyn4vv" data-svelte-h="svelte-6h264h">📦 Livrables</h4> <div class="deliverables-tags svelte-1vyn4vv">${each(phase.deliverables, (deliverable) => {
      return `<span class="deliverable-tag svelte-1vyn4vv">${escape(deliverable)}</span>`;
    })}</div> </div></div> ${phase.status === "completed" ? `<div class="phase-actions svelte-1vyn4vv" data-svelte-h="svelte-12nqwlq"><a href="/demo" class="btn btn-success svelte-1vyn4vv">Voir les démos</a> <button class="btn btn-outline svelte-1vyn4vv">Détails techniques</button> </div>` : `${phase.status === "current" ? `<div class="phase-actions svelte-1vyn4vv" data-svelte-h="svelte-16hdx0q"><a href="/demo" class="btn btn-primary svelte-1vyn4vv">Tester les fonctionnalités</a> <button class="btn btn-outline svelte-1vyn4vv">Suivre le développement</button> </div>` : `<div class="phase-actions svelte-1vyn4vv" data-svelte-h="svelte-1ipis03"><button class="btn btn-secondary svelte-1vyn4vv" disabled>Planification en cours</button> </div>`}`}</div> </div>`;
  })}</div></div></main> <section class="roadmap-insights svelte-1vyn4vv" data-svelte-h="svelte-1hipyta"><div class="container svelte-1vyn4vv"><h2 class="svelte-1vyn4vv">💡 Approche &amp; Méthodologie</h2> <div class="insights-grid svelte-1vyn4vv"><div class="insight-card svelte-1vyn4vv"><div class="insight-icon svelte-1vyn4vv">🏗️</div> <h3 class="svelte-1vyn4vv">Architecture Progressive</h3> <p class="svelte-1vyn4vv">Chaque phase construit sur les fondations de la précédente, 
            garantissant une architecture solide et évolutive.</p></div> <div class="insight-card svelte-1vyn4vv"><div class="insight-icon svelte-1vyn4vv">🧪</div> <h3 class="svelte-1vyn4vv">Développement Piloté par les Tests</h3> <p class="svelte-1vyn4vv">113 tests automatisés garantissent la fiabilité et facilitent 
            les évolutions futures du code.</p></div> <div class="insight-card svelte-1vyn4vv"><div class="insight-icon svelte-1vyn4vv">🔒</div> <h3 class="svelte-1vyn4vv">Sécurité by Design</h3> <p class="svelte-1vyn4vv">Sanitisation XSS, authentification sécurisée et validation 
            stricte des données à tous les niveaux.</p></div> <div class="insight-card svelte-1vyn4vv"><div class="insight-icon svelte-1vyn4vv">⚡</div> <h3 class="svelte-1vyn4vv">Performance Optimisée</h3> <p class="svelte-1vyn4vv">Cache intelligent, lazy loading et optimisations bundle 
            pour une expérience utilisateur fluide.</p></div></div></div></section> <footer class="roadmap-footer svelte-1vyn4vv" data-svelte-h="svelte-1gz9a8l"><div class="container svelte-1vyn4vv"><div class="footer-content svelte-1vyn4vv"><h3 class="svelte-1vyn4vv">🚀 État Actuel du Projet</h3> <p class="svelte-1vyn4vv"><strong>Phase 3 bientôt terminée !</strong> Le système de gestion de contenu avec Markdown 
          est opérationnel à 95%. Prochaine étape : les outils pédagogiques avancés de la Phase 4.</p> <div class="footer-actions svelte-1vyn4vv"><a href="/demo" class="btn btn-primary svelte-1vyn4vv">Essayer les démos</a> <a href="/tests" class="btn btn-outline svelte-1vyn4vv">Voir les tests</a> <a href="/" class="btn btn-outline svelte-1vyn4vv">Retour accueil</a></div></div></div></footer> </div>`;
});
export {
  Page as default
};
