

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/markdown/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/20.955809c0.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js","_app/immutable/chunks/MarkdownRenderer.8f95b5be.js","_app/immutable/chunks/each.3e85c0a5.js","_app/immutable/chunks/content.876af36e.js"];
export const stylesheets = ["_app/immutable/assets/20.430e9adf.css","_app/immutable/assets/MarkdownRenderer.c5065055.css"];
export const fonts = [];
