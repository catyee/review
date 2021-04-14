### es6模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量
### CommonJS和AMD模块，都只能在运行时确定这些东西，比如CommonJS模块就是对象，输入时必须查找对象的属性

commonjs模块
let {stat,exists,readFile} = require('fs')
// 等同于
let _fs = require('fs');
let stat = _fs.stat, exists = _fs.exists, readfile = _fs.readfile;
### 上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取3个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

### es6模块不是对象，而是通过export命令显式指定输出的代码，然后再通过import命令输入
// ES6模块
import { stat, exists, readFile } from 'fs';
### 上面的代码实质是从fs加载3个方法，其他方法不加载，这种加载称为编译时加载或静态加载，即es6可以在编译时就完成模块加载，效率比CommonJS模块的加载方式高。这也导致了没法引用es6模块本身，因为它不是对象

由于es6模块是编译时加载，使得静态分析称为可能，有了它就能进一步扩展js语法，比如引入宏和类型检验，这些只能靠静态分析实现的功能

除了静态加载带来的各种好处，es6模块还有以下好处
- 不需要umd模块格式了，将来服务器和浏览器都会支持es6模块格式，目前通过各种工具库，其实已经做到了这一点
- 将来浏览器的新api就能通过模块格式提供，不再必要做成全局变量或者nevigator对象的属性
- 不再需要对象作为命名空间比如Math对象，未来这些功能可以通过模块提供
ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";。
严格模式主要有以下限制。
    变量必须声明后再使用
    函数的参数不能有同名属性，否则报错
    不能使用with语句
    不能对只读属性赋值，否则报错
    不能使用前缀0表示八进制数，否则报错
    不能删除不可删除的属性，否则报错
    不能删除变量delete prop，会报错，只能删除属性delete global[prop]
    eval不会在它的外层作用域引入变量
    eval和arguments不能被重新赋值
    arguments不会自动反映函数参数的变化
    不能使用arguments.callee
    不能使用arguments.caller
    禁止this指向全局对象
    不能使用fn.caller和fn.arguments获取函数调用的堆栈
    增加了保留字（比如protected、static和interface）

    es6 模块功能的两个命令 export import 
    一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量。下面是一个 JS 文件，里面使用export命令输出变量。
    // profile.js
    export var firstName = 'Michael';
    export var lastName = 'Jackson';
    export var year = 1958;
    或者export {firstName, lastName, year};


    export 1 报错 
    var m = 1; export m; 报错 相当于直接输出一个1 
    export var m = 1; 正确
    // 正确
    var a = 1;
    export default a;
    var m = 1; export {m} 正确
    var n = 1 export {n as m} 正确
    实质是在接口名与模块内部变量之间，建立了一一对应关系
### 另外，export语句输出的接口，与对应的值是动态绑定的关系，即通过该接口，可以获取到模块内部实时的值
    export var foo = 'bar';
    setTimeout(() => foo = 'baz', 500);
    上面代码输出变量foo，值为bar，500毫秒之后变成baz
### 这一点与CommonJS规范完全不同，CommonJS模块输出的是值的缓存，不存在动态更新
export可以出现在模块的任何位置，只要是模块顶层就可以，不能出现在块级作用域。这是因为处于条件代码块之中，就没法做静态优化了

import {firstName, lastName, year} from './profile';
import { lastName as surname } from './profile';
import后面的from指定模块文件的位置，可以是相对路径，也可以是绝对路径，.js路径可以省略。如果只是模块名，不带有路径，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。

### import命令具有提升效果，会提升到整个模块的头部，首先执行
foo();

import { foo } from 'my_module';
### 上面的代码不会报错，因为import的执行早于foo的调用。这种行为的本质是，import命令是编译阶段执行的，在代码运行之前。
### 由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}

### 最后，import语句会执行所加载的模块，因此可以有下面的写法。
import 'lodash';
### 上面代码仅仅执行lodash模块，但是不输入任何值。
### 如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。

import 'lodash';
import 'lodash';
上面代码加载了两次lodash，但是只会执行一次。
### *实现模块的整体加载
import * as circle from './circle';

### export default 为模块指定默认输出 import命令可以为该匿名函数指定任意名字。，可以用任意名称指向export-default.js输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时import命令后面，不使用大括号。
// export-default.js
export default function () {
  console.log('foo');
}
// import-default.js
import customName from './export-default';
customName(); // 'foo'
### export *命令会忽略circle模块的default方法

## ES6模块加载的实质
### ES6模块加载的机制与CommonJS模块完全不同，CommonJS输出的是一个值的拷贝，也就是说一旦输出一个值，模块内部的变化就影响不到这个值
例子：
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
在main.js里面加载这个模块
// main.js
var mod = require('./lib');
console.log(mob.counter) // 3
mod.incCounter()
console.log(mob.counter) // 3
上面代码说明，lib.js模块加载以后，它的内部变化就影响不到输出的mob.counter了，这是因为mod.counter是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  // 取值函数
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
### ES6模块的运行机制与CommonJS不一样，它遇到模块加载命令import时，不会执行模块，而是只生成一个动态的只读引用，等到真正需要用到时，再到真正用到时，再到模块里面去取值。ES6是动态引用，不会缓存值，模块里面的变量绑定其所在的模块。换句话说，ES6的输入有点像Unix系统的“符号连接”，原始值变了，import输入的值也会跟着变。
由于ES6输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。
因为变量obj指向的地址是只读的，不能重新赋值，这就好比main.js创造了一个名为obj的const变量。
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
### 最后，export通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例。
### CommonJS模块的加载原理
#### CommonJS的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象
```
  {
    id: '...',
    exports: {...},
    loaded: true,
    ...
  }
```
#### 上面的代码就是node内部加载模块后生成的一个对象。该对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕。
#### 以后需要用到这个模块的时候，就会到exports属性上面取值，即便再次执行require命令，也不会再次执行该模块，而是到缓存中取值，也就是说，CommonJS模块无论加载多少次都会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存

### CommonJS模块的循环加载
CommonJS模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行，一旦出现某个模块被循环，就只输出已经执行的部分，还未执行的部分不会输出
