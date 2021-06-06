import { isObject, isReservedTag } from "../utils";

function createComponent (vm, tag, data, children, key, Ctor) {
	if (isObject(Ctor)) {
		Ctor = vm.$options._base.extend(Ctor);
	}
	data.hook = {
		init (vnode) {
			let child = vnode.componentInstance = new Ctor({});

			child.$mount();
		},
		prepatch () {

		},
		postpatch () {

		}
	}
	let componentVnode = vnode(vm, tag, data, undefined, key, undefined, { Ctor, children, tag });

	return componentVnode;
}

export function createElement (vm, tag, data = {}, ...children) {
	if (!isReservedTag(tag)) {
		let Ctor = vm.$options.components[tag];
		return createComponent(vm, tag, data, children, data.key, Ctor)
	}
	return vnode(vm, tag, data, children, data.key, undefined);
}

export function createText (vm, text) {
	return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode (vm, tag, data, children, key, text, options) {
	return {
		vm,
		tag,
		data,
		children,
		key,
		text,
		componentOptions: options
	}
}

export function isSameNode (oldVnode, vnode) {
	return oldVnode.tag === vnode.tag &&
		oldVnode.key === vnode.key;
}
