

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.333d8f67.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = ["_app/immutable/assets/6.9cc64228.css"];
export const fonts = [];
