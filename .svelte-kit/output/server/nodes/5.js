import * as universal from '../entries/pages/_matiere_/_niveau_/_competence_/_layout.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_niveau_/_competence_/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/[niveau]/[competence]/+layout.ts";
export const imports = ["_app/immutable/nodes/5.8965a544.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = [];
export const fonts = [];
