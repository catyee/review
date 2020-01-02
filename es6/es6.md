- var const let
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
https://github.com/xieranmaya/blog/issues/3

