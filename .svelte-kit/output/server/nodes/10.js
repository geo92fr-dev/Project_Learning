

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/pedagogy/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.a83c489c.js","_app/immutable/chunks/scheduler.53ef06e3.js","_app/immutable/chunks/index.aeab89ec.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.2202404a.js"];
export const stylesheets = ["_app/immutable/assets/10.353d629f.css"];
export const fonts = [];
