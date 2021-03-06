export function isFunction (val) {
	return typeof val === 'function';
}
export function isObject (val) {
	return typeof val === 'object' && val !== null;
}
export function isString (val) {
	return typeof val === 'string';
}
export let isArray = Array.isArray;

let callbacks = [];
let waiting = false;
let flushCallback = () => {
	callbacks = [];
	waiting = false;
	callbacks.forEach(fn => fn());
}
export function nextTick (fn) {
	callbacks.push(fn);
	if (!waiting) {
		waiting = true;
		Promise.resolve().then(flushCallback);
	}
}

const lifeCycles = [
	'beforeCreate',
	'created',
	'beforeMount',
	'mounted',
	'beforeUpdate',
	'updated',
	'beforeDestroy',
	'destroyed'
];
let strats = {};

lifeCycles.forEach(item => {
	strats[item] = function (parentVal, childVal) {
		if (childVal) {
			if (parentVal) {
				return parentVal.concat(childVal);
			} else {
				if (isArray(childVal)) return childVal;
				return [childVal];
			}
		} else {
			return parentVal;
		}
	}
})


strats.components = function (parentVal, childVal = {}) {
	let res = Object.create(parentVal)
	for (const childValKey in childVal) {
		res[childValKey] = childVal[childValKey]
	}
	return res;
}

export function mergeOptions (parentVal, childVal) {
	const options = {};
	for (const parentValKey in parentVal) {
		if (parentVal.hasOwnProperty(parentValKey)) {
			mergeField(parentValKey);
		}
	}
	for (const childValKey in childVal) {
		if (!parentVal.hasOwnProperty(childValKey)) {
			mergeField(childValKey);
		}
	}


	function mergeField (key) {
		let strat = strats[key];
		if (strat) {
			options[key] = strat(parentVal[key], childVal[key]);
		} else {
			options[key] = childVal[key] || parentVal[key];
		}
	}

	return options
}


function makeMap(str){
	let tagList = str.split(',');
	return function(tagName){
		return tagList.includes(tagName)
	}
}

export const isReservedTag = makeMap(
	'template,script,style,element,content,slot,link,meta,svg,view,button,' +
	'a,div,img,image,text,span,input,switch,textarea,spinner,select,' +
	'slider,slider-neighbor,indicator,canvas,' +
	'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
	'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown'
)
