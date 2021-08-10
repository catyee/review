# 1.computed原理
watcher dirty属性，dirty为true重新计算，计算属性依赖的属性发生变化，dirty置为true，计算一次计算属性的值，如果发生变化就主动通知组件watcher进行重新渲染

# 2. watch原理
new Watcher 全局存储watcher，get读取数据的时候手机依赖，watch第一个参数可以是字符串也可以是函数，函数作为get函数，watch的数据变化时，重新执行操作
deep:true循环依赖

# 3. nextTick原理 为什么异步更新
vue中数据更新会通知watcher，触发虚拟dom更新渲染，vue中组件的所有状态发送到同一个Watcher，然后虚拟DOM会对整个组件进行比对，更改DOM。也就是说同一轮事件循环中两个数据发生了变化组件Watcher会收到两份通知，从而进行两侧渲染，这是不需要的。虚拟DOM会对整个组件进行渲染，所以只需要等待所有的状态都修改完毕，一次性将整个组件的DOM渲染到最新即可。

vue内部对异步队列尝试使用Promise.then MutationObserver和setImmediate,如果执行环境不支持，则采用setTimeout(fn,0)支持

vue的实现方式是将收到通知的Watcher添加到队列缓存，并且在添加前检查是否已经存在，不存在添加，然后下一次事件循环，让队列中的Wacher触发渲染流程并清空队列

// 
this.$nextTick(function() {
    // DOM更新
})
// 然后修改数据
this.message = 'changed'

先调nextTick然后更改数据获取不到最新的DOM，因为更新DOM操作也是使用nextTick注册到微任务中的，会先执行自己的nextTick回调然后执行DOM更新的回调

# 4.$on $emit 注册事件的时候将回调函数收集起来，触发事件的时候将收集起来的回调函数依次调用
$on存取，$emit触发

# 5. $mount
参数是element or selector
手动挂载一个未挂载的一个实例，如果没有参数，则创建一个元素，必须使用原生DOM api插入到文档中，这个方法返回实例本身，所以可以链式调用

完整版本：会检查template或el选项提供的模板是否已经转换成了render函数，如果没有，进入编译过程，将其编译成渲染函数

运行时版本： 默认已存在渲染函数，不存在就创建一个空函数

挂载之前触发beforeMounted，挂载之后每当数据变化都会进行渲染

vm._watcher = new Watcher(vm, () => {
    vm._update(vm._render()) // **先调用渲染函数得到一份最新的VNode节点树，然后通过_update方法dom diff，更新DOM节点。简单来说就是执行了渲染操作。**
},noop)
callhook(vm,'mounted')
return vm

**-update是调用虚拟DOM中的patch方法来执行节点的比对与渲染操作， _render执行渲染函数，得到一份最新的 VNode节点树**


挂载是持续性的，持续性的关键在于new Watcher第二个参数是一个函数，当是函数时候会同时观察函数中所读取的所有响应式数据

# 6. $set(target,key,value)原理
数组：
$set(arr, 0,3)
先设置数组长度，如果数组长度小于传递的索引值，则数组长度等于索引值加1，否则不变
然后通过splice方法将value设置到指定索引
调用splice会收集依赖
返回value

对象：
判断可以在target中吗，存在即返回
判断target是否响应式，不是直接返回
否则是新增，调用defineReactive将新增属性转换getter，setter，然后向target的依赖触发变化通知，并返回val

# 7.为什么data是一个函数
数据以函数形式返回，这样每次复用组件都会返回一份新的data，每个组件实例维护各自的数据，否则组件之前的数据会相互影响

# 8. vue组件通讯
1. props 和on 父到子 子到父是$emit
2. $parent $children 获取当前组件的父子组件
3. $atters $children 
4. provide inject
5. $refs获取组件实例
6. eventBus
7. vuex

# 9.生命周期
（服务端渲染不可用）： beforeMounted，mounted，beforeUpdate，updated，beforeDestroy destroy
 都可用：beforeCreated created

 activated keep-alive 专属，组件被激活时调用

deactivated keep-alive 专属，组件被销毁时调用
## 初始化顺序
props methods data computed watch

# 10.v-if和v-show
v-if会转换成三元表达式，不满足条件不渲染
v-show编译成指令，不满足条件则隐藏

使用场景：
v-if适合改动不频繁
v-show适合频繁切换

# 11.vue内置指令
v-model v-cloak 页面闪烁问题
v-bind v-on v-html v-text v-if v-for v-show v-once
# 12如何理解vue单向数据流
数组总是从父到子，父无权直接修改父传递过来的数据，只能青青父对该数据修改，这样可防止子意外修改父导致应用数据流向难以理解
如果要改父传过来的prop：
子data定义一个变量，prop初始化它，然后$emit通知父改

# 13. computed和watch区别
computed 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算值变化才会返回内容，它可以设置 getter 和 setter。
watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。
计算属性一般用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑

# 14.v-if和v-for为何不一起用
解析时会先解析v-for然后v-if，可以使用计算属性解决这个问题

# 15. vue2响应式原理 
数据劫持+观察者模式

对象内部通过 defineReactive 方法，使用 Object.defineProperty 将属性进行劫持（只会劫持已经存在的属性），数组则是通过重写数组方法来实现。当页面使用对应属性时，每个属性都拥有自己的 dep 属性，存放他所依赖的 watcher（依赖收集），当属性变化后会通知自己对应的 watcher 去更新(派发更新)。


# 16 vue2检测数组变化

数组考虑性能原因没有用 defineProperty 对数组的每一项进行拦截，而是选择对 7 种数组（push,shift,pop,splice,unshift,sort,reverse）方法进行重写(AOP 切片思想)
所以在 Vue 中修改数组的索引和长度是无法监控到的。需要通过以上 7 种变异方法修改数组才会触发数组对应的 watcher 进行更新

# 17.vue父子组件生命周期钩子

加载渲染过程：

父beforeCreated - 父created - 父beforeMounted - 子beforeCreated -子created - 子beforeMounted - 子mounted - 父mounted


子更新：

父beforeUpdate - 子beforeUpdate - 子updated - 父updated

父更新

父beforeUpdate - 父updated

销毁：

父beforeDestroy - 子beforeDestroy - 子destroyed - 父destroyed


# 18 虚拟DOM是什么 有什么优缺点
操作dom代价比较高性能有问题。vnode是用一个js对象描述DOM节点，是对真实dom的抽象映射

优点：
避免频繁操作dom，进行了一些优化，比如dom diff，自动批量更新dom

缺点：
无法极致优化，首次渲染大量dom多了一层虚拟DOM计算，会比innnerHTML慢

# 19. v-model原理
语法糖
普通标签：
绑定value，监听input value值= e.target.value

组件：
props:value $emit $event.target.value

如果是其他类型input
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})

# 20.事件绑定原理

原生事件绑定addEventListener绑定给真实元素
组件事件绑定，vue的$on实现

# 21vue中使用了哪些设计模式
1. 工厂模式：传入参数创建实例    虚拟 DOM 根据参数的不同返回基础标签的 Vnode 和组件 Vnode
2. 单例模式 vuex 和 vue-router 的插件注册方法 install 判断如果系统存在实例就直接返回掉
3. 发布订阅模式 事件机制  发布者 事件中心 订阅者
4. 观察者模式 响应式原理 目标和观察者（watcher）

# 22 Vue.mixin使用场景和原理
抽离公共逻辑
原理：组件初始化的时候会调用mergeOptions方法进行合并，对不同的属性进行合并

# 23. nextTick
下次DOM更新循环结束之后执行对应回调

# 24 keep-alive使用场景和原理

实现组件缓存，组件切换时候不会进行卸载
常用两个属性：include/exclude  允许组件有条件的进行缓存
两个生命周期 activated/deactivated，用来得知当前组件是否处于活跃状态。
keep-alive 的中还运用了 LRU(最近最少使用) 算法，选择最近最久未使用的组件予以淘汰。

# 25 Vue.extend作用和原理
使用基础Vue构造器，创建一个子类，参数是一个包含组件选项的对象
data选项是特例，在Vue.extend()中，它必须是函数

Vue.extend()方法内增加了缓存策略，反复调用Vue.extend其实应该返回同一个结果，只要返回结果是固定的，就可以将计算结果缓存，再次调用extend方法时，只需要从缓存中取出结果即可。
本质是创建一个函数并继承父级

使用场景：

比如全局提示组件，可以挂载到vue原型上，如果需要包含操作DOM就需要使用Vue.extend了

# 26 自定义指令及原理

自定义指令有五个生命周期：bind，inserted，update，componentUpdate，unbind
原理
1.在生成 ast 语法树时，遇到指令会给当前元素添加 directives 属性
2.通过 genDirectives 生成指令代码
3.在 patch 前将指令的钩子提取到 cbs 中,在 patch 过程中调用对应的钩子
4.当执行指令对应钩子函数时，调用对应指令定义的方法
# 27 vue修饰符
事件:
stop 阻止传播
prevent
capture 自身先处理然后内部
self 只自身
once 只一次
passive 不阻止事件默认行为

v-model：
lazy 转换为change事件
number 数值类型
trim

键盘：
enter
tab
delete...

系统:
ctrl
alt

鼠标
left
right

# 28.vue模板编译原理
template转化为render函数

1. 转化为ast
2. 静态标记
3. 生成render函数

# 29.生命周期钩子实现原理
核心是 利用发布订阅模式先把用户传入的钩子函数订阅好，存储在数组里，然后在创建组件实例的过程中会依次执行对应的钩子方法（发布）

# 30  如何让CSS只在当前组件中起作用?
答：在组件中的 style 前面加上 scoped

# 31 vue-loader
Vue Loader 还提供了很多酷炫的特性：

允许为 Vue 组件的每个部分使用其它的 webpack loader，例如在 <style> 的部分使用 Sass 和在 <template> 的部分使用 Pug；
允许在一个 .vue 文件中使用自定义块，并对其运用自定义的 loader 链；
使用 webpack loader 将 <style> 和 <template> 中引用的资源当作模块依赖来处理；
为每个组件模拟出 scoped CSS；
在开发过程中使用热重载来保持状态。

简而言之，webpack 和 Vue Loader 的结合为你提供了一个现代、灵活且极其强大的前端工作流，来帮助撰写 Vue.js 应用。

# 32. 单页面应用和多页面应用区别及优缺点
答：单页面应用（SPA），通俗一点说就是指只有一个主页面的应用，浏览器一开始要加载所有必须的 html, js, css。所有的页面内容都包含在这个所谓的主页面中。但在写的时候，还是会分开写（页面片段），然后在交互的时候由路由程序动态载入，单页面的页面跳转，仅刷新局部资源。多应用于pc端。

多页面（MPA），就是指一个应用中有多个页面，页面跳转时是整页刷新

单页面的优点：用户体验好，快，内容的改变不需要重新加载整个页面，基于这一点spa对服务器压力较小；前后端分离；页面效果会比较炫酷（比如切换页面内容时的专场动画）。

单页面缺点：不利于seo；导航不可用，如果一定要导航需要自行实现前进、后退。（由于是单页面不能用浏览器的前进后退功能，所以需要自己建立堆栈管理）；初次加载时耗时多；页面复杂度提高很多。


# 33. ssets和static的区别
答：相同点： assets 和 static 两个都是存放静态资源文件。项目中所需要的资源文件图片，字体图标，样式文件等都可以放在这两个文件下，这是相同点

不相同点：assets 中存放的静态资源文件在项目打包时，也就是运行 npm run build 时会将 assets 中放置的静态资源文件进行打包上传，所谓打包简单点可以理解为压缩体积，代码格式化。而压缩后的静态资源文件最终也都会放置在 static 文件中跟着 index.html 一同上传至服务器。static 中放置的静态资源文件就不会要走打包压缩格式化等流程，而是直接进入打包好的目录，直接上传至服务器。因为避免了压缩直接进行上传，在打包时会提高一定的效率，但是 static 中的资源文件由于没有进行压缩等操作，所以文件的体积也就相对于 assets 中打包后的文件提交较大点。在服务器中就会占据更大的空间。

建议： 将项目中 template需要的样式文件js文件等都可以放置在 assets 中，走打包这一流程。减少体积。而项目中引入的第三方的资源文件如iconfoont.css 等文件可以放置在 static 中，因为这些引入的第三方文件已经经过处理，我们不再需要处理，直接上传。
# 34 vue的两个核心点
答：数据驱动、组件系统

数据驱动： ViewModel，保证数据和视图的一致性。

组件系统： 应用类UI可以看作全部是由组件树构成的。

# 35 vue slot
答：简单来说，假如父组件需要在子组件内放一些DOM，那么这些DOM是显示、不显示、在哪个地方显示、如何显示，就是slot分发负责的活。

#  36Vue里面router-link在电脑上有用，在安卓上没反应怎么解决？
答：Vue路由在Android机上有问题，babel问题，安装babel polypill插件解决。

# 37 .Vue2中注册在router-link上事件无效解决方法
答：使用 @click.native 。原因：router-link会阻止click事件，.native指直接监听一个原生事件。

# 38 RouterLink在IE和Firefox中不起作用（路由不跳转）的问题
答: 方法一：只用a标签，不适用button标签；方法二：使用button标签和Router.navigate方法

# 39 为什么用key
便于dom diff 防止错误的元素复用

# 40 组件渲染和更新过程
Vue.extend方法构造子组件的构造函数，进行实例化，最终调用$mount进行挂载，更新组件会进行patchVNode核心是dom diff

# 41.data为什么是一个函数
组件复用多次，会创建多个实例，这些实例是一个构造函数，如果data是一个对象，所有组件共享一个对象会相互影响，函数的话每次都可以创建一个新的data不会影响
# 42 v-html会导致哪些问题
可能会导致xss攻击
v-html会替换标签内部子元素

# 43. vue事件绑定原理
每一个Vue实例都是一个Event Bus，当子组件被创建的时候，父组件将事件传递给子组件，子组件初始化的时候是有$on方法将事件注册到内部，在需要的时候使用$emit触发函数，而对于原生native事件，使用addEventListener绑定到真实的DOM元素上。



# 44.slot原理
slot又名插槽，是vue的内容分发机制，组件内部的模板引擎使用slot元素作为承载分发内容的出口。插槽slot是子组件的一个模板标签元素，而这个标签元素是否显示，以及怎么显示是由父组件决定的。
slot分为：
默认插槽 slot没有指定name
具名插槽 指定name 多个
作用域插槽 可以匿名可以具名  子组件在渲染作用域插槽时，可以将组件内部的数据传递给父组件，让父组件根据子组件传递过来的数据决定如何渲染该插槽

实现原理： 当子组件vm实例化时，获取到父组件传入的slot标签的内容，存放在vm.$slot中，默认插槽为vm.$slot.default,具名插槽为vm.$slot.xxx，xxx为插槽名，当组件执行渲染函数的时候，遇到slot标签，使用$slot中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。

# 45vue模板编译原来
template转化为js函数的过程称为模板编译 
三个阶段：parse解析 优化 生成render函数
- 解析： 大量正则表达式对template字符串解析，将标签、指令、属性等转化为抽象语法树AST
- optimize阶段优化： 遍历AST找到静态节点标记，在diff节点直接跳过静态节点
- 将最终的AST生成render函数字符串


# 46 template预编译是什么
vue组件，模板编译只在组件实例化的时候编译一次，生成渲染函数之后再也不会进行编译，因此，编译对组件的runtime是一种性能损耗。
而模板编译的目的仅仅是将template转化为render函数，这个过程可以在项目构建的过程中完成，这样可以让实际组件在runtime时直接跳过模板渲染，进而提升性能，这个项目构建的编译template的过程就是预编译
vue默认使用的是vue.runtime.js,单文件模板中的template会在打包编译阶段编译成render函数.
如果想要在组件中动态调用template选项的话需要vue的完整构建

# 47 template和jsx有什么区别
对于runtime来说只要保证组件存在render函数即可，而我们有了预编译之后，我们只需要保证构建过程中生成render函数就可以。

在webpack中，我们使用vue-loader编译.vue文件，内部依赖vue-template-compiler模块，在webpack构建过程中将template预编译成render函数

在添加了jsx的语法糖解析器babel-plugin-transform-vue-jsx之后，就可以直接手写render函数。

template和jsx都是render的一种表现形式不同的是：
jsx相对于template而言有更高的灵活性，template相对更直观好维护

# 48 什么是虚拟DOM
vnode是dom在js中的抽象映射，之所以需要vnode是因为浏览器中操作dom代价高，频繁操作会产生性能问题。
vnode的作用是每一次响应式数据变化引起页面重渲染vue对比更新前后的vnode，匹配出尽可能少的需要更新的真实dom，从而达到性能优化。

# 49 diff算法
新老dom对比时：
- 首先比对节点本身，判断是否为同一节点，如果不同，删除重新创建替换
- 如果为相同节点，patchVnode，判断对其子节点的处理，一方有一份没有的处理
- 子节点都有，进行updateChildren，判断如何对这些新老节点的子节点进行操作
- 匹配时，找到相同的子节点，递归比较子节点

在diff中，只进行同层子节点比较，时间复杂度o(n),只有当新旧children都为多个子节点时才需要核心diff算法进行同层级比较。 

# 50. ssr了解吗？原理是什么
在客户端请求服务器的时候，服务器到数据库中获取到相关的数据，并且在服务器内部将vue组件渲染成html，并且将数据，html一并返回给客户端，这个在服务器将数据和组件转化为html的过程叫做服务端渲染ssr

而当客户端拿到服务端渲染的html和数据之后，由于数据已经有了，客户端不需要再一次请求数据，而只需要将数据同步到组件或vuex内部即可。除了数据以外，html结构也已经有了，客户端在渲染组件的时候，只需要将html的dom节点映射到vnode即可，这个将数据和html同步的过程叫做客户端激活

使用ssr的好处：
- 有利于seo，其实就是有利于爬虫爬页面，因为部分页面爬虫是不支持js的，这种爬虫爬取到的非ssr的页面会是一个空html页面，ssr可以避免这种问题
- 白屏时间更短，相对于客户端渲染，服务端渲染在url请求之后得到了一个带有数据的html文本，浏览器只需要解析html构建dom树即可。而客户端渲染，需要先得到一个空的HTML页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。


优化
todo：
异步组件原理










