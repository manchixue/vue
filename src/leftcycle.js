import { patch } from "./vdom/patch";

export function mountComponent (vm) {

	// 初始化流程
	let updateComponent = () => {
		vm._update(vm._render());
	}

	updateComponent();
}

export function lifecycleMixin (Vue) {
	Vue.prototype._update = function (vnode) {
		let vm = this;
		vm.$el = patch(vm.$el, vnode);
	}
}
