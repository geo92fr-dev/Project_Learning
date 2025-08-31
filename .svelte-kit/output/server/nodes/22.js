

export const index = 22;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/roadmap/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/22.9498927c.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/each.6b27af3a.js","_app/immutable/chunks/index.af76732a.js"];
export const stylesheets = ["_app/immutable/assets/22.a0c84e7a.css"];
export const fonts = [];
