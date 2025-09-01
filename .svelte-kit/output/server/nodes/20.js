

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/20.8a8b159b.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/each.ec837335.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = ["_app/immutable/assets/20.fc72e832.css"];
export const fonts = [];
