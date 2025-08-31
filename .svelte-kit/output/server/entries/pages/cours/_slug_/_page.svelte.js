import { s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component, e as escape } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import { a as currentCourse } from "../../../../chunks/content.js";
import "marked";
import "dompurify";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '.prose.svelte-evf9nm h1{font-size:2rem;font-weight:bold;color:#2563eb;margin-top:2rem;margin-bottom:1rem}.prose.svelte-evf9nm h2{font-size:1.5rem;font-weight:600;color:#3b82f6;margin-top:1.5rem;margin-bottom:0.75rem}.prose.svelte-evf9nm pre{background-color:#1f2937;color:#10b981;padding:1rem;border-radius:0.5rem;overflow-x:auto;margin:1rem 0}.prose.svelte-evf9nm code{background-color:#f3f4f6;padding:0.25rem 0.5rem;border-radius:0.25rem;font-family:"Courier New", monospace}.prose.svelte-evf9nm pre code{background-color:transparent;padding:0;color:#10b981}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  let $currentCourse, $$unsubscribe_currentCourse;
  $$unsubscribe_page = subscribe(page, (value) => value);
  $$unsubscribe_currentCourse = subscribe(currentCourse, (value) => $currentCourse = value);
  $$result.css.add(css);
  $$unsubscribe_page();
  $$unsubscribe_currentCourse();
  return `${$$result.head += `<!-- HEAD_svelte-rix04u_START -->${$currentCourse ? `${$$result.title = `<title>${escape($currentCourse.metadata.title)} - FunLearning</title>`, ""}` : ``}<!-- HEAD_svelte-rix04u_END -->`, ""} <div class="container mx-auto px-4 py-8">${`<div class="text-center py-12" data-svelte-h="svelte-34dcjp"><div class="loading loading-spinner loading-lg"></div> <p class="mt-4">Chargement du cours...</p></div>`} </div>`;
});
export {
  Page as default
};
