import * as universal from '../entries/pages/cours/_slug_/_page.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cours/_slug_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/cours/[slug]/+page.ts";
export const imports = ["_app/immutable/nodes/16.fe999f72.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js"];
export const stylesheets = [];
export const fonts = [];
