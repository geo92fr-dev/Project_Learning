import * as universal from '../entries/pages/cours/_slug_/_page.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cours/_slug_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/cours/[slug]/+page.ts";
export const imports = ["_app/immutable/nodes/8.6be32dcf.js","_app/immutable/chunks/content.32123c58.js","_app/immutable/chunks/index.2202404a.js","_app/immutable/chunks/scheduler.53ef06e3.js","_app/immutable/chunks/index.aeab89ec.js","_app/immutable/chunks/stores.ecd3eba0.js","_app/immutable/chunks/singletons.034d086d.js","_app/immutable/chunks/paths.21f781d0.js"];
export const stylesheets = ["_app/immutable/assets/8.45ccf26d.css"];
export const fonts = [];
