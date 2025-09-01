

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth-google/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.d233bb52.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js","_app/immutable/chunks/GoogleAuth.4007cd0a.js","_app/immutable/chunks/googleAuth.f303c407.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/index.6faaf2b0.js"];
export const stylesheets = ["_app/immutable/assets/9.761a90b4.css","_app/immutable/assets/GoogleAuth.c93edb81.css"];
export const fonts = [];
