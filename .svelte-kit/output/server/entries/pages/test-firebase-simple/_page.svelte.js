import { c as create_ssr_component, e as escape, a as each } from "../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".container.svelte-1dj1nfk{max-width:600px;margin:2rem auto;padding:1rem}.status-card.svelte-1dj1nfk,.results-card.svelte-1dj1nfk,.next-steps.svelte-1dj1nfk{background:white;border-radius:8px;padding:1.5rem;margin-bottom:1rem;box-shadow:0 2px 4px rgba(0,0,0,0.1)}.status.svelte-1dj1nfk{font-size:1.2em;font-weight:bold;margin:1rem 0}.error.svelte-1dj1nfk{color:#dc2626;background:#fef2f2;padding:0.5rem;border-radius:4px;margin:0.5rem 0}ul.svelte-1dj1nfk{list-style:none;padding:0}li.svelte-1dj1nfk{padding:0.5rem;margin:0.25rem 0;background:#f8fafc;border-radius:4px}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let status = "Chargement...";
  let details = {};
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-s1y5dg_START -->${$$result.title = `<title>Test Firebase Simple - Phase 2</title>`, ""}<!-- HEAD_svelte-s1y5dg_END -->`, ""} <main><div class="container svelte-1dj1nfk"><h1 data-svelte-h="svelte-1p80ifb">🔧 Test Firebase - Phase 2</h1> <div class="status-card svelte-1dj1nfk"><h2 data-svelte-h="svelte-s3byxx">Statut</h2> <p class="status svelte-1dj1nfk">${escape(status)}</p></div> ${details.results ? `<div class="results-card svelte-1dj1nfk"><h3 data-svelte-h="svelte-1ambu6s">Résultats détaillés</h3> <ul class="svelte-1dj1nfk"><li class="svelte-1dj1nfk">Firebase Auth: ${escape(details.results.auth ? "✅" : "❌")}</li> <li class="svelte-1dj1nfk">Firestore: ${escape(details.results.firestore ? "✅" : "❌")}</li> <li class="svelte-1dj1nfk">Auth anonyme: ${escape(details.results.anonymousAuth ? "✅" : "❌")}</li></ul> ${details.errors && details.errors.length > 0 ? `<div class="errors"><h4 data-svelte-h="svelte-dhiyza">Erreurs:</h4> ${each(details.errors, (error) => {
    return `<p class="error svelte-1dj1nfk">${escape(error)}</p>`;
  })}</div>` : ``}</div>` : ``} <div class="next-steps svelte-1dj1nfk" data-svelte-h="svelte-1uc3mry"><h3>✅ Phase 2A - Configuration Firebase</h3> <p>Si ce test réussit, nous pouvons passer à la Phase 2B : Interface d&#39;authentification</p></div></div> </main>`;
});
export {
  Page as default
};
