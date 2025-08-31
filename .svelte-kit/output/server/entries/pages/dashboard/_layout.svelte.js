import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component } from "../../../chunks/ssr.js";
import { l as loading, i as isAuthenticated, u as user } from "../../../chunks/googleAuth.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".loading-container.svelte-xthnhy.svelte-xthnhy,.redirecting-container.svelte-xthnhy.svelte-xthnhy{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;background:#f7fafc}.spinner.svelte-xthnhy.svelte-xthnhy{width:40px;height:40px;border:4px solid #e2e8f0;border-top:4px solid #667eea;border-radius:50%;animation:svelte-xthnhy-spin 1s linear infinite}.dashboard-layout.svelte-xthnhy.svelte-xthnhy{min-height:100vh;background:#f7fafc}.dashboard-header.svelte-xthnhy.svelte-xthnhy{background:white;border-bottom:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0, 0, 0, 0.1)}.dashboard-nav.svelte-xthnhy.svelte-xthnhy{max-width:1200px;margin:0 auto;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center}.nav-brand.svelte-xthnhy h1.svelte-xthnhy{color:#2d3748;font-size:1.5rem;font-weight:700;margin:0}.nav-user.svelte-xthnhy.svelte-xthnhy{display:flex;align-items:center;gap:1rem}.nav-user.svelte-xthnhy span.svelte-xthnhy{color:#4a5568;font-weight:500}.logout-btn.svelte-xthnhy.svelte-xthnhy{background:#667eea;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;font-size:0.875rem;font-weight:500;cursor:pointer;transition:background-color 0.2s}.logout-btn.svelte-xthnhy.svelte-xthnhy:hover{background:#5a67d8}.dashboard-content.svelte-xthnhy.svelte-xthnhy{max-width:1200px;margin:0 auto;padding:2rem}@keyframes svelte-xthnhy-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@media(max-width: 768px){.dashboard-nav.svelte-xthnhy.svelte-xthnhy{padding:1rem;flex-direction:column;gap:1rem}.dashboard-content.svelte-xthnhy.svelte-xthnhy{padding:1rem}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_loading;
  let $$unsubscribe_isAuthenticated;
  let $$unsubscribe_user;
  $$unsubscribe_loading = subscribe(loading, (value) => value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  $$unsubscribe_user = subscribe(user, (value) => value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  $$unsubscribe_loading();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_user();
  return `${$$result.head += `<!-- HEAD_svelte-1aa0j4h_START -->${$$result.title = `<title>Dashboard - FunLearning</title>`, ""}<!-- HEAD_svelte-1aa0j4h_END -->`, ""} ${`<div class="loading-container svelte-xthnhy" data-svelte-h="svelte-4m3p7z"><div class="spinner svelte-xthnhy"></div> <p>Chargement...</p></div>`}`;
});
export {
  Layout as default
};
