

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-auth/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/24.3b112e7d.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js","_app/immutable/chunks/auth.6566adde.js","_app/immutable/chunks/index.ce9bc0b6.js"];
export const stylesheets = ["_app/immutable/assets/24.418ed64e.css"];
export const fonts = [];
