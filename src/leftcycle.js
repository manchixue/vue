import { patch } from "./vdom/patch";
import Watcher from "./observe/watch";

export function mountComponent (vm) {

	// 初始化流程
	let updateComponent = () => {
		vm._update(vm._render());
	}
	callHook(vm, 'beforeCreate');
	new Watcher(vm, updateComponent, () => {
		// 更新完后面的回调
	}, true); // true表示是渲染watcher
	callHook(vm, 'mounted');
}

export function lifecycleMixin (Vue) {
	Vue.prototype._update = function (vnode) {
		let vm = this;
		vm.$el = patch(vm.$el, vnode);
	}
}

export function callHook (vm, hook) {
	let handlers = vm.$options[hook];
	handlers && handlers.forEach((fn) => {
		fn.call(vm);
	})
}
