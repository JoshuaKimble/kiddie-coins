export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["fallback.html","favicon.png"]),
	mimeTypes: {".html":"text/html",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.CA366klw.js","app":"_app/immutable/entry/app.Bh8m6zpd.js","imports":["_app/immutable/entry/start.CA366klw.js","_app/immutable/chunks/entry.BBBD6JX7.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/entry/app.Bh8m6zpd.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.D6A44wRX.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
