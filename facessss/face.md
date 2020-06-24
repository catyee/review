1. 模块化 commonjs及es6module区别 exports和module.exports import必须放在页面开头吗
- commonjs 
    - 模块可以多次加载，只会在第一次加载时运行一次，运行结果会被缓存下来，要再次运行模块，必须清除缓存
    - 同步加载 模块加载会阻塞后面代码的执行
    - 用于服务器环境
    exports只是对module.exports的引用，相当于node为每个模块提供了一个exports变量，指向module.exports,相当于每个模块头部都有这么一行代码
    var exports = module.exports

- AMD
    - 异步加载
    - 浏览器环境 依赖前置

- CMD
    - 浏览器环境
    - 异步加载 依赖就近

- UMD
    - 兼容AMD、commonjs、 全局引用同时支持运行在浏览器和node环境

- es6 module
    - 浏览器环境目前仍需要babel编译为es5代码
    - export只支持对象形式导出，不支持值的导出，export default指定默认输出，本质上是一个叫default的变量



- 总结
    - commonjs的同步加载主要用于服务端，也就是node，但与之相伴的阻塞加载特点并不适用于浏览器资源的加载，所以诞生了AMD,CMD规范
    - AMD与CMD都可以在浏览器中异步加载模块，但实际上这两种规范的开发成本都比较高
    - UMD同时兼容AMD与commonjs，全局引用等规范，算是目前打包js库的主流
    - es6在语言标准的层面上实现了模块化、使用起来非常舒服
    - require理论上可以运用在代码的任何地方，甚至不需要赋值给某个变量之后再使用
    - import命令具有提升效果，会提升到整个模块的头部，首先执行，所以可以在中间使用但是不推荐

2. es5继承和es6继承
- es5继承
```
    function A() {
        this.a = 'hello'
    }
    function B() {
        A.call(this) // 继承A实例的方法
    }
    // 继承A原型上的方法
    B.prototype = Object.create(A.prototype, {
        constructor: {value: B, writable: true, configurable: true}
    })
```

es6类上定义的方法都是不可枚举的
es5原型上的方法是可枚举的
一个类必须有constructor方法，用new命令生成对象实例时，自动调用该方法，如果没有显式定义，一个空的constructor方法会被默认添加
类的构造函数必须使用new来调用

class不存在变量提升 这与es5不一样
// 与函数一样，类也可以使用表达式的形式定义
// 这个类的名字是MyClass而不是Me，Me只在class的内部代码可用
const MyClass = class Me{

}

字类必须在constructor方法中调用super方法，否则新建实例时会报错，这是因为字类没有自己的this对象，而是继承父类的this对象，然后对其加工，如果不调用super方法，字类就得不到this对象

es5的继承实质是先创造字类的实例对象this，然后再将父类的方法添加到this上面（parent.apply(this)）
es6的继承机制完全不同，实质是先创造父类的实例对象this（所以必须先调用super方法）然后再用子类的构造函数修改this
字类必须先调用super才可以使用this关键字否则会报错



