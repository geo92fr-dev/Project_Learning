

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-content/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/23.7ae76aef.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js"];
export const stylesheets = [];
export const fonts = [];
