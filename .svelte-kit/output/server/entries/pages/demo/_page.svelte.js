import { c as create_ssr_component, a as each, e as escape, b as add_attribute } from "../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".demo-hub.svelte-1b5t3qa.svelte-1b5t3qa{min-height:100vh;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%)}.container.svelte-1b5t3qa.svelte-1b5t3qa{max-width:1200px;margin:0 auto;padding:0 2rem}.hero-section.svelte-1b5t3qa.svelte-1b5t3qa{padding:5rem 0;text-align:center;color:white}.hero-content.svelte-1b5t3qa.svelte-1b5t3qa{opacity:0;transform:translateY(2rem);transition:all 0.8s ease}.hero-content.mounted.svelte-1b5t3qa.svelte-1b5t3qa{opacity:1;transform:translateY(0)}.phase-badge.svelte-1b5t3qa.svelte-1b5t3qa{background:rgba(255, 255, 255, 0.2);padding:0.5rem 1rem;border-radius:2rem;font-size:1rem;font-weight:600;margin-right:1rem;backdrop-filter:blur(10px)}h1.svelte-1b5t3qa.svelte-1b5t3qa{font-size:3rem;font-weight:700;margin-bottom:1.5rem;line-height:1.2}.hero-description.svelte-1b5t3qa.svelte-1b5t3qa{font-size:1.3rem;margin-bottom:3rem;opacity:0.95;max-width:800px;margin-left:auto;margin-right:auto;line-height:1.6}.hero-stats.svelte-1b5t3qa.svelte-1b5t3qa{display:flex;justify-content:center;gap:3rem;flex-wrap:wrap}.stat-item.svelte-1b5t3qa.svelte-1b5t3qa{text-align:center}.stat-number.svelte-1b5t3qa.svelte-1b5t3qa{display:block;font-size:2.5rem;font-weight:700;line-height:1}.stat-label.svelte-1b5t3qa.svelte-1b5t3qa{font-size:0.9rem;opacity:0.9;text-transform:uppercase;letter-spacing:0.5px}.demo-grid-section.svelte-1b5t3qa.svelte-1b5t3qa{background:white;padding:5rem 0}.demo-grid-section.svelte-1b5t3qa h2.svelte-1b5t3qa{text-align:center;margin-bottom:3rem;color:#2c3e50;font-size:2.5rem}.demos-grid.svelte-1b5t3qa.svelte-1b5t3qa{display:grid;grid-template-columns:repeat(auto-fit, minmax(350px, 1fr));gap:2rem}.demo-card.svelte-1b5t3qa.svelte-1b5t3qa{background:white;border-radius:1rem;box-shadow:0 4px 6px rgba(0, 0, 0, 0.05);border:1px solid #e9ecef;padding:2rem;transition:all 0.3s ease;opacity:0;transform:translateY(2rem)}.demo-card.mounted.svelte-1b5t3qa.svelte-1b5t3qa{opacity:1;transform:translateY(0)}.demo-card.svelte-1b5t3qa.svelte-1b5t3qa:hover{transform:translateY(-4px);box-shadow:0 8px 25px rgba(0, 0, 0, 0.1)}.demo-header.svelte-1b5t3qa.svelte-1b5t3qa{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}.demo-icon.svelte-1b5t3qa.svelte-1b5t3qa{font-size:2.5rem}.demo-status.svelte-1b5t3qa.svelte-1b5t3qa{padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.875rem;font-weight:600}.demo-status.ready.svelte-1b5t3qa.svelte-1b5t3qa{background:#d4edda;color:#155724}.demo-status.in-progress.svelte-1b5t3qa.svelte-1b5t3qa{background:#fff3cd;color:#856404}.demo-content.svelte-1b5t3qa h3.svelte-1b5t3qa{margin:0 0 1rem 0;color:#2c3e50;font-size:1.3rem}.demo-description.svelte-1b5t3qa.svelte-1b5t3qa{color:#6c757d;margin-bottom:1.5rem;line-height:1.5}.demo-features.svelte-1b5t3qa.svelte-1b5t3qa{list-style:none;padding:0;margin:0 0 2rem 0}.demo-features.svelte-1b5t3qa li.svelte-1b5t3qa{padding:0.25rem 0;color:#495057;font-size:0.9rem;position:relative;padding-left:1.5rem}.demo-features.svelte-1b5t3qa li.svelte-1b5t3qa::before{content:'▸';position:absolute;left:0;color:#007bff;font-weight:bold}.demo-actions.svelte-1b5t3qa.svelte-1b5t3qa{display:flex;gap:1rem;flex-wrap:wrap}.btn.svelte-1b5t3qa.svelte-1b5t3qa{padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;text-decoration:none;cursor:pointer;transition:all 0.15s ease;flex:1;text-align:center;border:none}.btn-primary.svelte-1b5t3qa.svelte-1b5t3qa{background:#007bff;color:white}.btn-primary.svelte-1b5t3qa.svelte-1b5t3qa:hover{background:#0056b3}.btn-secondary.svelte-1b5t3qa.svelte-1b5t3qa{background:#6c757d;color:white}.btn-outline.svelte-1b5t3qa.svelte-1b5t3qa{background:transparent;border:1px solid #007bff;color:#007bff}.btn-outline.svelte-1b5t3qa.svelte-1b5t3qa:hover{background:#007bff;color:white}.btn.svelte-1b5t3qa.svelte-1b5t3qa:disabled{opacity:0.6;cursor:not-allowed}.technical-section.svelte-1b5t3qa.svelte-1b5t3qa{background:#f8f9fa;padding:5rem 0}.tech-overview.svelte-1b5t3qa h2.svelte-1b5t3qa{text-align:center;margin-bottom:3rem;color:#2c3e50;font-size:2.5rem}.tech-grid.svelte-1b5t3qa.svelte-1b5t3qa{display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:2rem}.tech-category.svelte-1b5t3qa.svelte-1b5t3qa{background:white;padding:2rem;border-radius:0.75rem;border:1px solid #e9ecef}.tech-category.svelte-1b5t3qa h3.svelte-1b5t3qa{margin:0 0 1.5rem 0;color:#495057;font-size:1.2rem}.tech-category.svelte-1b5t3qa ul.svelte-1b5t3qa{list-style:none;padding:0;margin:0}.tech-category.svelte-1b5t3qa li.svelte-1b5t3qa{padding:0.5rem 0;border-bottom:1px solid #f8f9fa;font-size:0.9rem;line-height:1.4}.tech-category.svelte-1b5t3qa li.svelte-1b5t3qa:last-child{border-bottom:none}.progress-section.svelte-1b5t3qa.svelte-1b5t3qa{background:white;padding:5rem 0}.progress-section.svelte-1b5t3qa h2.svelte-1b5t3qa{text-align:center;margin-bottom:3rem;color:#2c3e50;font-size:2.5rem}.progress-overview.svelte-1b5t3qa.svelte-1b5t3qa{max-width:800px;margin:0 auto}.progress-item.svelte-1b5t3qa.svelte-1b5t3qa{margin-bottom:2rem;padding:1.5rem;background:#f8f9fa;border-radius:0.75rem;border:1px solid #e9ecef}.progress-header.svelte-1b5t3qa.svelte-1b5t3qa{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.progress-header.svelte-1b5t3qa h3.svelte-1b5t3qa{margin:0;color:#495057;font-size:1.1rem}.progress-percentage.svelte-1b5t3qa.svelte-1b5t3qa{font-weight:700;color:#28a745}.progress-bar.svelte-1b5t3qa.svelte-1b5t3qa{height:0.5rem;background:#e9ecef;border-radius:0.25rem;overflow:hidden;margin-bottom:0.5rem}.progress-fill.svelte-1b5t3qa.svelte-1b5t3qa{height:100%;background:linear-gradient(90deg, #28a745, #20c997);transition:width 0.3s ease}.progress-item.svelte-1b5t3qa p.svelte-1b5t3qa{margin:0;font-size:0.9rem;color:#6c757d}.demo-footer.svelte-1b5t3qa.svelte-1b5t3qa{background:#2c3e50;color:white;padding:3rem 0}.footer-content.svelte-1b5t3qa.svelte-1b5t3qa{text-align:center}.footer-content.svelte-1b5t3qa h3.svelte-1b5t3qa{margin:0 0 1rem 0;font-size:1.5rem}.footer-content.svelte-1b5t3qa p.svelte-1b5t3qa{margin:0 0 2rem 0;font-size:1.1rem;opacity:0.9;line-height:1.6}.footer-actions.svelte-1b5t3qa.svelte-1b5t3qa{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap}@media(max-width: 768px){.container.svelte-1b5t3qa.svelte-1b5t3qa{padding:0 1rem}h1.svelte-1b5t3qa.svelte-1b5t3qa{font-size:2rem}.hero-description.svelte-1b5t3qa.svelte-1b5t3qa{font-size:1.1rem}.hero-stats.svelte-1b5t3qa.svelte-1b5t3qa{gap:2rem}.demos-grid.svelte-1b5t3qa.svelte-1b5t3qa{grid-template-columns:1fr}.demo-actions.svelte-1b5t3qa.svelte-1b5t3qa{flex-direction:column}.tech-grid.svelte-1b5t3qa.svelte-1b5t3qa{grid-template-columns:1fr}.progress-header.svelte-1b5t3qa.svelte-1b5t3qa{flex-direction:column;align-items:flex-start;gap:0.5rem}.footer-actions.svelte-1b5t3qa.svelte-1b5t3qa{flex-direction:column}.btn.svelte-1b5t3qa.svelte-1b5t3qa{width:100%}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const demoFeatures = [
    {
      id: "markdown",
      title: "Système de Contenu Markdown",
      description: "Rendu de contenu éducatif avec sanitisation XSS, coloration syntaxique et table des matières automatique",
      icon: "📝",
      path: "/demo/markdown",
      features: [
        "Parsing Markdown sécurisé",
        "Coloration syntaxique automatique",
        "Table des matières interactive",
        "Support des tableaux et équations",
        "Cache intelligent des rendus"
      ],
      status: "ready"
    },
    {
      id: "exercise",
      title: "Exercices Interactifs",
      description: "QCM intelligents avec feedback en temps réel, progression visuelle et évaluation automatique",
      icon: "🎯",
      path: "/demo/exercise",
      features: [
        "Questions à choix multiples",
        "Validation en temps réel",
        "Feedback pédagogique",
        "Calcul automatique du score",
        "Navigation intuitive"
      ],
      status: "ready"
    },
    {
      id: "content-management",
      title: "Gestion de Contenu",
      description: "Architecture complète pour la création, organisation et diffusion de contenu pédagogique",
      icon: "📚",
      path: "/content",
      features: [
        "Hiérarchie Matières → Niveaux → Compétences",
        "Types de contenu flexibles",
        "Métadonnées enrichies",
        "Validation Zod intégrée",
        "Store réactif Svelte"
      ],
      status: "ready"
    },
    {
      id: "components",
      title: "Composants Réutilisables",
      description: "Bibliothèque de composants UI optimisés pour l'apprentissage et l'accessibilité",
      icon: "🧩",
      path: "/demo/components",
      features: [
        "MarkdownRenderer avancé",
        "QCMCard interactive",
        "EmailAuth sécurisé",
        "AuthComplete élégant",
        "Design system cohérent"
      ],
      status: "in-progress"
    }
  ];
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-8tueca_START -->${$$result.title = `<title>Phase 3 - Démonstrations - FunLearning</title>`, ""}<meta name="description" content="Découvrez les fonctionnalités de la Phase 3 : système de contenu Markdown, exercices interactifs et composants avancés"><!-- HEAD_svelte-8tueca_END -->`, ""} <div class="demo-hub svelte-1b5t3qa"><header class="hero-section svelte-1b5t3qa"><div class="container svelte-1b5t3qa"><div class="${["hero-content svelte-1b5t3qa", ""].join(" ").trim()}" data-svelte-h="svelte-24z4v5"><h1 class="svelte-1b5t3qa"><span class="phase-badge svelte-1b5t3qa">Phase 3</span>
          Content Management &amp; Markdown</h1> <p class="hero-description svelte-1b5t3qa">Système complet de gestion de contenu éducatif avec rendu Markdown sécurisé, 
          exercices interactifs et composants réutilisables.</p> <div class="hero-stats svelte-1b5t3qa"><div class="stat-item svelte-1b5t3qa"><span class="stat-number svelte-1b5t3qa">113</span> <span class="stat-label svelte-1b5t3qa">Tests passés</span></div> <div class="stat-item svelte-1b5t3qa"><span class="stat-number svelte-1b5t3qa">4</span> <span class="stat-label svelte-1b5t3qa">Fonctionnalités</span></div> <div class="stat-item svelte-1b5t3qa"><span class="stat-number svelte-1b5t3qa">95%</span> <span class="stat-label svelte-1b5t3qa">Couverture</span></div></div></div></div></header> <main class="demo-grid-section svelte-1b5t3qa"><div class="container svelte-1b5t3qa"><h2 class="svelte-1b5t3qa" data-svelte-h="svelte-17v3y9h">🚀 Fonctionnalités Disponibles</h2> <div class="demos-grid svelte-1b5t3qa">${each(demoFeatures, (demo, index) => {
    return `<div class="${["demo-card svelte-1b5t3qa", ""].join(" ").trim()}" style="${"animation-delay: " + escape(index * 0.1, true) + "s"}"><div class="demo-header svelte-1b5t3qa"><div class="demo-icon svelte-1b5t3qa">${escape(demo.icon)}</div> <div class="${"demo-status " + escape(demo.status, true) + " svelte-1b5t3qa"}">${escape(demo.status === "ready" ? "✅ Prêt" : "🚧 En cours")} </div></div> <div class="demo-content svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">${escape(demo.title)}</h3> <p class="demo-description svelte-1b5t3qa">${escape(demo.description)}</p> <ul class="demo-features svelte-1b5t3qa">${each(demo.features, (feature) => {
      return `<li class="svelte-1b5t3qa">${escape(feature)}</li>`;
    })} </ul></div> <div class="demo-actions svelte-1b5t3qa">${demo.status === "ready" ? `<a${add_attribute("href", demo.path, 0)} class="btn btn-primary svelte-1b5t3qa">Essayer la démo
                </a>` : `<button class="btn btn-secondary svelte-1b5t3qa" disabled data-svelte-h="svelte-3cnmp5">Bientôt disponible
                </button>`} <button class="btn btn-outline svelte-1b5t3qa" data-svelte-h="svelte-pin99y">Voir le code
              </button></div> </div>`;
  })}</div></div></main> <section class="technical-section svelte-1b5t3qa" data-svelte-h="svelte-qjasac"><div class="container svelte-1b5t3qa"><div class="tech-overview svelte-1b5t3qa"><h2 class="svelte-1b5t3qa">🔧 Architecture Technique</h2> <div class="tech-grid svelte-1b5t3qa"><div class="tech-category svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">📝 Contenu</h3> <ul class="svelte-1b5t3qa"><li class="svelte-1b5t3qa"><strong>marked.js</strong> - Parsing Markdown performant</li> <li class="svelte-1b5t3qa"><strong>DOMPurify</strong> - Sanitisation XSS sécurisée</li> <li class="svelte-1b5t3qa"><strong>highlight.js</strong> - Coloration syntaxique</li> <li class="svelte-1b5t3qa"><strong>marked-highlight</strong> - Intégration optimisée</li></ul></div> <div class="tech-category svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">🎯 Exercices</h3> <ul class="svelte-1b5t3qa"><li class="svelte-1b5t3qa"><strong>QCMCard</strong> - Composant question interactif</li> <li class="svelte-1b5t3qa"><strong>EventDispatcher</strong> - Communication composants</li> <li class="svelte-1b5t3qa"><strong>CSS Animations</strong> - Feedback visuel</li> <li class="svelte-1b5t3qa"><strong>State Management</strong> - Progression utilisateur</li></ul></div> <div class="tech-category svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">🔒 Sécurité</h3> <ul class="svelte-1b5t3qa"><li class="svelte-1b5t3qa"><strong>Zod Validation</strong> - Types sécurisés</li> <li class="svelte-1b5t3qa"><strong>XSS Protection</strong> - Sanitisation HTML</li> <li class="svelte-1b5t3qa"><strong>TypeScript</strong> - Typage strict</li> <li class="svelte-1b5t3qa"><strong>CSP Headers</strong> - Politique de contenu</li></ul></div> <div class="tech-category svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">⚡ Performance</h3> <ul class="svelte-1b5t3qa"><li class="svelte-1b5t3qa"><strong>Cache intelligent</strong> - Mise en cache HTML</li> <li class="svelte-1b5t3qa"><strong>Lazy loading</strong> - Chargement à la demande</li> <li class="svelte-1b5t3qa"><strong>Tree shaking</strong> - Bundle optimisé</li> <li class="svelte-1b5t3qa"><strong>SSR Support</strong> - Rendu côté serveur</li></ul></div></div></div></div></section> <section class="progress-section svelte-1b5t3qa" data-svelte-h="svelte-zv0gd7"><div class="container svelte-1b5t3qa"><h2 class="svelte-1b5t3qa">📊 Progression Phase 3</h2> <div class="progress-overview svelte-1b5t3qa"><div class="progress-item svelte-1b5t3qa"><div class="progress-header svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">Système de Contenu Markdown</h3> <span class="progress-percentage svelte-1b5t3qa">100%</span></div> <div class="progress-bar svelte-1b5t3qa"><div class="progress-fill svelte-1b5t3qa" style="width: 100%"></div></div> <p class="svelte-1b5t3qa">✅ Parsing, sanitisation, coloration syntaxique, cache</p></div> <div class="progress-item svelte-1b5t3qa"><div class="progress-header svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">Exercices Interactifs</h3> <span class="progress-percentage svelte-1b5t3qa">95%</span></div> <div class="progress-bar svelte-1b5t3qa"><div class="progress-fill svelte-1b5t3qa" style="width: 95%"></div></div> <p class="svelte-1b5t3qa">✅ QCM, validation, scoring, feedback - 🔄 Finalisation</p></div> <div class="progress-item svelte-1b5t3qa"><div class="progress-header svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">Composants UI</h3> <span class="progress-percentage svelte-1b5t3qa">90%</span></div> <div class="progress-bar svelte-1b5t3qa"><div class="progress-fill svelte-1b5t3qa" style="width: 90%"></div></div> <p class="svelte-1b5t3qa">✅ MarkdownRenderer, QCMCard, Auth - 🔄 Optimisations</p></div> <div class="progress-item svelte-1b5t3qa"><div class="progress-header svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">Tests &amp; Validation</h3> <span class="progress-percentage svelte-1b5t3qa">95%</span></div> <div class="progress-bar svelte-1b5t3qa"><div class="progress-fill svelte-1b5t3qa" style="width: 95%"></div></div> <p class="svelte-1b5t3qa">✅ 113/119 tests passés - Excellent taux de réussite</p></div></div></div></section> <footer class="demo-footer svelte-1b5t3qa" data-svelte-h="svelte-y0fete"><div class="container svelte-1b5t3qa"><div class="footer-content svelte-1b5t3qa"><h3 class="svelte-1b5t3qa">🎯 Prochaines Étapes</h3> <p class="svelte-1b5t3qa">La Phase 3 Content Management est pratiquement terminée avec un excellent taux de réussite. 
          Prochaine étape : <strong>Phase 4 - Pédagogie Avancée</strong> avec pré-évaluation et métacognition.</p> <div class="footer-actions svelte-1b5t3qa"><a href="/roadmap" class="btn btn-primary svelte-1b5t3qa">Voir la Roadmap</a> <a href="/tests" class="btn btn-outline svelte-1b5t3qa">Résultats des Tests</a></div></div></div></footer> </div>`;
});
export {
  Page as default
};
