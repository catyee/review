- https://juejin.im/post/5c061ed2f265da61357258ee
-  var const let
    1. var 存在变量提升，console.log(a);var a = 3; => 打印出undefined console.log(a); let a = 2; => 报错 const，var不存在变量提升
    2. const声明变量后必须立马赋值,let和const不允许重复声明，var可以重复声明
    3. 在代码块内声明了let变量，在声明变量之前该变量都不可用，即使在外部声明赋值了

- 解构赋值
    - 字符串解构: const [a,b,c,d,e] = 'hello';// a: 'h', b:'e'...
      let [a,b,c] = [1,2,3]
    - 数值解构: const {toString: s} = 123; //
    - 布尔值解构: const {toString:b} = 123;
    - 对象解构


- 箭头函数需要注意的地方
当要求动态上下文的时候，就不能使用箭头函数，也就是this的固定化
在使用箭头函数定义函数的时候，this的指向是定义时所在的对象，而不是使用时所在的对象
不能用作构造函数，不能使用new命令，否则会抛出一个错误
不能使用arguments对象
不能使用yield命令

- set数据结构
es6的Set本身是一个构造函数，它类似于数组，但是成员是唯一的
const set = new Set([1,2,3,4,4]);
[...set]//1,2,3,4
Array.from(new set())

- promise用法
```
  // https://github.com/xieranmaya/blog/issues/3
  let promise = new Promise((resolve,reject) =>{
    if(操作成功){
      resolve(value);
    }else{
      reject(error);
    }
  })
  promise.then((value) => {
    //success
  }, () => {
    // failure
  })
```



- es5,es6和es2015有什么区别
es2015特指在2015年发布的新一代js语言标准，es6泛指下一代js语言标准，包含es2015，es2016，es2017，es2018等，现阶段绝大多数场景下，es2015默认等同es6，es5泛指上一代语言标准

- babel是什么？有什么作用？
babel是一个es6转码器，可以将es6代码转为es5代码，以便兼容那些还没支持es6的平台。
- let有什么用？有了var为什么还要用let
es6之前，声明变量只能用var，var声明变量其实是不合理的，因为es5里面没有块级作用域是不合理的，会带来很多问题，比如for循环var变量泄露，变量覆盖等问题。let声明的变量拥有自己的块级作用域且修复了var声明变量带来的变量提升。

- es6对String字符串类型做的常用升级优化
  1. 新增了字符串模板
  2. 增加了includes(),startsWith(),endsWith(),padStart(),padEnd(),repeat()等方法，可方便的用于查找补全字符串

- es6对Array数组类型做的常用升级优化
  1. 数组解构赋值。如let [a,b,c] = [1,2,3]对变量a,b,c进行赋值
  2. 扩展运算符，es6新增的扩展运算符(...),可以轻松的实现数组和松散序列的相互转换，可以取代arguments对象和apply方法，轻松获取未知参数个数情况下的参数集合。例如数组复制:let a = [1,2,3]; let b = [...a]
  3. es6增加了Array的find方法，copyWithin(),includes(),fill(),flat()等方法，可方便的用于字符串的查找，补全，转换等

- es6对Number数字类型做的常用升级优化
  1. 增加了isFinite(),isNaN()，es5 isNaN('NaN') === true es6 Number.isNaN('NaN') === false
  2. 增加了Math.cbrt(),truc(0,hypot()等科学计数法运算方法，可以更加全面的进行立方根，求和立方根等科学计算

- es6对Object类型做的常用升级优化
  - es6允许在大括号里直接写入变量和函数，作为对象的属性和方法，这样的书写更加简洁。
  ```
    const foo = 'bar';
    const baz = {foo}; // baz: {foo:'bar'}
  ```
  ```
    function f(x,y){return {x,y}};
    等同于function f(x,y) {return {x:x,x:y}}
    f(1,2) // {x:1,y:2}
  ```
  - 除了属性简写，方法也可以简写
  ```
    const o = {
      method() {
        return 'hello';
      }
    }
    等同于:
    const o = {
      method: function() {
        return 'hello'
      }
    }
  ```
  下面是一个实际的例子
  ```
    let birth = '2000/01/01';
    const Person = {
      name: '张三'，
      birth,
      hello() {console.log('hello')};
    }
  ```

  CommonJS模块输出一组变量，就非常适合使用简洁写法
  ```
    let ms = {};
    function getItem() {};
    function setItem() {};
    function clear() {};
    module.exports = {getItem,setItem,clear};
    等同于
    module.exports = {
      getItem: getItem,
      setItem: setItem,
      clear: clear
    }
  ```
  *** 简写的对象方法不能用作构造函数，会报错 ***

- foo::bar等同于 bar.bind(foo); 
- foo::bar(...arguments)等同于 bar.apply(foo,arguments)

- Symbol是es6引入的第七种数据类型，所有Symbol()生成的值都是独一无二的，可以从根本上解决对象属性太多导致属性名冲突覆盖的问题，对象中Symbol()属性不能被for...in遍历，但是也不是私有属性


- Set是一种类似Array的新的数据结构，Set实例的成员都是唯一不重复的
```
  const set = new Set([1,2,,3,4,4]); [...set] // [1,2,3,4] Set函数可以接受一个数组

```

- Map
  js中的对象，本质是键值对的集合，但是传统上只能用字符串当作键，这给它的使用带来了很大的限制。例如：键值对是一个DOM对象但是会自动转换为一个字符串[onject HTMLDivElement],为了解决这个问题，ES6提供了Map数据结构，类似于对象，也是键值对的集合，但是键的范围不限于字符串，各种类型都可以，
  ```
    const m = new Map();
    const o = {p: 'hello'}
    m.set(o,content); // 将对象o作为m的一个键
    m.get(o) // content

    m.has(o) // true
    m.delete(o) // true
    m.has(o) // false
  ```

  - Proxy在目标对象之前架设一层拦截，外界对该对象的访问都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
  ```
    var obj = new Proxy({},{
      get: function(target,propKey,receiver) {
        console.log(`getting ${propKey}!`);
        return Reflect.get(target,proxKey,receiver);
      },
      set: function (target, propKey, value, receiver) {
        console.log(`setting ${propKey}!`);
        return Reflect.set(target, propKey, value, receiver);
      }
    })
  ```
  上述代码对一个空对象架设了一层拦截，重定义了属性的读取get和设置set

ES6提供Proxy构造函数，用来生成Proxy实例 var proxy = new Proxy(target,handler); target:表示所要拦截的目标对象； handler是一个对象，用来定制拦截行为

- Reflect是ES6引入的一个新的对象，他的主要作用有两点:一是将原生的一些零散分布在Object,Function或者全局函数里的方法如apply，delete，get，set等等，统一整合到Reflect上，这样可以更加方便的统一管理一些原生API，还有就是Proxy可以改写默认的原生API，如果一旦原生API改写就可能找不到了，所以Relfect也可以起到备份原生API的作用，使得即使原生API被改写了之后，也可以在被改写之后的API用上默认的API


- for...in和for...of
所有部署载入了Iterator接口的对象都可以通过for...of遍历，for...in只能遍历对象，数组可以用for...of遍历

