import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, b as each, e as escape } from "../../../chunks/ssr.js";
import { c as coursesByCategory } from "../../../chunks/content.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".badge-success.svelte-3id1be{background-color:rgb(34 197 94);color:white}.badge-warning.svelte-3id1be{background-color:rgb(245 158 11);color:white}.badge-error.svelte-3id1be{background-color:rgb(239 68 68);color:white}.badge-neutral.svelte-3id1be{background-color:rgb(107 114 128);color:white}",
  map: null
};
function getLevelBadgeClass(level) {
  switch (level) {
    case "beginner":
      return "badge-success";
    case "intermediate":
      return "badge-warning";
    case "advanced":
      return "badge-error";
    default:
      return "badge-neutral";
  }
}
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
  }
  return `${mins}min`;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $coursesByCategory, $$unsubscribe_coursesByCategory;
  $$unsubscribe_coursesByCategory = subscribe(coursesByCategory, (value) => $coursesByCategory = value);
  $$result.css.add(css);
  $$unsubscribe_coursesByCategory();
  return `${$$result.head += `<!-- HEAD_svelte-eoqg56_START -->${$$result.title = `<title>Cours - FunLearning</title>`, ""}<meta name="description" content="Découvrez nos cours interactifs pour apprendre le développement web"><!-- HEAD_svelte-eoqg56_END -->`, ""} <div class="container mx-auto px-4 py-8"><header class="mb-8" data-svelte-h="svelte-14q1pvf"><h1 class="text-4xl font-bold text-center mb-4">📚 Nos Cours</h1> <p class="text-lg text-center text-gray-600">Explorez notre catalogue de cours interactifs et progressez à votre rythme</p></header> ${$coursesByCategory && Object.keys($coursesByCategory).length > 0 ? `${each(Object.entries($coursesByCategory), ([category, categoryCourses]) => {
    return `<section class="mb-12"><h2 class="text-2xl font-semibold mb-6 text-blue-600">${escape(category)}</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${each(categoryCourses, (course) => {
      return `<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"><div class="card-body"><h3 class="card-title text-lg">${escape(course.metadata.title)} <div class="${"badge " + escape(getLevelBadgeClass(course.metadata.level), true) + " svelte-3id1be"}">${escape(course.metadata.level)} </div></h3> <p class="text-sm text-gray-600 mb-4">${escape(course.metadata.description)}</p> <div class="flex flex-wrap gap-1 mb-4">${each(course.metadata.tags, (tag) => {
        return `<span class="badge badge-outline badge-sm">${escape(tag)}</span>`;
      })}</div> <div class="flex justify-between items-center text-sm text-gray-500 mb-4"><span>⏱️ ${escape(formatDuration(course.metadata.duration))}</span> <span>👤 ${escape(course.metadata.author)}</span></div> <div class="card-actions justify-end"><a href="${"/cours/" + escape(course.slug, true)}" class="btn btn-primary btn-sm">Commencer</a> </div></div> </div>`;
    })}</div> </section>`;
  })}` : `<div class="text-center py-12" data-svelte-h="svelte-1wr2j0o"><div class="loading loading-spinner loading-lg"></div> <p class="mt-4 text-gray-600">Chargement des cours...</p></div>`} </div>`;
});
export {
  Page as default
};
