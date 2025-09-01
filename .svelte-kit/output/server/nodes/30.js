

export const index = 30;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/test-firebase-simple/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/30.c18a7ee5.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/each.ec837335.js","_app/immutable/chunks/index.160b3567.js"];
export const stylesheets = ["_app/immutable/assets/30.2932fc15.css"];
export const fonts = [];
