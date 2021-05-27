import { initState } from "./state";
import { compileToFunction } from "./compiler";

export function initMixin (Vue) {
	Vue.prototype._init = function (options) {
		let vm = this;
		vm.$options = options;

		initState(vm);


		if (vm.$options.el) {

			// 组件挂载
			this.$mount(vm.$options.el);
		}

	}

	Vue.prototype.$mount = function (el) {
		let vm = this;
		let opts = this.$options;
		el = document.querySelector(el);
		this.$el = el;

		if (!opts.render) {
			let template = opts.template;
			if (!template) {
				template = el.outerHTML;
			}
			let render = compileToFunction(template);
			opts.render = render;
		}
	}
}
