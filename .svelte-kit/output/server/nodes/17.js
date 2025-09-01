import * as universal from '../entries/pages/cours/_slug_/_page.ts.js';

export const index = 17;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cours/_slug_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/cours/[slug]/+page.ts";
export const imports = ["_app/immutable/nodes/17.061b331e.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = [];
export const fonts = [];
