export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.f4f74cf8.js","app":"_app/immutable/entry/app.c1344500.js","imports":["_app/immutable/entry/start.f4f74cf8.js","_app/immutable/chunks/scheduler.02e0ea0e.js","_app/immutable/chunks/singletons.486a7f47.js","_app/immutable/chunks/index.3731fc92.js","_app/immutable/entry/app.c1344500.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.02e0ea0e.js","_app/immutable/chunks/index.ee037b30.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/auth-simple",
				pattern: /^\/auth-simple\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/content",
				pattern: /^\/content\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/cours",
				pattern: /^\/cours\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/cours/[slug]",
				pattern: /^\/cours\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/pedagogy",
				pattern: /^\/pedagogy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/test-content-fixed",
				pattern: /^\/test-content-fixed\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/test-content",
				pattern: /^\/test-content\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/test-exercises",
				pattern: /^\/test-exercises\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/test-firebase-simple",
				pattern: /^\/test-firebase-simple\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/test-markdown",
				pattern: /^\/test-markdown\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/[matiere]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/[matiere]/[niveau]",
				pattern: /^\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false},{"name":"niveau","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/[matiere]/[niveau]/[competence]",
				pattern: /^\/([^/]+?)\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false},{"name":"niveau","optional":false,"rest":false,"chained":false},{"name":"competence","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/[matiere]/[niveau]/[competence]/[cours]",
				pattern: /^\/([^/]+?)\/([^/]+?)\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false},{"name":"niveau","optional":false,"rest":false,"chained":false},{"name":"competence","optional":false,"rest":false,"chained":false},{"name":"cours","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 20 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
