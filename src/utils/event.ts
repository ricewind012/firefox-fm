declare global {
	interface WindowEventMap {
		"fm:path-change": PathChangeEvent;
	}
}

export interface PathChangeEvent {
	path: string;
}

// TODO: actually use this
export function DispatchEvent<K extends keyof WindowEventMap>(
	name: K,
	detail: WindowEventMap[K],
) {
	const ev = new CustomEvent(name, {
		detail,
	});
	window.dispatchEvent(ev);
}
