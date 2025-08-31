

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.136460dc.js","_app/immutable/chunks/scheduler.53ef06e3.js","_app/immutable/chunks/index.aeab89ec.js"];
export const stylesheets = [];
export const fonts = [];
