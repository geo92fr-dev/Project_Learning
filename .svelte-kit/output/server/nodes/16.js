

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cours/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/16.8a6196c4.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js"];
export const stylesheets = [];
export const fonts = [];
