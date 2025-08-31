import * as universal from '../entries/pages/cours/_slug_/_page.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cours/_slug_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/cours/[slug]/+page.ts";
export const imports = ["_app/immutable/nodes/9.a56584d4.js","_app/immutable/chunks/scheduler.02e0ea0e.js","_app/immutable/chunks/index.ee037b30.js"];
export const stylesheets = [];
export const fonts = [];
