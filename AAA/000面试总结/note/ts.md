https://blog.csdn.net/z18237613052/article/details/117566996
1. js和ts的对比
- ts是js的超集，可以在ts中使用原生js
- ts最终仍然需要编译为js，去执行
- ts提供了类，模块和接口，更易于构建组件和维护
- ts强类型，接口，继承

let num:number = 100;
- 类型推论  let x = 100; // 这种情况下 ts 就会使用类型推论

- 联合类型   let arr:number|string=100

- 对象的类型——接口

// 定义一个接口Person，接口名字首字母大写
interface Person {
    name: String;
    age:number;
}
// 接着定义一个变量tom，它的类型是Person
let tom:Person {
    name: 'Tom',
    age:25
}

- 定义只读类型
interface Person {
    readonly name:string;
    age:number
}
//只读  在该环节生效的
let stu1:Person = {
    name:'张三',
    age:19
}
//console.log(stu.name);
stu1.name="李四"//只读属性不允许修改

