

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.c5ec0bd8.js","_app/immutable/chunks/scheduler.53ef06e3.js","_app/immutable/chunks/index.aeab89ec.js"];
export const stylesheets = ["_app/immutable/assets/5.cf422693.css"];
export const fonts = [];
