

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-markdown/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/30.c0943cef.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js","_app/immutable/chunks/each.287b3127.js","_app/immutable/chunks/content.c502cdd0.js","_app/immutable/chunks/index.ce9bc0b6.js","_app/immutable/chunks/MarkdownRenderer.1de30148.js","_app/immutable/chunks/content.11eb7466.js","_app/immutable/chunks/environment.60829b93.js"];
export const stylesheets = ["_app/immutable/assets/30.1360e426.css","_app/immutable/assets/MarkdownRenderer.c5065055.css"];
export const fonts = [];
