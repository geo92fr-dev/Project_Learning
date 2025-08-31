

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.b012515b.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.6a6d9526.js","_app/immutable/chunks/firebase.d43fb313.js"];
export const stylesheets = ["_app/immutable/assets/2.8762ed9c.css"];
export const fonts = [];
