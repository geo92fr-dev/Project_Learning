

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/18.70e5863c.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/each.6b27af3a.js","_app/immutable/chunks/index.af76732a.js"];
export const stylesheets = ["_app/immutable/assets/18.fc72e832.css"];
export const fonts = [];
