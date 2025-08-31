import * as universal from '../entries/pages/_matiere_/_layout.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/+layout.ts";
export const imports = ["_app/immutable/nodes/2.af0d821b.js","_app/immutable/chunks/Breadcrumbs.f9e2e585.js","_app/immutable/chunks/control.c2cf8273.js","_app/immutable/chunks/scheduler.53ef06e3.js","_app/immutable/chunks/each.e59479a4.js","_app/immutable/chunks/index.aeab89ec.js","_app/immutable/chunks/paths.21f781d0.js","_app/immutable/chunks/stores.ecd3eba0.js","_app/immutable/chunks/singletons.034d086d.js","_app/immutable/chunks/index.2202404a.js"];
export const stylesheets = ["_app/immutable/assets/2.a425360b.css","_app/immutable/assets/Breadcrumbs.2c5d7ce3.css"];
export const fonts = [];
