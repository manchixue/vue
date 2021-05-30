import Dep from "./dep";
import { queueWatcher } from "./scheduler";

let id = 0;
class Watcher {
	constructor (vm, fn, cb, options) {
		this.vm = vm;
		this.fn = fn;
		this.cb = cb;
		this.options = options;
		this.id = id++;
		this.depIdSet = new Set();
		this.deps = [];

		this.getter = fn;
		this.get();
	}

	get () {
		Dep.target = this;
		this.getter();
		Dep.target = null;
	}

	addDep (dep) {
		if (!this.depIdSet.has(dep.id)) {
			this.depIdSet.add(dep.id);
			this.deps.push(dep);
			dep.addSub(this);
		}
	}

	update () {
		queueWatcher(this);

	}
	run () {
		this.get();
	}
}

export default Watcher;
