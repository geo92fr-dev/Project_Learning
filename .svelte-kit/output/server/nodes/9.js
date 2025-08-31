

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.9572489c.js","_app/immutable/chunks/scheduler.53ef06e3.js","_app/immutable/chunks/index.aeab89ec.js","_app/immutable/chunks/navigation.7cb6dc4c.js","_app/immutable/chunks/index.2202404a.js","_app/immutable/chunks/singletons.034d086d.js","_app/immutable/chunks/paths.21f781d0.js"];
export const stylesheets = ["_app/immutable/assets/9.5deba8a5.css"];
export const fonts = [];
