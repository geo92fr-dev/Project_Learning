

export const index = 22;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/demo/markdown/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/22.03290375.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js","_app/immutable/chunks/MarkdownRenderer.035861d4.js","_app/immutable/chunks/each.ec837335.js","_app/immutable/chunks/content.72a61c6a.js","_app/immutable/chunks/_commonjsHelpers.cc7032c7.js","_app/immutable/chunks/environment.60829b93.js"];
export const stylesheets = ["_app/immutable/assets/22.430e9adf.css","_app/immutable/assets/MarkdownRenderer.c5065055.css"];
export const fonts = [];
