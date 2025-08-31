

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.83de789e.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/singletons.947714fe.js","_app/immutable/chunks/index.1e5ee360.js"];
export const stylesheets = [];
export const fonts = [];
