

export const index = 27;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tests/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/27.bf69551a.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/each.6b27af3a.js","_app/immutable/chunks/index.af76732a.js"];
export const stylesheets = ["_app/immutable/assets/27.3fd718f9.css"];
export const fonts = [];
