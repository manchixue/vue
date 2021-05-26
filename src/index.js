import { initMixin } from "./init";


function Vue (options) {

	// console.log(options); // 实现vue的初始化功能
	this._init(options);
}

initMixin(Vue);

export default Vue;
