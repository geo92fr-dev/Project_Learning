import { c as create_ssr_component, e as escape } from "../../../chunks/ssr.js";
const LevelCard_svelte_svelte_type_style_lang = "";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".matiere-page.svelte-imhrky.svelte-imhrky{padding:1rem 0}.welcome-section.svelte-imhrky.svelte-imhrky{text-align:center;margin-bottom:3rem;padding:2rem;background:linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 255, 0.9) 100%);border-radius:1rem;border:1px solid rgba(var(--matiere-color), 0.1)}.welcome-title.svelte-imhrky.svelte-imhrky{font-size:2rem;font-weight:700;color:#2d3748;margin-bottom:0.5rem;line-height:1.2}.welcome-subtitle.svelte-imhrky.svelte-imhrky{font-size:1.125rem;color:#718096;margin:0}.levels-section.svelte-imhrky.svelte-imhrky{margin-bottom:3rem}.section-title.svelte-imhrky.svelte-imhrky{font-size:1.5rem;font-weight:600;color:#2d3748;margin-bottom:1.5rem;text-align:center}.levels-grid.svelte-imhrky.svelte-imhrky{display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.5rem;margin-bottom:2rem}.objectives-section.svelte-imhrky.svelte-imhrky{background:#f7fafc;border-radius:1rem;padding:2rem;border:1px solid #e2e8f0}.objectives-grid.svelte-imhrky.svelte-imhrky{display:grid;grid-template-columns:2fr 1fr;gap:2rem;align-items:start}.objectives-title.svelte-imhrky.svelte-imhrky{font-size:1.25rem;font-weight:600;color:#2d3748;margin-bottom:1rem}.objectives-list.svelte-imhrky.svelte-imhrky{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.75rem}.objectives-list.svelte-imhrky li.svelte-imhrky{display:flex;align-items:center;gap:0.75rem;font-size:0.975rem;color:#4a5568;line-height:1.5}.objective-bullet.svelte-imhrky.svelte-imhrky{color:#22c55e;font-weight:bold;font-size:1rem}.tip-card.svelte-imhrky.svelte-imhrky{background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);border-radius:0.75rem;padding:1.5rem;border:1px solid #f59e0b;box-shadow:0 4px 12px rgba(245, 158, 11, 0.1)}.tip-text.svelte-imhrky.svelte-imhrky{margin:0;font-size:0.925rem;color:#92400e;line-height:1.6;font-weight:500}@media(max-width: 768px){.welcome-section.svelte-imhrky.svelte-imhrky{padding:1.5rem 1rem;margin-bottom:2rem}.welcome-title.svelte-imhrky.svelte-imhrky{font-size:1.5rem}.welcome-subtitle.svelte-imhrky.svelte-imhrky{font-size:1rem}.levels-grid.svelte-imhrky.svelte-imhrky{grid-template-columns:1fr;gap:1rem}.objectives-grid.svelte-imhrky.svelte-imhrky{grid-template-columns:1fr;gap:1.5rem}.objectives-section.svelte-imhrky.svelte-imhrky{padding:1.5rem}}@media(max-width: 480px){.matiere-page.svelte-imhrky.svelte-imhrky{padding:0.5rem 0}.welcome-section.svelte-imhrky.svelte-imhrky{padding:1rem}.welcome-title.svelte-imhrky.svelte-imhrky{font-size:1.25rem}.objectives-section.svelte-imhrky.svelte-imhrky{padding:1rem}}",
  map: null
};
function getMatiereInfo(mat) {
  const infos = {
    "mathematiques": {
      welcomeMessage: "Explorez l'univers des nombres, des formes et de la logique !",
      objectives: [
        "Maîtriser les opérations fondamentales",
        "Comprendre la géométrie dans l'espace",
        "Développer le raisonnement mathématique",
        "Résoudre des problèmes concrets"
      ],
      tips: "💡 Conseil : Pratiquez régulièrement avec des exercices variés pour progresser efficacement."
    },
    "francais": {
      welcomeMessage: "Découvrez la richesse de la langue française !",
      objectives: [
        "Maîtriser l'orthographe et la grammaire",
        "Développer l'expression écrite",
        "Analyser des textes littéraires",
        "Enrichir son vocabulaire"
      ],
      tips: "📚 Conseil : Lisez régulièrement pour améliorer votre style et votre culture littéraire."
    },
    "anglais": {
      welcomeMessage: "Welcome to your English learning journey!",
      objectives: [
        "Acquérir du vocabulaire essentiel",
        "Maîtriser la grammaire anglaise",
        "Développer la compréhension orale",
        "S'exprimer avec confiance"
      ],
      tips: "🌍 Conseil : Regardez des vidéos en anglais avec sous-titres pour améliorer votre compréhension."
    },
    "histoire": {
      welcomeMessage: "Voyagez à travers les époques et civilisations !",
      objectives: [
        "Comprendre les grandes périodes historiques",
        "Analyser des documents historiques",
        "Développer l'esprit critique",
        "Situer les événements dans le temps"
      ],
      tips: "🏛️ Conseil : Créez des frises chronologiques pour mieux mémoriser les dates importantes."
    },
    "geographie": {
      welcomeMessage: "Explorez notre planète et ses territoires !",
      objectives: [
        "Comprendre l'organisation des territoires",
        "Analyser les enjeux environnementaux",
        "Lire et interpréter des cartes",
        "Développer l'esprit géographique"
      ],
      tips: "🗺️ Conseil : Utilisez des atlas et cartes interactives pour visualiser les concepts étudiés."
    },
    "sciences": {
      welcomeMessage: "Découvrez les secrets de la nature et de la technologie !",
      objectives: [
        "Observer et expérimenter",
        "Comprendre les phénomènes naturels",
        "Développer l'esprit scientifique",
        "Appliquer les connaissances"
      ],
      tips: "🔬 Conseil : Faites des expériences simples à la maison pour mieux comprendre les concepts."
    }
  };
  return infos[mat] || {
    welcomeMessage: "Commencez votre apprentissage !",
    objectives: ["Acquérir de nouvelles connaissances", "Développer des compétences"],
    tips: "📖 Conseil : Travaillez régulièrement pour progresser efficacement."
  };
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let matiere;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  matiere = data.matiere;
  getMatiereInfo(matiere);
  return `${$$result.head += `<!-- HEAD_svelte-1i2ujlf_START -->${$$result.title = `<title>${escape(matiere)} - Choisir un niveau - FunLearning</title>`, ""}<!-- HEAD_svelte-1i2ujlf_END -->`, ""} <div class="matiere-page svelte-imhrky"> ${``}  ${``}  ${``} </div>`;
});
export {
  Page as default
};
