- Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”，即对编程语言进行编程
- Proxy 可以理解成，在目标对象之前架设一层拦截，外界对该对象的访问，都必须经过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写，Proxy这个词的原意是代理，用在这里表示由它来代理某些操作，可以译为代理器
```
    var obj = new Proxy({}, {
        get: function(target,key,receiver) {
            console.log(`getting${key}!`)
            return Reflect.get(target,key,receiver)
        },
        set: function(target,key,value,receiver) {
            console.log(`setting${key}`)
            return Reflect.set(target,key,value,receiver)
        }
    })
```
上述代码对一个空对象架设了一层拦截重定义了属性的读取get和设置set行为

es6提供Proxy构造函数，用来生成Proxy实例
var proxy = new Proxy(target,handler) // target表示要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为
注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。
如果handler没有设置任何拦截，那就等同于直接通向原对象。


- 一个技巧是将Proxy对象，设置到object.proxy属性，从而可以在object对象上调用。

var object = { proxy: new Proxy(target, handler) };

Proxy 实例也可以作为其他对象的原型对象。

var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
上面代码中，proxy对象是obj对象的原型，obj对象本身并没有time属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截。
- 同一个拦截器函数，可以设置拦截多个操作。

var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // 1
new fproxy(1,2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo // "Hello, foo"
下面是 Proxy 支持的拦截操作一览。

对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。

（1）get(target, propKey, receiver)

拦截对象属性的读取，比如proxy.foo和proxy['foo']。

最后一个参数receiver是一个对象，可选，参见下面Reflect.get的部分。

（2）set(target, propKey, value, receiver)

拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。

（3）has(target, propKey)

拦截propKey in proxy的操作，以及对象的hasOwnProperty方法，返回一个布尔值。

（4）deleteProperty(target, propKey)

拦截delete proxy[propKey]的操作，返回一个布尔值。

（5）ownKeys(target)

拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)，返回一个数组。该方法返回对象所有自身的属性，而Object.keys()仅返回对象可遍历的属性。

（6）getOwnPropertyDescriptor(target, propKey)

拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。

（7）defineProperty(target, propKey, propDesc)

拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。

（8）preventExtensions(target)

拦截Object.preventExtensions(proxy)，返回一个布尔值。

（9）getPrototypeOf(target)

拦截Object.getPrototypeOf(proxy)，返回一个对象。

（10）isExtensible(target)

拦截Object.isExtensible(proxy)，返回一个布尔值。

（11）setPrototypeOf(target, proto)

拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。

如果目标对象是函数，那么还有两种额外操作可以拦截。

（12）apply(target, object, args)

拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。

（13）construct(target, args)

拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

let proto = new Proxy({}, {
  get(target, propertyKey, receiver) {
    console.log('GET '+propertyKey);
    return target[propertyKey];
  }
});

let obj = Object.create(proto);
obj.xxx // "GET xxx"
上面代码中，拦截操作定义在Prototype对象上面，所以如果读取obj对象继承的属性时，拦截会生效。


set()
set方法用来拦截某个属性的赋值操作。

假定Person对象有一个age属性，该属性应该是一个不大于200的整数，那么可以使用Proxy保证age的属性值符合要求。

let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于age以外的属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
# 上面代码中，由于设置了存值函数set，任何不符合要求的age属性赋值，都会抛出一个错误。利用set方法，还可以数据绑定，即每当对象发生变化时，会自动更新DOM。


- Proxy.revocable() 返回一个可取消的Proxy实例
```
    let target = {}
    let handler = {}
    let {proxy,revoke} = Proxy.revocable(target,handler)
    proxy.foo = 123
    proxy.foo // 123
    revoke()
    proxy.foo // TypeError: Revoked
```
Proxy.revocable方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例，上面代码中，当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误


- this问题
虽然Proxy可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致，主要原因就是在Proxy代理的情况下，目标对象内部的this关键字会指向Proxy代理
```
    const target = {
    m: function () {
        console.log(this === proxy);
    }
    };
    const handler = {};

    const proxy = new Proxy(target, handler);

    target.m() // false
    proxy.m()  // true
```
// 上面代码中，一旦proxy代理target.m，后者内部的this就是指向proxy，而不是target。


此外，有些原生对象的内部属性，只有通过正确的this才能拿到，所以 Proxy 也无法代理这些原生对象的属性。

const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);

proxy.getDate();
// TypeError: this is not a Date object.

上面代码中，getDate方法只能在Date对象实例上面拿到，如果this不是Date对象实例就会报错，这时，this绑定原始对象就可以解决这个问题
```
    const target = new Date('2015-01-01')
    const handler = {
        get(target,prop) {
            if(prop === 'getDate') {
                return target.getDate.bind(target)
            }
            return Reflect.get(target,prop)
        }
    }
    const proxy = new Proxy(target,handler)
    Proxy.getDate() // 1
```
- Reflect概述
Reflect对象与Proxy对象一样，也是es6为了操作对象而提供的API.Reflect对象的设计目的有这样几个。
（1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty）,放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上
（2）修改某些Object方法的返回结果，让其变得更合理。比如Object.defineProperty(obj,name,desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj,name,desc)则会返回false。
```
    // 老写法
    try {
        Object.defineProperty(target,property,attributes)
    }catch(e) {}

    // 新写法
    if(Reflect.defineProperty(target,property,attributes)) {

    }else {}
```
（3）让Object操作都变成函数行为，某些Object操作是命令式，比如name in obj 和delete obj[name], 而Relect.has(obj,name)和Reflect.deleteProperty(obj,name)让它们变成了函数行为
```
    // 老写法
    'assign' in Object // true
    // 新写法
    Reflect.has(Object, 'assign') // true
```
（4） Reflect对象的方法和Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法，这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础，也就是说不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为
```
    Proxy(target, {
        set: function(target,name,value,receiver) {
            var success = Reflect.set(target,name,value,receiver)
            if(success) {
                log('property ' + name + ' on ' + target + ' set to ' + value);
            }
            rerurn success
        }
    })
```
上面代码中，Proxy方法拦截target对象的属性赋值行为。它采用Reflect.set方法将值赋值给对象的属性，然后再部署额外的功能。

有了Reflect对象以后，很多操作会更易读。

// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1  相当于Math.floor.apply(undefined, [1.75])

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1

- Reflect对象的方法
Reflect对象的方法清单如下，共13个。

Reflect.apply(target,thisArg,args)
Reflect.construct(target,args)
Reflect.get(target,name,receiver)
Reflect.set(target,name,value,receiver)
Reflect.defineProperty(target,name,desc)
Reflect.deleteProperty(target,name)
Reflect.has(target,name)
Reflect.ownKeys(target)
Reflect.isExtensible(target)
Reflect.preventExtensions(target)
Reflect.getOwnPropertyDescriptor(target, name)
Reflect.getPrototypeOf(target)
Reflect.setPrototypeOf(target, prototype)

（1）Reflect.get(target, name, receiver)

查找并返回target对象的name属性，如果没有该属性，则返回undefined。

如果name属性部署了读取函数，则读取函数的this绑定receiver。

var obj = {
  get foo() { return this.bar(); },
  bar: function() { ... }
};

// 下面语句会让 this.bar()
// 变成调用 wrapper.bar()
Reflect.get(obj, "foo", wrapper);

- 使用Proxy实现观察者模式
观察者模式(Obeserver mode)指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行
```
    const person = observable({
        name: 张三,
        age: 20
    })
    function print() {
        console.log(`${person.name}${person.age}`)
    }
    observe(print)
    person.name = '李四'
```
在上面代码中，数据对象person是观察目标，函数print是观察者，一旦数据对象发生变化，print就会自动执行
下面使用Proxy写一个观察者模式的简单实现，即实现observable和observe这两个函数，思路是observable函数返回一个原始对象的Proxy代理，拦截赋值操作，触发充当观察者的各个函数
```
    const queuedObservers = new Set()
    const observe = fn => queuedObservers.add(fn)
    const observable = obj => new Proxy(obj,{set})
    function set(target, key,value,receiver) {
        const result = Reflect.set(target, key,value,receiver)
        queuedObservers.forEach(observer => observer())
        return result
    }
```
上面代码中，先定义了一个Set集合，所有观察者函数都放进这个集合。然后，observable函数返回原始对象的代理，拦截赋值操作。拦截函数set之中，会自动执行所有观察者。