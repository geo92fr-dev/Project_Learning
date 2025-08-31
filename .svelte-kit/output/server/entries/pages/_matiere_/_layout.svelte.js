import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, e as escape, o as onDestroy, v as validate_component } from "../../../chunks/ssr.js";
import { p as page } from "../../../chunks/stores.js";
import { B as Breadcrumbs } from "../../../chunks/Breadcrumbs.js";
const MatiereHeader_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".matiere-header.svelte-1t3yesj{background:linear-gradient(135deg, var(--matiere-color) 0%, var(--matiere-color-dark) 100%);color:white;position:relative;overflow:hidden}.matiere-header.svelte-1t3yesj::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),\r\n                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);pointer-events:none}.header-content.svelte-1t3yesj{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center}.matiere-info.svelte-1t3yesj{display:flex;flex-direction:column;gap:1rem}.matiere-title.svelte-1t3yesj{display:flex;align-items:center;gap:1rem}.matiere-icon.svelte-1t3yesj{font-size:4rem;filter:drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))}.title.svelte-1t3yesj{font-size:3rem;font-weight:700;margin:0;text-shadow:0 2px 4px rgba(0, 0, 0, 0.3)}.description.svelte-1t3yesj{font-size:1.25rem;color:rgba(255, 255, 255, 0.9);margin:0;line-height:1.6}.matiere-stats.svelte-1t3yesj{display:flex;flex-direction:column;gap:1.5rem}.stats-grid.svelte-1t3yesj{display:grid;grid-template-columns:repeat(2, 1fr);gap:1rem}.stat-card.svelte-1t3yesj{background:rgba(255, 255, 255, 0.15);backdrop-filter:blur(10px);border:1px solid rgba(255, 255, 255, 0.2);border-radius:1rem;padding:1.5rem;text-align:center;position:relative;transition:transform 0.2s ease}.stat-card.svelte-1t3yesj:hover{transform:translateY(-2px)}.stat-value.svelte-1t3yesj{font-size:2rem;font-weight:700;margin-bottom:0.25rem}.stat-label.svelte-1t3yesj{font-size:0.875rem;color:rgba(255, 255, 255, 0.8)}.stat-icon.svelte-1t3yesj{position:absolute;top:1rem;right:1rem;font-size:1.5rem;opacity:0.6}.progression-bar.svelte-1t3yesj{background:rgba(255, 255, 255, 0.1);border-radius:1rem;padding:1rem;border:1px solid rgba(255, 255, 255, 0.2)}.progression-label.svelte-1t3yesj{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;font-size:0.875rem;color:rgba(255, 255, 255, 0.9)}.progress-track.svelte-1t3yesj{height:0.75rem;background:rgba(255, 255, 255, 0.2);border-radius:0.375rem;overflow:hidden}.progress-fill.svelte-1t3yesj{height:100%;background:linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 1) 100%);border-radius:0.375rem;transition:width 0.5s ease}@media(max-width: 768px){.header-content.svelte-1t3yesj{grid-template-columns:1fr;gap:2rem;text-align:center}.matiere-icon.svelte-1t3yesj{font-size:3rem}.title.svelte-1t3yesj{font-size:2rem}.description.svelte-1t3yesj{font-size:1rem}.stats-grid.svelte-1t3yesj{grid-template-columns:repeat(2, 1fr);gap:0.75rem}.stat-card.svelte-1t3yesj{padding:1rem}.stat-value.svelte-1t3yesj{font-size:1.5rem}}@media(max-width: 480px){.stats-grid.svelte-1t3yesj{grid-template-columns:1fr}}",
  map: null
};
const MatiereHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let config;
  let stats;
  let { matiere } = $$props;
  let { totalCompetences = 0 } = $$props;
  let { totalCours = 0 } = $$props;
  let { progression = 0 } = $$props;
  const matiereConfig = {
    "mathematiques": {
      title: "Mathématiques",
      icon: "📊",
      color: "#667eea",
      colorDark: "#764ba2",
      description: "Nombres, calculs, géométrie et résolution de problèmes"
    },
    "francais": {
      title: "Français",
      icon: "📚",
      color: "#f093fb",
      colorDark: "#f5576c",
      description: "Grammaire, orthographe, lecture et expression écrite"
    },
    "anglais": {
      title: "Anglais",
      icon: "🌍",
      color: "#4facfe",
      colorDark: "#00f2fe",
      description: "Vocabulaire, grammaire et expression orale et écrite"
    },
    "histoire": {
      title: "Histoire",
      icon: "🏛️",
      color: "#fa709a",
      colorDark: "#fee140",
      description: "Événements historiques, personnages et civilisations"
    },
    "geographie": {
      title: "Géographie",
      icon: "🗺️",
      color: "#a8edea",
      colorDark: "#fed6e3",
      description: "Territoires, populations et développement durable"
    },
    "sciences": {
      title: "Sciences",
      icon: "🔬",
      color: "#d299c2",
      colorDark: "#fef9d7",
      description: "Physique, chimie, SVT et technologie"
    }
  };
  if ($$props.matiere === void 0 && $$bindings.matiere && matiere !== void 0)
    $$bindings.matiere(matiere);
  if ($$props.totalCompetences === void 0 && $$bindings.totalCompetences && totalCompetences !== void 0)
    $$bindings.totalCompetences(totalCompetences);
  if ($$props.totalCours === void 0 && $$bindings.totalCours && totalCours !== void 0)
    $$bindings.totalCours(totalCours);
  if ($$props.progression === void 0 && $$bindings.progression && progression !== void 0)
    $$bindings.progression(progression);
  $$result.css.add(css$1);
  config = matiereConfig[matiere] || {
    title: matiere,
    icon: "📖",
    color: "#667eea",
    colorDark: "#764ba2",
    description: "Matière non configurée"
  };
  stats = {
    cours: totalCours,
    competences: totalCompetences,
    progression: Math.round(progression),
    niveauxDisponibles: 4
  };
  return `${$$result.head += `<!-- HEAD_svelte-va4ybm_START --><style data-svelte-h="svelte-2u16jb">:root {
      --matiere-color: {config.color};
      --matiere-color-dark: {config.colorDark};
    }</style><!-- HEAD_svelte-va4ybm_END -->`, ""} <header class="matiere-header svelte-1t3yesj"><div class="container mx-auto px-4 py-8"><div class="header-content svelte-1t3yesj"> <div class="matiere-info svelte-1t3yesj"><div class="matiere-title svelte-1t3yesj"><span class="matiere-icon svelte-1t3yesj">${escape(config.icon)}</span> <h1 class="title svelte-1t3yesj">${escape(config.title)}</h1></div> <p class="description svelte-1t3yesj">${escape(config.description)}</p></div>  <div class="matiere-stats svelte-1t3yesj"><div class="stats-grid svelte-1t3yesj"><div class="stat-card svelte-1t3yesj"><div class="stat-value svelte-1t3yesj">${escape(stats.niveauxDisponibles)}</div> <div class="stat-label svelte-1t3yesj" data-svelte-h="svelte-19vrwqu">Niveaux</div> <div class="stat-icon svelte-1t3yesj" data-svelte-h="svelte-1xm60jm">🎯</div></div> <div class="stat-card svelte-1t3yesj"><div class="stat-value svelte-1t3yesj">${escape(stats.competences)}</div> <div class="stat-label svelte-1t3yesj" data-svelte-h="svelte-z3rt7m">Compétences</div> <div class="stat-icon svelte-1t3yesj" data-svelte-h="svelte-cxdj8b">🧠</div></div> <div class="stat-card svelte-1t3yesj"><div class="stat-value svelte-1t3yesj">${escape(stats.cours)}</div> <div class="stat-label svelte-1t3yesj" data-svelte-h="svelte-1s7tnqy">Cours</div> <div class="stat-icon svelte-1t3yesj" data-svelte-h="svelte-hr6t3g">📚</div></div> <div class="stat-card svelte-1t3yesj"><div class="stat-value svelte-1t3yesj">${escape(stats.progression)}%</div> <div class="stat-label svelte-1t3yesj" data-svelte-h="svelte-xnfvel">Progression</div> <div class="stat-icon svelte-1t3yesj" data-svelte-h="svelte-civfhy">📈</div></div></div>  ${stats.progression > 0 ? `<div class="progression-bar svelte-1t3yesj"><div class="progression-label svelte-1t3yesj"><span data-svelte-h="svelte-1qw0jt9">Progression globale</span> <span>${escape(stats.progression)}%</span></div> <div class="progress-track svelte-1t3yesj"><div class="progress-fill svelte-1t3yesj" style="${"width: " + escape(stats.progression, true) + "%"}"></div></div></div>` : ``}</div></div></div> </header>`;
});
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".matiere-layout.svelte-18b5i9k{min-height:100vh;background:linear-gradient(135deg, var(--matiere-color, #667eea) 0%, var(--matiere-color-dark, #764ba2) 100%);position:relative}.matiere-layout.svelte-18b5i9k::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),\r\n      radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);pointer-events:none;z-index:0}.matiere-content.svelte-18b5i9k{position:relative;z-index:1;padding:2rem;max-width:1200px;margin:0 auto;background:rgba(255, 255, 255, 0.95);border-radius:1rem 1rem 0 0;min-height:60vh;margin-top:-2rem;box-shadow:0 -4px 20px rgba(0, 0, 0, 0.1)}@media(max-width: 768px){.matiere-content.svelte-18b5i9k{padding:1rem;margin-top:-1rem;border-radius:0.75rem 0.75rem 0 0}}@media(max-width: 480px){.matiere-content.svelte-18b5i9k{padding:0.75rem;border-radius:0.5rem 0.5rem 0 0}}",
  map: null
};
function getMatiereColors(mat) {
  const colors = {
    "mathematiques": { color: "#667eea", colorDark: "#764ba2" },
    "francais": { color: "#f093fb", colorDark: "#f5576c" },
    "anglais": { color: "#4facfe", colorDark: "#00f2fe" },
    "histoire": { color: "#fa709a", colorDark: "#fee140" },
    "geographie": { color: "#a8edea", colorDark: "#fed6e3" },
    "sciences": { color: "#d299c2", colorDark: "#fef9d7" }
  };
  return colors[mat] || { color: "#667eea", colorDark: "#764ba2" };
}
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let matiere;
  let stats;
  let currentPath;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  onDestroy(() => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  matiere = data.matiere;
  stats = data.stats;
  currentPath = $page.url.pathname;
  getMatiereColors(matiere);
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-q2t5g1_START -->${$$result.title = `<title>${escape(data.matiere)} - FunLearning</title>`, ""}<meta name="description" content="${"Cours et exercices de " + escape(data.matiere, true) + " pour le collège - 6ème à 3ème"}"><!-- HEAD_svelte-q2t5g1_END -->`, ""} <div class="matiere-layout svelte-18b5i9k"> ${validate_component(Breadcrumbs, "Breadcrumbs").$$render($$result, { currentPath, matiere }, {}, {})}  ${validate_component(MatiereHeader, "MatiereHeader").$$render(
    $$result,
    {
      matiere,
      totalCompetences: stats.totalCompetences,
      totalCours: stats.totalCours,
      progression: stats.progression
    },
    {},
    {}
  )}  <main class="matiere-content svelte-18b5i9k">${slots.default ? slots.default({}) : ``}</main> </div>`;
});
export {
  Layout as default
};
