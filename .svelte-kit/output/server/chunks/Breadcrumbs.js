import { c as create_ssr_component, b as each, e as escape, d as add_attribute } from "./ssr.js";
const Breadcrumbs_svelte_svelte_type_style_lang = "";
const css = {
  code: ".breadcrumbs.svelte-13dxwdz{background:rgba(255, 255, 255, 0.1);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255, 255, 255, 0.2)}.breadcrumb-list.svelte-13dxwdz{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin:0;padding:0;list-style:none}.breadcrumb-item.svelte-13dxwdz{display:flex;align-items:center;gap:0.5rem}.breadcrumb-link.svelte-13dxwdz{color:rgba(255, 255, 255, 0.8);text-decoration:none;padding:0.25rem 0.5rem;border-radius:0.375rem;transition:all 0.2s ease;font-size:0.875rem}.breadcrumb-link.svelte-13dxwdz:hover{color:white;background:rgba(255, 255, 255, 0.1)}.breadcrumb-current.svelte-13dxwdz{color:white;font-weight:600;padding:0.25rem 0.5rem;font-size:0.875rem}.breadcrumb-separator.svelte-13dxwdz{color:rgba(255, 255, 255, 0.6);font-size:0.75rem;margin:0 0.25rem}@media(max-width: 640px){.breadcrumb-list.svelte-13dxwdz{font-size:0.75rem}.breadcrumb-link.svelte-13dxwdz,.breadcrumb-current.svelte-13dxwdz{padding:0.125rem 0.375rem;font-size:0.75rem}}",
  map: null
};
function formatCompetence(comp) {
  return comp.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
const Breadcrumbs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let breadcrumbs;
  let { currentPath = "" } = $$props;
  let { matiere = "" } = $$props;
  let { niveau = "" } = $$props;
  let { competence = "" } = $$props;
  const matiereLabels = {
    "mathematiques": "📊 Mathématiques",
    "francais": "📚 Français",
    "anglais": "🌍 Anglais",
    "histoire": "🏛️ Histoire",
    "geographie": "🗺️ Géographie",
    "sciences": "🔬 Sciences"
  };
  const niveauLabels = {
    "6eme": "6ème",
    "5eme": "5ème",
    "4eme": "4ème",
    "3eme": "3ème"
  };
  function buildBreadcrumbs(path, mat, niv, comp) {
    const crumbs = [
      {
        label: "🏠 Accueil",
        href: "/",
        current: false
      }
    ];
    if (mat) {
      crumbs.push({
        label: matiereLabels[mat] || mat,
        href: `/${mat}`,
        current: !niv && !comp
      });
    }
    if (niv) {
      crumbs.push({
        label: niveauLabels[niv] || niv,
        href: `/${mat}/${niv}`,
        current: !comp
      });
    }
    if (comp) {
      crumbs.push({
        label: formatCompetence(comp),
        href: `/${mat}/${niv}/${comp}`,
        current: true
      });
    }
    return crumbs;
  }
  if ($$props.currentPath === void 0 && $$bindings.currentPath && currentPath !== void 0)
    $$bindings.currentPath(currentPath);
  if ($$props.matiere === void 0 && $$bindings.matiere && matiere !== void 0)
    $$bindings.matiere(matiere);
  if ($$props.niveau === void 0 && $$bindings.niveau && niveau !== void 0)
    $$bindings.niveau(niveau);
  if ($$props.competence === void 0 && $$bindings.competence && competence !== void 0)
    $$bindings.competence(competence);
  $$result.css.add(css);
  breadcrumbs = buildBreadcrumbs(currentPath, matiere, niveau, competence);
  return `<nav class="breadcrumbs svelte-13dxwdz" aria-label="Fil d'Ariane"><div class="container mx-auto px-4 py-3"><ol class="breadcrumb-list svelte-13dxwdz">${each(breadcrumbs, (crumb, index) => {
    return `<li class="${["breadcrumb-item svelte-13dxwdz", crumb.current ? "current" : ""].join(" ").trim()}">${crumb.current ? `<span class="breadcrumb-current svelte-13dxwdz" aria-current="page">${escape(crumb.label)} </span>` : `<a${add_attribute("href", crumb.href, 0)} class="breadcrumb-link svelte-13dxwdz" data-sveltekit-preload-data="hover">${escape(crumb.label)} </a>`} ${index < breadcrumbs.length - 1 ? `<span class="breadcrumb-separator svelte-13dxwdz" aria-hidden="true" data-svelte-h="svelte-12yx5bb">→</span>` : ``} </li>`;
  })}</ol></div> </nav>`;
});
export {
  Breadcrumbs as B
};
