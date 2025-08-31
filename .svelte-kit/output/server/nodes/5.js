

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.3a5de1d1.js","_app/immutable/chunks/scheduler.02e0ea0e.js","_app/immutable/chunks/index.ee037b30.js"];
export const stylesheets = ["_app/immutable/assets/5.9cc64228.css"];
export const fonts = [];
