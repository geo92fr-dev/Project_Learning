

export const index = 25;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-auth/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/25.837a9f66.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js","_app/immutable/chunks/auth.610f470b.js","_app/immutable/chunks/index.6faaf2b0.js"];
export const stylesheets = ["_app/immutable/assets/25.418ed64e.css"];
export const fonts = [];
