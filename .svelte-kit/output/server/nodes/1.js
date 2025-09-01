

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.a7527c89.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js","_app/immutable/chunks/singletons.05b9045c.js","_app/immutable/chunks/index.6faaf2b0.js"];
export const stylesheets = [];
export const fonts = [];
