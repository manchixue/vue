import { isString } from "../utils";
import { isSameNode } from "./index";

export function patch (oldVnode, vnode) {
	if (!oldVnode) {
		return createElm(vnode);
	}

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

		// 比较儿子节点
		let oldChildren = oldVnode.children || [];
		let newChildren = vnode.children || [];

		// 1. 老的有儿子, 新的没儿子
		if (oldChildren.length > 0 && newChildren.length === 0) {
			el.innerHTML = '';
		} else if (oldChildren.length === 0 &&
			newChildren.length > 0) { // 2. 新的有儿子, 老的没儿子
			newChildren.forEach(vnode => el.appendChild(createElm(vnode)))
		} else { // 其他情况
			updateChildren(el, oldChildren, newChildren);
		}
	}
}

function updateChildren (el, oldChildren, newChildren) {
	let oldStartIndex = 0;
	let oldEndIndex = oldChildren.length - 1;
	let oldStartVnode = oldChildren[oldStartIndex];
	let oldEndVnode = oldChildren[oldEndIndex];

	let newStartIndex = 0;
	let newEndIndex = newChildren.length - 1;
	let newStartVnode = newChildren[newStartIndex];
	let newEndVnode = newChildren[newEndIndex];

	function makeKeyByIndex (children) {
		let map = {};
		children.forEach((item, index) => {
			map[item.key] = index;
		})
		return map;
	}

	let mapping = makeKeyByIndex(oldChildren);

	while (oldStartIndex <= oldEndIndex &&
	newStartIndex <= newEndIndex) {
		if (!oldStartVnode) {
			oldStartVnode = oldChildren[++oldStartIndex];
		} else if (!oldEndVnode) {
			oldEndVnode = oldChildren[--oldEndIndex];
		} else if (isSameNode(oldStartVnode, newStartVnode)) { // 头头对比
			patch(oldStartVnode, newStartVnode); // 递归比较子节点
			oldStartVnode = oldChildren[++oldStartIndex];
			newStartVnode = newChildren[++newStartIndex];
		} else if (isSameNode(oldEndVnode, newEndVnode)) {// 尾尾比较
			patch(oldEndVnode, newEndVnode);
			oldEndVnode = oldChildren[--oldEndIndex];
			newEndVnode = newChildren[--newEndIndex];
		} else if (isSameNode(oldStartVnode, newEndVnode)) {// 头尾比较
			patch(oldStartVnode, newEndVnode);
			el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);// 移动位置
			oldStartVnode = oldChildren[++oldStartIndex];
			newEndVnode = newChildren[--newEndIndex];
		} else if (isSameNode(oldEndVnode, newStartVnode)) {// 尾头比较
			patch(oldEndVnode, newStartVnode);
			el.insertBefore(oldEndVnode.el, oldStartVnode.el);// 移动位置
			oldEndVnode = oldChildren[--oldEndIndex];
			newStartVnode = newChildren[++newStartIndex];
		} else { // 乱序对比
			let moveIndex = mapping[newStartVnode.key];
			if (typeof moveIndex !== 'undefined') { // 找到key的节点
				let moveNode = oldChildren[moveIndex];
				el.insertBefore(moveNode.el, oldStartVnode.el);// 移动位置
				patch(moveNode, newStartVnode);
				oldChildren[moveIndex] = null;
			} else {
				el.insertBefore(createElm(newStartVnode), oldStartVnode.el);
			}

			newStartVnode = newChildren[++newStartIndex];
		}
	}

	if (newStartIndex <= newEndIndex) {
		let anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null;
		for (let i = newStartIndex; i <= newEndIndex; i++) {
			el.insertBefore(createElm(newChildren[i]), anchor)
		}
	}
	if (oldStartIndex <= oldEndIndex) {
		for (let i = oldStartIndex; i <= oldEndIndex; i++) {
			el.removeChild(oldChildren[i].el);
		}
	}

}

function isCreateComponent (vnode) {
	let i = vnode.data;
	if ((i = i.hook) && (i = i.init)) {
		i(vnode);
	}
	if (vnode.componentInstance) { // 说明是组件
		return true;
	}
}

export function createElm (vnode) {
	 let { tag, data, children, text, vm } = vnode;
	 if (isString(tag)) {
	 	if (isCreateComponent(vnode)) {
	 		return vnode.componentInstance.$el;
	    }
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
	let newProps = vnode.data || {};
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
// 4. 如果有孩子  对孩子进行diff算法比对
// 5. diff比对主要是以新虚拟节点和老虚拟节点进行比对, 有以下几种逻辑
// - 头头比对  ABCD -> ABCDE  将对ABCD进行复用, 生成E
// - 尾尾比对  ABCD -> EABCD  将对ABCD进行复用, 生成E
// - 头尾比对  ABCD -> EDCBA  将对ABCD进行复用, 生成E
// - 尾头比对  ABCD -> DCBAE  将对ABCD进行复用, 生成E
// - 以上的四种比对策略都是对diff算法的优化比对逻辑, 如果以上的四种优化比对策略都匹配不到, 则采用暴力比对。
//   暴力比对的基准以老节点的开始索引为主.拿到老节点生成的一个key为虚拟节点的key, value为虚拟节点对应的索引表, 从新节点的开始索引在map中进行查找是否有复用的节点,
//   如果没有,则创建该节点放入到当前开始索引前面。
//   如果有,  则根据获取到的索引从老节点列表中获取该老节点, 并将该老节点移动到当前开始索引前
//   以上的几个比对条件过程, 凡是新老节点有匹配到的  需要递归进行比对
