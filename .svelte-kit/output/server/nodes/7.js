

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cours/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.106f269d.js","_app/immutable/chunks/scheduler.53ef06e3.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.aeab89ec.js","_app/immutable/chunks/content.32123c58.js","_app/immutable/chunks/index.2202404a.js"];
export const stylesheets = ["_app/immutable/assets/7.474686d9.css"];
export const fonts = [];
