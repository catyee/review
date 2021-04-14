1. 数据类型
 - 基本：Number String Null Udefined Boolean
 - 引用：Object Array Regexp Date Function

2. 数据类型检测
- typeof 检测基本类型 引用数据类型都是Object Null也是object typeof function=> function typeof NaN => number  typeof undefined => undefined
- instanceof 
    'a' instanceof String => false 
    var a = new String('a')
    a instanceof String => true
 String，Number，Boolean 类型需要new创建的话才能检测 字面量创建不能检测
 null instanceof Null 报错
 undefined instanceof Undefined 报错

 function instanceof Function => true 可以检测
 date instanceof Date => true 可以检测
 {} instanceof Object => true 可以检测
 regexp instanceof RegExp => true 可以检测
 [] instanceof Array => true 可以检测

- constructor 可以检测除了null undefined 但是原型可以被改写（如何改写？）改写之后就不准确了
 (1).constructor === Number => true可以检测
 ('1').constructor === String => true 可以检测
 ('true').constructor === Boolean  => true 可以检测
 (null).constructor=== Null  => 报错
 (undefined).constructor === Udefined => 报错
 (function).constructor === Function => true 可以检测
 ([]).constructor === Array => true 可以检测
 ({}).constructor === Object => true 可以检测
 (/\d/).constructor === RegExp => true 可以检测
 (date).constructor === Date => true 可以检测

 改写：
 function F() {} F.prototype = new Array() var f = new F() f.constructor === F // false
 f.constructor === Array // true

 - Object.prototype.toSting.call(1) => '[object Number]'
 - Object.prototype.toSting.call('1') => '[object String]'
 - Object.prototype.toSting.call(true) => '[object Boolean]'
 - Object.prototype.toSting.call(null) => '[object Null]'
 - Object.prototype.toSting.call(undefined) => '[object Undefined]'
 - Object.prototype.toSting.call([]) => '[object Array]'
 - Object.prototype.toSting.call({}) => '[object Object]'
 - Object.prototype.toSting.call(function() {}) => '[object Function]'
 - Object.prototype.toSting.call(/\d+/) => '[object RegExp]'
 - Object.prototype.toSting.call(new Date()) => '[object Date]'
 - Object.prototype.toSting.call(Symbol(1)) => '[object Symbol]'

 // todo!!!
 Object.prototype上有哪些方法呢
      1. toString 使用call方法可以检测数据类型 Object.prototype.toSting.call(obj)
      2. constructor 指向构造函数 Object.prototype.constructor === Object
      3. hasOwnProperty 判断是不是有这个属性 自身的私有属性 忽略从原型上继承的属性
      4. isPrototypeOf
      5. valueOf 



 3. 原型与原型链

 - 面向对象的三个基本特征
  1. 封装
  类：封装对象的属性和行为 todo!!! 类的修饰符
  方法：封装具体逻辑功能
  2. 继承
   使子类具有父类的属性和共有方法，而不需要再次编写相同的代码。子类继承父类的同时，可以重新定义某些属性，并重写某些方法
  3. 多态
   - 重写 字类对父类的方法重写，不影响父类，又称方法覆盖
   - 重载 函数或者方法有相同的名称，但是参数列表不相同的情形，这样的同名不同参数的函数或者方法之间互相称之为重载函数或方法。可以自己判断参数类型去调用不同方法。


 - 每个实例对象都有一个私有属性__proto__,指向它的构造函数的原型对象prototype，该原型对象也有一个私有属性__proto__,层层向上直到一个对象的原型为null，根据定义null没有原型，并且作为原型链中的最后一个环节。
 核心：每个实例对象都有一个私有属性__proto__,该私有属性指向实例构造函数的原型对象。
 只有函数有prototype，对象是没有的
 函数也有__proto__，因为函数也是对象，函数的__proto__指向Function.prototype
 也就是说普通函数是Function这个构造函数的一个实例



Function.__proto__ === Function.prototype // __proto__一定指向一个prototype 即作为实例指向其构造函数的prototype Function的构造函数还是他自身
Function.prototype.__proto__ === Object.prototype
Function.prototype是一个原型对象，对象的构造函数是Object

Object.prototype.__proto__ === null Object的原型对象作为实例的构造函数是null
Object.__proto__=== Function.prototype Object作为实例指向其构造函数的原型Function.prototype 
 Object.__proto__.__proto__ === Object.prototype
 Object.constructor === Function
 Object.prototype.constructor === Object
 Function.constructor === Function
 Function.prototype === (函数F).__proto__
 Function.__proto__ === Function.prototype
 Function.prototype.__proto__ === Object.prototype
 Object.prototype === Function.prototype.__proto__
 Object.__proto__ === Function.prototype
 Object.prototype.__proto__ === null


 创建对象的三种方式
 1. 字面量创建 var a = {name: 'mimi'}或var a = new Object({name: 'mimi'})
 2. 构造函数 function A(name){this.name = name} var a = new A('mimi')
  a => {name: 'mimi'}
 3. Object.create: Object.create(prototype, propertiesObject)第一个参数是新创建对象的原型对象，第二个参数是可选的 var p = {name: 'p'} var a = Object.create('p', {
   age: {
     value:1,
     writable: true
   }
 })

4. instanceof 原理 可以检测数据类型 但是只能检测new的基本类型，引用类型也可以，null和undefined不可以
 instanceof是判断实例对象的__proto__和生成该实例的构造函数的prototype是不是引用的同一个地址
 实例在instanceof的时候与原型链上所有的构造函数相比都是true
 如果要判断实例是由哪个构造函数生成的，需要用constructor obj.__proto__.constructor

5. new关键字
 new运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例，new关键字会进行如下操作
 1. 创建一个空对象{}
 2. 链接该对象到另一个对象（即设置该对象的构造函数）
 3. 将步骤1新创建的对象作为this的上下文
 4. 如果该函数没有返回对象或返回基本类型则返回this

 当代码new Foo(...)执行时，将会发生以下事情
 1. 一个继承自Foo.prototype的新对象被创建
 2. 使用指定的参数调用构造函数Foo,并将this绑定到新创建的对象，new Foo等同于new Foo(),也就是没有指定参数列表，Foo不带任何参数的情况
 3. 由构造函数返回的对象就是new表达式的结果，如果构造函数没有显式返回一个对象，则返回步骤一新创建的对象（一般情况下，构造函数不返回值但是用户可以选择主动返回对象，来覆盖正常的对象操作步骤）

 - 实现一个new函数 _new(Fn, 1,2,3) 
 扩展运算符 ...将数组转化为逗号分隔的序列 ...[1,2,3] => 1,2,3


 ```
  function _new(func, ...args) {
    let obj = Object.create(func.prototype)
    var res = func.call(obj,...args)
    if( res !=== null && typeof res=== 'object' || typeof res === 'function'){
      return res
    }
    return obj
  }

  function _new(func) {
    // 拿到参数
    var args = Array.prototype.slice.call(arguments, 1)
    var obj = {}
    obj.__proto__ = func.prototype
    var res = func.apply(obj,args)
    if( res !=== null && typeof res=== 'object' || typeof res === 'function'){
    return res
    }
    return obj

  }
 ```

 6. call,bind,apply
 call,bind,apply这三个函数的第一个参数都是this的指向对象
 call的参数是直接放进去的，第二第三个第n个参数全部用逗号分隔，直接放到后面obj.myFun.call(db,'成都','上海')
 apply中的所有参数必须放在一个数组里传进去obj.myFun.apply(db,['成都','上海'])
 bind除了返回是函数外，它的参数和call一样
 obj.myFun.bind('db', '成都', '上海')()

 7. 函数声明和变量声明总是会被解释器提升到方法体的最顶部
 - var a会被提升 但是a =3 即变量初始化不会被提升，声明会被提升，初始化不会被提升
    ```

      function a(){	
      }
      var a; 
      console.log(a) // a的函数体
      函数的声明比变量的声明优先级更高
   ```
- 函数式声明函数声明连同函数体一起被提升
- 基本数据类型栈内存 引用数据类型堆内存
- 如果函数在函数体中声明，则它是函数作用域，否则为全局作用域。变量将会在执行进入作用域的时候被创建。块不会定义新的作用域，只有函数声明和全局性质代码执行才会创建新的作用域，变量在创建的时候会被初始化为undefined。如果变量声明语句里带有赋值操作，则赋值操作只有在执行的时候才会发生，而不是创建的时候。
- js引擎在读取js代码的时候会有两个步骤1.解释 2.执行 解释是指先通篇扫描所有的js代码，然后把所有的声明提升到顶端，然后就是代码执行
```
  var a = 1;                           1. 将外部函数foo声明提前，foo函数定义提升到代码开始之前
  function foo() {                     2. 将内部函数a提升到foo函数作用域顶部，此时输出function() {}
    a = 10;                            3. 将a类型由函数类型重新定义为number类型，并赋值为10
    return;                            4. 将内部函数执行环境从执行堆栈中弹出销毁，此时外部a值未做改变，仍为1
    function a() {}                    5. 输出外部变量a，其值必然为1
  }
  foo();
  console.log(a)
```



js中变量进入一个作用域有以下四种方式：
    1. 变量声明：如var a；var fn = function() {}
    2. 函数声明：如function foo() {}
    3. 函数形参：函数的形参存在于函数作用域中
    4. 语言自定义构建：所有的作用域都会自动生成this、arguments两个默认变量

js在执行前会预先创建好执行环境变量，但由于其弱类型语言特征，其变量和函数可同时定义并赋值，为保证执行环境的完整性及函数执行的有效性，js会在编译阶段将所有变量、函数的声明事先放入内存，以保证其可访问性。从代码结构来看，好像是把所有变量的声明、函数的声明都放在代码头部事先执行一样。

8. js event loop
- 进程和线程
 进程是系统分配的独立资源，是cpu资源分配的基本单位
 进程是由一个或多个线程组成的，线程是进程的执行流，是cpu调度和分派的基本单位，同一个进程中的多个线程是共享该进程的资源的

- 浏览器内核
 浏览器是多进程的，浏览器的每一个tab标签都代表一个独立的进程，多个空tab会合并成一个进程，浏览器内核（浏览器渲染进程）则属于浏览器多进程的一种
 浏览器内核有多种线程在工作
 1. GUI渲染线程 (1) 负责渲染页面，解析html，css构成DOM树等，当页面重绘或者由于某种操作引起回流都会调用该线程。
 (2) 和js引擎是互斥的，当js引擎在工作的时候，GUI渲染进程会被挂起，GUI更新会被放入到js任务队列中，等待js引擎线程空闲的时候继续执行

 2. js引擎线程
 (1) 单线程工作，负责解析允许js脚本
 (2) 和GUI渲染进程互斥，js脚本耗时过长会引起页面阻塞

 3. 事件触发线程
 当事件符合触发条件时被触发，该线程会把对应的事件回调函数添加到任务队列，等待js引擎处理
 4. 定时器触发线程
  (1) 浏览器定时器并不是js引擎计数的，阻塞会导致计时不正确
  (2) 开启定时器触发线程并触发计时时，计时完成后被添加到任务队列中，等待js引擎处理

 5. http请求线程
  (1) http请求的时候开启一条请求线程
  (2) 请求完成后，将请求的回调函数添加到任务队列中等待js引擎处理

- 事件循环
  js引擎是单线程的，分为浏览器事件循环和node事件循环
  浏览器：
  - js有一个主线程和调用栈，所有的任务都会被放到调用栈等待主线程执行
  - js调用栈是一个后进先出的数据结构，当函数被调用时，会被添加到栈的顶部，执行完之后就从栈顶移出该函数，直到栈被清空
  - js中的任务分为同步任务和异步任务，同步任务会在调用栈中按照顺序排队等待主线程执行，异步任务有了结果之后会将注册的回调函数添加到任务队列，等待主线程空闲的时候，也就是调用栈被清空的时候，被读取到调用栈中等待主线程执行，任务队列是先进先出的数据结构
  - 调用栈中的异步任务都执行完毕后，栈被清空了就代表主线程空闲了，这个时候就会去任务队列中按照顺序读取一个任务，有就读取进栈执行，一直循环这就形成了事件循环
  - 定时器会开启一条定时器触发线程来触发计时，定时器在等待了指定时间后，将任务放在任务队列中等待读取到调用栈中等待主线程执行，定时器指定的延时毫秒并不准确，因为定时器只是到了指定的时间放到任务队列，必须等到同步任务和现有的任务队列中的事件全部执行完之后才会读取到定时器的回调函数到主线程执行，中间可能存在耗时比较久的任务，那么就不可能保证在指定的时间执行
  - 宏任务，微任务
  除了广义的同步任务和异步任务，js单线程的任务可以分为宏任务和微任务
  - 宏任务：script(整体代码) setTimeout setInterval setImediate I/O UI rending http回调，事件 requestAnimationFrame
  - 微任务：process.nextTick promise Object。observe MutationObserver await
  - 一次完整的事件循环步骤：
  1. 检查宏任务队列是否为空，如果不为空到2，如果为空到3
  2. 执行宏任务中的一个任务
  3. 继续检测微任务队列是否为空，如果不为空则到4，否则到5
  4. 执行微任务队列中的任务，执行完返回3
  5. 执行视图更新
  执行顺序：
  先执行同步代码，遇到setTimeout之类的宏任务就先放到宏任务队列里，碰到pormise之类的微任务就放到微任务的队列中，然后同步代码执行完毕后开始释放微任务队列，完了之后再释放宏任务队列


  - 浏览器环境下js引擎的事件循环机制
  1. 执行栈与事件队列
  当js代码执行的时候会将不同的变量存于内存中的不同位置：堆和栈中来加以区分。其中，堆里存放着一些对象，而栈中存放着一些基础类型变量以及对象的指针，但是我们这里所说的执行栈跟上面这个栈的意义却不同。
  我们知道，当我们调用一个方法的时候，js会生成一个与这个方法对应的执行环境context，又叫执行上下文。这个执行环境中存在着这个方法的私有作用域，上层作用域的指向，方法的参数，这个作用域中定义的变量以及这个作用域的this指向。而当一系列方法被依次调用的时候，因为js是单线程的，同一时间只能执行一个方法，于是这些方法被排队中一个单独的地方，这个地方称为执行栈
  当一个脚本第一次执行的时候，js引擎会解析这段代码，并将同步代码按照执行顺序加入到执行栈，然后从头开始执行。如果当前执行的是一个方法，那么js会向执行栈在添加这个方法的执行环境，然后进入这个执行环境继续执行其中的代码。当这个执行环境中的代码执行完毕后返回结果后，js会退出这个执行环境并把这个执行环境销毁。这个过程反复进行，直到执行栈中的代码全部执行完毕
  js引擎遇到一个异步事件后并不会一直等待其返回结果，而是会将这个事件挂起，继续执行执行栈中的其他任务。当一个异步事件返回结果后，js会将这个事件加入与当前执行栈不同的另一个队列，即事件队列。被放入到事件队列不会立即执行其回调，而是等待当前执行栈中的所有任务都指向完毕，主线程处于闲置状态时，主线程会查找事件队列是否有任务。如果有主线程会从中取出排在第一位的事件，并把这个事件对应的回调放入到执行栈中，然后执行其中的同步代码，如此反复就形成了一个循环，这个过程被称为事件循环。

  先执行同步代码，当前执行栈为空的时候，去微任务队列，把微任务执行完，然后再去宏任务队列取出一个宏任务加入到执行栈执行，执行完毕再去微任务中查看是否为空，不为空执行微任务队列，为空就执行一个宏任务，如此循环。
  - node环境下的事件循环机制
  1. 与浏览器有何不同？
  在node中事件循环表现出的状态与浏览器大致相同，不同的是node有一套自己的模型，node中时间的循环的实现是依靠的libuv引擎，我们知道node选择chorme v8引擎作为js解释器，v8引擎将js代码分析后调用对应的node api，而这些api最后是由libuv引擎驱动，执行对应的任务，并把不同的事件放在不同的队列中等待主线程执行，因此实际上node中的事件循环存在于libuv引擎中

闭包：
函数和对其周围状态（词法环境）的引用捆绑在一起构成闭包。也就是说闭包可以让你从内部函数访问外部函数作用域，在js中每当函数被创建，就会在函数生成时生成闭包
作用: 一个是它可以读取函数内部的变量，另一个是让这些变量始终保持在内存中
缺点：使用闭包会占有内存资源，过多的闭包会导致内存溢出
内存泄漏处理：简单的说就是把那些不需要的变量，但是垃圾回收又收不走的那些赋值为null，然后让垃圾回收走
闭包就是能够读取其他函数内部变量的函数，通俗的讲就是函数a的内部函数b被函数a外部的一个变量引用的时候，就创建了一个闭包，最常见的是函数封装的时候，再就是使用定时器的时候
闭包：
```
  function a() {
    var i = 0;
    function b() {
      console.log(i++)
    }
    return b
  }
  var c = a()
  c() // 1 c()//2 c() //3 ...
```
i是函数a中的一个变量，它的值被函数b引用，形成了闭包i变量一直保存在内存中
当我们需要在模块中定义一些变量，并且希望这些变量能够一直保存在内存中但又不会污染全局变量时，就可以用闭包来定义这个模块

闭包的优点： 减少全局变量，减少传递函数的参数量，封装
缺点：占用内存资源，过多的闭包会导致内存溢出
内存泄漏解决： 不需要的变量赋值为null

垃圾回收机制：
js具有垃圾收集器，垃圾收集器会按照固定的时间间隔周期性的执行
最常见的垃圾回收方式有两种：
1. 标记清除 运行时候给内存变量加标记 去掉环境变量以及引用的变量的标记，剩下的带标记的视为准备删除的，销毁带标记的值并回收内存空间
2. 引用计数 跟踪记录每个值被引用的次数  次数变为0 就释放


- 原型链与继承
 函数有一个prototype属性，prototype包含一个指向构造函数的指针constructor prototype存储函数及其实例的公有方法和属性，实例对象有一个__proto__属性，指向其父类构造函数的prototype，查询实例上的一个属性，如果没有就去其父类的prototype上去查找，直到找到null
 例如函数F.prototype.__proto__ === Object.prototype Object.prototype.__proto__ === null 
var F=function(){}; Object.prototype.a=function(){ console.log('a()') }; Function.prototype.b=function(){ console.log('b()') } var f=new F(); f.a()//？ f.b()//？ F.a()//？ F.b()//？ 
a() 报错 a() b()

- 实现继承
 1. 原型链继承（思想：一个类的原型对象等于另一个类的实例）
 ```
  function Super() {

  }
  Super.prototype.a = function() {}
  function Sub() {

  }
  Sub.prototype = new Super()
 ```
 问题： 原型对象中的所有属性都是所有实例共享的，如果原型对象中存储一个引用类型的属性如colors:[],那么一个实例修改这个属性，其他的实例也会受到影响
 因此，我们将属性放在构造函数上，而不是构造函数的原型对象上，例如function Super() { this.colors = ['black'] } 这样实例之间就不会相互影响了。还有个问题是创建子类型实例的时候，没法向超类型的构造函数中传参，会影响其他实例

 2. 借用构造函数（思想：子类型构造函数内部调用超类型构造函数）
 ```
  function Super(name){
    this.colors = []
    this.name = name
  }
  function Sub(name) {
    Super.call(this, 'huahua')
  }
  var sub = new Sub()
 ```
 这种方式，每个子类型实例创建的时候都将执行Super并创建自己的属性，这样每个实例之间就不会影响了。 同时还可以实现在子类型构造函数中向超类型函数
 问题：这种方式的话，超类型的函数必须在构造函数中定义，这样就不能实现构造函数的复用了，在超类型原型上定义的方法对于子类型是不可见的

 3. 组合继承（思想：组合原型链继承和借用构造函数继承）
 ```
  function Super(name){
    this.colors = []
    this.name = name
  }
  Super.prototype.func = function() {}
  function Sub(name) {
    Super.call(this, name)
  }
  Sub.prototype = new Super()
  Sub.prototype.constructor = Sub
  var sub = new Sub('huahua')
 ```
 问题： 会调用两次构造函数

 4. 原型式继承（思想：Object.create()）
 ```
  function create(o) {
    var F = function () {}
    F.prototype = o
    return new F()
  }
 ```
问题：所有实例共用一套引用属性，实例之间会相互影响
5. 寄生式继承（思想：创建一个仅用于封装继承过程的函数，该函数不以某种方式来增强对象，最后再像是真的它做了所有工作一样返回对象）
```
  function createAnother(original) {
    var clone = Object.create(original)
    clone.say = function() {}
    return clone
  }
```
问题：不能做到函数复用

6. 寄生组合式继承


