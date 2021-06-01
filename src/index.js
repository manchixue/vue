import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./liftcycle";
import { initGlobalAPI } from "./global-api";
import { compileToFunction } from "./compiler";
import { createElm, patch } from "./vdom/patch";


function Vue (options) {

	// console.log(options); // 实现vue的初始化功能
	this._init(options);
}

initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);
initGlobalAPI(Vue);

export default Vue;

let vm1 = new Vue({
	data () {
		return {
			name: 'test'
		}
	}
})

let render1 = compileToFunction(`<div style="color:red;font-size: 18px">{{name}}</div>`);
let oldVnode = render1.call(vm1);

let el1 = createElm(oldVnode);
document.body.appendChild(el1);

let vm2 = new Vue({
	data () {
		return {
			name: 'vm2'
		}
	}
})

let render2 = compileToFunction(`<div style="color:blue;background:green">{{name}}</div>`);
let vnode = render2.call(vm2);

setTimeout(() => {
	patch(oldVnode, vnode);
}, 1500)

// vue步骤
// 1. new Vue 会调用_init方法进行初始化操作
// 2. 会将传入的options放到vm.$options上
// 3. 初始化state
// 4. 有data 判断data是不是一个函数, 如果是函数则调用取返回值 initData
// 5. observe 观测data中的数据
// 6. vm._data保存data数据
// 7. 代理_data中的数据到vm上

