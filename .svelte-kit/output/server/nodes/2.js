import * as server from '../entries/pages/dashboard/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.4619c4dd.js","_app/immutable/chunks/scheduler.9ed29267.js","_app/immutable/chunks/index.c5ac0418.js","_app/immutable/chunks/navigation.f52af3b3.js","_app/immutable/chunks/singletons.e673124c.js","_app/immutable/chunks/index.ce9bc0b6.js","_app/immutable/chunks/googleAuth.6ccb6c02.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/2.b0ab24fe.css"];
export const fonts = [];
