

export const index = 19;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/19.d50d7700.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/each.287b3127.js","_app/immutable/chunks/index.c5ac0418.js"];
export const stylesheets = ["_app/immutable/assets/19.fc72e832.css"];
export const fonts = [];
