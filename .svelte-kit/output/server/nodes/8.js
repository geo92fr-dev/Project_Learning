

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cours/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.fc5ef2e5.js","_app/immutable/chunks/scheduler.02e0ea0e.js","_app/immutable/chunks/index.ee037b30.js"];
export const stylesheets = [];
export const fonts = [];
