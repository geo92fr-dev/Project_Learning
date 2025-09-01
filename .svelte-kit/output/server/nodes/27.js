

export const index = 27;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tests/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/27.6e3b0e89.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/each.3e85c0a5.js","_app/immutable/chunks/index.e2275cf0.js"];
export const stylesheets = ["_app/immutable/assets/27.3fd718f9.css"];
export const fonts = [];
