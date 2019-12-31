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



