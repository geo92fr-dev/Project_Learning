import * as universal from '../entries/pages/content/_matiere_/_page.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/content/_matiere_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/content/[matiere]/+page.ts";
export const imports = ["_app/immutable/nodes/12.29248b90.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/index.8f2ca6db.js","_app/immutable/chunks/control.c2cf8273.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/each.6b27af3a.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/navigation.e383eed4.js","_app/immutable/chunks/singletons.947714fe.js","_app/immutable/chunks/index.1e5ee360.js","_app/immutable/chunks/content.ad934cc6.js"];
export const stylesheets = ["_app/immutable/assets/12.272d39e1.css"];
export const fonts = [];
