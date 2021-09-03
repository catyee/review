// Promise优缺点：优点：解决异步回调嵌套，解决多个异步并发问题 缺点：内部基于回调，无法终止
// 三个状态pending resolved rejected，默认pending，一旦成功了就不能失败，一旦失败不能成功
// 每个Promise实例都有一个then方法，参数：成功的回调 失败的回调
// 如果new Promise报错了 会变成失败态（会调用onRejected）
let promise = new Promise((resolve,reject) => { // executor 默认执行
    resolve(1)
}).then(data => {}, err => {})


// 中止Promise可以返回一个 new Promise(() => {}) pending的Promise，这样不会继续走then
// 每次then都是一个新的Promise实例
// then中传递的函数如果是Promise采用它的状态，如果是Promise将结果传递下去即可

let p = new Promise((resolve,reject) => {
    resolve(1)
})
let promise2 = p.then()

// Promise.all 解决异步并发，同步处理结果

// finally Promise实例

// generator 可以暂停 可以和promise配合
// generator生成器执行得到iterator迭代器

//  Array.from 和 [...likeArray]