import { isObject, mergeOptions } from "../utils";

export function initGlobalAPI (Vue) {
	Vue.options = {};
	Vue.mixin = function (options) {
		this.options = mergeOptions(this.options, options);
		return this;
	}
	Vue.options._base = Vue;
	Vue.extend = function (opt) {
		const Super = this;
		const Sub = function (options) {
			this._init(options);
		};

		Sub.prototype = Object.create(Super.prototype);
		Sub.prototype.constructor = Sub;
		Sub.options = mergeOptions(Super.options, opt);

		return Sub;
	}

	Vue.options.components = {};
	Vue.component = function (id, definition) {
		let name = definition.name || id;
		definition.name = name;
		if (isObject(definition)) {
			definition = Vue.extend(definition)
		}
		Vue.options.components[name] = definition;
		console.log(Vue.options);
	}
}
