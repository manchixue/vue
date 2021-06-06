### 组件的初始化流程

- Vue.component(componentName, options | function) 声明全局组件

- 调用Vue.component, 组件name使用规则: options.name || componentName
- 如果传入的是一个options, 会调用Vue.extend将options转成一个子类Ctor构造函数


### Vue.extend

- 调用Vue.extend, 会根据传入的配置, 生成一个基于当前类生成的子类
- 创造子类构造函数, 将子类的原型指向基于父类原型创造出来的函数
- 修正子类原型的构造函数为子类
- 子类也拥有一个options, 且会对父类的options进行合并

