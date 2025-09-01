import * as server from '../entries/pages/dashboard/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.8d4eabae.js","_app/immutable/chunks/scheduler.8e7cbb6f.js","_app/immutable/chunks/index.e2275cf0.js","_app/immutable/chunks/navigation.f08be3e0.js","_app/immutable/chunks/singletons.5c2381ad.js","_app/immutable/chunks/index.85dcc1c7.js","_app/immutable/chunks/googleAuth.97bf3db9.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/2.b0ab24fe.css"];
export const fonts = [];
