###### 插槽内容：

// 子组件  <navigation-link>
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>

// 父组件
<navigation-link url="/profile">
  Your Profile
</navigation-link>
当组件渲染的时候，<slot></slot> 将会被替换为“Your Profile”。插槽内可以包含任何模板代码，包括 HTML：
如果 <navigation-link> 的 template 中没有包含一个 <slot> 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃。




###### 编译作用域
父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。
在父元素中使用插槽时，插槽的内容可以访问父元素的作用域，但是不能访问插槽本身的子组件的作用域


###### 后备内容 父组件不提供slot内容时候默认渲染备用内容
<button type="submit">
  <slot>Submit</slot>
</button>

###### 具名插槽
对于这样的情况，<slot> 元素有一个特殊的 attribute：name。这个 attribute 可以用来定义额外的插槽：

<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
一个不带 name 的 <slot> 出口会带有隐含的名字“default”。

在向具名插槽提供内容的时候，我们可以在一个 <template> 元素上使用 v-slot 指令，并以 v-slot 的参数的形式提供其名称：

<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
现在 <template> 元素中的所有内容都将会被传入相应的插槽。任何没有被包裹在带有 v-slot 的 <template> 中的内容都会被视为默认插槽的内容。


###### 作用域插槽
让父组件中的插槽内容能够访问子组件中的数据
子组件：<current-user>
<span>
  <slot>{{ user.lastName }}</slot>
</span>

父组件： 此时无法访问到子组件user上面的数据
<current-user>
  {{ user.firstName }}
</current-user>

为了让user在父组件的插槽内容中可见，我们可以将user作为<slot>元素的一个attribute绑定上去
// 子组件：
<span>
  <slot v-bind:user="user">{{ user.lastName }}</slot>
</span>
绑定在<slot>元素上的attribute被称为插槽prop，现在在父级作用域中，我们可以使用带值的v-slot来定义我们提供的插槽prop的名字:
<current-user>
    <template v-slot:default="slotProps">
        {{ user.firstName }}
    </template>
  
</current-user>
当只有默认插槽时，可简写为：
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>

在这个例子中，我们选择将包含所有插槽 prop 的对象命名为 slotProps，但你也可以使用任意你喜欢的名字。


注意！！！简写语法不能和具名插槽混用，因为会导致作用域不明确：
<!-- 无效，会导致警告 -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
  <template v-slot:other="otherSlotProps">
    slotProps is NOT available here
  </template>
</current-user>
应该写为：
只要出现多个插槽，请始终为所有的插槽使用完整的基于 <template> 的语法：
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>

###### 解构插槽
作用域插槽的内部工作原理是将你的插槽内容包裹在一个拥有单个参数的函数里：

function (slotProps) {
  // 插槽内容
}
这意味着 v-slot 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。所以在支持的环境下 (单文件组件或现代浏览器)，你也可以使用 ES2015 解构来传入具体的插槽 prop，如下：

<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，例如将 user 重命名为 person：

<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
你甚至可以定义后备内容，用于插槽 prop 是 undefined 的情形：

<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>

###### 动态插槽名
动态指令参数也可以用在 v-slot 上，来定义动态的插槽名：

<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>

###### 具名插槽的缩写

跟 v-on 和 v-bind 一样，v-slot 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为字符 #。例如 v-slot:header 可以被重写为 #header：
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>

然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：

<!-- 这样会触发一个警告 -->
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
如果你希望使用缩写的话，你必须始终以明确插槽名取而代之：

<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>