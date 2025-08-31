

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-exercises/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/25.2943cbf4.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/QCMCard.c811cc19.js","_app/immutable/chunks/each.6b27af3a.js","_app/immutable/chunks/index.1e5ee360.js"];
export const stylesheets = ["_app/immutable/assets/25.5d095f22.css","_app/immutable/assets/QCMCard.ecc192c2.css"];
export const fonts = [];
