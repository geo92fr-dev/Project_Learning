

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cours/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/15.d840024c.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js"];
export const stylesheets = [];
export const fonts = [];
