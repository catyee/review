# computed原理this.$watch原理 this.$nextTick原理 extend原理 过滤器原理 组件化原理 指令原理 methods原理 props原理 this.$mount原理


下面我们来回顾一下watcher观察数据的过程。状态通过Observer转换成响应式之后，每当触发getter时，会从全局的某个属性中获取watcher实例并将它添加到数据的依赖列表中。watcher在读取数据之前，会先将自己设置到全局的某个属性中。而数据被读取会触发getter，所以会将watcher收集到依赖列表中。收集好依赖后，当数据发生变化时，会向依赖列表中的watcher发送通知。

# 实例方法：vm.$watch vm.$set vm.$delete vm.$on vm.$emit vm.$once vm.$off vm.$mount vm.forceUpdate vm.$nextTick vm.$destroy
# computed原理
计算属性结果会被缓存，只有计算属性所依赖的响应式属性或计算属性的返回值发生变化时才会重新计算。是结合wacher的dirty属性来分辨的，当dirty为false时，说明没有变不重新计算，dirty为true时重新计算
当计算属性依赖的属性发生变化时，计算属性的wacher会把自己的dirty属性设置为true，当下一次读取计算属性时，就会重新计算一次值，然后组件watcher得到通知，从而执行render函数重新渲染。重新渲染的时候会读取计算属性，此时dirty为true，所以重新计算一次用于本次渲染。

一个问题：如果计算属性中用到的状态发生了变化，但最终计算属性的返回值并没有变，这时计算属性依然会认为自己的返回值变了，组件也会重新走一遍渲染流程。只不过最终由于虚拟DOM的Diff中发现没有变化，所以在视觉上并不会发现UI有变化，其实渲染函数会被执行。也就是说，计算属性只是观察它所用到的所有数据是否发生了变化，但并没有真正去校验它自身的返回值是否有变化，所以当它所使用的数据发生变化后，它就认为自己的返回值也会有变化，但事实并不总是这样。

为了解决这个问题，作者把计算属性的实现做了一些改动，改动后的逻辑是：组件的Watcher不再观察计算属性用到的数据的变化，而是让计算属性的Watcher得到通知后，计算一次计算属性的值，如果发现这一次计算出来的值与上一次计算出来的值不一样，再去主动通知组件的Watcher进行重新渲染操作。这样就可以解决前面提到的问题，只有计算属性的返回值真的变了，才会重新执行渲染函数。



# watch原理
new Watcher()
默认msg取值收集依赖，msg值更新触发依赖更新，deep:true 循环遍历 依赖收集

Watcher读取value时，会触发收集依赖的逻辑 递归操作

new Watcher 全局存储wacher，get读取数据的时候收集依赖，将全局watcher收集起来，数据改变的时候进行更新操作，this.$watch第一个参数可以是字符串也可以是函数，如果是字符串，将字符串转为取值函数，如果是函数，其中读取的所有数据都会被watcher观察，返回一个取消观察的函数


# nextTick原理 为什么异步更新
异步更新：vue中状态变化会通知Watcher，触发虚拟DOM的渲染，vue的变化侦测只发送到组件，组件中所有状态的变化通知到同一个Watcher，然后虚拟DOM会对整个组件进行比对，并更改DOM。也就是说如果同一轮事件循环中两个数据发生了变化，那么组件的Wacher会收到两份通知，从而进行两次渲染，但是事实上并不需要两次渲染，虚拟DOM会对整个组件进行渲染，所以只需要等所有的状态都修改完毕后，一次性将整个组件的DOM渲染到最新即可。

vue的实现方式是将收到通知的Watcher添加到队列缓存，并且在添加前检查是否已经存在，不存在添加，然后下一次事件循环，让队列中的Wacher触发渲染流程并清空队列

更新DOM也是使用vm.$nextTick来注册到微任务中的


# $on $emit事件原理 vm.$on(event,callback) event可以为数组或字符串
注册事件的时候将回调函数收集起来，触发事件的时候将收集起来的回调函数依次调用
$on将监听的事件的回调存储在事件列表中，new Vue初始化的时候实例上会创建一个_events属性，存储事件列表
$emit 触发事件，取出对应事件的回调函数，依次执行

# vm.$forceUpdate
作用是迫使vue实例重新渲染，注意它仅仅影响实例本身以及插入插槽内容的子组件，而不是所有子组件
原理本质上是执行watcher的update方法

# vm.$mount
vm.$mount([elementOrSelector]) 
vue实例在实例化时没有收到el选项，则它处于"未挂载"状态，没有关联的DOM元素。我们可以使用vm.$mount手动挂载一个未挂载的实例。如果没有提供elementOrSelector参数，模板将被渲染为文档之外的元素（自动创建一个元素），并且必须使用原生DOM的API将它插入到文档中，这个方法返回实例本身，因此可以链式调用

这个方法在vue完整版和vue运行时构建版本不一样，在只包含运行时如上述所说，在完整版会稍有不同，

它首先会检查template或el选项锁提供的模板是否已经转换成渲染函数(render函数)，
如果没有，则立即进入编译过程，将模板编译成渲染函数，完成之后再进入挂载与渲染的流程中

只包含运行时版本的这个方法没有编译步骤，它会默认实例上已经存在渲染函数，如果不存在则设置一个，并且这个渲染函数在执行时会返回一个空节点的vnode以保证执行时不会因为函数不存在而报错。

1. 获取模板：
判断是否有render？ 如果没有=》判断是否有options.template选项，如果没有template选项那么使用getOuterHTML方法从用户提供的el选项中获取模板
如果有template选项，根据格式解析，格式：#选择符，字符串模板，DOM元素

2. 模板编译成渲染函数 compileToFunctions函数 AST-优化-代码字符串-render函数

3. 挂载之前触发beforeMount钩子函数，钩子函数触发后，进行挂载，挂载与渲染类似，不同的是渲染指的是渲染一次，而挂载指的是持续性渲染，挂载之后，每当状态发生变化时，都会进行渲染操作
使用new Watcher进行挂载
vm._watcher = new Watcher(vm, () => {
    vm._update(vm._render()) // **先调用渲染函数得到一份最新的VNode节点树，然后通过_update方法dom diff，更新DOM节点。简单来说就是执行了渲染操作。**
},noop)
callhook(vm,'mounted')
return vm

**-update是调用虚拟DOM中的patch方法来执行节点的比对与渲染操作， _render执行渲染函数，得到一份最新的 VNode节点树**

挂载是持续性的，持续性的关键在于new Watcher第二个参数是一个函数，当是函数时候会同时观察函数中所读取的所有响应式数据


# vm.$set vm.$set(target,key,value)
在object上设置一个属性，如果object是响应式的，vue会保证属性被创建后也是响应式的，并且触发视图更新，
主要解决vue不能侦测属性被添加的限制
**对象：属性的添加 数组：设置数组项 比如：vm.items[1] = 'x' 解决：Vue.set(vm.items, indexOfItem, newValue)
target不能是vue实例或跟数据对象

原理：
target是数组：
先设置数组长度，如果数组长度小于传递的索引值，则数组长度等于索引值，否则不变
然后，通过splice方法将第三个参数value设置到target的指定位置 target.splice(key,1,value),使用splice方法设置的时候，拦截器会侦测到target发生了变化，并且会自动帮我们转换成响应式的
最后返回value


对象：

注意判断key是不是已经在target中，如果在直接修改数据，
判断target是不是响应式__ob__,如果target本身不是响应式的直接修改数据返回值即可
如果新增：
调用defineReactive将新增属性转换为getter/setter
最后向target的依赖触发变化通知，并返回val
















*******************************************************************************************
# 全局API Vue.extend,

# Vue.extend(options) 用法：使用基础Vue构造器创建一个“子类”，其参数是一个包含“组件选项”的对象
data选项是特例，在Vue.extend()中，它必须是函数

Vue.extend()方法内增加了缓存策略，反复调用Vue.extend其实应该返回同一个结果，只要返回结果是固定的，就可以将计算结果缓存，再次调用extend方法时，只需要从缓存中取出结果即可。
本质是创建一个函数并继承父级


使用场景：

比如全局提示组件，可以挂载到vue原型上，如果需要包含操作DOM就需要使用Vue.extend了
实现：
// Message.vue
<template>
<transition name="fade">
    <div class="message" :class="type" v-show="show">
      <i class="icon"></i>
      <span class="text">{{text}}</span>
    </div>
</transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'message',
    props: {
      type: {
        type: String,
        default: 'info',
        validator: val => ['info', 'success', 'warning', 'error'].includes(val)
//['info', 'success', 'warning', 'error'] 表示type只接收这四个字符串作为参数传入message组件
      },
      text: {
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "~@/common/style/global.styl"
   // fade动画 <transition name="fade"> </transition>
   // 下面的样式可以自己改
  ...
</style>

// index.js
import Message from './Message.vue'
const MESSAGE = {
  duration: 3000, // 显示的时间 ms
  animateTime: 300, // 动画时间,表示这个组件切换show的动画时间
  install(Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('Message', Message) //注册全局组件

    function msg(type, text, callBack) {
      let msg
      let duration = MESSAGE.duration
      if (typeof text === 'string') {
        msg = text
      } else if (text instanceof Object) {
        msg = text.text || ''
        if (text.duration) {
          duration = text.duration
        }
      }
      let VueMessage = Vue.extend({
        render(h) {
          let props = {
            type,
            text: msg,
            show: this.show
          }
          return h('message', {props}) // ***h函数vue中的createElement方法***
        },
        data() {
          return {
            show: false
          }
        }
      })
      let newMessage = new VueMessage()
      let vm = newMessage.$mount()
      let el = vm.$el
      document.body.appendChild(el) // 把生成的提示的dom插入body中
      vm.show = true
      let t1 = setTimeout(() => {
        clearTimeout(t1)
        vm.show = false  //隐藏提示组件，此时会有300ms的动画效果，等动画效果过了再从body中移除dom
        let t2 = setTimeout(() => {
          clearTimeout(t2)
          document.body.removeChild(el) //从body中移除dom
          newMessage.$destroy()
          vm = null // 设置为null，好让js垃圾回收算法回收，释放内存

          callBack && (typeof callBack === 'function') && callBack() 
      // 如果有回调函数就执行，没有就不执行，用&&操作符，
      // 只有&&左边 的代码为true才执行&&右边的代码，避免用面条代码：
      // if(true){
      //   ... 
      //   if(true){
      //   ...
      //   }
      // }
        }, MESSAGE.animateTime)
      }, duration)
    }
******************msg 方法结束****************************
// 挂载到vue原型上，暴露四个方法
    Vue.prototype.$message = {
      info(text, callBack) {
        if (!text) return
        msg('info', text, callBack)
      },
      success(text, callBack) {
        if (!text) return
        msg('success', text, callBack)
      },
      error(text, callBack) {
        if (!text) return
        msg('error', text, callBack)
      },
      warning(text, callBack) {
        if (!text) return
        msg('warning', text, callBack)
      }
    }
  }
}
export default MESSAGE

在main.js中引入components/Message/index.js,以插件形式安装

import Vue from 'vue'
import vMessage from './components/Message/index' 
Vue.use(vMessage)


# Vue.component 那么子组件呢？？？
使用：Vue.component(id, [definition]) 注册或获取全局组件。注册组件时，还会自动使用给定的id设置组件的名称。

// 注册组件，传入一个扩展过的构造器
Vue.component('my-component',Vue.extend（{/*...*/}）)

// 注册组件，传入一个选项对象(自动调用Vue.extend)
Vue.component('my-component', {/*...*/})

// 获取注册的组件(始终返回构造器)
var MyComponent = Vue.component('my-component')

原理：
将组件保存在某个地方
这里我们在Vue.options中新增了components属性用于存放组件，并在Vue.js上新增了component方法，它接收两个参数：id和definition。

如果发现definition参数是Object类型，则调用Vue.extend方法将它变成Vue的子类，使用Vue.component方法注册组件；如果选项对象中没有设置组件名，则自动使用给定的id设置组件的名称。