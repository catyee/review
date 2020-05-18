- css面试题展开  擅长的点。。。 不要背书方式回答
  1. 什么是标签语义化
    合理的标签做合理的事情
  2. 块级标签，行内标签，行内块级标签
    块：div header footer p h li 等
       块级标签独占一行，不设置宽度的话默认宽度为100%,可以设置padding，margin

    行内：i，span，a等
         多个标签存在一行，不能直接设置宽高，上下margin设置不起作用，左右margin可以
         padding可以设置
    行内块级：input，img
  3. 三类标签区别
     
    
  4. 三类标签转换
    行内元素： display: inline
    块级元素：display:block
    行内块级元素：display: inline-block

  5. display除了这几个值还有哪些
     display属性有两个作用：1.定义元素的类型（块级或者行内），规定元素的流式布局 2.控制其子元素的布局 flex或grid
     - display：none隐藏元素，不占据空间 visibility：hidden 隐藏，但是占据空间
     - display: list-item  此元素会作为列表显示。
     - display:table-cell实现水平垂直居中 要求父级元素有固定宽高 父级设置display：table-cell 设置 vertical-align:middle text-align:center
  6. 让元素隐藏可以怎么做？
     - display: none 隐藏元素，不占据空间
     - visibility: hidden 隐藏但是占据空间
     - opacity:0 隐藏但是占据空间 兼容写法 filter: alpha(opacity = 0);兼容ie678
     - position适用于不影响布局又可交互的情况  position: absolute;top: -9999px;left:-9999px;
  7. filter还能做哪些事情
     - 滤镜函数处理
  8. display: flex
     - 什么时候用到？移动端布局 pc端不考虑兼容性用到 布局用的比较多
     - flex布局后的元素 float clear vertical-align属性失效
     - 父元素设置display：flex justify-content 定义子元素沿着主轴方向如何排列 align-items定义如何沿着交叉轴排列 
  9. line-height属性
      - px固定值
      - 百分比 相对自身的font-size， 继承的不是父元素的百分比而是父元素的计算的最终值
      - 纯数字 根据自身的font-size计算，后代元素继承这个数字
  10. vertical-align
      - 指定行内元素或表格单元格table-cell元素的垂直对齐方式
      - 定义行内元素的基线相对于该元素所在行的基线的垂直对齐，允许指定负长度和百分比
      - 在单元格中定义单元格框中的单元格内容的对齐方式
  11. 文字居中问题
      - 单行文字 line-height text-align:center
      - 多行文字高度不固定： 设置固定的上下左右padding
      - 多行文字高度固定： 父元素display：table 包含文字的元素display：table-cell vertical-algin：middle或者flex布局
  12. 盒子水平垂直居中
      - 已知宽高
        position:absolute;top:50%;left:50%;margin-left:-25px; margin-top:-25px;
        position:absolute;top:0;left:0;right:0;margin:auto;
      - 未知宽高
        position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)
      - flex布局
      - js获取屏幕宽高，定位
      - display:table-cell;要求父级有固定宽度
  13. 如何使一个div里面的文字垂直居中，其该文字的大小根据屏幕大小自适应
      - 单行或者多行 @media
      - js处理
      - rem布局

  14. css盒子模型
  标准盒子模型 box-sizing: content-box;width不包括padding border只是内容宽高，实际项目中一般需要转换为border-box 
  ie盒子模型  box-sizing: border-box; 包括padding border
  flex弹性伸缩盒子模型
  15. BFC
    - BFC即块级格式化上下文，具有BFC特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响其他元素
    - 触发BFC的可能情况
      1. 根元素body
      2. 浮动元素除了float：none
      3. 绝对定位元素 position：absolute fixed
      4. display：inline-block table-cell flex等
      5. overflow除了visible 如hidden auto scroll
    - BFC应用及特性
      1. 同一BFC下外边距会发生重叠，如果要避免外边距重叠可以将其放在不同的BFC下
      2. BFC可以包含浮动的元素（通过清除浮动）
        - 浮动元素会脱离普通文档流，让其容器触发BFC可以清除浮动
      3. 浮动元素会形成文字环绕，给文字元素增加overflow：hidden触发BFC可以阻止文字环绕
   16. z-index的工作原理和适用范围 值auto（默认与父元素相等），数值，inherit（继承）
        - z-index设置元素的堆叠顺序，值越大越位于上面
        - 适用于定位元素relative，absolute，fixed