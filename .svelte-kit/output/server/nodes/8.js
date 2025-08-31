

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/login/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.f2abf7de.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/navigation.e383eed4.js","_app/immutable/chunks/singletons.947714fe.js","_app/immutable/chunks/index.1e5ee360.js","_app/immutable/chunks/GoogleAuth.64801b47.js","_app/immutable/chunks/googleAuth.03c8b086.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/8.a33a2a9a.css","_app/immutable/assets/GoogleAuth.c93edb81.css"];
export const fonts = [];
