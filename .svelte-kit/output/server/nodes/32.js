

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tests/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/32.c892a88d.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/each.287b3127.js","_app/immutable/chunks/index.c5ac0418.js"];
export const stylesheets = ["_app/immutable/assets/32.3fd718f9.css"];
export const fonts = [];
