import * as universal from '../entries/pages/_matiere_/_niveau_/_competence_/_cours_/_page.ts.js';

export const index = 36;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_niveau_/_competence_/_cours_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/[niveau]/[competence]/[cours]/+page.ts";
export const imports = ["_app/immutable/nodes/36.6335203c.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js"];
export const stylesheets = [];
export const fonts = [];
