- 基本用法
async函数返回一个Promise对象，可以使用then方法添加回调函数，当函数执行的时候，一旦遇到await就先返回，等到异步操作完成，再接着执行函数体内后面的语句。
```
    async function getStockPriceByName(name) {
        const symbol = await getStockSymbol(name);
        const stockPrice = await getStockPrice(symbol);
        return stockPrice;
    }
    getStockPriceByName('goog').then(function(result){
        console.log(result);
    })
```
调用async函数时会立即返回一个promise对象
下面是一个例子，指定多少毫秒后输出一个值
```
    function timeout(ms){
        return new Promise(function(resolve) {
            setTimeout(resolve,ms);
        })
    }
    async function asyncPrint(value,ms){
        await timeout(ms);
        console.log(value);
    }
    asyncPrint('hello',50);
```
上面代码指定50ms以后输出hello

由于async函数返回的是Promise对象，可以作为await命令的参数，所以上面的例子也可以写成下面的形式
```
    async function timeout(ms) {
        await new Promise(function (resolve) {
            setTimeout(resolve,ms);
        })
    }
    async function asyncPrint(value,ms) {
        await timeout(ms);
        console.log(value);
    }
    asyncPrint('hello',50);
```
async函数返回一个Promise对象。async函数内部return语句返回的值，会成为then方法回调函数的参数。
```
    async function f() {
        return 'hello world';
    }

    f().then(v => console.log(v))
    // "hello world"
```
async函数内部抛出错误，会导致返回的Promise对象变为reject状态，抛出的错误对象会被catch方法回调函数接收到
```
    async function f() {
        throw new Error('出错了');
    }
    f().then.(
        v => console.log(v);
        e => console.log(e);
    )
    // Error: 出错了
```
async函数返回的Promise对象必须等到内部所有的await命令后面的Promise对象执行完，才会发生状态改变，除非遇到return语句或抛出错误，也就是说只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数

```
    async function getTitle(url) {
        let response = await fetch(url);
        let html = await response.text();
        return html.match(/<title>([\s\S])</title>/[i])[1];
    }
    getTitle('https://hewhi.com/wje').then(console.log())
```

- await命令
正常情况下await命令后面是一个Promise对象，返回该对象的结果，如果不是Promise对象，就直接返回对应的值。
async function f() {return 123; //等同于 return await 123}

另一种情况是await命令后面是一个thenable对象即定义then方法的对象，那么await会将其等同于Promise对象
```
    Class Sleep{
        constructor(timeout){
            this.timeout = timeout;
        }
        then(resolve,reject){
            const startTime = Date.now();
            setTimeout(
                () => resolve(Date.now() - startTime),
                this.timeout
            )
        }
    }
    (async () => {
        const sleepTime = await new Sleep(1000);
        console.log(sleepTime);
    })()
```
js中没有休眠的语法，但是借助await命令可以让程序停顿指定的时间。下面给出了一个简化的sleep实现。
```
    function sleep(interval) {
        return new Promise(function(resolve) {
            setTimeout(resolve,interval);
        })
    }
```