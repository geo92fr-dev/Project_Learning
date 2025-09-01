

export const index = 33;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tests/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/33.e1a1e351.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/each.ec837335.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = ["_app/immutable/assets/33.3fd718f9.css"];
export const fonts = [];
