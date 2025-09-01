

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth-test/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.8950ba31.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = ["_app/immutable/assets/10.f09bc7a6.css"];
export const fonts = [];
