import * as server from '../entries/pages/dashboard/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.b15ac512.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js","_app/immutable/chunks/navigation.8780faf0.js","_app/immutable/chunks/singletons.05b9045c.js","_app/immutable/chunks/index.6faaf2b0.js","_app/immutable/chunks/googleAuth.f303c407.js","_app/immutable/chunks/preload-helper.a4192956.js"];
export const stylesheets = ["_app/immutable/assets/2.b0ab24fe.css"];
export const fonts = [];
