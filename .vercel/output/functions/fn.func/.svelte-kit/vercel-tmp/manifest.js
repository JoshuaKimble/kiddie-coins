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
		client: {"start":"_app/immutable/entry/start.DkybuPib.js","app":"_app/immutable/entry/app.C_Nn7g6f.js","imports":["_app/immutable/entry/start.DkybuPib.js","_app/immutable/chunks/entry.CaB_5gQc.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/entry/app.C_Nn7g6f.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.D6A44wRX.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
