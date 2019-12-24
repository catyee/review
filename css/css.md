###### css选择器？哪些属性可以继承？css优先级算法如何计算？
- 选择器
    1. id选择器 #myid
    2. 类选择器 .myclassname
    3. 标签选择器 div h1 p
    4. 相邻选择器 h1+p
    5. 子选择器 ul>li
    6. 后代选择器 li a
    7. 通配符选择器 *
    8. 属性选择器 a[rel="external"]
    9. 伪类选择器 a:hover li:nth-child
- 继承性
    - 可继承的样式: font-size, font-family,color,ul,li,dl,dt,dd
    - 不可继承的样式: border,padding,margin,width,height
- 优先级（就近原则）：!important > [id > class > tag]   *** !important比内联优先级高 ***
- 元素选择符的权值: 元素标签（派生选择器）:1 , class选择符:10 , id选择符:100 ,内联样式权值最大为1000
    1. !important声明的样式优先级最高，如果冲突再进行计算
    2. 如果优先级相同，则选择最后出现的样式
    3. 继承得到的样式的优先级最低

###### css3新增伪类有哪些
- p:first-of-type 选择属于其父元素的首个p元素
- p:last-of-type  选择属于其父元素的最后一个p元素
- p:only-of-type  选择属于其父元素的唯一一个p元素
- p:only-child    选择属于其父元素的唯一子元素的每个 <p> 元素。
- p:nth-child(2) 选择属于其父元素的第二个子元素的 <p> 元素。
- :enabled

- :disabled 控制表单控件的禁用状态。

- :checked，单选框或复选框被选中。

- :before在元素之前添加内容，也可以用来做清除浮动

- :after在元素之后添加内容



###### display值及作用
- inline 默认，此元素会被显示为内联元素，元素前后没有换行符
- block 此元素默认为块级元素，换行
- none 此元素不会被显示
- inline-block 行内块元素
- list-item 此元素会作为列表显示
- table 此元素会作为块级表格来显示，表格前后带有换行符

###### position的值
- absolute 生成绝对定位的元素，相对于static定位以外的第一个父元素进行定位，原先在文档中的流中所占的空间会被后面元素占据
- fixed 生成固定定位的元素，相对于浏览器窗口进行定位
- relative 生成相对定位的元素，相对于其正常位置进行定位，不脱离文档流，可以通过z-index进行层次分级，元素仍保持其未定位前的形状，原本所占的空间仍将保留，如果没有定位偏移量，对元素本身没有任何影响。
- static 默认值 没有定位
- inherit 规定应该从父元素继承position属性的值
- sticky 粘性定位 主要用在对scroll事件的监听上
#one { position: sticky; top: 10px; } 在 viewport 视口滚动到元素 top 距离小于 10px 之前，元素为相对定位。之后，元素将固定在与顶部距离 10px 的位置，直到 viewport 视口回滚到阈值以下。

###### css3新特性
- 新增css选择器 :not(p) P:empty 选择没有任何子级的p元素（包括文本节点）
- 边框 borders border:2px solid; border-radius: 25px; box-shadow:10px 10px 5px #888; // 水平阴影 垂直阴影 模糊距离 阴影颜色 border-image:url(border.png) 30px 30px round;
- background-clip规定背景图的绘制区域background-orgin:content-box;background-size:100% 100%; background-repeat:no-repeat;background-image: url(image_url),url(image2_url);
- 线性渐变 background:linear-gradient(direction,color-stop1,color-stop2...)
- 文本效果 阴影box-shadow textwrap word-break word-wrap
- 2D转换 transform:scale(0.1,0.9)|tarnslate(0px,-3px)|skew(-9deg,0deg) | rotate(45deg)
- 3D转换 perspective() 
- 过渡 transition
- 动画 animation

###### 纯css创建一个三角形
```
    width:0;
    height:0;
    border-top:40px solid transparent;
    border-left:40px solid transparent;
    border-right:40px solid transparent;
    border-bottom:40px solid red;
```

###### 常见的兼容性问题
- 不同浏览器默认margin padding不一样
- css属性前缀
- chorme下默认会将小于12px的文本强制按照12px来解析，解决方法: -webkit-text-adjust:none;
- firefox的cursor不支持hand。只支持pointer

###### 当一个元素visbility属性被设置成collapse值后，对于一般的元素，它的表现跟hidden是一样的，对于table元素表现跟display:none一样
###### display:none和visibility:hidden区别
- display:none隐藏对应的元素，在文档布局中不再分配空间(回流+重绘)
- visibility:hidden隐藏对应的元素，在文档布局中仍保留原来的空间(重绘)
###### 浮动
- 浮动原因：浮动元素遇到包含它的边框或者浮动元素的边框就会停留，脱离了文档流，当浮动框高度超出包含框的时候，就会出现包含框不会自动伸缩高度
- 浮动带来的问题: 1. 父元素的高度无法撑开，影响与父元素同级的元素 2.与浮动元素同级的非浮动元素会跟随其后 3.若非第一个元素浮动，则该元素之前的元素也需要浮动否则会影响页面显示的结构

- 清除浮动的方式:1.父级设置高度 2.最后一个浮动元素后加空div标签，并添加样式clear:both 3.包含浮动的父级元素添加样式overflow:hidden或auto 4.父级div定义zoom 5.父级div定义伪类:after .clearfix:after{content:'';display:block;height:0;clear:both}

###### 设置元素浮动后，该元素变为display:block;

###### 移动端媒体查询
- head里面： <link rel="stylesheet" type="text/css" href="xxx.css" media="only screen and (max-device-width:480px)">
- css @media only screen and (max-device-width:480px) {
    /css样式/}

###### css预处理器 less saas增强css代码的复用性，函数，变量，循环等功能，提高编码效率
#####  css后处理器 处理css，例如给css属性根据浏览器增加前缀

###### css优化，提高性能的方法
- 避免过度约束
- 避免后代选择符
- 避免链式选择符
- 使用紧凑的语法
- 减少不必要的命名空间
- 避免不必要重复
- 最好使用语义化名字
- 避免!important
- 精简规则
- 移除空css规则
- 正确使用display例如inline属性不应该设置宽高等 inline-block不再设置float block属性不应该再使用vertical-aligin table属性不应该再使用margin或float
- 不滥用浮动
- 不滥用web字体
- 不声明过多的font-size
- 不在选择符中使用id标识符
- 不给h标签定义过多样式

###### 浏览器是如何解析css选择器的
css选择器的解析是从右向左解析的，为了避免对所有元素进行遍历。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能，若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点，直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历，两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点
css解析完毕后，需要将解析的结果与DOM Tree的内容一起进行分析建立一棵Render Tree，最终用来进行绘图。在建立Render Tree时，浏览器就要为每个DOM Tree中的元素根据css的解析结果来确定生成怎样的Render Tree

###### 网页中应该使用偶数字体，因为偶数字体更容易和web设计的其他部分构成比例关系
###### margin padding的使用场景
- margin 需要在border外侧添加空白；空白处不需要背景色；上下相连的两个盒子之间的空白需要相互抵消
- padding 需要在border内测添加空白；空白处需要使用背景色；不希望空白抵消

###### 当按照百分比设定一个元素的宽度时，它是相当于父容器的宽度计算的，但是对于一些表示竖向距离的属性，例如padding-top，padding-bottom，margin-top，margin-bottom等，当按照百分比设定他们时，依据的也是父容器的宽度而不是高度

###### 全屏滚动原理 假设5个需要展示的全屏页面，高度是500%，只是展示100%，剩下的可以通过transform进行y轴定位，也可以通过margin-top实现 用到的css属性 overflow:hidden;transition:all 1000ms ease;

###### ::before和:after中双冒号和单冒号有什么区别
- 单冒号用于css3伪类 双冒号用于css3伪元素
- 双冒号就是以一个子元素存在，定义在元素主题内容之前/后的一个伪元素，并不存在于dom之中，只存在于页面之中


###### css伪类和伪元素的区别
- 伪类功能类似class状态改变时，引发设置的样式
- 伪元素不是操作状态，而是操作诸如第一个字母第一个元素等

###### line-height
行高指一行文字的高度，具体说是两行文字间基线的距离，css中起高度作用的是height和line-height没有定义height属性，其最终表现作用一定是line-height，单行文本垂直居中，line-height属性即可 多行文本垂直居中需要设置display属性为inline-block

###### 让页面里的字体变清晰，变细， -webkit-font-smoothing在windows下不支持，ios设备下起作用 -weblit-font-smoothing:antialiased是最佳的，灰度平滑
##### position fixed在android下无效怎么处理
- <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>

##### 如果需要手写动画，你认为最小时间间隔是多久
- 多数显示器默认频率是60hz即1秒刷新60次，所以理论上最小间隔为1/60*1000=16.7ms
###### li与li之间有看不见的空白间隔是什么原因引起的？如何解决？
- 原因 回车或空格
- 解决方法li代码写在一排 浮动li  ul中font-size:0 ul可以将 ul{letter-spacing: -4px;};li{letter-spacing: normal;}

###### display:inline-block间隙解决 注释掉空格 font-size:0

###### 有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度外层div使用position：relative；高度要求自适应的div使用position: absolute; top: 100px; bottom: 0; left: 0

###### 图片格式
- png是一种无损数据压缩位图文件格式，优点:压缩比高，色彩好，大多数地方都可以用
- jpg是一种针对相片使用的一种失真压缩方法，破坏性压缩，在www上用来储存和传输照片的格式
- gif是一动图
- wep谷歌推出 大小比png小45%缺点是压缩时间更久兼容性不好

###### style标签写在body后与body前有什么区别
页面加载自上而下，应该先加载样式。下载body标签后由于浏览器以逐行方式对html文档进行解析，当解析到写在尾部的样式表会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染
###### overflow属性
- scroll 一直存在滚动条
- auto 子元素内容大于父元素时出现滚动条
- visible 溢出的内容出现在父元素之外
- hidde 溢出隐藏

##### 雪碧图
- 优势 减少网页请求提升性能，减少图片字节
- 劣势 开发繁琐 合并时需预留足够空间，宽屏高分辨率的屏幕下易出现背景断裂

###### 设置css样式
- 外部引入css文件
- head标签
- 内联html元素内部

###### 隐藏元素 不在可视范围
display:none; visibility:hidden; 宽高0，透明的0，z-index:-1000


