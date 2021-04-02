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

###### css清除浮动
浮动会导致父元素高度塌陷
- 父元素设置固定高度
- 浮动元素的后面加一个空div 设置该元素 clear:both
- 父元素增加一个清除浮动的class 伪类
```
    .cleafix:after{
			content:'.';
			display: block;
			clear: both;
			overflow: hidden;
			height: 0;
    }
```
- 父元素增加overflow:hidden;


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

###### 行内元素和块级元素的具体区别？行内元素的padding和margin可以设置吗
- 块级元素特性:总是独占一行，宽高内外边距都可控制,不设置宽度的话宽度会自适应其父级的宽度
- 行内元素特性: 和相邻的内联元素在同一行，宽高，内外边距的top/bottom都不可改变。内外边距的left，right可以改变，大小由其内容决定
- 行内块级元素特性:拥有内在尺寸，可以设置宽高，不会自动换行

###### css中两个相邻盒子的外边距可以结合成一个单独的外边距即折叠外边距。折叠原则:1.都为正数取最大值 2.都为负数取绝对值最大值 3.一正一负值相加

###### rgba()和opacity的透明效果有何不同
- 两者都能实现透明效果，不同的是opacity作用于元素，以及元素内的所有内容的透明度
- rgba()只作用于元素的颜色或背景色（设置rgba透明的元素的子元素不会继承透明效果）

###### css中可以让文字在垂直和水平方向上重叠的两个属性是什么
- 垂直方向 line-height
- 水平方向 letter-spacing

###### px和em，rem
- px和em都是长度单位，区别是:px的值是固定的，指定是多少就是多少，计算比较容易。em的值不是固定的，并且em会继承父级元素的字体大小
- rem是相对单位，相对的只是html根元素
###### translate()方法能移动一个元素在z轴上的位置吗
不能，只能移动x，y轴的位置，translate3d可以

###### xhtml和html有什么区别
- 功能上: html是一种基本的web网页设计语言，xhtml是一个基于xml的置标语言

###### css link引入和@import引入区别 内联 内嵌 外链 导入
页面被加载时link会被同时加载，@import引用的css会等到页面加载完再加载

###### 浏览器内核
- 主要分成两部分:渲染引擎和js引擎
- 渲染引擎：负责获取网页的内容html，xml，图像等，整理讯息（例如加入css等），以及计算网页的显示方式，然后会输出到显示器或打印机。浏览器的渲染内核不同对于网页的语法解释也会不同，所以渲染效果也不同，所有的网页浏览器，电子邮件客户端以及其他所需要编辑显示网络的应用程序都需要内核
- js引擎：解析和执行js来实现网页动态效果
- 常见浏览器内核: 
                - trident内核 ie 360 搜狗
                - Gecko内核 firefox等
                - Presto内核 opera7及以上
                - webkit内核 Safari Chorme
                - edgeHtml内核 Microsolft Edge
1、IE浏览器内核：Trident内核，也是俗称的IE内核。

2、Chrome浏览器内核：统称为Chromium内核或Chrome内核，以前是Webkit内核，现在是Blink内核。演进Chromium内核 → Webkit内核 → Blink内核。

3、Firefox浏览器内核：Gecko内核，俗称Firefox内核。

4、Safari浏览器内核：Webkit内核。演进 KHTML->Webkit(WebCore+JSCore)->Webkit2。

5、Opera浏览器内核：最初是自己的Presto内核，后来加入谷歌大军，从Webkit又到了Blink内核。

6、360浏览器、猎豹浏览器内核：IE内核+Chrome双内核；

7、搜狗、遨游、QQ浏览器内核：IE内核（兼容模式）+Webkit（高速模式）；

8、百度浏览器、世界之窗内核：IE内核；

9、2345浏览器内核：好像以前是IE内核，现在也是IE+Chrome双内核了；

10、UC浏览器内核：这个众口不一，UC说是他们自己研发的U3内核，但好像还是基于Webkit和Trident，还有说是基于火狐内核



###### html5中的datakist有助于提供文本框自动完成特性
###### 水平垂直居中一张背景图 background-position:center
###### 强制换行css word-break:break-all;
###### px,em,rem的区别
- px实际的像素 
- em 相对于使用em的元素的字体大小 em*字体大小
- rem相对于根元素html的字体大小 rem*根元素字体

- pc端适配
- svg canvas

- BFC的应用
1. 消除margin合并 相邻元素出现margin合并 给其中一个元素添加一个父元素 设置overflow:hidden触发BFC
2. 父元素里的某个子元素设置浮动之后，子元素脱离了文档流，使得父元素无法包住这个浮动的子元素，给父元素设置overflow:hidden，实际上创建了一个BFC，这决定了height:auto是如何计算的，计算BFC高度时，浮动元素也参与计算，因此，父元素在计算高度时候加入了浮动元素的高度，顺便清除了浮动，使得父元素包裹住了子元素
除了overflow:hidden还可以给父元素设置absolute float:left，display:inline-block等来创建一个BFC

3. BFC布局规则
 1. 内部的块级元素会在垂直方向一个接一地放置
 2. 块级元素的垂直距离由margin决定。属于同一个BFC的两个相邻的块级元素会发生margin合并，不属于同一个BFC的两个相邻的块级元素不会发生margin合并
 3. 每个元素的margin box的左边，与包含border box的左边相接触 即使存在浮动也是如此
 4. BFC的区域不会与float box重叠
 5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，外面的元素不会影响到容器里面的元素
 6. 计算BFC的高度时，浮动元素也参与计算



 - 块级元素和行内元素的区别
 块级元素独占一行，不设置宽度默认宽度100%，可以设置margin，padding

 行内元素： i span a等
 - 多个标签在一行显示
 - 不能直接设置宽高
 - 行内元素设置内边距时,只有左右方向有效,上下边距会有边距效果,但是对其他元素不会有影响
 - 左右margin有效的,上下margin无效

 - line-height 属性
  1. px固定值
  2. 百分比 相对自身的font-size 继承的不是父元素的百分比而是父元素计算的最终值
  3. 纯数字 根据自身的font-size计算 后代继承这个数字

- vertical-align 属性
 1. 指定行内元素或表格单元格table-cell元素的垂直对齐方式
 2. 定义行内元素的基线相对于该元素所在行的基线的垂直对齐,允许指定负长度和百分比
 3. 在单元格中定义单元格框中的单元格内容的对齐方式

todo!!!
- 文字居中问题
 1. 单行文字垂直水平居中 line-height: 高度 text-align:center 或父元素display:table 子元素display:table-cell; text-align:center;
 2. 多行文字高度不固定   设置padding   或父元素display:table 子元素display:table-cell; text-align:center;
 3. 多行文字高度固定  或父元素display:table 子元素display:table-cell; text-align:center;

- 盒子水平垂直居中
 1. 已知宽高 2种定位 定位四个方向为0 margin:auto flex布局 定位50% transform: translate(-50%, -50%)
 2. 未知宽高 还有flex布局 定位50% transform: translate(-50%, -50%)  子元素display:table-cell; text-align:center;


css引入
- css在head标签中引入时，会阻塞html的渲染，因此页面只有等css下载并解析完成之后才会渲染，最终出现的页面是带有完整样式的。这个过程只会发生一次解析渲染。html解析成DOM树+css解析成CSSOM树+结合生成layout树+计算布局+绘制 但也存在缺点：在css文件下载比较慢时，会出现长时间白屏，但与出现裸奔的页面相比，白屏似乎在体验上更加友好
- css在body中引入时，会阻塞html的解析，但不会阻塞html的渲染，因此页面在css下载完成之前会将link标签前的html先进行解析渲染，并展现在页面，但由于没有css样式，页面会展示没有样式的页面，即裸奔现象，等到css下载解析完成之后，页面重新解析渲染，展现出带有样式的html，这个过程会导致reflow或repaint；从用户体验来看：css在body标签中引入时，虽然页面可以先展现处理，但由于裸奔现象，会导致极差的用户体验，从性能方面来看，在css与head标签中引入相比，页面在css加载完成后需要重新解析渲染，这个过程带来了极大的性能损耗

- css3
1. 边框 border-radius:20px;
2. box-shadow: 10px 10px 5px #888;
3. border-image: url(border.png) 30 30 round; // 使用图片创建边框
4. background-origin属性指定了背景图像的位置区域 值可以为content-box padding-box border-box
5. background-image可以设置多个背景图像
6. background-clip 背景裁剪属性是从指定位置开始绘制
7. background-image: linear-gradient(to bottom right, red, yellow);
8. background-image: linear-gradient(-90deg, red, yellow);
9. background-image: radial-gradient(red, yellow, green);
10. text-shadow: 5px 5px 5px #fff000; // 水平阴影 垂直阴影 模糊距离 阴影颜色
11. 溢出隐藏
```
    {
        white-space:nowrap;
        overflow:hidden;
        text-overflow: ellipsis;
    }
```
12. 多列 column-count：3