import * as universal from '../entries/pages/_matiere_/_layout.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/+layout.ts";
export const imports = ["_app/immutable/nodes/3.ca6fa2be.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js"];
export const stylesheets = [];
export const fonts = [];
