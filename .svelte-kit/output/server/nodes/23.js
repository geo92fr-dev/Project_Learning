

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/roadmap/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/23.02a4623d.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/each.287b3127.js","_app/immutable/chunks/index.c5ac0418.js"];
export const stylesheets = ["_app/immutable/assets/23.a0c84e7a.css"];
export const fonts = [];
