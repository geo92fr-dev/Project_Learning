import * as universal from '../entries/pages/_matiere_/_layout.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/+layout.ts";
export const imports = ["_app/immutable/nodes/3.3a04bb48.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js"];
export const stylesheets = [];
export const fonts = [];
