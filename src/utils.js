export function isFunction (val) {
	return typeof val === 'function';
}
export function isObject (val) {
	return typeof val === 'object' && val !== null;
}
export function isString (val) {
	return typeof val === 'string';
}
export let isArray = Array.isArray;

let callbacks = [];
let waiting = false;
let flushCallback = () => {
	callbacks.forEach(fn => fn());
	callbacks = [];
	waiting = false;
}
export function nextTick (fn) {
	callbacks.push(fn);
	if (!waiting) {
		waiting = true;
		Promise.resolve().then(flushCallback);
	}
}
