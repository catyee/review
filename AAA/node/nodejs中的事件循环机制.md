# node中的事件循环机制
在node中，事件循环是基于libuv实现，libuv是一个多平台的专注于异步I/O的库


## 事件循环分成了6个阶段

- timers阶段：这个阶段执行timer（setTimeout，setInterval）的回调
- 定时器检测阶段（timers）：本阶段执行timer的回调，即setTimeout，setInterval里面的回调函数
- I/O事件回调阶段（I/O callbacks）：执行延迟到下一个循环迭代的I/O回调，即上一轮循环中未被执行的一些I/O回调
- 闲置阶段：仅系统内部使用
- 轮询阶段（poll）：检索新的I/O事件，执行与I/O相关的回调
- 检查阶段（check）：setImmediate回调函数在这里执行
- 关闭事件回调阶段（close callback）: 一些关闭的回调函数，如socket.on('close'
)

**除了上述6个阶段，还存在process.nextTick，其不属于事件循环的任何一个阶段，它属于该阶段与下阶段之间的过渡, 即本阶段执行结束, 进入下一个阶段前, 所要执行的回调，类似插队**


### 在Node中，同样存在宏任务和微任务，与浏览器中的事件循环相似
微任务对应有：

next tick queue：process.nextTick
other queue：Promise的then回调、queueMicrotask


宏任务对应有：

timer queue：setTimeout、setInterval
poll queue：IO事件
check queue：setImmediate
close queue：close事件

其执行顺序为：

next tick microtask queue
other microtask queue
timer queue
poll queue
check queue
close queue


script start   async1 start    async2   promise1  promise2  script end nextTick1   nextTick2   async1 end      promise3  setTimeout0 setImmediate setTimeout2 