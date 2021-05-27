import { isArray, isObject } from "../utils";
import { arrayMethods } from "./array";

export function observe (value) {
	if (!isObject(value)) {
		return;
	}

	return new Observe(value);
}

class Observe {
	constructor (value) {
		// value.__ob__ = this;

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
	observe(value);
	return Object.defineProperty(target, key, {
		get () {
			return value;
		},
		set (newValue) {
			if (newValue === value) return;
			observe(newValue);
			value = newValue;
		}
	})
}
