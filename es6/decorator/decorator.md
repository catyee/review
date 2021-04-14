- 类的修饰 Decorator
装饰器是一个函数，用来修改类的行为。 装饰器对类的行为的改变，是代码编译时发生的，而不是运行时，这意味着，装饰器能在编译阶段运行代码
function testable(target) {
    target.idTestable = true
}
@testable
class MyTestbleClass{}

上面代码中@testable就是一个装饰器，它修改了MyTestbleClass这个类的行为，为它加上了静态属性idTestable
基本上，修饰器的行为就是下面这样
@decorator
class A{}
// 等同于
class A{}
A = decorator(A) || A
也就是说，修饰器本质就是编译时执行的函数
修饰器的第一个参数就是所要修饰的目标类
function testable(target) {
  // ...
}
上面代码中，testable函数的参数target，就是会被修饰的类。
如果觉得一个参数不够用，可以在修饰器外面再封装一层函数
function testable(isTestable) {
    return function (target) {
        target.isTestable = isTestable
    }
}
@testable(true)
class MyTestableClass{}
上面代码中，修饰器testable可以接受参数，这就等于可以修改修饰器的行为。

前面的例子是为类添加一个静态属性，如果想添加实例属性，可以通过目标类的prototype对象操作
function testable(target) {
    target.prototype.isTestable = true
}
@testable
class MyTestableClass {}

let obj = new MyTestableClass();
obj.isTestable // true
上面代码中，修饰器函数testable是在目标类的prototype对象上添加属性，因此可以在实例上调用

下面是另外一个例子
```
// mixins.js
export function mixins(...list) {
    return function(target) {
        Object.assign(target.prototype, ...list)
    }
}
// main.js
import { mixins } from './mixins'
const Foo = {
    foo() {console.log('foo')}
}
@mixins(Foo)
class MyClass{}

let obj = new MyClass()
obj.foo() // 'foo'

```
上面通过装饰器mixins把Foo类的方法添加到了MyClass的实例上面
可以用Object.assign()模拟这个功能。
const Foo = {
  foo() { console.log('foo') }
};
class MyClass {}
Object.assign(MyClass.prototype, Foo);
let obj = new MyClass();
obj.foo() // 'foo'

- 方法的修饰
修饰器不仅可以修饰类，还可以修饰类的属性
class Person {
    @readonly // 修饰name方法
    name() { return `${this.first} ${this.last}` }
}
修饰器修饰类的属性，一共可以接受三个参数，第一个参数是所要修饰的目标对象，第二个参数是所要修饰的属性名，第三个参数是该属性的描述对象
function readonly(target,name,descriptor) {
      // descriptor对象原来的值如下
     // {
     //   value: specifiedFunction,
     //   enumerable: false,
     //   configurable: true,
     //   writable: true
     // };
     descriptor.writable = false
     return descriptor
}
readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor);

上面代码说明，修饰器会修改属性的描述对象descriptor，然后被修改的描述对象再用来定义属性

下面是另一个例子，修改属性描述对象的enumerable属性，使得该属性不可遍历。
class Person {
    @noenumerable
    get kidCount() {return this.children.length}
}
function noenumerable(target,name,descriptor) {
    descriptor.enumerable = false
    return descriptor
}
下面的@log修饰器，可以起到输出日志的作用。
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}
function log(target, name, descriptor) {
     var oldValue = descriptor.value;
     descriptor.value = function() {
     console.log(`Calling "${name}" with`, arguments);
        return oldValue.apply(null, arguments);
    };
    return descriptor

}
上面代码中，@log修饰器的作用就是在执行原始的操作之前，执行一次console.log，从而达到输出日志的目的。

修饰器有注释的作用。

@testable
class Person {
  @readonly
  @nonenumerable
  name() { return `${this.first} ${this.last}` }
}
从上面代码中，我们一眼就能看出，Person类是可测试的，而name方法是只读和不可枚举的。

如果同一个方法有多个装饰器，会像剥洋葱一样，先从外向内进入，然后由内向外执行
function dec(id) {
    console.log('evaluated', id);
    return (target, property, descriptor) => console.log('executed', id);
}
class Example {
    @dec(1)
    @dec(2)
    method(){}
}
dec(Example,method,descriptor,1 )
// evaluated 1
// evaluated 2
// executed 2
// executed 1

上面代码中，外层修饰器@dec(1)先进入，但是内层修饰器@dec(2)先执行。
除了注释，修饰器还能用来类型检查。所以，对于类来说，这项功能相当有用。从长期来看，它将是JavaScript代码静态分析的重要工具。

- 为什么修饰器不能用于函数
修饰器只能用于类和类的 方法，不能用于函数，因为函数存在函数提升