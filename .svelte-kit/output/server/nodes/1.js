

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.0119383b.js","_app/immutable/chunks/scheduler.f22d9642.js","_app/immutable/chunks/index.ff65e33c.js","_app/immutable/chunks/singletons.06e10889.js"];
export const stylesheets = [];
export const fonts = [];
