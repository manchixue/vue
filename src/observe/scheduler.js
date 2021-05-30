import { nextTick } from "../utils";

let has = {};
let pending = false;
let queue = [];

function flushCallback () {
	queue.forEach(watcher => watcher.run());
	queue = [];
	pending = false;
	has = {};
}

export function queueWatcher (watcher) {

	if (!has[watcher.id]) {
		has[watcher.id] = true;
		queue.push(watcher);
		if (!pending) {
			nextTick(flushCallback);
			pending = true;
		}
	}
}
