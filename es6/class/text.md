7. es6 类的理解

传统的js只有对象，没有类的概念。它是基于原型的面向对象的语言。原型对象的特点就是将自身的属性共享给新对象。如果要生成一个对象实例，需要先定义一个构造函数，然后通过new操作符来完成。
```
  function Person(name, age) {
    this.name = name
    this.age = age
  }
  Person.prototype.say = function() {
    return this.name + + '' + this.age
  }
  var obj = new Person('hhh', 99)
  console.log(obj.say())
```
 构造函数生成实例的执行过程：
 1. 当使用了构造函数并且new构造函数，后台会隐式执行new Object()创建对象，新对象的__proto__指向构造函数的prototype
 2. 将构造函数的作用域给新对象即this指向新对象 利用call方法
 3. 执行构造函数的代码
 4. 返回新对象
 
es6引入了class类这个概念，通过class关键字可以定义类。该关键字的出现使得其在对象的写法上更加清晰，更像是一种面向对象的语言，如果将之前的代码改写成es6的写法：
```
  class Person() {
    constructor(name, age) {
      this.name = name
      this.age = age
    }
    // 类中声明方法这样写！！！
    say() {
      return ''
    }
  }
  var obj = new Person('hhh', 88)
```
类本质上就是一个函数，类自身指向的就是构造函数，es6中的类可以认为就是构造函数的另一种写法 构造函数的prototype在类中依然存在
实际上类的所有继承方法都定义在prototype属性上
可以通过prototype属性对类添加方法
```
  Person.prototype.addFn = function() {}
  // 还可以通过Object.assign()方法来为对象动态添加方法
  ```
    Object.assign(Person.prototype, {
      getName: function() {
        return this.name
      },
      getAge: function() {
        return this.age
      }
    })
  ```
```
constructor()方法是类的构造函数的默认方法，通过new 命令生成实例时候会自动调用该方法。
constructor() 方法如果没有显示定义，会隐式生成一个constructor方法，即如果没有添加构造函数，构造函数也是存在的，constructor默认返回实例对象的this，但是也可以指定constructor方法返回一个全新的对象，让返回的实例对象不是该类的实例
constructor中定义的属性可以称为实例属性（即定义在this对象上），constructor外声明的属性都是定义在原型对象上。hasOwnProperty函数用于判断属性是否是实例属性，in操作符会在通过对象能够访问的属性，不论对象是在实例上还是原型上
类的所有实例共享一个原型对象
- class不存在变量提升，所以需要先定义后使用。es5存在变量提升，可以先new再定义构造函数，class不存在变量提升的原因
```
  与继承有关，必须保证子类在父类之后调用
  {
    let Foo = class{}
    class Bar extends Foo{

    }
  }
  // 这个代码是不会报错的，因为Bar继承Foo的时候，Foo已经有定义了。但是如果存在class变量提升，上面代码就会报错，因为class被提升到代码头部，而let命令是不提升的，所以导致Bar继承Foo的时候Foo还没有定义
```

- es5中原型上定义的方法是可枚举的 Object.keys 可以获取到， es6类class中原型上定义即类的内部定义的方法是不可枚举的 Object.keys获取不到
类的属性名可以为表达式
- 类的构造函数必须使用new调用，否则会报错。普通构造函数不用new也可以直接执行

- 与函数一样 类也可以使用表达式的方式来 定义
```
  const MyClass = class Me{
    getClassName() {
      return Me.name
    }
  }
  上面的代码使用表达式定义了一个类。需要注意的是这个类的名字是MyClass而不是Me,Me只在Class的内部代码可用，指代当前类
  如果类的内部没有用到当前类Me的话，可以如下：
  const MyClass = Class {}

  采用Class表达式，可以写出立即执行的Class
  let person = new Class {
    constructor(name) {
      this.name = name
    }
    sayName() {
      return this.name
    }

  }('张三')
  person.sayName()
```

- 类的私有方法 ES6不提供 只能通过变通的方法模拟实现
  - 一种做法是在命名上加以区别
  ```
    class Widget {
      // 公有方法
      foo(baz) {
        this._baz(baz)
      }
      // 私有方法
      _baz(baz) {
        return this.snaf = baz
      }
    }
    // _baz表示这是一个仅限于内部使用的私有方法，但是这种命名是不保险的，在类的外部还是可以调到这个方法
  ```
  - 另一种做法就是将私有方法移除模块，因为只有模块内部的方法是对外可见的
  ```
    class Widget {
      foo(baz) {
        bar.call(this, baz)
      }
    }
    function bar(baz) {
      return this.snaf = baz
    }
  ```
  - 还有一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值
  ```
    const bar = Symbol('bar')
    const snaf = Symbol('snaf')
    export default class MyClass{
      // 公有方法
      foo(baz) {
        this[bar](baz)
      }
      // 私有方法
      [bar](baz) {
        return this[snaf] = baz
      }
    }
  ```
  - this的指向
  类的内部如果含有this，它默认指向类的实例，但是必须非常小心，一旦使用该方法很可能报错
  ```
    class Logger{
      printName(name = 'there') {
        this.print('${name}')
      }
      print(text) {
        console.log(text)
      }
    }
    const logger = new Logger()
    const {printName} = logger
    printName() // TypeError: Cannot read property 'print' of undefined

    上面代码中，printName方法中的this默认指向Logger类的实例，但是如果将这个方法单独提出来使用，this会指向该方法运行时所在的环境，因为找不到print而报错
    一个比较简单的解决方法是在构造函数中绑定this，这样就不会找不到print方法了
    class Logger{
      constructor() {
        this.printName = this.printName.bind(this)
      }
    }
    另一种解决方法是使用箭头函数
    class Logger{
      constructor() {
        this.printName = (name = "there") => {
          this.print('${name}')
        }
      }
    }
    还有一种解决方法是使用proxy 获取方法的时候自动绑定this todo!!!
    function selfish(target) {
      const cache = new WeakMap()
      const handler = {
        get(target, key){
          const value = Reflect.get(target,key)
          if(typeof value !== 'function') {
              return value
          }
          if(!cache.has(value)) {
            cache.set(value, value.bind(target))
          }
          return cache.get(value)
        }
      }
      const proxy = new Proxy(target, handler)
      return proxy
    }
    const logger = selfish(new Logger())
  ```
  - 严格模式
  类和模块的内部，默认就是严格模式，所以不需要使用use strict，只要代码写在类或模块之中就只有严格模式可用，考虑到未来所有的代码其实都是运行在模块之中，所以es6实际上把整个语言升级到了严格模式
  - name属性
  因为本质上es6类只是es5的构造函数的一层包装，所以函数的许多特性都被class继承，包含name属性 class Point {} Point.name // "Point" name属性总是返回紧跟在class关键字后面的类名

  - class继承
  class之间可以使用extends关键字继承 class ColorPoint extends Point{} // 因为没有部署代码 相当于复制了一个Point类
  ```
    class ColorPoint extends Point {
      constructor(x,y,color) {
        super(x,y) // 调用父类的constructor(x,y)
        this.color = color
      }
      toString() {
        return this.color + '' + super.toString() // 调用父类的toString()
      }
    }
    super关键字，在这里表示父类的构造函数，用来新建父类的this对象，字类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承的父类的this对象，然后对其加工，如果不调用super方法，子类就得不到this对象
  ```
  - es5的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上(parent.apply(this)) es6的继承机制完全不同，实质是先创造父类的实例对象所以必须先调用super方法，然后再用子类的构造函数修改this
  如果子类没有定义constructor方法默认添加：constructor(...args) {super(...args)}
  - 在子类的构造函数中，必须调用super之后才可以使用this关键字，否则会报错。这是因为子类实例的构建，是基于对父类加工，只有super()方法才能返回父类实例
  
  - 子类的__proto__属性，表示构造函数的继承，总是指向父类
  - 子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性
  B extends A
  B.__proto__ === A
  B.prototype.__proto__ === A.prototype
  var b = new B()
  var a = new A()
  b.__proto__=== B.prototype
  b.__proto__.__proto__ === B.prototype.__proto__ === A.prototype === a.__proto__
  这样的结果是因为，类的继承是按照下面的模式实现的。
  ```
    class A{}
    class B{}
    // B的实例继承A的实例
    Object.setPrototypeOf(B.prototype,A.prototype)
    // B继承A的静态属性
    Object.setProrotypeOf(B,A)

    Object.setPrototypeOf = function(obj,proto) {
      obj.__proto__ = proto
      return obj
    }
  ```
  可以这样理解：作为一个对象，子类B的原型__proto__属性是父类A
                作为一个构造函数，子类B的原型prototype属性是父类的实例


- extends的继承目标
extends关键字后面可以跟多种类型的值
class B extends A{

}
上面代码A，只要是prototype属性的函数就能被B继承，由于函数都有prototype属性除了Function，因此A可以是任意函数，下面讨论三种特殊情况
1. 子类继承Object类
class A extends Object {}  A.__proto__ === Object // true A.prototype.__proto__ === Object.prototype // true
这种情况下A其实就是构造函数Object的复制，A的实例就是Object的实例
2. 不存在任何继承
class A {} A.__proto__ === Function.prototype // true A.prototype.__proto__ === Object.prototype // true
3. 子类继承null
class A extends null {} A.__proto__ === Function.prototype A.prototype.__proto__ === undefined
A是一个普通函数，所以直接继承Function.prototype 但是A调用后返回的对象不继承任何方法
- Object.getPrototypeOf() 可以从子类上获取父类 Object.getPrototypeOf(ColorPoint) === Point
这个方法可以用来判断一个类是否继承了另一个类
- super关键字
super既可以当作函数使用，也可以当作对象使用，这两种情况用法完全不同
1. 作为函数调用，代表父类的构造函数，es6规定，子类的构造函数必须执行一次父类的构造函数即super函数
class A{}
class B extends A {
  constructor() {
    super() // 必须调用 代表父类的构造函数  super虽然代表的是父类A的构造函数，但是返回的是子类B的实例，即super内部的this指向的是B，因此super()在这里相当于A.prorotype.constructor.call(this)
  }
}
作为函数，super()只能用于子类的构造函数，其他地方就会报错
2. super作为对象，指向父类的原型对象
```
  class A {
    p() {
      return 2
    }
  }
  class B extends A {
    constructor() {
      super()
      super.p() // 2
    }
  }
  let b = new B()
  // 子类中的super.p()就是将super作为一个对象使用，super指向A.prototype
```
这里需要注意的是由于super指向父类的原型对象，所以定义在父类实例上的方法或属性是无法通过super调用的
```
  class A {
    constructor() {
      this.p = 2
    }
  }
  class B extends A {
    get m() {
      return super.p
    }
  }
  let b = new B()
  b.m // undefined  p是父类A实例的属性，super.p就引用不到它
```
es6规定，通过super调用父类的方法时，super会绑定子类的this
```
  class A{
  constructor() {
    this.x = 1
  }
  print() {
    return this.x
  }
}
class B extends A{
  constructor() {
    super()
    this.x = 2
  }
  m() {
    super.print() // 实际上执行的是super.print.call(this)
  }
}
var b = new B() b.m // 2 
```
对象总是继承其他对象的，所以可以在任意一个对象中使用super关键字
var obj = {
  toString() {
    return super.toString()
  }
}

- 原生构造函数的继承
  - 原生构造函数是语言内置的构造函数，用来生成数据结构 如Boolean() Number() Object() Date() ...
  - es5 原生构造函数是无法继承的，比如不能自己定义一个Array的子类
  ```
    function MyArray() {
      Array.apply(this, arguments);
    }

    MyArray.prototype = Object.create(Array.prototype, {
      constructor: {
        value: MyArray,
        writable: true,
        configurable: true,
        enumerable: true
      }
    });
    var colors = new MyArray();
    colors[0] = "red";
    colors.length  // 0

    colors.length = 0;
    colors[0]  // "red"
  ```
  子类无法获得原生构造函数的内部属性，通过Array.apply()或分配给原生对象都不行 原生构造函数会忽略apply方法传入的this，也就是说原生构造函数的this无法绑定，导致拿不到内部属性
  es5是先创建子类的实例对象，再将父类的属性添加到子类上，由于父类的内部属性无法获取导致无法继承原生的构造函数。比如，Array构造函数有一个内部属性[[DefineOwnProperty]]，用来定义新属性时，更新length属性，这个内部属性无法在子类获取，导致子类的length属性行为不正常。

  es6允许继承原生构造函数定义子类，因为es6是先创建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承
  ```
    class MyArray extends Array{
      constructor(...args) {
        super(...args)
      }
    }
    var arr = new MyArray(1,2,3)
    arr[0] = 12
    arr.length // 3
    arr.length = 0
    arr[0] // undefined
  ```
es6可以自定义原生数据结构的子类

类可以设置set和get方法 设置在属性的descriptor对象上
```
  class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html");
"get" in descriptor  // true
"set" in descriptor  // true
```
- class的静态属性和实例属性
静态属性指的是Class本身的属性，即class.propName而不是定义在实例对象this上的属性
class Foo {}
Foo.prop = 1 Foo.prop // 1
prop是Foo的静态属性
目前只有这种写法可行。因为es6明确规定class内部只有静态方法没有静态属性
// 以下两种写法都无效
class Foo {
  // 写法1 无效
  prop: 2
  // 写法2 无效
  static prop: 2
}
es7提案：
（1）类的实例属性 类的实例属性可以用等式写入类的定义之中
class MyClass {
  myProp = 42
  constructor() {
    console.log(this.myProp) // 42
  }
}
在MyClass的实例上可以读取这个属性
以前我们定义实例属性，只能写在类的constructor方法里面
class MyClass {
  constructor(props) {
    this.state = 0
  }
}
有了新的写法以后，可以不在constructor方法里面定义。

class ReactCounter extends React.Component {
  state = {
    count: 0
  };
}
这种写法比以前更清晰。

为了可读性的目的，对于那些在constructor里面已经定义的实例属性，新写法允许直接列出。

class ReactCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  state; !!!
}
(2) 类的静态属性 实例属性新写法前面加static
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myProp); // 42
  }
}
- new.target属性
new是从构造函数生成实例的命令，es6为new命令引入了一个new.target的属性，在构造函数中返回new命令作用于的那个构造函数，如果构造函数不是new命令调用的，new.target会返回undefined
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用new生成实例');
  }
}
// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用new生成实例');
  }
}
var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
class内部调用new.target，返回当前class

class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}
var obj = new Rectangle(3, 4); // 输出 true
需要注意的是，子类继承父类的时候，new.target会返回子类
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}
class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}
var obj = new Square(3); // 输出 false
利用这个特点，可以写出不能独立使用，必须继承后才能使用的类
class shape  {
  constructor() {
    if(new.target === Shape) {
      throw new Error('本类不能实例化')
    }
  }
}
class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}
var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
上面代码中，Shape类不能被实例化，只能用于继承。

注意，在函数外部，使用new.target会报错。

- Mixin模式的实现
Mixin模式指的是将多个类的接口混入另一个类，它在es6实现如下
function mix(...mixins) {
  class Mix {}
  for(let mixin in mixins) {
    copyProperties(Mix,mixin)
    copyProperties(Mix.prototype,mixin.prototype)
  }
  return Mix
}
function copyProperties(target,source) {
  for(let key of Reflect.ownKeys(source)) {
       if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
上面代码的mix函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。

class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}