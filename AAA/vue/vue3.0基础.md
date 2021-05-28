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


vue3.0中，我们可以通过一个新的ref函数使任何响应式变量在任何地方起作用 如：const counter = ref(0) // {value:0}
ref接受参数，并将其包裹在一个带有value property的对象中返回，然后可以使用该property访问或更改响应式变量的值
将值封装在一个对象中，看似没有必要，但为了保持js中不同数据类型的行为统一这是必须的。这是因为在js中Number和String等基本类型是通过值传递的，而不是通过引用传递的
**换句话说，ref为我们的值创建了一个响应式引用，**
