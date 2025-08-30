import { c as create_ssr_component, e as escape } from "../../chunks/ssr.js";
const version = "1.0.0-alpha";
const phase = "Phase 0 - Setup & Architecture";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-9se9nm{text-align:center;padding:2rem;max-width:800px;margin:0 auto}h1.svelte-9se9nm{color:#ff3e00;text-transform:uppercase;font-size:2.5rem;font-weight:100;margin-bottom:2rem}.info.svelte-9se9nm{background:#f9f9f9;padding:1.5rem;border-radius:8px;margin-top:2rem}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-10fiqy5_START -->${$$result.title = `<title>FunLearning - ${escape(phase)}</title>`, ""}<meta name="description" content="Application d'apprentissage interactive"><!-- HEAD_svelte-10fiqy5_END -->`, ""} <main class="svelte-9se9nm"><h1 class="svelte-9se9nm" data-svelte-h="svelte-eqqk9i">🎓 FunLearning</h1> <div class="status"><h2 data-svelte-h="svelte-1lqraka">Statut du Projet</h2> <p><strong data-svelte-h="svelte-1iruewa">Version:</strong> ${escape(version)}</p> <p><strong data-svelte-h="svelte-k37o30">Phase actuelle:</strong> ${escape(phase)}</p> <p data-svelte-h="svelte-7ez1b2"><strong>Statut:</strong> ✅ Configuration de base terminée</p></div> <div class="info svelte-9se9nm" data-svelte-h="svelte-p8cba1"><h3>Phase 0 - Setup &amp; Architecture</h3> <ul><li>✅ SvelteKit configuré</li> <li>✅ Structure de dossiers créée</li> <li>✅ Tests unitaires configurés (Vitest)</li> <li>✅ TypeScript configuré</li> <li>🎯 Prêt pour Phase 1 (Firebase &amp; Auth)</li></ul></div> </main>`;
});
export {
  Page as default
};
