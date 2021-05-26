import { isFunction } from "./utils";
import { observe } from "./observe";

export function initState (vm) {
	const opts = vm.$options;
	if (opts.data) {
		initData(vm);
	}
}

function initData (vm) {
	let data = vm.$options.data; // 传入的data数据

	data = vm._data = isFunction(data) ? data.call(vm) : data;


	// 将data变成响应式数据, 观测数据
	observe(data);

	for (let key in data) {
		proxy(vm, key, '_data');
	}
}

function proxy (vm, key, source) {
	Object.defineProperty(vm, key, {
		get () {
			return vm[source][key];
		},
		set (newValue) {
			vm[source][key] = newValue;
		}
	})
}
