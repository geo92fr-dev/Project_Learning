export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["test.html"]),
	mimeTypes: {".html":"text/html"},
	_: {
		client: {"start":"_app/immutable/entry/start.f11c1786.js","app":"_app/immutable/entry/app.156bcb61.js","imports":["_app/immutable/entry/start.f11c1786.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/singletons.05b9045c.js","_app/immutable/chunks/index.6faaf2b0.js","_app/immutable/chunks/control.c2cf8273.js","_app/immutable/entry/app.156bcb61.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.b71902e7.js","_app/immutable/chunks/index.160b3567.js"],"stylesheets":[],"fonts":[]},
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
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/33.js')),
			__memo(() => import('./nodes/34.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/auth-google",
				pattern: /^\/auth-google\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/auth-test",
				pattern: /^\/auth-test\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/auth",
				pattern: /^\/auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/complete",
				pattern: /^\/complete\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/content",
				pattern: /^\/content\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/content/[matiere]",
				pattern: /^\/content\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/content/[matiere]/[niveau]",
				pattern: /^\/content\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false},{"name":"niveau","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/content/[matiere]/[niveau]/[competence]",
				pattern: /^\/content\/([^/]+?)\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false},{"name":"niveau","optional":false,"rest":false,"chained":false},{"name":"competence","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/cours",
				pattern: /^\/cours\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/cours/[slug]",
				pattern: /^\/cours\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/debug-auth",
				pattern: /^\/debug-auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/demo",
				pattern: /^\/demo\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/demo/exercise",
				pattern: /^\/demo\/exercise\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/demo/markdown",
				pattern: /^\/demo\/markdown\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/pedagogy",
				pattern: /^\/pedagogy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/roadmap",
				pattern: /^\/roadmap\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/test-auth",
				pattern: /^\/test-auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/test-content-fixed",
				pattern: /^\/test-content-fixed\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/test-content",
				pattern: /^\/test-content\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/test-exercises",
				pattern: /^\/test-exercises\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/test-firebase-simple",
				pattern: /^\/test-firebase-simple\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/test-firebase",
				pattern: /^\/test-firebase\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/test-markdown",
				pattern: /^\/test-markdown\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/test-phase4",
				pattern: /^\/test-phase4\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/tests",
				pattern: /^\/tests\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/[matiere]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/[matiere]/[niveau]",
				pattern: /^\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false},{"name":"niveau","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4,], errors: [1,,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/[matiere]/[niveau]/[competence]",
				pattern: /^\/([^/]+?)\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false},{"name":"niveau","optional":false,"rest":false,"chained":false},{"name":"competence","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4,5,], errors: [1,,,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/[matiere]/[niveau]/[competence]/[cours]",
				pattern: /^\/([^/]+?)\/([^/]+?)\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"matiere","optional":false,"rest":false,"chained":false},{"name":"niveau","optional":false,"rest":false,"chained":false},{"name":"competence","optional":false,"rest":false,"chained":false},{"name":"cours","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4,5,], errors: [1,,,,], leaf: 37 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
