import * as server from '../entries/pages/dashboard/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.d0027208.js","_app/immutable/chunks/scheduler.8dd50edf.js","_app/immutable/chunks/index.af76732a.js","_app/immutable/chunks/navigation.1081ecf5.js","_app/immutable/chunks/singletons.50902caa.js","_app/immutable/chunks/index.1e5ee360.js","_app/immutable/chunks/googleAuth.03c8b086.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/2.c162a8af.css"];
export const fonts = [];
