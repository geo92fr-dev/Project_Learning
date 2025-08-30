

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.5098ef3d.js","_app/immutable/chunks/scheduler.f22d9642.js","_app/immutable/chunks/index.ff65e33c.js"];
export const stylesheets = ["_app/immutable/assets/2.6f085c24.css"];
export const fonts = [];
