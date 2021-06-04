- createApp 返回一个提供应用上下文的应用实例.应用实例挂载的整个组件树共享同一个上下文。
const app = Vue.createApp({})
你可以在 createApp 之后链式调用其它方法
该函数接收一个根组件选项对象作为第一个参数
const app = Vue.createApp({
  data() {
    return {
      ...
    }
  },
  methods: {...},
  computed: {...}
  ...
})
使用第二个参数，我们可以将根 prop 传递给应用程序：
const app = Vue.createApp(
  {
    props: ['username']
  },
  { username: 'Evan' }
)
<div id="app">
  <!-- 会显示 'Evan' -->
  {{ username }}
</div>

- setup
setup组件选项在创建组件之前执行，一旦props被解析，就作为组合式API的入口点
由于在执行setup时，组件实例尚未被创建，因此在setup选项中没有this，这意味着除了props之外，你将无法访问组件中声明的任何属性——本地状态、计算属性和方法

setup选项应该是一个接受props和context的函数，此外，我们从setup返回的所有内容都将暴露给组件的其余部分（计算属性、方法、生命周期钩子等等）以及组件的模板

setup函数中的第一个参数是props，setup中的props是响应式的，当传入新的props时，它将被更新，因为props是响应式的，所以不能使用es6解构，因为它会消除prop的响应性
如果需要解构，可以使用toRefs const title = toRefs(props)  如果title是可选的prop，使用toRef const title = toRef(props,'title')

setup第二个参数context ，暴露组件的三个property 
export default {
  setup(props, context) {
    // Attribute (非响应式对象)
    console.log(context.attrs)

    // 插槽 (非响应式对象)
    console.log(context.slots)

    // 触发事件 (方法)
    console.log(context.emit)
  }
}

执行setup时，组件实例尚未被创建。因此，只能访问以下property
props
attrs
slots
emit
将无法访问 data computed methods

如果setup返回一个对象，则可以在组件的模板中想传递给setup的props property一样访问该对象的property
<!-- MyBook.vue -->
<template>
  <div>{{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    setup() {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })

      // expose to template
      return {
        readersNumber,
        book
      }
    }
  }
</script>

注意：在setup返回的refs在模板中访问时是被自动解开的，因此不应在模板中使用.value

setup还可以返回一个渲染函数，该函数可以使用同一作用域中声明的响应式状态

// MyBook.vue

import { h, ref, reactive } from 'vue'

export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    // Please note that we need to explicitly expose ref value here
    return () => h('div', [readersNumber.value, book.title])
  }
}

在setup内部，this不会是该活跃实例的引用，因为setup是在解析其他组件选项之前被调用的，因此setup()内部的this行为与其他选项中的this完全不同


vue3.0中，我们可以通过一个新的ref函数使任何响应式变量在任何地方起作用 如：const counter = ref(0) // {value:0}
ref接受参数，并将其包裹在一个带有value property的对象中返回，然后可以使用该property访问或更改响应式变量的值
将值封装在一个对象中，看似没有必要，但为了保持js中不同数据类型的行为统一这是必须的。这是因为在js中Number和String等基本类型是通过值传递的，而不是通过引用传递的
**换句话说，ref为我们的值创建了一个响应式引用，**

reactive 返回一个响应式的对象状态
const state = reactive({
  count:0
})
 - 响应式原理的改变：vue3使用proxy取代vue2的Object.defineProperty
组件选项声明方式vue3使用Composition API

- composition API 将零散分布的逻辑组合在一起来维护，并且还可以将单独的功能逻辑拆分成单独的文件
  - setup: 是组件内使用composition API的入口
  setup的执行时机：beforeCreate之前

  setup接受两个参数 props 响应式 不可结构  context 可以获取到attrs slot和emit

- reactive ref toRefs
    在vue2中，定义数据都是在data中，但是vue3可以使用reactive和ref来进行数据定义
    ref和reactive的区别：
    ref和toRefs 基本类型和引用类型都可以
      - ref: 接受一个内部值并返回一个响应式且可变的ref对象 const count = ref(0)
      - toRef: 可以用来为源响应式对象上的某个property新创建一个ref，然后，ref可以被传递，它会保持对其源property的响应式连接
      const state = reactive({
        foo:1,
        bar:2
      })
      // const {foo,bar} = state 这样写是不正确的，会消除响应式

      可以使用：
      const {foo,bar} = toRefs(state)
      - reactive 返回对象的响应式副本 不能代理基本类型
      const obj = reactive({count:0})

- 生命周期钩子
          app = Vue.createApp(options) app.mount(el) 创建实例
                ↓
              初始化事件 & 生命周期 ← setup
beforeCreate ←  ↓
              初始化注入&校验
  created   ←      ↓
                  是否指定template选项
              ↓                         ↓
             是                        否
将template编译到render函数中       将el外部的html作为template编译
                            ↓
    beforeMounted     ←     ↓
                            ↓
                  创建vm.$el并用其替换el
            mounted      ←  ↓
                            挂载完毕  当data被修改时 beforeUpdated  虚拟dom更新渲染并应用更新 updated
beforeUnmounted  ←          ↓
                         解除绑定
                            ↓
             unmounted      ←    销毁完毕

vue3.0新增了setup，将beforeDestroy变更为beforeUnmount，将destroyed变更为unmounted

vue3.0新增用于调试的钩子函数 onRenderTriggered和onRenderTricked



















- watch和watchEffect的用法
watch(source,callback,[option])
watch函数用来侦听特定的数据源，并在回调函数中执行副作用。默认情况是惰性的，也就是说仅在侦听的源数据发生变更时才执行回调
与watchEffect比较，watch允许我们：
    - 懒执行副作用
    - 更具体地说明什么状态应该触发侦听器重新运行
    - 访问侦听状态变化前后的值


  侦听单个数据源：
  侦听器数据源可以是具有返回值的gettter函数，也可以是ref
  // 侦听一个getter
  const state = reactive({count:0})
  watch(() => state.count,
    (count,prevCount){
      /*...*/
    }
  )
  // 直接侦听ref
  const count = ref(0)
  watch(count,(count,prevCount)=> {
    /*...*/
  })


  侦听多个数据源：
  侦听器还可以使用数组同时侦听多个源
  const firstName = ref('')
  const lasteName = ref('')
  watch([firstName,lastName],(newValues,prevValues) => {

  })

  侦听响应式对象：
  使用侦听器来比较一个数组或对象的值，这些值是响应式的，要求它有一个由值构成的副本
  const numbers = reactive([1,2,3,4])
  watch(()=>[...numbers],(numbers,prevNumbers)=> {

  })

  尝试深度检查嵌套对象或数组中的property变化时，仍然需要deep选项设置为true
  const state = reactive({ 
  id: 1, 
  attributes: { 
    name: "",
  },
});

watch(
  () => state,
  (state, prevState) => {
    console.log(
      "not deep ",
      state.attributes.name,
      prevState.attributes.name
    );
  }
);

watch(
  () => state,
  (state, prevState) => {
    console.log(
      "deep ",
      state.attributes.name,
      prevState.attributes.name
    );
  },
  { deep: true }
);

state.attributes.name = "Alex"; // 日志: "deep " "Alex" "Alex"


然而，侦听一个响应式对象或数组将始终返回该对象的当前值和上一个状态值的引用。为了完全侦听深度嵌套的对象和数组，可能需要对值进行深拷贝
import _ from 'lodash';

const state = reactive({
  id: 1,
  attributes: {
    name: "",
  },
});

watch(
  () => _.cloneDeep(state),
  (state, prevState) => {
    console.log(
      state.attributes.name, 
      prevState.attributes.name
    );
  }
);

state.attributes.name = "Alex"; // 日志: "Alex" ""
















watchEffect 为了根据响应式状态自动应用和重新应用副作用，我们使用watchEffect方法，它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)

停止侦听
当watchEffect在组件的setup()函数或生命周期钩子被调用时，侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止
在一些情况下，也可以显示调用返回值以停止监听
const stop = watchEffect(()=> {})
stop()

清除副作用：
有时副作用函数会执行一些异步的副作用，这些响应需要在其失效时清除(即完成之前状态已经改变了)。所以侦听副作用传入的函数可以接收一个onInvalidate函数作入参，用来注册清理失效时的回调，当以下情况发生时，这个失效回调会被触发
 - 副作用即将重新执行时
 - 侦听器被停止

 watchEffect(onInvalidate => {

 })

 watch和watchEffect的区别：
 1. watchEffect不需要手动传入依赖 即source
 2. watchEffect会先执行一次用来自动收集依赖
 3. watchEffect无法获取到变化前的值，只能获取变化后的值


- 自定义Hooks
实现加减法封装成一个hook，我们约定这些[自定义Hook]以use作为前缀，和普通的函数加以区分
import {ref,Ref,computed} from "vue"
type CountResultProps = {
  count:Ref<number>;
  multiple:Ref<number>;
  increase: (delta?:number)=> void;
  decrease:(delta?:number)=>void;
};
export default function useCount(initValue = 1):CountResultProps {
  const const = ref(initValue);
  const increase = (delta?number):void => {
     if (typeof delta !== "undefined") {
      count.value += delta;
    } else {
      count.value += 1;
    }
  }
  const multipe = computed(()=> count.value *2);
  const decrease = (delta?number):void => {
     if (typeof delta !== "undefined") {
      count.value -= delta;
    } else {
      count.value -= 1;
    }
  }
  return {
    count,
    multipie,
    increase,
    decrease
  }
}








- Object.defineProperty与proxy
Object.defineProperty只能劫持对象属性，需要遍历对象的每一个属性，如果属性值也是对象，就需要递归进行深度遍历。但是proxy直接代理对象，不需要遍历操作
Object.defineProperty对新增属性需要手动observe
因为Object.defineProperty劫持的是对象的属性，所以新增属性时，需要重新遍历对象，对其新增属性再次使用Object.defineProperty进行劫持。也就是vue2.x中给数组和对象新增属性时，需要使用$set才能保证新增的属性也是响应式的，$set内部也是通过调用Object.defineProperty去处理的











- Teleport（传送）
在子组件header中使用到Dialog组件，此时Dialog就被渲染到一层层子组件内部，处理嵌套组件的定位、z-index和样式都变得困难。Dialog从用户感知的层面，应该是一个独立的组件，从dom结构应该完全剥离Vue顶层组件挂载的DOM,同时还可以使用到Vue组件内的状态(data或props)的值。简单来说，就是，**既希望继续在组件内部使用Dialog，又希望渲染的DOM结构不嵌套在组件的DOM中**此时就需要Teleport上场，我们可以用<Teleport>包裹Dialog，此时就建立了一个传送门，可以将Dialog渲染的内容传送到任何指定的地方

Teleport使用：
我们希望Dialog渲染的dom和顶层组件是兄弟节点关系，在index.html文件中定义一个供挂载的元素
<body>
  <div id="app"></div>
  <div id="dialog"></div>
</body>

定义一个Dialog组件Dialog.vue，留意to属性，与上面的id选择器一致
<template>
  <teleport to="#dialog">
    <div class="dialog">
      <div class="dialog_wrapper">
        <div class="dialog_header" v-if="title">
          <slot name="header">
            <span>{{ title }}</span>
          </slot>
        </div>
      </div>
      <div class="dialog_content">
        <slot></slot>
      </div>
      <div class="dialog_footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </teleport>
</template>

 最后在一个子组件Header.vue中使用Dialog组件，这里主要演示Teleport的使用
 <div class="header">
    ...
    <navbar />
    <Dialog v-if="dialogVisible"></Dialog>
</div>
...










- Suspense 悬念
Suspense是Vue3.0新增的特性
Vue2.x应该经常遇到这样的场景：
<template>
<div>
    <div v-if="!loading">
        ...
    </div>
    <div v-if="loading">
        加载中...
    </div>
</div>
</template>

在前后端交互获取数据时，是一个异步过程，一般我们都会提供一个加载中的动画，当数据返回时配合v-if来控制数据显示。Suspense提供两个template slot,刚开始会渲染一个fallback状态下的内容，直到到达某个条件后才会渲染default状态的正式内容，通过Suspense组件进行展示异步渲染会更加的简单，**如果要使用Suspense，要返回一个promise**
<Suspense>
  <template #default>
     <async-component></async-component>
  </template>
   <template #fallback>
     <div>Loading...</div>
  </template>
</Suspense>


asyncComponent.vue:

<template>
<div>
    <h4>这个是一个异步加载数据</h4>
    <p>用户名：{{user.nickname}}</p>
    <p>年龄：{{user.age}}</p>
</div>
</template>
<script>
import { defineComponent } from "vue"
import axios from "axios"
export default defineComponent({
    setup(){
        const rawData = await axios.get("http://xxx.xinp.cn/user")
        return {
            user: rawData.data
        }
    }
})
</script>
从上面代码来看，Suspense 只是一个带插槽的组件，只是它的插槽指定了default 和 fallback 两种状态。






- 片段
在vue2.x中，template中只允许有一个根节点
**但是在vue3.x中，可以直接写多个根节点**
- 更好的tree-shaking
vue3.x在考虑tree-shaking的基础上重构了全局和内部的API，表现结果就是现在的全局API需要通过es module的引用方式进行具名引用，比如在vue2.x中，我们要使用nextTick
import Vue from 'vue'
Vue.nextTick(()=>{})
Vue.nextTick()是一个从Vue对象直接暴露出来的全局API，其实$nextTick()只是Vue.nextTick()的一个简易包装，只是为了方便而把后者的回调函数的this绑定到了当前的实例。虽然我们借助webpack的tree-shaking，但是不管我们实际上是否使用Vue.nextTick()最终都会进入我们的生产代码，因为Vue实例是作为单个对象导出的，打包器无法检测出代码使用了对象的哪些属性

Vue3.0
import {nextTick} from 'vue'
nextTick(() => {})

受影响的API
Vue.nextTick
**Vue.observable（用Vue.reactive替换） Vue.observable??**
Vue.version
Vue.compile(仅限完整版本可用)
Vue.set(仅在2.x兼容版本中可用)
Vue.delete(与上同)











- 变更
 - slot具名插槽语法：

 Vue2.0写法
 子组件：
 <slot name="title"></slot>
 
 父组件：
 <template slot="title">
    <h1>歌曲：成都</h1>
 </template>

如果我们要**在slot上面绑定数据，父组件使用slot时候可以在slot里访问子组件数据，可以使用作用域插槽**

子组件：
<slot name="content" :data="data"></data>
export default {
  data() {
    return {
      data: ['1',2,3]
    }
  }
}

父组件：
<template slot="content" slot-scope="scoped">
  <div v-for="item in scope.data">{{item}}</div>
</template>

