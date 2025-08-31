import { c as create_ssr_component, e as escape } from "../../../../chunks/ssr.js";
const CompetenceCard_svelte_svelte_type_style_lang = "";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".niveau-page.svelte-p6kmp9{padding:1rem 0}.welcome-section.svelte-p6kmp9{background:linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);border-radius:1rem;padding:2rem;margin-bottom:2rem;border:1px solid #e2e8f0}.welcome-header.svelte-p6kmp9{display:flex;align-items:center;gap:1.5rem;margin-bottom:1.5rem}.niveau-icon.svelte-p6kmp9{font-size:3rem;filter:drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))}.welcome-title.svelte-p6kmp9{font-size:1.75rem;font-weight:700;color:#1a202c;margin:0 0 0.5rem 0}.welcome-subtitle.svelte-p6kmp9{font-size:1.125rem;color:#4a5568;margin:0}.advice-card.svelte-p6kmp9{display:flex;align-items:center;gap:1rem;background:#fef5e7;border:1px solid #f6ad55;border-radius:0.75rem;padding:1rem}.advice-icon.svelte-p6kmp9{font-size:1.5rem}.advice-text.svelte-p6kmp9{margin:0;color:#9c4221;font-weight:500}.progress-overview.svelte-p6kmp9{background:white;border-radius:1rem;padding:1.5rem;margin-bottom:2rem;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0, 0, 0, 0.1)}.progress-title.svelte-p6kmp9{font-size:1.25rem;font-weight:600;color:#2d3748;margin-bottom:1rem}.progress-container.svelte-p6kmp9{display:flex;align-items:center;gap:1rem}.progress-bar.svelte-p6kmp9{flex:1;height:0.75rem;background:#f1f5f9;border-radius:0.375rem;overflow:hidden}.progress-fill.svelte-p6kmp9{height:100%;background:linear-gradient(90deg, var(--matiere-color, #3b82f6) 0%, var(--matiere-color-dark, #1e40af) 100%);border-radius:0.375rem;transition:width 0.8s ease}.progress-text.svelte-p6kmp9{font-size:0.925rem;font-weight:600;color:var(--matiere-color, #3b82f6);white-space:nowrap}.competences-section.svelte-p6kmp9{margin-bottom:3rem}.section-header.svelte-p6kmp9{margin-bottom:1.5rem}.section-title.svelte-p6kmp9{font-size:1.5rem;font-weight:600;color:#2d3748;margin-bottom:0.5rem}.section-description.svelte-p6kmp9{font-size:1rem;color:#718096;margin-bottom:0.75rem}.section-advice.svelte-p6kmp9{display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:#4a5568;background:#f7fafc;padding:0.75rem;border-radius:0.5rem;border:1px solid #e2e8f0}.competences-grid.svelte-p6kmp9{display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1.5rem}.pedagogy-tips.svelte-p6kmp9{background:linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);border-radius:1rem;padding:2rem;border:1px solid #e2e8f0}.tips-title.svelte-p6kmp9{font-size:1.5rem;font-weight:600;color:#2d3748;margin-bottom:1.5rem;text-align:center}.tips-grid.svelte-p6kmp9{display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:1rem}.tip-card.svelte-p6kmp9{background:white;border-radius:0.75rem;padding:1.5rem;text-align:center;border:1px solid #e2e8f0;transition:transform 0.2s ease}.tip-card.svelte-p6kmp9:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0, 0, 0, 0.1)}.tip-icon.svelte-p6kmp9{font-size:2rem;margin-bottom:0.75rem}.tip-title.svelte-p6kmp9{font-size:1.125rem;font-weight:600;color:#2d3748;margin-bottom:0.5rem}.tip-text.svelte-p6kmp9{font-size:0.925rem;color:#4a5568;margin:0;line-height:1.5}@media(max-width: 768px){.welcome-header.svelte-p6kmp9{flex-direction:column;text-align:center;gap:1rem}.welcome-title.svelte-p6kmp9{font-size:1.5rem}.competences-grid.svelte-p6kmp9{grid-template-columns:1fr;gap:1rem}.tips-grid.svelte-p6kmp9{grid-template-columns:repeat(2, 1fr)}}@media(max-width: 480px){.niveau-page.svelte-p6kmp9{padding:0.5rem 0}.welcome-section.svelte-p6kmp9,.pedagogy-tips.svelte-p6kmp9{padding:1.5rem}.tips-grid.svelte-p6kmp9{grid-template-columns:1fr}.progress-container.svelte-p6kmp9{flex-direction:column;gap:0.75rem;align-items:stretch}}",
  map: null
};
function getNiveauDisplayConfig(niv) {
  const configs = {
    "6eme": {
      welcomeMessage: "Bienvenue en 6ème ! Commencez votre parcours au collège.",
      encouragement: "Prenez votre temps et construisez des bases solides.",
      focusAdvice: "Concentrez-vous sur la compréhension plutôt que la vitesse.",
      icon: "🌱"
    },
    "5eme": {
      welcomeMessage: "En 5ème, approfondissez vos connaissances !",
      encouragement: "Vous maîtrisez déjà les bases, explorez de nouveaux horizons.",
      focusAdvice: "Établissez des liens entre les différents concepts.",
      icon: "🌿"
    },
    "4eme": {
      welcomeMessage: "La 4ème marque une étape importante !",
      encouragement: "Développez votre autonomie et votre esprit critique.",
      focusAdvice: "Préparez-vous progressivement aux exigences du lycée.",
      icon: "🌳"
    },
    "3eme": {
      welcomeMessage: "Dernière ligne droite avant le brevet !",
      encouragement: "Mobilisez toutes vos compétences pour exceller.",
      focusAdvice: "Organisez vos révisions et travaillez la méthodologie.",
      icon: "🎯"
    }
  };
  return configs[niv] || {
    welcomeMessage: "Découvrez les compétences de ce niveau.",
    encouragement: "Progressez à votre rythme.",
    focusAdvice: "Pratiquez régulièrement.",
    icon: "📚"
  };
}
function groupCompetencesByDifficulty(comps) {
  return {
    facile: comps.filter((c) => c.difficulty === "facile"),
    moyen: comps.filter((c) => c.difficulty === "moyen"),
    difficile: comps.filter((c) => c.difficulty === "difficile")
  };
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let matiere;
  let niveau;
  let competences;
  let competencesByDifficulty;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  matiere = data.matiere;
  niveau = data.niveau;
  competences = data.competences;
  getNiveauDisplayConfig(niveau);
  competencesByDifficulty = groupCompetencesByDifficulty(competences);
  [
    {
      key: "facile",
      title: "🟢 Compétences Essentielles",
      description: "Commencez par ces bases fondamentales",
      competences: competencesByDifficulty.facile,
      advice: "Ces compétences sont la fondation de votre apprentissage."
    },
    {
      key: "moyen",
      title: "🟡 Compétences Intermédiaires",
      description: "Approfondissez vos connaissances",
      competences: competencesByDifficulty.moyen,
      advice: "Assurez-vous de maîtriser les bases avant de continuer."
    },
    {
      key: "difficile",
      title: "🔴 Compétences Avancées",
      description: "Relevez le défi avec ces notions complexes",
      competences: competencesByDifficulty.difficile,
      advice: "Ces compétences demandent plus de pratique et de réflexion."
    }
  ];
  return `${$$result.head += `<!-- HEAD_svelte-sxrw9r_START -->${$$result.title = `<title>${escape(niveau)} ${escape(matiere)} - Compétences - FunLearning</title>`, ""}<!-- HEAD_svelte-sxrw9r_END -->`, ""} <div class="niveau-page svelte-p6kmp9"> ${``}  ${``}  ${``}  ${``} </div>`;
});
export {
  Page as default
};
