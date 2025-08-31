

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth-google/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.ffb1d8e9.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/GoogleAuth.64801b47.js","_app/immutable/chunks/googleAuth.03c8b086.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/index.1e5ee360.js"];
export const stylesheets = ["_app/immutable/assets/9.761a90b4.css","_app/immutable/assets/GoogleAuth.c93edb81.css"];
export const fonts = [];
