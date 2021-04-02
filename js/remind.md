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
 
