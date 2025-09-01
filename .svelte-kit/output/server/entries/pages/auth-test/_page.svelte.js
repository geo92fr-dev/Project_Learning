import { c as create_ssr_component } from "../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-149e2of{padding:2rem;max-width:800px;margin:0 auto}.status.svelte-149e2of{background:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:1.5rem;margin:2rem 0}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1q11vbj_START -->${$$result.title = `<title>Test Auth - FunLearning</title>`, ""}<!-- HEAD_svelte-1q11vbj_END -->`, ""} <main class="svelte-149e2of" data-svelte-h="svelte-1ntv16o"><h1>🧪 Test Page d&#39;Authentification</h1> <p>Cette page teste le rendu basique sans Firebase.</p> <div class="status svelte-149e2of"><h2>Status des tests :</h2> <ul><li>✅ Rendu Svelte basique</li> <li>⏳ Import Firebase (à tester)</li> <li>⏳ Store d&#39;authentification (à tester)</li></ul></div> </main>`;
});
export {
  Page as default
};
