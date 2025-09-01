

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth-google/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.67d1f844.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js","_app/immutable/chunks/GoogleAuth.193c595a.js","_app/immutable/chunks/googleAuth.6ccb6c02.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/index.ce9bc0b6.js"];
export const stylesheets = ["_app/immutable/assets/9.761a90b4.css","_app/immutable/assets/GoogleAuth.c93edb81.css"];
export const fonts = [];
