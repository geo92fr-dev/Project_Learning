

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/login/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.b4ad9622.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js","_app/immutable/chunks/navigation.ebcbfbc2.js","_app/immutable/chunks/singletons.0071c0a9.js","_app/immutable/chunks/index.ce9bc0b6.js","_app/immutable/chunks/GoogleAuth.193c595a.js","_app/immutable/chunks/googleAuth.6ccb6c02.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/8.a33a2a9a.css","_app/immutable/assets/GoogleAuth.c93edb81.css"];
export const fonts = [];
