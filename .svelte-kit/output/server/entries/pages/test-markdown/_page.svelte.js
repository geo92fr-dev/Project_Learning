import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, e as each, v as validate_component, a as escape } from "../../../chunks/ssr.js";
import "../../../chunks/content.js";
import { M as MarkdownRenderer } from "../../../chunks/MarkdownRenderer.js";
import { w as writable } from "../../../chunks/index2.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '.test-page.svelte-159gvuj.svelte-159gvuj{max-width:1400px;margin:0 auto;padding:2rem;font-family:"Segoe UI", system-ui, sans-serif}header.svelte-159gvuj.svelte-159gvuj{text-align:center;margin-bottom:3rem;padding:2rem;background:linear-gradient(135deg, #10b981 0%, #059669 100%);color:white;border-radius:12px}header.svelte-159gvuj h1.svelte-159gvuj{font-size:2.5rem;margin-bottom:0.5rem;font-weight:700}header.svelte-159gvuj p.svelte-159gvuj{font-size:1.2rem;opacity:0.9;margin:0}section.svelte-159gvuj.svelte-159gvuj{margin-bottom:3rem;background:white;padding:2rem;border-radius:8px;box-shadow:0 2px 4px rgba(0, 0, 0, 0.1)}h2.svelte-159gvuj.svelte-159gvuj{font-size:1.8rem;color:#374151;margin-bottom:1.5rem;font-weight:600}.buttons.svelte-159gvuj.svelte-159gvuj{display:flex;flex-wrap:wrap;gap:1rem}.test-btn.svelte-159gvuj.svelte-159gvuj{background:#3b82f6;color:white;border:none;padding:0.75rem 1.5rem;border-radius:8px;cursor:pointer;font-size:0.9rem;font-weight:500;transition:all 0.3s ease}.test-btn.svelte-159gvuj.svelte-159gvuj:hover{background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 8px rgba(59, 130, 246, 0.3)}.demo-header.svelte-159gvuj.svelte-159gvuj{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:1.5rem;margin-bottom:2rem;text-align:center}.demo-header.svelte-159gvuj h3.svelte-159gvuj{margin:0 0 0.5rem 0;color:#1f2937;font-size:1.25rem}.demo-header.svelte-159gvuj p.svelte-159gvuj{margin:0;color:#6b7280}.features-grid.svelte-159gvuj.svelte-159gvuj{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:1.5rem}.feature-card.svelte-159gvuj.svelte-159gvuj{border:1px solid #e5e7eb;border-radius:8px;padding:1.5rem;background:#fafafa}.feature-card.svelte-159gvuj h3.svelte-159gvuj{margin:0 0 1rem 0;color:#1f2937;font-size:1.1rem;font-weight:600}.feature-card.svelte-159gvuj ul.svelte-159gvuj{margin:0;padding-left:1rem}.feature-card.svelte-159gvuj li.svelte-159gvuj{margin-bottom:0.5rem;color:#4b5563;font-size:0.9rem}@media(max-width: 768px){.test-page.svelte-159gvuj.svelte-159gvuj{padding:1rem}header.svelte-159gvuj h1.svelte-159gvuj{font-size:2rem}.buttons.svelte-159gvuj.svelte-159gvuj{flex-direction:column}.features-grid.svelte-159gvuj.svelte-159gvuj{grid-template-columns:1fr}}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $matieres, $$unsubscribe_matieres;
  let matieres = writable([]);
  $$unsubscribe_matieres = subscribe(matieres, (value) => $matieres = value);
  let testMarkdown = `# Test du MarkdownRenderer 🧪

## Introduction

Ce composant permet de **rendre du Markdown** de manière sécurisée avec des fonctionnalités avancées.

## Fonctionnalités

### 🔒 Sécurité
- Sanitisation HTML avec DOMPurify
- Protection contre les attaques XSS
- Validation du contenu

### ⚡ Performance
- Cache intelligent
- Rendu optimisé
- Temps de traitement affiché

### 🎨 Interface
- Table des matières automatique
- Métadonnées du contenu
- Design responsive

## Exemples de code

Voici un exemple en JavaScript :

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

Et en Python :

\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\`

## Liste de tâches

- [x] Composant créé
- [x] Sécurité implémentée  
- [x] Cache fonctionnel
- [ ] Tests unitaires
- [ ] Documentation complète

## Citation

> "Le code est plus souvent lu qu'écrit" - Guido van Rossum

## Tableau de comparaison

| Fonctionnalité | Avant | Maintenant |
|----------------|-------|------------|
| Sécurité | ❌ | ✅ |
| Cache | ❌ | ✅ |
| TOC | ❌ | ✅ |
| Performance | 🟡 | ✅ |

## Conclusion

Le composant MarkdownRenderer est maintenant **opérationnel** ! 🎉
`;
  $$result.css.add(css);
  $$unsubscribe_matieres();
  return `${$$result.head += `<!-- HEAD_svelte-8ipa0z_START -->${$$result.title = `<title>Test MarkdownRenderer - FunLearning</title>`, ""}<!-- HEAD_svelte-8ipa0z_END -->`, ""} <div class="test-page svelte-159gvuj"><header class="svelte-159gvuj" data-svelte-h="svelte-jqjcek"><h1 class="svelte-159gvuj">🧪 Test du composant MarkdownRenderer</h1> <p class="svelte-159gvuj">Validation du rendu Markdown avancé avec table des matières et métadonnées</p></header> <section class="controls svelte-159gvuj"><h2 class="svelte-159gvuj" data-svelte-h="svelte-1jmi0bt">🎛️ Options de test</h2> <div class="buttons svelte-159gvuj"><button class="test-btn svelte-159gvuj" data-svelte-h="svelte-uy7ib">📝 Test Markdown brut</button> ${each($matieres || [], (matiere) => {
    return `<button class="test-btn svelte-159gvuj">📖 Test cours: ${escape(matiere.nom)} </button>`;
  })}</div></section> <section class="demo-section svelte-159gvuj"><h2 class="svelte-159gvuj" data-svelte-h="svelte-41f1gd">🎨 Démonstration</h2> ${`<div class="demo-header svelte-159gvuj" data-svelte-h="svelte-1vyxhkw"><h3 class="svelte-159gvuj">Mode Markdown libre</h3> <p class="svelte-159gvuj">Rendu de contenu Markdown avec table des matières</p></div> ${validate_component(MarkdownRenderer, "MarkdownRenderer").$$render(
    $$result,
    {
      content: testMarkdown,
      showMeta: true,
      showToc: true
    },
    {},
    {}
  )}`}</section> <section class="features-section svelte-159gvuj" data-svelte-h="svelte-18ccfoa"><h2 class="svelte-159gvuj">✨ Fonctionnalités testées</h2> <div class="features-grid svelte-159gvuj"><div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">🔒 Sécurité</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Sanitisation DOMPurify</li> <li class="svelte-159gvuj">✅ Protection XSS</li> <li class="svelte-159gvuj">✅ Tags HTML filtrés</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">📋 Table des matières</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Extraction automatique</li> <li class="svelte-159gvuj">✅ Navigation fluide</li> <li class="svelte-159gvuj">✅ Hiérarchie respectée</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">⚡ Performance</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Cache intelligent</li> <li class="svelte-159gvuj">✅ Temps de traitement</li> <li class="svelte-159gvuj">✅ Rendu optimisé</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">🎨 Interface</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Design responsive</li> <li class="svelte-159gvuj">✅ Coloration syntaxique</li> <li class="svelte-159gvuj">✅ Métadonnées riches</li></ul></div></div></section> </div>`;
});
export {
  Page as default
};
