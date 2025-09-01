import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, d as createEventDispatcher, a as escape, b as add_attribute, v as validate_component } from "../../../chunks/ssr.js";
import { e as error, l as loading, u as user, i as isAuthenticated } from "../../../chunks/googleAuth.js";
/* empty css                                                        *//* empty css                                                       */function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate" || key === "on_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const goto = /* @__PURE__ */ client_method("goto");
const css$1 = {
  code: ".google-auth-component.svelte-11msynr.svelte-11msynr{width:100%;max-width:400px}.error-banner.svelte-11msynr.svelte-11msynr{background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;padding:0.75rem;border-radius:6px;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;font-size:0.9rem}.error-dismiss.svelte-11msynr.svelte-11msynr{background:none;border:none;color:#dc2626;cursor:pointer;font-size:1.1rem;padding:0.25rem;border-radius:3px}.error-dismiss.svelte-11msynr.svelte-11msynr:hover{background:#fee2e2}.google-signin-btn.svelte-11msynr.svelte-11msynr{width:100%;display:flex;align-items:center;justify-content:center;gap:0.75rem;padding:0.875rem 1rem;background:white;border:2px solid #dadce0;border-radius:8px;color:#3c4043;font-family:inherit;font-size:1rem;font-weight:500;cursor:pointer;transition:all 0.2s ease}.google-signin-btn.svelte-11msynr.svelte-11msynr:hover:not(:disabled){border-color:#c4c7ca;box-shadow:0 2px 4px rgba(0, 0, 0, 0.1)}.google-signin-btn.svelte-11msynr.svelte-11msynr:active:not(:disabled){background:#f8f9fa}.google-signin-btn.svelte-11msynr.svelte-11msynr:disabled{opacity:0.6;cursor:not-allowed}.google-signin-btn.small.svelte-11msynr.svelte-11msynr{padding:0.5rem 0.75rem;font-size:0.9rem}.google-signin-btn.large.svelte-11msynr.svelte-11msynr{padding:1rem 1.25rem;font-size:1.1rem}.google-icon.svelte-11msynr.svelte-11msynr{display:flex;align-items:center;justify-content:center}.spinner.svelte-11msynr.svelte-11msynr{width:20px;height:20px;border:2px solid #f3f3f3;border-top:2px solid #4285f4;border-radius:50%;animation:svelte-11msynr-spin 1s linear infinite}@keyframes svelte-11msynr-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.user-info.svelte-11msynr.svelte-11msynr{display:flex;align-items:center;gap:1rem;padding:1rem;background:#f8f9fa;border-radius:8px;border:1px solid #e0e0e0}.user-avatar.svelte-11msynr.svelte-11msynr{width:40px;height:40px;border-radius:50%;overflow:hidden;flex-shrink:0}.user-avatar.svelte-11msynr img.svelte-11msynr{width:100%;height:100%;object-fit:cover}.avatar-placeholder.svelte-11msynr.svelte-11msynr{width:100%;height:100%;background:#4285f4;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.2rem}.user-details.svelte-11msynr.svelte-11msynr{flex:1}.user-name.svelte-11msynr.svelte-11msynr{font-weight:600;color:#202124;margin-bottom:0.25rem}.user-email.svelte-11msynr.svelte-11msynr{font-size:0.9rem;color:#5f6368}.signout-btn.svelte-11msynr.svelte-11msynr{background:#ea4335;color:white;border:none;padding:0.5rem 1rem;border-radius:6px;font-size:0.9rem;cursor:pointer;transition:background 0.2s}.signout-btn.svelte-11msynr.svelte-11msynr:hover:not(:disabled){background:#d33b2c}.signout-btn.svelte-11msynr.svelte-11msynr:disabled{opacity:0.6;cursor:not-allowed}",
  map: null
};
const GoogleAuth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentUser;
  let isLoading;
  let authError;
  let isAuthenticated2;
  let $error, $$unsubscribe_error;
  let $loading, $$unsubscribe_loading;
  let $user, $$unsubscribe_user;
  $$unsubscribe_error = subscribe(error, (value) => $error = value);
  $$unsubscribe_loading = subscribe(loading, (value) => $loading = value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  createEventDispatcher();
  let { buttonText = "Se connecter avec Google" } = $$props;
  let { showUserInfo = true } = $$props;
  let { size = "medium" } = $$props;
  if ($$props.buttonText === void 0 && $$bindings.buttonText && buttonText !== void 0)
    $$bindings.buttonText(buttonText);
  if ($$props.showUserInfo === void 0 && $$bindings.showUserInfo && showUserInfo !== void 0)
    $$bindings.showUserInfo(showUserInfo);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$1);
  currentUser = $user;
  isLoading = $loading;
  authError = $error;
  isAuthenticated2 = currentUser !== null;
  $$unsubscribe_error();
  $$unsubscribe_loading();
  $$unsubscribe_user();
  return `<div class="google-auth-component svelte-11msynr" data-testid="google-auth">${authError ? `<div class="error-banner svelte-11msynr" data-testid="error-banner"><span class="error-text">${escape(authError)}</span> <button class="error-dismiss svelte-11msynr" aria-label="Fermer l'erreur" data-svelte-h="svelte-yc4nmv">✕</button></div>` : ``} ${!isAuthenticated2 ? ` <button class="${[
    "google-signin-btn " + escape(size, true) + " svelte-11msynr",
    isLoading ? "loading" : ""
  ].join(" ").trim()}" ${isLoading ? "disabled" : ""} data-testid="google-signin-btn">${isLoading ? `<div class="spinner svelte-11msynr" data-testid="loading-spinner"></div> <span data-svelte-h="svelte-1l25ql8">Connexion en cours...</span>` : `<div class="google-icon svelte-11msynr" data-svelte-h="svelte-1bo5srv"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg></div> <span>${escape(buttonText)}</span>`}</button>` : `${showUserInfo ? ` <div class="user-info svelte-11msynr" data-testid="user-info"><div class="user-avatar svelte-11msynr">${currentUser?.photoURL ? `<img${add_attribute("src", currentUser.photoURL, 0)} alt="Avatar" class="svelte-11msynr">` : `<div class="avatar-placeholder svelte-11msynr">${escape(currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || "👤")}</div>`}</div> <div class="user-details svelte-11msynr"><div class="user-name svelte-11msynr">${escape(currentUser?.displayName || "Utilisateur")}</div> <div class="user-email svelte-11msynr">${escape(currentUser?.email || "")}</div></div> <button class="signout-btn svelte-11msynr" ${isLoading ? "disabled" : ""} data-testid="signout-btn">${escape(isLoading ? "..." : "Déconnexion")}</button></div>` : ``}`} </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".auth-page.svelte-1fzri4d.svelte-1fzri4d{min-height:100vh;display:grid;grid-template-columns:1fr 400px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%)}.auth-container.svelte-1fzri4d.svelte-1fzri4d{padding:2rem;display:flex;flex-direction:column;justify-content:center;min-height:100vh}.auth-header.svelte-1fzri4d.svelte-1fzri4d{text-align:center;margin-bottom:2rem;color:white}.logo.svelte-1fzri4d h1.svelte-1fzri4d{margin:0;font-size:2.5rem;font-weight:700;text-shadow:0 2px 4px rgba(0, 0, 0, 0.1)}.auth-header.svelte-1fzri4d h2.svelte-1fzri4d{margin:1rem 0 0.5rem 0;font-size:1.75rem;font-weight:600}.auth-header.svelte-1fzri4d p.svelte-1fzri4d{margin:0;opacity:0.9;font-size:1.1rem}.auth-tabs.svelte-1fzri4d.svelte-1fzri4d{display:flex;background:rgba(255, 255, 255, 0.1);border-radius:0.75rem;padding:0.25rem;margin-bottom:2rem;backdrop-filter:blur(10px)}.tab-button.svelte-1fzri4d.svelte-1fzri4d{flex:1;padding:0.75rem 1rem;border:none;background:transparent;color:white;border-radius:0.5rem;cursor:pointer;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;gap:0.5rem;font-weight:500}.tab-button.svelte-1fzri4d.svelte-1fzri4d:hover{background:rgba(255, 255, 255, 0.1)}.tab-button.active.svelte-1fzri4d.svelte-1fzri4d{background:white;color:#667eea;box-shadow:0 2px 8px rgba(0, 0, 0, 0.1)}.tab-icon.svelte-1fzri4d.svelte-1fzri4d{width:1.25rem;height:1.25rem}.auth-content.svelte-1fzri4d.svelte-1fzri4d{background:white;border-radius:1rem;padding:2rem;box-shadow:0 10px 25px rgba(0, 0, 0, 0.1);backdrop-filter:blur(10px)}.auth-method.svelte-1fzri4d.svelte-1fzri4d{min-height:400px;display:flex;flex-direction:column;justify-content:center}.method-description.svelte-1fzri4d.svelte-1fzri4d{text-align:center;margin-bottom:2rem}.method-description.svelte-1fzri4d h3.svelte-1fzri4d{margin:0 0 0.5rem 0;color:#2c3e50;font-size:1.25rem}.method-description.svelte-1fzri4d p.svelte-1fzri4d{margin:0;color:#6c757d;line-height:1.5}.auth-footer.svelte-1fzri4d.svelte-1fzri4d{margin-top:2rem;text-align:center}.footer-links.svelte-1fzri4d.svelte-1fzri4d{display:flex;justify-content:center;gap:2rem;margin-bottom:1rem}.footer-link.svelte-1fzri4d.svelte-1fzri4d{color:white;text-decoration:none;opacity:0.9;transition:opacity 0.2s ease}.footer-link.svelte-1fzri4d.svelte-1fzri4d:hover{opacity:1;text-decoration:underline}.footer-info.svelte-1fzri4d.svelte-1fzri4d{color:white;opacity:0.8;font-size:0.875rem;line-height:1.5}.footer-info.svelte-1fzri4d .link.svelte-1fzri4d{color:white;text-decoration:underline}.auth-sidebar.svelte-1fzri4d.svelte-1fzri4d{background:rgba(255, 255, 255, 0.95);padding:3rem 2rem;display:flex;align-items:center;backdrop-filter:blur(10px)}.sidebar-content.svelte-1fzri4d h3.svelte-1fzri4d{margin:0 0 2rem 0;color:#2c3e50;font-size:1.5rem;font-weight:600}.feature-list.svelte-1fzri4d.svelte-1fzri4d{display:flex;flex-direction:column;gap:1.5rem}.feature-item.svelte-1fzri4d.svelte-1fzri4d{display:flex;gap:1rem;align-items:flex-start}.feature-icon.svelte-1fzri4d.svelte-1fzri4d{width:3rem;height:3rem;background:linear-gradient(135deg, #667eea, #764ba2);border-radius:0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0}.feature-text.svelte-1fzri4d h4.svelte-1fzri4d{margin:0 0 0.25rem 0;color:#2c3e50;font-size:1rem;font-weight:600}.feature-text.svelte-1fzri4d p.svelte-1fzri4d{margin:0;color:#6c757d;font-size:0.875rem;line-height:1.4}@media(max-width: 1024px){.auth-page.svelte-1fzri4d.svelte-1fzri4d{grid-template-columns:1fr}.auth-sidebar.svelte-1fzri4d.svelte-1fzri4d{order:-1;padding:2rem}.sidebar-content.svelte-1fzri4d h3.svelte-1fzri4d{font-size:1.25rem;margin-bottom:1.5rem}.feature-list.svelte-1fzri4d.svelte-1fzri4d{display:grid;grid-template-columns:1fr 1fr;gap:1rem}}@media(max-width: 768px){.auth-container.svelte-1fzri4d.svelte-1fzri4d{padding:1rem}.auth-content.svelte-1fzri4d.svelte-1fzri4d{padding:1.5rem}.footer-links.svelte-1fzri4d.svelte-1fzri4d{flex-direction:column;gap:1rem}.feature-list.svelte-1fzri4d.svelte-1fzri4d{grid-template-columns:1fr}.feature-item.svelte-1fzri4d.svelte-1fzri4d{gap:0.75rem}.feature-icon.svelte-1fzri4d.svelte-1fzri4d{width:2.5rem;height:2.5rem;font-size:1rem}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  $$result.css.add(css);
  {
    if ($isAuthenticated) {
      goto("/dashboard");
    }
  }
  $$unsubscribe_isAuthenticated();
  return `${$$result.head += `<!-- HEAD_svelte-plkxmz_START -->${$$result.title = `<title>Se connecter - FunLearning</title>`, ""}<meta name="description" content="Connectez-vous à votre compte FunLearning pour accéder à vos cours et suivre votre progression."><!-- HEAD_svelte-plkxmz_END -->`, ""} <div class="auth-page svelte-1fzri4d"><div class="auth-container svelte-1fzri4d"><header class="auth-header svelte-1fzri4d" data-svelte-h="svelte-nhgw4m"><div class="logo svelte-1fzri4d"><h1 class="svelte-1fzri4d">🎓 FunLearning</h1></div> <h2 class="svelte-1fzri4d">Connectez-vous à votre compte</h2> <p class="svelte-1fzri4d">Accédez à votre parcours d&#39;apprentissage personnalisé</p></header> <div class="auth-tabs svelte-1fzri4d"><button class="${["tab-button svelte-1fzri4d", "active"].join(" ").trim()}" data-svelte-h="svelte-1fdj2b0"><svg class="tab-icon svelte-1fzri4d" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
        Google</button> <button class="${["tab-button svelte-1fzri4d", ""].join(" ").trim()}" data-svelte-h="svelte-1rmt2eu"><svg class="tab-icon svelte-1fzri4d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        Email</button></div> <div class="auth-content svelte-1fzri4d">${`<div class="auth-method svelte-1fzri4d"><div class="method-description svelte-1fzri4d" data-svelte-h="svelte-5q8god"><h3 class="svelte-1fzri4d">Connexion rapide avec Google</h3> <p class="svelte-1fzri4d">Utilisez votre compte Google pour vous connecter en un clic.
              Sécurisé et pratique.</p></div> ${validate_component(GoogleAuth, "GoogleAuth").$$render($$result, {}, {}, {})}</div>`}</div> <footer class="auth-footer svelte-1fzri4d" data-svelte-h="svelte-r4ku4z"><div class="footer-links svelte-1fzri4d"><a href="/" class="footer-link svelte-1fzri4d">← Retour à l&#39;accueil</a> <a href="/help" class="footer-link svelte-1fzri4d">Besoin d&#39;aide ?</a></div> <div class="footer-info svelte-1fzri4d"><p>En vous connectant, vous acceptez nos
          <a href="/terms" class="link svelte-1fzri4d">conditions d&#39;utilisation</a>
          et notre
          <a href="/privacy" class="link svelte-1fzri4d">politique de confidentialité</a>.</p></div></footer></div> <div class="auth-sidebar svelte-1fzri4d" data-svelte-h="svelte-1feaeri"><div class="sidebar-content svelte-1fzri4d"><h3 class="svelte-1fzri4d">Pourquoi FunLearning ?</h3> <div class="feature-list svelte-1fzri4d"><div class="feature-item svelte-1fzri4d"><div class="feature-icon svelte-1fzri4d">🎯</div> <div class="feature-text svelte-1fzri4d"><h4 class="svelte-1fzri4d">Apprentissage personnalisé</h4> <p class="svelte-1fzri4d">Des cours adaptés à votre niveau et à votre rythme</p></div></div> <div class="feature-item svelte-1fzri4d"><div class="feature-icon svelte-1fzri4d">📊</div> <div class="feature-text svelte-1fzri4d"><h4 class="svelte-1fzri4d">Suivi de progression</h4> <p class="svelte-1fzri4d">Visualisez vos progrès et vos réussites</p></div></div> <div class="feature-item svelte-1fzri4d"><div class="feature-icon svelte-1fzri4d">🎮</div> <div class="feature-text svelte-1fzri4d"><h4 class="svelte-1fzri4d">Exercices interactifs</h4> <p class="svelte-1fzri4d">Apprenez en vous amusant avec nos exercices ludiques</p></div></div> <div class="feature-item svelte-1fzri4d"><div class="feature-icon svelte-1fzri4d">🏆</div> <div class="feature-text svelte-1fzri4d"><h4 class="svelte-1fzri4d">Récompenses</h4> <p class="svelte-1fzri4d">Débloquez des badges et célébrez vos achievements</p></div></div></div></div></div> </div>`;
});
export {
  Page as default
};
