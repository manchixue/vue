import { createElement, createText } from "./vdom";
import { isObject } from "./utils";

export function renderMixin (Vue) {
	Vue.prototype._c = function () {
		return createElement(this, ...arguments);
	}
	Vue.prototype._v = function (text) {
		return createText(this, text);
	}
	Vue.prototype._s = function (val) {
		if (isObject(val)) return JSON.stringify(val);
		return val;
	}

	Vue.prototype._render = function () {
		let vm = this;
		let { render } = vm.$options;
		let vnode = render.call(vm);
		return vnode;
	}
}
