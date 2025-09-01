

export const index = 26;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-content/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/26.9f2e108b.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = [];
export const fonts = [];
