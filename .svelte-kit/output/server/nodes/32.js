

export const index = 32;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-phase4/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/32.ee58ed2b.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js","_app/immutable/chunks/each.ec837335.js","_app/immutable/chunks/index.6faaf2b0.js","_app/immutable/chunks/index.bbed0b63.js"];
export const stylesheets = ["_app/immutable/assets/32.7dbc5d46.css"];
export const fonts = [];
