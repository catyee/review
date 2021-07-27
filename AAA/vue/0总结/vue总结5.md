# router
将组件映射到路由，然后告诉vue-router在哪里渲染他们，通过改变url，在不重新请求页面的情况下，更新页面视图
## vue路由的两种方式：hash和history及实现原理

1. hash模式

hash：
window.addEventListener("hashchange", funcRef, false)

hash虽然出现在url中，但不会被包括在http请求中，它是用来指导浏览器的，改变hash不会重新加载页面。

2. history模式
应用是单页面应用，如果后台没有正确的配置，用户在浏览器直接访问http://oursite.com/user/id会返回404


- vue-router跳转和location.href有什么区别：
location.href跳转会刷新页面重新请求到服务器
vue-router 不会刷新页面，静态跳转

- 配置404页面
path * 放在最后，redirect到404路由

- 切换路由时如何保存草稿
使用keep-alive

- 路由参数变化，组件不会重新渲染如何解决
1. $watch监听$route变化
2. 使用导航守卫beforeRouteUpdate
3. 给router-view组件添加属性key

- 切换到新路由时，页面要滚动到顶部或保持原先的滚动位置


### history.push(state,title, （可选）url)



## vue-router导航守卫


## 路由懒加载的原理
将路由对应的组件打包成一个个的js代码块，只有在这个路由被访问到的时候，才加载对应的组件，否则不加载

实现方式：
1. 异步加载 
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
2. es6 import()
// 官网可知：下面没有指定webpackChunkName，每个组件打包成一个js文件。
const Foo = () => import('../components/Foo')
const Aoo = () => import('../components/Aoo')
 {
            path: '/Foo',
            name: 'Foo',
            component: Foo
 },

3. webpack提供的require.ensure()
const HelloWorld=resolve=>{
		require.ensure(['@/components/HelloWorld'],()=>{
			resolve(require('@/components/HelloWorld'))
		})
	}

https://www.cnblogs.com/cczlovexw/p/14263654.html
## vue单文件组件原理
vue单文件是通过vue-loader来解析的
vue-loader的作用：解析单文件组件，在style中添加scope属性，



vue-loader：
解析和转换.vue文件。提取出其中的逻辑代码 script,样式代码style,以及HTML 模板template，再分别把他们交给对应的loader去处理

css-loader：加载由vue-loader提取出的CSS代码
vue-template-compiler：把vue-loader提取出的HTML模板编译成可执行的jacascript代码







# vuex
# element