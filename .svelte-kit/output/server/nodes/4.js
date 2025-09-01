import * as universal from '../entries/pages/_matiere_/_niveau_/_layout.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_niveau_/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/[niveau]/+layout.ts";
export const imports = ["_app/immutable/nodes/4.8965a544.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = [];
export const fonts = [];
