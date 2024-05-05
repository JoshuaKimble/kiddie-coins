

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.AeMdRPXz.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.D6A44wRX.js","_app/immutable/chunks/entry.BBBD6JX7.js"];
export const stylesheets = [];
export const fonts = [];
