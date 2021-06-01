import { isString } from "../utils";
import { isSameNode } from "./index";

export function patch (oldVnode, vnode) {
	const isRealElement = oldVnode.nodeType;
	if (isRealElement) { // 初渲染
		let elm = createElm(vnode);
		let parent = oldVnode.parentNode;
		parent.insertBefore(elm, oldVnode.nextSibling);
		parent.removeChild(oldVnode);
		return elm;
	} else { // diff算法实现
		if (!isSameNode(oldVnode, vnode)) { // 标签不一样  直接将新vnode替换老vnode
			return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
		}
		let el = vnode.el = oldVnode.el; // 复用节点
		if (!oldVnode.tag) { // 文本
			if (vnode.text !== oldVnode.text) {
				return el.textContent = vnode.text;
			}
		}

		// 是元素, 更新属性
		updateProperties(vnode, oldVnode.data);
	}
}

export function createElm (vnode) {
	 let { tag, data, children, text, vm } = vnode;
	 if (isString(tag)) {
	 	vnode.el = document.createElement(tag);
		 updateProperties(vnode)
	 	children.forEach((child) => {
		    vnode.el.appendChild(createElm(child))
	    })
	 } else {
		 vnode.el = document.createTextNode(text);
	 }

	 return vnode.el;
}


function updateProperties (vnode, oldProps = {}) {
	let newProps = vnode.data;
	let el = vnode.el;
	let newStyle = newProps.style || {};
	let oldStyle = oldProps.style || {};
	for (const oldStyleKey in oldStyle) {
		if (!newStyle[oldStyleKey]) {
			el.style[oldStyleKey] = '';
		}
	}
	for (const newPropsKey in newProps) {
		if (newPropsKey === 'style') {
			for (const newStyleKey in newStyle) {
				el.style[newStyleKey] = newStyle[newStyleKey]
			}
			return;
		}
		el.setAttribute(newPropsKey, newProps[newPropsKey]);
	}

	for (const oldPropsKey in oldProps) {
		if (!newProps[oldPropsKey]) {
			el.removeAttribute(oldPropsKey);
		}
	}
}


// diff逻辑

// 节点内容变化的的逻辑处理
// 1. 查看标签,key是否相同,如果不同则将整体重新替换
// 2. 标签,key相同, 查看是否是文本节点, 如果是则比对两者的text内容是否一样, 不同则直接将元素的textContent更新为最新的
// 3. 如果是元素, 则更新属性.
