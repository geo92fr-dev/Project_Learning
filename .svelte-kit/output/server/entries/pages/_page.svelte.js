import { c as create_ssr_component } from "../../chunks/ssr.js";
import "../../chunks/firebase.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".container.svelte-3q0wdd.svelte-3q0wdd{max-width:1200px;margin:0 auto;padding:2rem}.hero.svelte-3q0wdd.svelte-3q0wdd{text-align:center;margin-bottom:3rem}.hero.svelte-3q0wdd h1.svelte-3q0wdd{font-size:3rem;color:#2563eb;margin-bottom:1rem}.phase-status.svelte-3q0wdd.svelte-3q0wdd{background:#10b981;color:white;padding:0.5rem 1rem;border-radius:6px;display:inline-block;margin-top:1rem}.status-grid.svelte-3q0wdd.svelte-3q0wdd{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:1.5rem;margin-top:1.5rem}.status-card.svelte-3q0wdd.svelte-3q0wdd{border:2px solid #10b981;border-radius:8px;padding:1.5rem;background:#f0fdf4}.status-card.pending.svelte-3q0wdd.svelte-3q0wdd{border-color:#f59e0b;background:#fffbeb}.status-card.svelte-3q0wdd h3.svelte-3q0wdd{margin:0 0 0.5rem 0;font-size:1.2rem}footer.svelte-3q0wdd.svelte-3q0wdd{text-align:center;margin-top:3rem;padding-top:2rem;border-top:1px solid #e5e7eb;color:#6b7280}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-15aats4_START -->${$$result.title = `<title>FunLearning V2.0 - Plateforme Éducative</title>`, ""}<meta name="description" content="Plateforme d'apprentissage personnalisée"><!-- HEAD_svelte-15aats4_END -->`, ""} <main class="container svelte-3q0wdd" data-svelte-h="svelte-15uorl8"><header class="hero svelte-3q0wdd"><h1 class="svelte-3q0wdd">🚀 FunLearning V2.0</h1> <p>Plateforme d&#39;apprentissage personnalisée et adaptive</p> <p class="phase-status svelte-3q0wdd">📋 Phase 1 : Setup &amp; Architecture ✅</p></header> <section class="status"><h2>🏗️ État du Projet</h2> <div class="status-grid svelte-3q0wdd"><div class="status-card svelte-3q0wdd"><h3 class="svelte-3q0wdd">✅ Phase 1 - Setup</h3> <p>SvelteKit + TypeScript + Tests configurés</p></div> <div class="status-card pending svelte-3q0wdd"><h3 class="svelte-3q0wdd">⏳ Phase 2 - Auth Firebase</h3> <p>Authentification complète (à venir)</p></div> <div class="status-card pending svelte-3q0wdd"><h3 class="svelte-3q0wdd">⏳ Phase 3 - Contenus</h3> <p>Structure des cours (à venir)</p></div></div></section> <footer class="svelte-3q0wdd"><p>🎯 Développement méthodique selon roadmap 12 phases</p></footer> </main>`;
});
export {
  Page as default
};
