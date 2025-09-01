

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth-test/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.bd6beecf.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js"];
export const stylesheets = ["_app/immutable/assets/10.5b0b544c.css"];
export const fonts = [];
