

export const index = 18;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/18.8d6fe127.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/each.3e85c0a5.js","_app/immutable/chunks/index.e2275cf0.js"];
export const stylesheets = ["_app/immutable/assets/18.fc72e832.css"];
export const fonts = [];
