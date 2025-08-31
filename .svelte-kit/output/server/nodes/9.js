

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth-google/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.9e8d3326.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/GoogleAuth.6ac148d5.js","_app/immutable/chunks/googleAuth.03c8b086.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/index.1e5ee360.js"];
export const stylesheets = ["_app/immutable/assets/9.73aba3ac.css","_app/immutable/assets/GoogleAuth.8936650e.css"];
export const fonts = [];
