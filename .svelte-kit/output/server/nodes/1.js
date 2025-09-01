

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.5e5b3633.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js","_app/immutable/chunks/singletons.5c2381ad.js","_app/immutable/chunks/index.85dcc1c7.js"];
export const stylesheets = [];
export const fonts = [];
