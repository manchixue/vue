import { isString } from "../utils";

export function patch (el, vnode) {
	let elm = createElm(vnode);

	let parent = el.parentNode;
	parent.insertBefore(elm, el.nextSibling);
	parent.removeChild(el);

	return elm;
}

function createElm (vnode) {
	 let { tag, data, children, text, vm } = vnode;
	 if (isString(tag)) {
	 	vnode.el = document.createElement(tag);
		 updateProperties(vnode.el, data)
	 	children.forEach((child) => {
		    vnode.el.appendChild(createElm(child))
	    })
	 } else {
		 vnode.el = document.createTextNode(text);
	 }

	 return vnode.el;
}


function updateProperties (el, props = {}) {
	for (const propsKey in props) {
		if (propsKey === 'style') {
			const styleObj = props[propsKey];
			Object.keys(styleObj).forEach((styleKey) => {
				el.style[styleKey] = styleObj[styleKey]
			})

		} else {
			el.setAttribute(propsKey, props[propsKey]);
		}
	}
}
