import { s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component } from "../../../../chunks/ssr.js";
import { i as isAuthenticated } from "../../../../chunks/googleAuth.js";
/* empty css                                                           */const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".login-container.svelte-ngxpy4.svelte-ngxpy4{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:1rem}.login-card.svelte-ngxpy4.svelte-ngxpy4{background:white;border-radius:16px;box-shadow:0 20px 40px rgba(0, 0, 0, 0.1);padding:2.5rem;width:100%;max-width:420px;animation:svelte-ngxpy4-slideUp 0.6s ease-out}.login-header.svelte-ngxpy4.svelte-ngxpy4{text-align:center;margin-bottom:2rem}.login-header.svelte-ngxpy4 h1.svelte-ngxpy4{color:#2d3748;font-size:1.875rem;font-weight:700;margin-bottom:0.5rem}.login-header.svelte-ngxpy4 p.svelte-ngxpy4{color:#718096;font-size:1rem}.message.svelte-ngxpy4.svelte-ngxpy4{padding:1rem;border-radius:8px;margin-bottom:1.5rem;font-weight:500}.message.success.svelte-ngxpy4.svelte-ngxpy4{background-color:#f0fff4;border:1px solid #9ae6b4;color:#276749}.message.error.svelte-ngxpy4.svelte-ngxpy4{background-color:#fed7d7;border:1px solid #feb2b2;color:#c53030}.loading-indicator.svelte-ngxpy4.svelte-ngxpy4{margin-top:0.5rem;font-size:0.875rem;color:#4a5568}.auth-section.svelte-ngxpy4.svelte-ngxpy4{margin-bottom:2rem}.login-footer.svelte-ngxpy4.svelte-ngxpy4{text-align:center;font-size:0.875rem;color:#718096}.login-footer.svelte-ngxpy4 a.svelte-ngxpy4{color:#667eea;text-decoration:none;margin-top:1rem;display:inline-block;transition:color 0.2s}.login-footer.svelte-ngxpy4 a.svelte-ngxpy4:hover{color:#5a67d8}.loading-container.svelte-ngxpy4.svelte-ngxpy4{display:flex;flex-direction:column;align-items:center;gap:1rem;color:white}.spinner.svelte-ngxpy4.svelte-ngxpy4{width:40px;height:40px;border:4px solid rgba(255, 255, 255, 0.3);border-top:4px solid white;border-radius:50%;animation:svelte-ngxpy4-spin 1s linear infinite}@keyframes svelte-ngxpy4-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes svelte-ngxpy4-slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@media(max-width: 480px){.login-card.svelte-ngxpy4.svelte-ngxpy4{padding:1.5rem;margin:0.5rem}.login-header.svelte-ngxpy4 h1.svelte-ngxpy4{font-size:1.5rem}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_isAuthenticated;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  $$result.css.add(css);
  $$unsubscribe_isAuthenticated();
  return `${$$result.head += `<!-- HEAD_svelte-1k6z8d8_START -->${$$result.title = `<title>Connexion - FunLearning</title>`, ""}<meta name="description" content="Connectez-vous à FunLearning avec votre compte Google"><!-- HEAD_svelte-1k6z8d8_END -->`, ""} <main class="login-container svelte-ngxpy4">${`<div class="loading-container svelte-ngxpy4" data-svelte-h="svelte-qc7skv"><div class="spinner svelte-ngxpy4"></div> <p>Chargement...</p></div>`} </main>`;
});
export {
  Page as default
};
