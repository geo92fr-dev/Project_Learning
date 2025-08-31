import * as universal from '../entries/pages/_matiere_/_niveau_/_layout.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_niveau_/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/[niveau]/+layout.ts";
export const imports = ["_app/immutable/nodes/4.3a04bb48.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js"];
export const stylesheets = [];
export const fonts = [];
