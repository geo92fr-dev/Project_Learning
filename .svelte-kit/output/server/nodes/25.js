

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-exercises/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/25.c039f93a.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js","_app/immutable/chunks/QCMCard.7ff24969.js","_app/immutable/chunks/each.3e85c0a5.js","_app/immutable/chunks/index.85dcc1c7.js"];
export const stylesheets = ["_app/immutable/assets/25.5d095f22.css","_app/immutable/assets/QCMCard.ecc192c2.css"];
export const fonts = [];
