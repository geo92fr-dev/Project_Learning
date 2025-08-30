

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.035dadcf.js","_app/immutable/chunks/scheduler.f22d9642.js","_app/immutable/chunks/index.ff65e33c.js","_app/immutable/chunks/navigation.8ae5150f.js","_app/immutable/chunks/singletons.06e10889.js"];
export const stylesheets = ["_app/immutable/assets/4.5deba8a5.css"];
export const fonts = [];
