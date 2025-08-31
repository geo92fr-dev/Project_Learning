import { c as create_ssr_component, e as escape, v as validate_component } from "../../../../../chunks/ssr.js";
import { B as Breadcrumbs } from "../../../../../chunks/Breadcrumbs.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".competence-layout.svelte-15rm261{min-height:100vh;background:linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)}.competence-header.svelte-15rm261{background:white;border-bottom:1px solid #e2e8f0;padding:1rem 0;margin-bottom:2rem}.competence-info.svelte-15rm261{background:white;border-radius:1rem;padding:2rem;margin-bottom:2rem;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0, 0, 0, 0.1)}.info-content.svelte-15rm261{max-width:800px}.competence-badge.svelte-15rm261{display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border-radius:1rem;font-size:0.925rem;font-weight:500;margin-bottom:1.5rem}.badge-icon.svelte-15rm261{font-size:0.875rem}.competence-title.svelte-15rm261{font-size:2.5rem;font-weight:700;color:#1a202c;margin:0 0 1rem 0;line-height:1.2}.competence-description.svelte-15rm261{font-size:1.25rem;color:#4a5568;line-height:1.6;margin:0 0 1.5rem 0}.competence-meta.svelte-15rm261{display:flex;flex-wrap:wrap;gap:1.5rem}.meta-item.svelte-15rm261{display:flex;align-items:center;gap:0.5rem;font-size:0.925rem;color:#6b7280}.meta-icon.svelte-15rm261{font-size:1.125rem}.objectives-section.svelte-15rm261,.prerequisites-section.svelte-15rm261{background:white;border-radius:1rem;padding:1.5rem;margin-bottom:2rem;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0, 0, 0, 0.1)}.section-title.svelte-15rm261{font-size:1.5rem;font-weight:600;color:#2d3748;margin:0 0 1.5rem 0}.objectives-grid.svelte-15rm261{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:1rem}.objective-card.svelte-15rm261{display:flex;align-items:flex-start;gap:1rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0.75rem;padding:1.25rem;transition:transform 0.2s ease}.objective-card.svelte-15rm261:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0, 0, 0, 0.1)}.objective-number.svelte-15rm261{background:var(--matiere-color, #3b82f6);color:white;width:2rem;height:2rem;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.875rem;flex-shrink:0}.objective-text.svelte-15rm261{margin:0;color:#374151;line-height:1.5}.prerequisites-list.svelte-15rm261{display:flex;flex-direction:column;gap:0.75rem}.prerequisite-item.svelte-15rm261{display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:0.5rem}.prerequisite-icon.svelte-15rm261{color:#22c55e;font-weight:600}.prerequisite-text.svelte-15rm261{color:#374151}.competence-content.svelte-15rm261{background:white;border-radius:1rem;padding:2rem;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0, 0, 0, 0.1);min-height:60vh}@media(max-width: 768px){.competence-info.svelte-15rm261,.objectives-section.svelte-15rm261,.prerequisites-section.svelte-15rm261,.competence-content.svelte-15rm261{padding:1.5rem}.competence-title.svelte-15rm261{font-size:2rem}.competence-description.svelte-15rm261{font-size:1.125rem}.competence-meta.svelte-15rm261{flex-direction:column;gap:1rem}.objectives-grid.svelte-15rm261{grid-template-columns:1fr}}@media(max-width: 480px){.competence-layout.svelte-15rm261{padding:0.5rem}.competence-info.svelte-15rm261,.objectives-section.svelte-15rm261,.prerequisites-section.svelte-15rm261,.competence-content.svelte-15rm261{padding:1rem}.competence-title.svelte-15rm261{font-size:1.75rem}}",
  map: null
};
function getDifficultyConfig(difficulty) {
  const configs = {
    facile: {
      color: "#22c55e",
      bgColor: "#f0fdf4",
      icon: "🟢",
      label: "Essentiel"
    },
    moyen: {
      color: "#f59e0b",
      bgColor: "#fffbeb",
      icon: "🟡",
      label: "Intermédiaire"
    },
    difficile: {
      color: "#ef4444",
      bgColor: "#fef2f2",
      icon: "🔴",
      label: "Avancé"
    }
  };
  return configs[difficulty] || configs.moyen;
}
function groupCoursByType(courseList) {
  return {
    introduction: courseList.filter((c) => c.type === "introduction"),
    theorie: courseList.filter((c) => c.type === "théorie"),
    methodes: courseList.filter((c) => c.type === "méthodes"),
    exercices: courseList.filter((c) => c.type === "exercices"),
    applications: courseList.filter((c) => c.type === "applications")
  };
}
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let competence;
  let cours;
  let matiere;
  let niveau;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  competence = data.competence;
  cours = data.cours;
  matiere = data.matiere;
  niveau = data.niveau;
  getDifficultyConfig(competence.difficulty);
  groupCoursByType(cours);
  return `${$$result.head += `<!-- HEAD_svelte-1bevzyq_START -->${$$result.title = `<title>${escape(competence.title)} - ${escape(niveau)} ${escape(matiere)} - FunLearning</title>`, ""}<!-- HEAD_svelte-1bevzyq_END -->`, ""} <div class="competence-layout svelte-15rm261"> <header class="competence-header svelte-15rm261">${validate_component(Breadcrumbs, "Breadcrumbs").$$render($$result, { items: data.breadcrumbs }, {}, {})}</header> ${``}  <main class="competence-content svelte-15rm261">${slots.default ? slots.default({}) : ``}</main> </div>`;
});
export {
  Layout as default
};
