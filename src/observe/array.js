const oldArrayPrototype = Array.prototype;

export let arrayMethods = Object.create(oldArrayPrototype);

let methods = [
	'push',
	'pop',
	'shift',
	'unshift',
	'reverse',
	'sort',
	'splice'
]; // 导致数组发生变化的方法


methods.forEach(method => {
	arrayMethods[method] = function (...args) {
		let ret = oldArrayPrototype[method].call(this, ...args);
		let inserted = null;
		let ob = this.__ob__;
		// 新增的属性
		switch (method) {
			case 'push':
			case 'shift':
				inserted = args;
				break;
			case 'splice':
				inserted = args.slice(2);
				break;
			default:
				break;
		}

		if (inserted) ob.observeArray(inserted);
		ob.dep.notify();
		return ret;
	}
})
