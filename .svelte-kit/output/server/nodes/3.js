

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.aab2f670.js","_app/immutable/chunks/scheduler.f22d9642.js","_app/immutable/chunks/index.ff65e33c.js","_app/immutable/chunks/navigation.8ae5150f.js","_app/immutable/chunks/singletons.06e10889.js"];
export const stylesheets = ["_app/immutable/assets/3.d2595b0a.css"];
export const fonts = [];
