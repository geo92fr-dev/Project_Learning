

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.f3601ac7.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.6a6d9526.js","_app/immutable/chunks/firebase.d43fb313.js"];
export const stylesheets = ["_app/immutable/assets/3.86c8710b.css"];
export const fonts = [];
