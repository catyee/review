# Node中的EventEmitter
## 是什么
node采用事件驱动机制，而EventEmitter就是node实现事件驱动的基础
在EventEmitter的基础上，Node几乎所有的模块都继承了这个类，这些模块拥有了自己的事件，可以绑定/触发监听器，实现了异步操作
