import { c as create_ssr_component, e as escape, v as validate_component } from "../../../../../../chunks/ssr.js";
import { B as Breadcrumbs } from "../../../../../../chunks/Breadcrumbs.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".cours-page.svelte-193tco0.svelte-193tco0{min-height:100vh;background:linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);padding-bottom:2rem}.cours-header.svelte-193tco0.svelte-193tco0{background:white;border-bottom:1px solid #e2e8f0;padding:1rem 0;margin-bottom:2rem}.cours-info.svelte-193tco0.svelte-193tco0{background:white;border-radius:1rem;padding:2rem;margin-bottom:2rem;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0, 0, 0, 0.1)}.cours-badge.svelte-193tco0.svelte-193tco0{display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border-radius:1rem;font-size:0.925rem;font-weight:500;margin-bottom:1.5rem}.badge-icon.svelte-193tco0.svelte-193tco0{font-size:0.875rem}.cours-title.svelte-193tco0.svelte-193tco0{font-size:2.25rem;font-weight:700;color:#1a202c;margin:0 0 1rem 0;line-height:1.2}.cours-description.svelte-193tco0.svelte-193tco0{font-size:1.125rem;color:#4a5568;line-height:1.6;margin:0 0 1.5rem 0}.cours-meta.svelte-193tco0.svelte-193tco0{display:flex;flex-wrap:wrap;gap:1.5rem;margin-bottom:1.5rem}.meta-item.svelte-193tco0.svelte-193tco0{display:flex;align-items:center;gap:0.5rem;font-size:0.925rem;color:#6b7280}.meta-icon.svelte-193tco0.svelte-193tco0{font-size:1.125rem}.progression-container.svelte-193tco0.svelte-193tco0{display:flex;align-items:center;gap:1rem}.progression-bar.svelte-193tco0.svelte-193tco0{flex:1;height:0.75rem;background:#f1f5f9;border-radius:0.375rem;overflow:hidden}.progression-fill.svelte-193tco0.svelte-193tco0{height:100%;border-radius:0.375rem;transition:width 0.8s ease}.progression-text.svelte-193tco0.svelte-193tco0{font-size:0.925rem;font-weight:500;color:#374151;white-space:nowrap}.cours-content.svelte-193tco0.svelte-193tco0{display:flex;flex-direction:column;gap:2rem}.sections-container.svelte-193tco0.svelte-193tco0,.activities-container.svelte-193tco0.svelte-193tco0,.resources-container.svelte-193tco0.svelte-193tco0{background:white;border-radius:1rem;padding:1.5rem;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0, 0, 0, 0.1)}.content-title.svelte-193tco0.svelte-193tco0{font-size:1.5rem;font-weight:600;color:#2d3748;margin:0 0 1.5rem 0}.sections-list.svelte-193tco0.svelte-193tco0{display:flex;flex-direction:column;gap:1rem}.section-card.svelte-193tco0.svelte-193tco0{border:1px solid #e2e8f0;border-radius:0.75rem;overflow:hidden;transition:all 0.2s ease}.section-card.svelte-193tco0.svelte-193tco0:hover{box-shadow:0 4px 12px rgba(0, 0, 0, 0.1)}.section-card.completed.svelte-193tco0.svelte-193tco0{border-color:#22c55e;background:linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)}.section-header.svelte-193tco0.svelte-193tco0{width:100%;display:flex;align-items:center;justify-content:space-between;padding:1.25rem;background:none;border:none;cursor:pointer;text-align:left}.section-info.svelte-193tco0.svelte-193tco0{display:flex;align-items:center;gap:1rem}.section-status.svelte-193tco0 .status-icon.svelte-193tco0{font-size:1.25rem}.section-title.svelte-193tco0.svelte-193tco0{font-size:1.125rem;font-weight:600;color:#2d3748;margin:0 0 0.25rem 0}.section-duration.svelte-193tco0.svelte-193tco0{font-size:0.875rem;color:#6b7280}.toggle-icon.svelte-193tco0.svelte-193tco0{font-size:0.875rem;color:#9ca3af;transition:transform 0.2s ease}.toggle-icon.rotated.svelte-193tco0.svelte-193tco0{transform:rotate(180deg)}.section-content.svelte-193tco0.svelte-193tco0{padding:0 1.25rem 1.25rem 1.25rem;border-top:1px solid #f1f5f9}.section-text.svelte-193tco0.svelte-193tco0{color:#4a5568;line-height:1.6;margin:0 0 1rem 0}.complete-button.svelte-193tco0.svelte-193tco0{background:#3b82f6;color:white;border:none;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:500;cursor:pointer;transition:background-color 0.2s ease}.complete-button.svelte-193tco0.svelte-193tco0:hover{background-color:#2563eb}.activities-grid.svelte-193tco0.svelte-193tco0{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:1.5rem}.activity-card.svelte-193tco0.svelte-193tco0{border:1px solid #e2e8f0;border-radius:0.75rem;padding:1.5rem;transition:all 0.2s ease}.activity-card.svelte-193tco0.svelte-193tco0:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0, 0, 0, 0.1)}.activity-card.completed.svelte-193tco0.svelte-193tco0{border-color:#22c55e;background:linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)}.activity-header.svelte-193tco0.svelte-193tco0{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.activity-status.svelte-193tco0 .status-icon.svelte-193tco0{font-size:1.25rem}.activity-type.svelte-193tco0.svelte-193tco0{padding:0.25rem 0.75rem;border-radius:0.375rem;font-size:0.8rem;font-weight:500;text-transform:capitalize}.activity-title.svelte-193tco0.svelte-193tco0{font-size:1.125rem;font-weight:600;color:#2d3748;margin:0 0 0.5rem 0}.activity-duration.svelte-193tco0.svelte-193tco0{font-size:0.875rem;color:#6b7280;margin-bottom:1rem}.activity-button.svelte-193tco0.svelte-193tco0{width:100%;color:white;border:none;padding:0.75rem;border-radius:0.5rem;font-weight:500;cursor:pointer;transition:opacity 0.2s ease}.activity-button.svelte-193tco0.svelte-193tco0:hover{opacity:0.9}.resources-header.svelte-193tco0.svelte-193tco0{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.toggle-resources.svelte-193tco0.svelte-193tco0{background:#f1f5f9;color:#374151;border:1px solid #e2e8f0;padding:0.5rem 1rem;border-radius:0.5rem;font-size:0.875rem;cursor:pointer;transition:background-color 0.2s ease}.toggle-resources.svelte-193tco0.svelte-193tco0:hover{background-color:#e2e8f0}.resources-grid.svelte-193tco0.svelte-193tco0{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:1rem}.resource-item.svelte-193tco0.svelte-193tco0{display:flex;align-items:center;gap:0.75rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.5rem;text-decoration:none;color:inherit;transition:all 0.2s ease}.resource-item.svelte-193tco0.svelte-193tco0:hover{background-color:#f8fafc;box-shadow:0 2px 8px rgba(0, 0, 0, 0.1)}.resource-icon.svelte-193tco0.svelte-193tco0{font-size:1.5rem}.resource-title.svelte-193tco0.svelte-193tco0{flex:1;font-weight:500;color:#374151}.resource-type.svelte-193tco0.svelte-193tco0{font-size:0.8rem;color:#9ca3af;text-transform:uppercase}.cours-navigation.svelte-193tco0.svelte-193tco0{background:white;border-radius:1rem;padding:1.5rem;margin-top:2rem;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0, 0, 0, 0.1)}.nav-content.svelte-193tco0.svelte-193tco0{display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:center}.nav-button.svelte-193tco0.svelte-193tco0{display:flex;align-items:center;gap:0.75rem;padding:1rem;border:1px solid #e2e8f0;border-radius:0.75rem;text-decoration:none;color:inherit;transition:all 0.2s ease}.nav-button.svelte-193tco0.svelte-193tco0:hover{background-color:#f8fafc;box-shadow:0 2px 8px rgba(0, 0, 0, 0.1)}.nav-previous.svelte-193tco0.svelte-193tco0{justify-self:start}.nav-next.svelte-193tco0.svelte-193tco0{justify-self:end}.nav-back.svelte-193tco0.svelte-193tco0{justify-self:center;background-color:var(--matiere-color, #3b82f6);color:white;border-color:var(--matiere-color, #3b82f6)}.nav-back.svelte-193tco0.svelte-193tco0:hover{background-color:var(--matiere-color-dark, #2563eb)}.nav-info.svelte-193tco0.svelte-193tco0{display:flex;flex-direction:column}.nav-label.svelte-193tco0.svelte-193tco0{font-size:0.8rem;color:#9ca3af}.nav-title.svelte-193tco0.svelte-193tco0{font-weight:500;color:#374151}.nav-arrow.svelte-193tco0.svelte-193tco0{font-size:1.25rem;color:#9ca3af}.nav-spacer.svelte-193tco0.svelte-193tco0{width:1px}@media(max-width: 768px){.cours-content.svelte-193tco0.svelte-193tco0{gap:1.5rem}.sections-container.svelte-193tco0.svelte-193tco0,.activities-container.svelte-193tco0.svelte-193tco0,.resources-container.svelte-193tco0.svelte-193tco0{padding:1.25rem}.cours-title.svelte-193tco0.svelte-193tco0{font-size:1.875rem}.cours-meta.svelte-193tco0.svelte-193tco0{flex-direction:column;gap:1rem}.activities-grid.svelte-193tco0.svelte-193tco0{grid-template-columns:1fr}.nav-content.svelte-193tco0.svelte-193tco0{grid-template-columns:1fr;gap:1rem}.nav-button.svelte-193tco0.svelte-193tco0{justify-self:stretch !important}}@media(max-width: 480px){.cours-page.svelte-193tco0.svelte-193tco0{padding-bottom:1rem}.cours-info.svelte-193tco0.svelte-193tco0,.sections-container.svelte-193tco0.svelte-193tco0,.activities-container.svelte-193tco0.svelte-193tco0,.resources-container.svelte-193tco0.svelte-193tco0,.cours-navigation.svelte-193tco0.svelte-193tco0{padding:1rem}.cours-title.svelte-193tco0.svelte-193tco0{font-size:1.5rem}}",
  map: null
};
function getTypeConfig(type) {
  const configs = {
    introduction: {
      color: "#3b82f6",
      bgColor: "#eff6ff",
      icon: "🚀",
      label: "Introduction"
    },
    théorie: {
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
      icon: "📚",
      label: "Théorie"
    },
    méthodes: {
      color: "#f59e0b",
      bgColor: "#fef3c7",
      icon: "🔧",
      label: "Méthodes"
    },
    exercices: {
      color: "#10b981",
      bgColor: "#ecfdf5",
      icon: "💪",
      label: "Exercices"
    },
    applications: {
      color: "#ef4444",
      bgColor: "#fef2f2",
      icon: "🎯",
      label: "Applications"
    }
  };
  return configs[type] || configs.théorie;
}
function calculateProgression(content) {
  const totalSections = content.sections.length;
  const completedSections = content.sections.filter((s) => s.completed).length;
  const totalActivities = content.activities.length;
  const completedActivities = content.activities.filter((a) => a.completed).length;
  const totalItems = totalSections + totalActivities;
  const completedItems = completedSections + completedActivities;
  return totalItems > 0 ? Math.round(completedItems / totalItems * 100) : 0;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cours;
  let contenu;
  let competence;
  let matiere;
  let niveau;
  let breadcrumbs;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  cours = data.cours;
  contenu = data.contenu;
  competence = data.competence;
  data.navigation;
  matiere = data.matiere;
  niveau = data.niveau;
  getTypeConfig(cours.type);
  calculateProgression(contenu);
  breadcrumbs = [
    { label: "Accueil", href: "/" },
    { label: matiere, href: `/${matiere}` },
    {
      label: niveau,
      href: `/${matiere}/${niveau}`
    },
    {
      label: competence.title,
      href: `/${matiere}/${niveau}/${competence.slug}`
    },
    {
      label: cours.title,
      href: `/${matiere}/${niveau}/${competence.slug}/${cours.slug}`
    }
  ];
  return `${$$result.head += `<!-- HEAD_svelte-t209mn_START -->${$$result.title = `<title>${escape(cours.title)} - ${escape(competence.title)}</title>`, ""}<!-- HEAD_svelte-t209mn_END -->`, ""} <div class="cours-page svelte-193tco0"> <header class="cours-header svelte-193tco0">${validate_component(Breadcrumbs, "Breadcrumbs").$$render($$result, { items: breadcrumbs }, {}, {})}</header> ${``} </div>`;
});
export {
  Page as default
};
