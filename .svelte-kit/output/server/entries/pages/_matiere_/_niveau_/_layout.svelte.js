import { s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component, e as escape, v as validate_component } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import { B as Breadcrumbs } from "../../../../chunks/Breadcrumbs.js";
const NiveauHeader_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".niveau-header.svelte-1ce025r.svelte-1ce025r{background:linear-gradient(135deg, var(--matiere-color, #667eea) 0%, var(--matiere-color-dark, #764ba2) 100%);color:white;position:relative;overflow:hidden}.niveau-header.svelte-1ce025r.svelte-1ce025r::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),\r\n      radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);pointer-events:none}.header-main.svelte-1ce025r.svelte-1ce025r{position:relative;z-index:1;display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:start;margin-bottom:1.5rem}.niveau-identity.svelte-1ce025r.svelte-1ce025r{display:flex;align-items:flex-start;gap:1.5rem}.niveau-icon.svelte-1ce025r.svelte-1ce025r{font-size:4rem;filter:drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));flex-shrink:0}.niveau-info.svelte-1ce025r.svelte-1ce025r{display:flex;flex-direction:column;gap:0.75rem}.niveau-title.svelte-1ce025r.svelte-1ce025r{display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap}.niveau-title.svelte-1ce025r h1.svelte-1ce025r{font-size:2.5rem;font-weight:700;margin:0;text-shadow:0 2px 4px rgba(0, 0, 0, 0.3)}.matiere-name.svelte-1ce025r.svelte-1ce025r{font-size:1.25rem;color:rgba(255, 255, 255, 0.8);font-weight:500}.niveau-description.svelte-1ce025r.svelte-1ce025r{font-size:1.125rem;color:rgba(255, 255, 255, 0.9);margin:0;line-height:1.5;max-width:500px}.niveau-theme.svelte-1ce025r.svelte-1ce025r{display:flex;align-items:center;gap:0.5rem;font-size:0.975rem}.theme-label.svelte-1ce025r.svelte-1ce025r{color:rgba(255, 255, 255, 0.7)}.theme-value.svelte-1ce025r.svelte-1ce025r{color:rgba(255, 255, 255, 0.95);font-weight:600}.quick-stats.svelte-1ce025r.svelte-1ce025r{display:flex;gap:1rem;flex-direction:column}.stat-item.svelte-1ce025r.svelte-1ce025r{background:rgba(255, 255, 255, 0.15);backdrop-filter:blur(10px);border:1px solid rgba(255, 255, 255, 0.2);border-radius:0.75rem;padding:1rem;text-align:center;min-width:80px}.stat-number.svelte-1ce025r.svelte-1ce025r{font-size:1.5rem;font-weight:700;margin-bottom:0.25rem}.stat-label.svelte-1ce025r.svelte-1ce025r{font-size:0.75rem;color:rgba(255, 255, 255, 0.8);text-transform:uppercase;letter-spacing:0.05em}.progress-section.svelte-1ce025r.svelte-1ce025r{position:relative;z-index:1;background:rgba(255, 255, 255, 0.1);border-radius:0.75rem;padding:1rem;border:1px solid rgba(255, 255, 255, 0.2);margin-bottom:1.5rem}.progress-header.svelte-1ce025r.svelte-1ce025r{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem}.progress-title.svelte-1ce025r.svelte-1ce025r{font-size:0.925rem;color:rgba(255, 255, 255, 0.9);font-weight:500}.progress-percentage.svelte-1ce025r.svelte-1ce025r{font-weight:700;font-size:1rem}.progress-bar.svelte-1ce025r.svelte-1ce025r{height:0.75rem;background:rgba(255, 255, 255, 0.2);border-radius:0.375rem;overflow:hidden}.progress-fill.svelte-1ce025r.svelte-1ce025r{height:100%;background:linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 1) 100%);border-radius:0.375rem;transition:width 0.5s ease}.difficulty-overview.svelte-1ce025r.svelte-1ce025r{position:relative;z-index:1;background:rgba(255, 255, 255, 0.1);border-radius:0.75rem;padding:1rem;border:1px solid rgba(255, 255, 255, 0.2)}.difficulty-title.svelte-1ce025r.svelte-1ce025r{font-size:1rem;font-weight:600;margin-bottom:1rem;color:rgba(255, 255, 255, 0.9)}.difficulty-grid.svelte-1ce025r.svelte-1ce025r{display:grid;grid-template-columns:repeat(3, 1fr);gap:0.75rem}.difficulty-item.svelte-1ce025r.svelte-1ce025r{display:flex;align-items:center;gap:0.75rem;background:rgba(255, 255, 255, 0.1);border-radius:0.5rem;padding:0.75rem;border:1px solid rgba(255, 255, 255, 0.2)}.difficulty-icon.svelte-1ce025r.svelte-1ce025r{font-size:1.25rem}.difficulty-count.svelte-1ce025r.svelte-1ce025r{font-size:1.125rem;font-weight:700}.difficulty-label.svelte-1ce025r.svelte-1ce025r{font-size:0.8rem;color:rgba(255, 255, 255, 0.8);text-transform:uppercase;letter-spacing:0.05em}@media(max-width: 768px){.header-main.svelte-1ce025r.svelte-1ce025r{grid-template-columns:1fr;gap:1.5rem}.niveau-identity.svelte-1ce025r.svelte-1ce025r{flex-direction:column;gap:1rem;text-align:center}.niveau-icon.svelte-1ce025r.svelte-1ce025r{font-size:3rem}.niveau-title.svelte-1ce025r h1.svelte-1ce025r{font-size:2rem}.niveau-description.svelte-1ce025r.svelte-1ce025r{font-size:1rem;max-width:none}.quick-stats.svelte-1ce025r.svelte-1ce025r{flex-direction:row;justify-content:center}.difficulty-grid.svelte-1ce025r.svelte-1ce025r{grid-template-columns:1fr;gap:0.5rem}}@media(max-width: 480px){.niveau-title.svelte-1ce025r.svelte-1ce025r{flex-direction:column;gap:0.5rem}.quick-stats.svelte-1ce025r.svelte-1ce025r{flex-direction:column;align-items:center}}",
  map: null
};
function getDifficultyDistribution(comps) {
  const distribution = { facile: 0, moyen: 0, difficile: 0 };
  comps.forEach((comp) => {
    if (comp.difficulty && distribution.hasOwnProperty(comp.difficulty)) {
      distribution[comp.difficulty]++;
    }
  });
  return distribution;
}
const NiveauHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let config;
  let matiereLabel;
  let levelStats;
  let { matiere } = $$props;
  let { niveau } = $$props;
  let { competences = [] } = $$props;
  let { stats = {} } = $$props;
  const niveauConfig = {
    "6eme": {
      title: "6ème",
      icon: "🌱",
      description: "Première année du collège - Découverte et bases fondamentales",
      theme: "Adaptation et découverte"
    },
    "5eme": {
      title: "5ème",
      icon: "🌿",
      description: "Approfondissement des acquis et nouvelles notions",
      theme: "Consolidation et ouverture"
    },
    "4eme": {
      title: "4ème",
      icon: "🌳",
      description: "Renforcement des compétences et préparation",
      theme: "Maîtrise et perfectionnement"
    },
    "3eme": {
      title: "3ème",
      icon: "🎯",
      description: "Dernière année du collège - Préparation au brevet",
      theme: "Excellence et préparation"
    }
  };
  const matiereLabels = {
    "mathematiques": "Mathématiques",
    "francais": "Français",
    "anglais": "Anglais",
    "histoire": "Histoire",
    "geographie": "Géographie",
    "sciences": "Sciences"
  };
  if ($$props.matiere === void 0 && $$bindings.matiere && matiere !== void 0)
    $$bindings.matiere(matiere);
  if ($$props.niveau === void 0 && $$bindings.niveau && niveau !== void 0)
    $$bindings.niveau(niveau);
  if ($$props.competences === void 0 && $$bindings.competences && competences !== void 0)
    $$bindings.competences(competences);
  if ($$props.stats === void 0 && $$bindings.stats && stats !== void 0)
    $$bindings.stats(stats);
  $$result.css.add(css$1);
  config = niveauConfig[niveau] || {
    title: niveau,
    icon: "📚",
    description: "Niveau non configuré",
    theme: "Apprentissage"
  };
  matiereLabel = matiereLabels[matiere] || matiere;
  levelStats = {
    competences: competences.length,
    totalCours: competences.reduce((sum, comp) => sum + (comp.coursCount || 0), 0),
    progression: Math.round(stats.niveauProgression || 0),
    difficultyDistribution: getDifficultyDistribution(competences)
  };
  return `<header class="niveau-header svelte-1ce025r"><div class="container mx-auto px-4 py-6"> <div class="header-main svelte-1ce025r"><div class="niveau-identity svelte-1ce025r"><div class="niveau-icon svelte-1ce025r">${escape(config.icon)}</div> <div class="niveau-info svelte-1ce025r"><div class="niveau-title svelte-1ce025r"><h1 class="svelte-1ce025r">${escape(config.title)}</h1> <span class="matiere-name svelte-1ce025r">${escape(matiereLabel)}</span></div> <p class="niveau-description svelte-1ce025r">${escape(config.description)}</p> <div class="niveau-theme svelte-1ce025r"><span class="theme-label svelte-1ce025r" data-svelte-h="svelte-1j218uu">🎯 Thème :</span> <span class="theme-value svelte-1ce025r">${escape(config.theme)}</span></div></div></div>  <div class="quick-stats svelte-1ce025r"><div class="stat-item svelte-1ce025r"><div class="stat-number svelte-1ce025r">${escape(levelStats.competences)}</div> <div class="stat-label svelte-1ce025r" data-svelte-h="svelte-z3rt7m">Compétences</div></div> <div class="stat-item svelte-1ce025r"><div class="stat-number svelte-1ce025r">${escape(levelStats.totalCours)}</div> <div class="stat-label svelte-1ce025r" data-svelte-h="svelte-1s7tnqy">Cours</div></div> <div class="stat-item svelte-1ce025r"><div class="stat-number svelte-1ce025r">${escape(levelStats.progression)}%</div> <div class="stat-label svelte-1ce025r" data-svelte-h="svelte-xnfvel">Progression</div></div></div></div>  ${levelStats.progression > 0 ? `<div class="progress-section svelte-1ce025r"><div class="progress-header svelte-1ce025r"><span class="progress-title svelte-1ce025r" data-svelte-h="svelte-6mkqqh">Progression du niveau</span> <span class="progress-percentage svelte-1ce025r">${escape(levelStats.progression)}%</span></div> <div class="progress-bar svelte-1ce025r"><div class="progress-fill svelte-1ce025r" style="${"width: " + escape(levelStats.progression, true) + "%"}"></div></div></div>` : ``}  <div class="difficulty-overview svelte-1ce025r"><h3 class="difficulty-title svelte-1ce025r" data-svelte-h="svelte-1ph2iie">Répartition par difficulté</h3> <div class="difficulty-grid svelte-1ce025r"><div class="difficulty-item facile svelte-1ce025r"><div class="difficulty-icon svelte-1ce025r" data-svelte-h="svelte-pxsoqz">🟢</div> <div class="difficulty-info"><div class="difficulty-count svelte-1ce025r">${escape(levelStats.difficultyDistribution.facile)}</div> <div class="difficulty-label svelte-1ce025r" data-svelte-h="svelte-1axzrxz">Facile</div></div></div> <div class="difficulty-item moyen svelte-1ce025r"><div class="difficulty-icon svelte-1ce025r" data-svelte-h="svelte-i4ten4">🟡</div> <div class="difficulty-info"><div class="difficulty-count svelte-1ce025r">${escape(levelStats.difficultyDistribution.moyen)}</div> <div class="difficulty-label svelte-1ce025r" data-svelte-h="svelte-wgl6dv">Moyen</div></div></div> <div class="difficulty-item difficile svelte-1ce025r"><div class="difficulty-icon svelte-1ce025r" data-svelte-h="svelte-7amvwp">🔴</div> <div class="difficulty-info"><div class="difficulty-count svelte-1ce025r">${escape(levelStats.difficultyDistribution.difficile)}</div> <div class="difficulty-label svelte-1ce025r" data-svelte-h="svelte-1v0xgkw">Difficile</div></div></div></div></div></div> </header>`;
});
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".niveau-layout.svelte-aqsyp0{min-height:100vh}.niveau-content.svelte-aqsyp0{padding:2rem;max-width:1200px;margin:0 auto;background:white;border-radius:1rem 1rem 0 0;min-height:60vh;margin-top:-2rem;box-shadow:0 -4px 20px rgba(0, 0, 0, 0.1);position:relative;z-index:1}@media(max-width: 768px){.niveau-content.svelte-aqsyp0{padding:1rem;margin-top:-1rem;border-radius:0.75rem 0.75rem 0 0}}@media(max-width: 480px){.niveau-content.svelte-aqsyp0{padding:0.75rem;border-radius:0.5rem 0.5rem 0 0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let matiere;
  let niveau;
  let currentPath;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  matiere = data.matiere;
  niveau = data.niveau;
  currentPath = $page.url.pathname;
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-1xrtfh5_START -->${$$result.title = `<title>${escape(niveau)} - ${escape(matiere)} - FunLearning</title>`, ""}<meta name="description" content="${"Cours et exercices de " + escape(matiere, true) + " niveau " + escape(niveau, true)}"><!-- HEAD_svelte-1xrtfh5_END -->`, ""} <div class="niveau-layout svelte-aqsyp0"> ${validate_component(Breadcrumbs, "Breadcrumbs").$$render($$result, { currentPath, matiere, niveau }, {}, {})}  ${validate_component(NiveauHeader, "NiveauHeader").$$render(
    $$result,
    {
      matiere,
      niveau,
      competences: data.competences,
      stats: data.stats
    },
    {},
    {}
  )}  <main class="niveau-content svelte-aqsyp0">${slots.default ? slots.default({}) : ``}</main> </div>`;
});
export {
  Layout as default
};
