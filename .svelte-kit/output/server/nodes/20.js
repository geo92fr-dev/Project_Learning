

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/markdown/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/20.0fa7f09a.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/MarkdownRenderer.26be611d.js","_app/immutable/chunks/each.6b27af3a.js","_app/immutable/chunks/content.876af36e.js"];
export const stylesheets = ["_app/immutable/assets/20.e8003cac.css","_app/immutable/assets/MarkdownRenderer.c5065055.css"];
export const fonts = [];
