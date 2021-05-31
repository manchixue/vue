import { isArray, isObject } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";

export function observe (value) {
	if (!isObject(value)) {
		return;
	}

	return new Observe(value);
}

function dependArray (value) {
	for (let i = 0; i < value.length; i++) {
		let current = value[i];
		current.__ob__ && current.__ob__.dep.depend();
		if (Array.isArray(current)) {
			dependArray(current);
		}
	}
}

class Observe {
	constructor (value) {
		// value.__ob__ = this;
		this.dep = new Dep();
		Object.defineProperty(value, '__ob__', {
			value: this,
			enumerable: false
		})

		// 数组的特殊处理
		if (isArray(value)) {
			value.__proto__ = arrayMethods;

			this.observeArray(value);
		} else {
			this.walk(value);
		}
	}
	walk (data) {
		Object.keys(data).forEach(key => {
			defineReactive(data, key, data[key])
		})
	}
	observeArray (data) {
		data.forEach((item) => observe(item));
	}
}
function defineReactive (target, key, value) {
	let dep = new Dep();

	let childOb = observe(value);
	return Object.defineProperty(target, key, {
		get () {
			if (Dep.target) {
				dep.depend();
				if (childOb) {
					childOb.dep.depend();
					if (Array.isArray(value)) {
						dependArray(value);
					}
				}
			}
			return value;
		},
		set (newValue) {
			if (newValue === value) return;
			observe(newValue);
			value = newValue;

			// 更新
			dep.notify();
		}
	})
}
