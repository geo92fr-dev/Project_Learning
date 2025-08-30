

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.dfc9abb2.js","_app/immutable/chunks/scheduler.f22d9642.js","_app/immutable/chunks/index.ff65e33c.js"];
export const stylesheets = [];
export const fonts = [];
