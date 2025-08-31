import * as universal from '../entries/pages/_matiere_/_niveau_/_layout.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_niveau_/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[matiere]/[niveau]/+layout.ts";
export const imports = ["_app/immutable/nodes/3.96e8b906.js","_app/immutable/chunks/scheduler.02e0ea0e.js","_app/immutable/chunks/index.ee037b30.js"];
export const stylesheets = [];
export const fonts = [];
