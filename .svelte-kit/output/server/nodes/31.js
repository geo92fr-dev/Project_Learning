import * as universal from '../entries/pages/_matiere_/_niveau_/_competence_/_cours_/_page.ts.js';

export const index = 31;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_niveau_/_competence_/_cours_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/[niveau]/[competence]/[cours]/+page.ts";
export const imports = ["_app/immutable/nodes/31.fe999f72.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js"];
export const stylesheets = [];
export const fonts = [];
