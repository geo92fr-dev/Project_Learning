

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-firebase-simple/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/15.988c59db.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.02e0ea0e.js","_app/immutable/chunks/each.4470a8e9.js","_app/immutable/chunks/index.ee037b30.js"];
export const stylesheets = ["_app/immutable/assets/15.239ad4a6.css"];
export const fonts = [];
