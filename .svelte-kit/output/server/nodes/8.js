

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/login/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.4e44fd3e.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/navigation.1081ecf5.js","_app/immutable/chunks/singletons.50902caa.js","_app/immutable/chunks/index.1e5ee360.js","_app/immutable/chunks/GoogleAuth.6ac148d5.js","_app/immutable/chunks/googleAuth.03c8b086.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/8.455df3a1.css","_app/immutable/assets/GoogleAuth.8936650e.css"];
export const fonts = [];
