

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.7c16f421.js","_app/immutable/chunks/scheduler.53ef06e3.js","_app/immutable/chunks/index.aeab89ec.js","_app/immutable/chunks/stores.ecd3eba0.js","_app/immutable/chunks/singletons.034d086d.js","_app/immutable/chunks/index.2202404a.js","_app/immutable/chunks/paths.21f781d0.js"];
export const stylesheets = [];
export const fonts = [];
