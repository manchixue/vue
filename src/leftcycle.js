import { patch } from "./vdom/patch";
import Watcher from "./observe/watch";

export function mountComponent (vm) {

	// 初始化流程
	let updateComponent = () => {
		vm._update(vm._render());
	}

	new Watcher(vm, updateComponent, () => {
		// 更新完后面的回调
	}, true); // true表示是渲染watcher
}

export function lifecycleMixin (Vue) {
	Vue.prototype._update = function (vnode) {
		let vm = this;
		vm.$el = patch(vm.$el, vnode);
	}
}
