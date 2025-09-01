

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.f668301c.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js","_app/immutable/chunks/singletons.0071c0a9.js","_app/immutable/chunks/index.ce9bc0b6.js"];
export const stylesheets = [];
export const fonts = [];
