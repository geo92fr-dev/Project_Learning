

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.66488644.js","_app/immutable/chunks/scheduler.02e0ea0e.js","_app/immutable/chunks/index.ee037b30.js","_app/immutable/chunks/singletons.486a7f47.js","_app/immutable/chunks/index.3731fc92.js"];
export const stylesheets = [];
export const fonts = [];
