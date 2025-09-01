import * as universal from '../entries/pages/_matiere_/_niveau_/_competence_/_cours_/_page.ts.js';

export const index = 31;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_niveau_/_competence_/_cours_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/[niveau]/[competence]/[cours]/+page.ts";
export const imports = ["_app/immutable/nodes/31.2032b9af.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js"];
export const stylesheets = [];
export const fonts = [];
