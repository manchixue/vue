
/*

<div id="app">{{message}}</div>


*/

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名的  aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  aa:aa-xxx
const startTagOpen = new RegExp(`^<${qnameCapture}`); //  此正则可以匹配到标签名 匹配到结果的第一个(索引第一个) [1]
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>  [1]
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

// [1]属性的key   [3] || [4] ||[5] 属性的值  a=1  a='1'  a=""
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  />    >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{   xxx  }}



export function parseHTML (html) {
	let stack = [];
	let root = null;
	function createElement (tag, attrs, parent = null) {
		return {
			tag,
			type: 1, // 元素
			children: [],
			parent,
			attrs
		}
	}
	function start (tag, attrs) {
		let parent = stack[stack.length - 1];
		let element = createElement(tag, attrs, parent);
		if (root === null) {
			root = element;
		}
		if (parent) {
			element.parent = parent;
			parent.children.push(element);
		}

		stack.push(element)
	}
	function end (tagName) {
		let entTag = stack.pop();
		if (entTag.tag !== tagName) {
			console.log('标签出错');
		}
	}
	function text (chars) {
		let parent = stack[stack.length - 1];
		chars = chars.replace(/\s/g, '');
		if (chars) {
			parent.children.push({type: 2, text: chars});
		}
	}
	function advance (step) {
		html = html.substring(step);
	}

	function parseStartTag () {
		let start = html.match(startTagOpen);

		if (start) {
			advance(start[0].length);
			let match = {
				tagName: start[1],
				attrs: []
			}

			// 开始匹配属性attr
			let end;
			let attr;
			while (!(end = html.match(startTagClose)) &&
			(attr = html.match(attribute))) {
				match.attrs.push({
					name: attr[1],
					value: attr[3] || attr[4] || attr[5]
				});
				advance(attr[0].length);
			}
			if (end) {
				advance(end[0].length)
			}
			return match
		}
		return false;
	}
	while (html) {
		let index = html.indexOf('<');
		if (index === 0) {
			let startTagMatch = parseStartTag();
			if (startTagMatch) {
				start(startTagMatch.tagName, startTagMatch.attrs);
				continue;
			}
			let endTagMatch = html.match(endTag);
			if (endTagMatch) {
				advance(endTagMatch[0].length);
				end(endTagMatch[1]);
				continue;
			}
			break;
		} else if (index > 0) { // 普通内容
			let chars = html.substring(0, index);
			text(chars);
			advance(chars.length);
		}
	}
	return root;
}
