import { initState } from "./state";

export function initMixin (Vue) {
	Vue.prototype._init = function (options) {
		let vm = this;
		vm.$options = options;
		console.log(vm);

		initState(vm);


		if (vm.$options.el) {

			// 组件挂载
			console.log('组件挂载');
		}

	}
}
