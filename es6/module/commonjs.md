https://blog.csdn.net/weixin_30532987/article/details/97604368
https://blog.csdn.net/weixin_39956558/article/details/112078954?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_title-0&spm=1001.2101.3001.4242
- node使用CommonJS规范 服务端   加载是同步的 只有加载完成才能加载后面的
- 客户端 AMD使用requireJS CMD seajs
- coomonjs核心思想是通过require方法来同步加载依赖的其他模块 通过module.exports导出需要暴露的接口
module.exports = moduleA.func
const moduleA = require('./moduleA')


var  a = require('a');
// 等同于

var a = require('a.js');
根据参数的不同格式，require 命令去不同路径寻找模块文件。

- module对象
node内部提供了一个Module构造函数，所有的模块都是Module的实例

function Module(id, parent){
    this.id = id;
    this.exports = {};
    this.parent = parent;
    this.filename = null;
    this.loaded = false;
    this.children = []
}
module.exports = Module;

var module = new Module(filename, parent)
上面的代码中，Node 定义了一个构造函数 Module,所有的模块都是 Module 的实例。可以看到，当前模块 (module.js)也是Moudle的一个实例。
module.id 模块的识别符，通常是带有绝对路径的模块文件名。

module.filename 模块的文件名，带有绝对路径。

module.loaded 返回一个布尔值，表示模块是否已经完成加载。

module.parent 返回一个对象，表示调用该模块的模块。

module.children 返回一个数组，表示该模块要用到的其他模块。

module.exports 表示模块对外输出的值
- 每个模块实例都有一个require方法

Module.prototype.require = function(path){
  return Module._load(path, this)  
}
由此可知，require并不是全局命令，而是每个模块提供的一个内部方法。也就是说，只有在模块内部才能使用require命令（唯一的例外是REPL 环境）。另外，require 其实内部调用 Module._load 方法。
Module._load 的内部处理流程
1. 检测Module._cache,是否在缓存中有指定的模块，如果模块已经在缓存就从缓存取出
2. 判断是否为内置模块，如果是就返回内置模块
3. 如果缓存没有，创建一个module实例，将它保存在缓存
4. 加载模块
5. 如果加载、解析过程出错，就从缓存删除该模块
6. 返回该模块的module.exports

nodejs中每个文件就是一个模块，拥有自己的作用域，文件中的变量、函数都是私有的，与其他文件相隔离
CommonJS规范规定，每个模块内部，module变量代表当前模块，这个变量是一个对象，它的exports属性（即module.exports）是对外的接口，加载某个模块其实是加载该模块的module.exports属性。
// util\index.js
let name = 'now';
let age = 18;
let fun = () => {    console.log('into fun');    name = 'change'}
module.exports = {    name,    fun}
console.log(module)
// appJsBridge\index.js
var { name, fun } = require('./util/index.js')
### 通过module.exports输出的对象就是引用方require出来的值
exports = module.exports
// exports = ()=>{} 不能修改
exports.fun = () => {    console.log('into fun');    
name = 'change'}
exports.name = 'now';
// exports = ()=>{} 随你改



### module.exports和exports都可以导出 因为内置了exports = module.exports,但是如果更改exports的引用比如exports = {} 就会影响导出
### CommonJS规范是在运行时加载的，在运行时导出对象，导出的对象与原本模块中的对象是隔离的，简单的说就是克隆了一份
// util\index.js
let object = {    age: 10}
let fun = function() {    
    console.log('modules obj', object);   
    object = { age: 99 }
    }
 module.exports = {    fun,    object}

 // index.js
 var { name, fun, object } = require('./util/index.js')
 console.log('before fun', object)
 fun()
 console.log('end fun', object)

 执行 node index.js 看看打印
 before fun { age: 10 }modules obj { age: 10 }end fun { age: 10 }

 引用方调用了导出的 fun 方法，fun 方法改变了模块中的 object 对象，可是在 index.js 中导出的 object 对象并没有发生改变，所以可见 commonjs 规范下模块的导出是深克隆的。

# ES6模块规范和CommonJS规范 运行机制的区别
CommonJS是运行时加载，ES6模块是编译时输出接口
## 运行时加载：CommonJS模块就是对象，即在输入时先加载整个模块，生成一个对象，然后从这个对象上读取方法，这种加载称为“运行时加载”
## 编译时加载：ES6模块不是对象，而是通过export命令显式地指定输出的代码，可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”
# CommonJS 规范是在代码运行时同步阻塞性地加载模块，在执行代码过程中遇到 require(X)时会停下来等待，直到新的模块加载完成之后再继续执行接下去的代码。  在模块代码被运行前就已经写入了 cache，同一个模块被多次 require 时只会执行一次，重复的 require 得到的是相同的 exports 引用。
https://blog.csdn.net/xgangzai/article/details/106935104?utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&dist_request_id=&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control

值得留意：cache key 使用的是模块在系统中的绝对位置，由于模块调用位置的不同，相同的 require('foo')代码并不能保证返回的是统一个对象引用。我之前恰巧就遇到过，两次 require('egg-core')但是他们并不相等。

ES6 模块
ES6 模块是前端开发同学更为熟悉的方式，使用 import, export 关键字来进行模块输入输出。ES6 不再是使用闭包和函数封装的方式进行模块化，而是从语法层面提供了模块化的功能。

ES6 模块中不存在 require, module.exports, __filename 等变量，CommonJS 中也不能使用 import。两种规范是不兼容的，一般来说平日里写的 ES6 模块代码最终都会经由 Babel, Typescript 等工具处理成 CommonJS 代码。

使用 Node 原生 ES6 模块需要将 js 文件后缀改成 mjs，或者 package.json "type"`` 字段改为 "module"，通过这种形式告知Node使用ES Module` 的形式加载模块。



ES6 模块 加载过程
ES6 模块的加载过程分为三步：

1. 查找，下载，解析，构建所有模块实例。
# ES6 模块会在程序开始前先根据模块关系查找到所有模块，生成一个无环关系图，并将所有模块实例都创建好，这种方式天然地避免了循环引用的问题，当然也有模块加载缓存，重复 import 同一个模块，只会执行一次代码。
2. 在内存中腾出空间给即将 export 的内容（此时尚未写入 export value）。然后使 import 和 export 指向内存中的这些空间，这个过程也叫连接。
3. 运行模块代码将变量的实际值填写在第二步生成的空间中。
到第三步，会基于第一步生成的无环图进行深度优先后遍历填值，如果这个过程中访问了尚未初始化完成的空间，会抛出异常。
# require 会将完整的 exports 对象引入，import 可以只 import 部分必要的内容，

### 为什么平时开发可以混写？
前面提到 ES6 模块和 CommonJS 模块有很大差异，不能直接混着写。这和开发中表现是不一样的，原因是开发中写的 ES6 模块最终都会被打包工具处理成 CommonJS 模块，以便兼容更多环境，同时也能和当前社区普通的 CommonJS 模块融合。

import()动态加载
import命令会被 JavaScript 引擎静态分析，无法像require方法一样在运行时加载模块，所以引入了import()函数：
import('./xxx')
mport()返回一个 Promise 对象，实现了异步加载
import()有三个适用场合：
（1）按需加载
（2）条件加载
（3）动态的模块路径


https://www.jianshu.com/p/ba0faf79c167（循环依赖） 
main starting   a starting   b starting   in b, a.done = false b done   in a, b.done = true a done in main, a.done = true, b.done = true
commonjs被循环依赖时，只会输出当前执行完成的导出值。也就是说b.js依赖未执行的a.js时，并不会等待a.js执行完，而是直接输出当前执行过的export对象


es6

