

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/login/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.f06f0c4b.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js","_app/immutable/chunks/navigation.f08be3e0.js","_app/immutable/chunks/singletons.5c2381ad.js","_app/immutable/chunks/index.85dcc1c7.js","_app/immutable/chunks/GoogleAuth.3acfb677.js","_app/immutable/chunks/googleAuth.97bf3db9.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/8.a33a2a9a.css","_app/immutable/assets/GoogleAuth.c93edb81.css"];
export const fonts = [];
