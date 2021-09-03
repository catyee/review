async函数返回一个Promise对象
async函数内部return语句返回的值，会成为then方法回调函数的参数
  async function f() {
        return 'hello'
}
  f().then(v => console.log(v)) // hello world  函数f内部return命令返回的值，会被then方法回调函数接收到

  **正常情况下，await命令后面是一个Promise对象。如果不是，会被转成一个立即resolve的Promise对象。**