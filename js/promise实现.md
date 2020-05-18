###### 异步
- 回调函数
  - 问题1:无法捕获错误try catch
  - 不能return
  - 回调地狱 效率低 因为是串行的

 - 解决方法
   - 1. 事件发布订阅
   - 2. 哨兵函数

- 生成器是一个函数 用来生成迭代器 生成器函数需要加*
  - 生成器函数和普通函数不一样，普通函数一旦调用一定会执行完毕，生成器函数可以暂停
  - 生成器函数遇到暂停点会停下来，直到再次让它执行
  - 每个暂停点可以输出输入
  - next传参数 给下次执行的值传参数
  - next第一次执行不需要传参数，没有意义
    ```
        function *go(a) {
            console.log(1)
            // 这一行用来实现输入和输出 本次的输出放在yield后面 下次的输入放在yield前面
            let b = yield a
            console.log(2)
            let c = yield b
            console.log(3)
            return c
        }

        let it = go() // 返回此生成器的迭代器
        let r1 = it.next() // {value: 'a', done:false}
        let r2 = it.next('B值') // // {value: 'B值', done:false} =》 b
       
    ```