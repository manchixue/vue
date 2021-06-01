export function createElement (vm, tag, data = {}, ...children) {
	return vnode(vm, tag, data, children, data.key, undefined);
}

export function createText (vm, text) {
	return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode (vm, tag, data, children, key, text) {
	return {
		vm,
		tag,
		data,
		children,
		key,
		text
	}
}

export function isSameNode (oldVnode, vnode) {
	return oldVnode.tag === vnode.tag &&
		oldVnode.key === vnode.key;
}
