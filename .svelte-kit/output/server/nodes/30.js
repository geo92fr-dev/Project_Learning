

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_matiere_/_niveau_/_competence_/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/30.7ae76aef.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js"];
export const stylesheets = [];
export const fonts = [];
