import { initMixin } from "./init";
import { renderMixin } from "./render";


function Vue (options) {

	// console.log(options); // 实现vue的初始化功能
	this._init(options);
}

initMixin(Vue);
renderMixin(Vue);

export default Vue;


// vue步骤
// 1. new Vue 会调用_init方法进行初始化操作
// 2. 会将传入的options放到vm.$options上
// 3. 初始化state
// 4. 有data 判断data是不是一个函数, 如果是函数则调用取返回值 initData
// 5. observe 观测data中的数据
// 6. vm._data保存data数据
// 7. 代理_data中的数据到vm上

