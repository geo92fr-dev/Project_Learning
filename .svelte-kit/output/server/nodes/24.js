

export const index = 24;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/roadmap/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/24.6361cb83.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/each.ec837335.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = ["_app/immutable/assets/24.a0c84e7a.css"];
export const fonts = [];
