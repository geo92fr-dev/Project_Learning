import { c as create_ssr_component } from "../../../chunks/ssr.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-1nx4az3{padding:2rem;max-width:800px;margin:0 auto}.status.svelte-1nx4az3{background:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:1.5rem;margin:2rem 0}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-1q11vbj_START -->${$$result.title = `<title>Test Auth - FunLearning</title>`, ""}<!-- HEAD_svelte-1q11vbj_END -->`, ""} <main class="svelte-1nx4az3" data-svelte-h="svelte-wig5s0"><h1>🧪 Test Page d&#39;Authentification</h1> <p>Cette page teste le rendu basique sans Firebase.</p> <div class="status svelte-1nx4az3"><h2>Status des tests :</h2> <ul><li>✅ Rendu Svelte basique</li> <li>⏳ Import Firebase (à tester)</li> <li>⏳ Store d&#39;authentification (à tester)</li></ul></div> </main>`;
});
export {
  Page as default
};
