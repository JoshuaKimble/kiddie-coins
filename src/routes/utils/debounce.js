export function debounce(func, { timeout = 300, isLeading = false }) {
	let timer;
	return (...args) => {
		if (isLeading && !timer) {
			func.apply(this, args);
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (isLeading) {
				timer = undefined;
			} else {
				func.apply(this, args);
			}
		}, timeout);
	};
}
