

export const index = 22;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/roadmap/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/22.41d567c8.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/each.3e85c0a5.js","_app/immutable/chunks/index.e2275cf0.js"];
export const stylesheets = ["_app/immutable/assets/22.a0c84e7a.css"];
export const fonts = [];
