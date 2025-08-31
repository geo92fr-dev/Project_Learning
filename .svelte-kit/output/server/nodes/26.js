

export const index = 26;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-markdown/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/26.403840b3.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/each.6b27af3a.js","_app/immutable/chunks/content.ad934cc6.js","_app/immutable/chunks/index.1e5ee360.js","_app/immutable/chunks/MarkdownRenderer.26be611d.js","_app/immutable/chunks/content.876af36e.js"];
export const stylesheets = ["_app/immutable/assets/26.1360e426.css","_app/immutable/assets/MarkdownRenderer.c5065055.css"];
export const fonts = [];
