import * as universal from '../entries/pages/content/_matiere_/_niveau_/_competence_/_page.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/content/_matiere_/_niveau_/_competence_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/content/[matiere]/[niveau]/[competence]/+page.ts";
export const imports = ["_app/immutable/nodes/15.b49bdf6e.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/index.8f2ca6db.js","_app/immutable/chunks/control.c2cf8273.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js","_app/immutable/chunks/each.287b3127.js","_app/immutable/chunks/navigation.f52af3b3.js","_app/immutable/chunks/singletons.e673124c.js","_app/immutable/chunks/index.ce9bc0b6.js","_app/immutable/chunks/MarkdownRenderer.1de30148.js","_app/immutable/chunks/content.11eb7466.js","_app/immutable/chunks/environment.60829b93.js","_app/immutable/chunks/content.c502cdd0.js"];
export const stylesheets = ["_app/immutable/assets/15.5f06cbb6.css","_app/immutable/assets/MarkdownRenderer.c5065055.css"];
export const fonts = [];
