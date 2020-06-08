### js
1. Symbol
- Symbol类型不能使用new会报错
- Symbol 值通过 Symbol 函数生成，使用 typeof，结果为 "symbol"
- var s = Symbol('foo'); console.log(s instanceof Symbol); // false
- Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
2. js数据类型
    基本数据类型和引用数据类型
    基本：Number，String，Boolean，Null，Undefined
    引用 Object，Function，Regexp，Date，Array
    Symbol
3. js检测数据类型
   - typeof 使用它会返回一个字符串，适合函数对象和基本类型(除了null)
     - typeof 1 => 'number' typeof NaN => 'number'
     - typeof '1' => 'string'
     - typeof true => "boolean"
     - typeof undefined => "undefined"
     - typeof null => 'object'
     - typeof function() {} => "function"
     - typeof new Array => "object"
     - typeof {} => 'object'
     - typeof Symbol() => 'symbol'
   - instanceof 
     - '1' instanceof String => false
     - new String('1') instanceof String => true
     -  1 instanceof Number => false
     -  new Number(1) instanceof Number => true
     -  总结： 对于Number，String，Boolean类型，可以检测new创建的不可检测字面量创建的
     -  null instanceof Null 报错
     -  undefined instanceof Undefined 报错
     -  引用数据类型可以检测
  - constructor 可以检测除了null和undefined,但是原型可以被改写，改写之后就不准确了
     - ("1").constructor === String => true
     - (1).constructor === Number => true
     - (true).constructor === Boolean => true
     - []).constructor === Array => true
     - function() {}).constructor === Function => true
     - ({}).constructor === Object => true
     - (null).constructor === Null => 报错
     - (undefined).constructor === Undefined => 报错
     - function Fn() {} Fn.prototype = new Array var f = new Fn() f.constructor === Fn// false f.constructor === Array // true
  - Object.prototype.toString.call()
     - var a = Object.prototype.toString;
     - a.call('111') => "[object String]"
     - a.call(1) => "[object Number]"
     - a.call(true) => "[object Boolean]"
     - a.call(null) => "[object Null]"
     - a.call(undefind) => "[object Undefined]"
     - a.call([]) => "[object Array]"
     - a.call(function() {}) => "[object Function]"
     - a.call(/\d+/) => "[object RegExp]"
     - a.call(Symbol(1)) => "[object Symbol]"
4. new关键字 new运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例，new关键字会进行如下操作
  1. 创建一个空的简单javascript对象即{}
  2. 链接该对象到另一个对象（即设置该对象的构造函数）
  3. 将步骤1新创建的对象作为this的上下文
  4. 如果该函数没有返回对象或返回基本类型则返回this

  - 当代码new Foo(...)执行时，会发生以下事情
    1. 一个继承自Foo.prototype的新对象被创建
    2. 使用指定的参数调用构造函数Foo，并将this绑定到新创建的对象，new Foo等同于new Foo(),也就是没有指定参数列表，Foo不带任何参数调用的情况
    3. 由构造函数返回的对象就是new表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1返回的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

  - 实现一个new函数
    ```
      function _new(func,...args) {
        let obj = Object.create(func.prototype)
        var res = func.call(obj, ...args)
        if(typeof res !=== null && typeof res === 'object' || typeof res === 'function') {
          return res
        }
        return obj
      }

      function _new(func) {
        var args = Array.prototype.slice.call(arguments,1)
        var obj = {}
        obj.__proto__ = func.prototype
        var res = func.apply(obj,args)
         if(typeof res !=== null && typeof res === 'object'|| typeof res === 'function') {
          return res
        }
        return obj
      }
    ```
5. 函数声明和变量声明总是会被解释器提升到方法体的最顶部
   - https://blog.csdn.net/hbzyin/article/details/78025777
   - var a会被提升 但是 a = 3即变量初始化不会被提升 声明会被提升，初始化不会被提升
   ```

      function a(){	
      }
      var a; 
      console.log(a) // a的函数体
      函数的声明比变量的声明优先级更高

   ```
   - 函数式声明函数声明连同函数体一起被提升
   - 基本数据类型栈内存 引用数据类型堆内存
   - 如果函数在函数体中声明，则它是函数作用域，否则为全局作用域。变量将会在执行进入作用域的时候被创建。块不会定义新的作用域，只有函数声明和全局性质代码执行才会创建新的作用域，变量在创建的时候会被初始化undefined。如果变量声明语句里带有赋值操作，则赋值操作只有在执行的时候才会发生，而不是创建的时候
  - js引擎在读取js代码时候会有两个步骤即1.解释2.执行，解释是指先通篇扫描所有的js代码，然后把所有的声明提升到顶端，然后就是代码执行
   ```var a=1;
      function foo(){
      a=10;
      return;
      function a(){ }
      }
      foo();
      console.log(a);
   ```
6. js event loop
   - 进程和线程
     进程是系统分配的独立资源，是cpu资源分配的基本单位，进程是由一个或多个线程组成的，线程是进程的执行流，是cpu调度和分派的基本单位，同一个进程中的多个线程是共享该进程的资源的
   - 浏览器内核
     浏览器是多进程的，浏览器的每一个tab标签都代表一个独立的进程，多个空白tab会合并成一个进程，浏览器内核（浏览器渲染进程）则属于浏览器多进程的一种
     浏览器内核有多种线程在工作
     1. GUI渲染线程 （1）负责渲染页面，解析html，css构成DOM树等，当页面重绘或者由于某种操作引起回流都会调用该线程 （2）和js引擎是互斥的，当js引擎在工作的时候，GUI渲染线程会被挂起，GUI更新被放入到js任务队列中，等待js引擎线程空闲的时候继续执行
     2. js引擎线程 （1）单线程工作，负责解析允许js脚本 （2）和GUI渲染进程互斥，js允许耗时过长会引起页面阻塞
   - 事件触发线程
     当事件符合触发条件被触发时，该线程会把对应的事件回调函数添加到任务队列，等待js引擎处理
   - 定时器触发线程
     1. 浏览器定时器并不是由js引擎计数的，阻塞会导致计时不争取
     2. 开启定时器触发线程并触发计时时，计时完成后被添加到任务队列中，等待js引擎处理
   - http请求线程
     1. http请求的时候开启一条请求线程
     2. 请求完成后，将请求的回调函数添加到任务队列中等待js引擎处理
  
  - 事件循环
    - js引擎是单线程的，分为浏览器事件循环和node事件循环
    - 浏览器： js有一个主线程和调用栈，所有的任务都会被放到调用栈等待主线程执行
    - js调用栈是一个后进先出的数据结构，当函数被调用时，会被添加到栈的顶部，执行完成之后就从栈顶移出该函数，直到栈被清空
    - js中的任务分为同步任务和异步任务，同步任务会在调用栈中按照顺序排队等待主线程执行，异步任务有了结果之后会将注册的回调函数添加到任务队列，等待主线程空闲的时候，也就是调用栈被清空的时候，被读取到调用栈中等待主线程执行，任务队列是先进先出的数据结构
    - 调用栈中的异步任务都执行完毕后，栈被清空了，就代表主线程空闲了，这个时候就会去任务队列中按照顺序读取一个任务，有就读取进栈执行，一直循环这就形成了事件循环
    - 定时器会开启一条定时器触发线程来触发计时，定时器会在等待了指定事件后，将任务放到任务队列中等待读取到调用栈中等待主线程执行，定时器指定的延时毫秒并不准确，因为定时器只是到了指定的事件将事件放到任务队列，必须等到同步任务和现有的任务队列中的事件全部执行完之后才会读取定时器的回调函数到主线程执行，中间可能存在耗时比较久的任务，那么就不可能保证在指定的时间执行
    - 宏任务，微任务
      除了广义的同步任务和异步任务，js单线程的任务可以分为宏任务和微任务
      - 宏任务： script（整体代码）setTimeout setTnterval setImediate I/O UI rending http回调 事件 requestAnimationFrame
      - 微任务： process.nextTick promise Object.observe MutationObserver await
      - 一次完整的事件循环步骤
         1. 检查宏任务队列是否为空，不为空到2，为空到3
         2. 执行宏任务队列中的一个任务 
         3. 继续检查微任务队列是否为空，不为空则到4，否则到5
         4. 去除微任务队列中的任务执行，执行完返回3
         5. 执行视图更新
      浏览器视图渲染发生在本轮事件怒换的微任务队列被执行完之后，也就是说执行任务的耗时会影响视图渲染的时机，通常浏览器以每秒60帧的速率刷新页面，大概16，7ms渲染一帧，所以要让用户觉得流畅，单个宏任务以及它相关的所有微任务最好能在16.7ms内完成
      但也不是每轮事件循环都会执行视图更新，浏览器有自己的优化策略，例如把前几次的视图更新累积到一起重绘，重绘之前通知requestAnimationFrame执行回调函数，也就是说requestAnimationFrame的回调的执行时机是在一次或多次事件循环的UI render阶段
      事件循环是js实现异步的核心
      浏览器只保证requestAnimationFrame的回调在重绘之前执行，没有确定的时间，何时重绘由浏览器决定
   - node中的事件循环机制 https://www.cnblogs.com/yzfdjzwl/p/8182749.html
   - https://juejin.im/post/5c3d8956e51d4511dc72c200
      1. v8引擎解析js脚本
      2. 解析后的代码调用node api
      3. libuv库负责node api的执行，它将不同的任务分配给不同的线程，形成一个事件循环，以异步的方式将任务的执行结果返回给v8引擎
      4. v8引擎再将结果返回给用户
7. 闭包 https://blog.csdn.net/weixin_43955769/article/details/90521768
   - 对象的属性名不能为引用数据类型object，会调用对象Object.prototype.toString()方法转换为 "[object Object]" [].toString() => ''
   - 对象和数组方法整理
   - 编译器： 词法解析 AST抽象语法树 构建出浏览器能够执行的代码 =》 引擎（v8/webkit内核）：变量提升 作用域/闭包 变量对象 堆栈内存 GO/VO/AO/EC/ECStack 。。。
   - ECStack 执行上下文环境栈 js引擎想要执行代码一定会创建一个执行栈 =》栈内存：执行代码
   - EC 执行上下文 某个域下代码执行都有自己的执行上下文 把创建的上下文压缩到栈内执行 =》 进栈  执行完没用的 =》出栈 有的还有用 =》压缩到栈底 =》 闭包
   - GO 全局对象，在浏览器端，全局对象为window
   - null和undefined区别 undefined只声明未定义 null赋值为一个空值 释放内存占用
   - vo变量对象 存储当前上下文中的变量
 - 闭包
   - 函数和对其周围状态（词法环境）的引用捆绑在一起构成闭包。也就是说闭包可以让你从内部函数访问外部函数作用域，在js中，每当函数被创建，就会在函数生成时生成闭包。
   - 作用：一个是它可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。
   - 缺点：使用闭包会占有内存资源，过多的使用闭包会导致内存溢出等
   - 内存泄漏处理：简单的说就是把那些不需要的变量，但是垃圾回收又收不走的的那些赋值为null，然后让垃圾回收走；

周五
8. 原型继承
   - 面向对象的特点：封装 继承 多态（重载 同名方法的多个实现 可以依靠参数类型和个数来区分判断）
   - 原型与原型链
     - 每个实例对象都有一个私有属性__proto__,指向它的构造函数的 原型对象prototype，该原型对象也有一个__proto__,层层向上，直到一个对象的原型对象为null，null没有自己的原型对象，并作为原型链中的最后一个环节
     - 只有函数有prototype，对象是没有的
     - 函数也有__proto__,因为函数也是对象，函数的__proto__指向Function.prototype
     - 也就是说普通函数是Function这个构造函数的一个实例
    
     - 创建对象的三种方式
      1. 字面量：var a = {name: 'a'} 或 var a = new Object({name: 'a'})
      2. 构造函数：function A(name) {this.name = name} var a = new A('a')
      3. Object.create: Object.create(proto,propertiesObject) 第一个参数是新创建对象的原型对象，第二个参数是可选的  var p = {name: 'p'} var a = Object.create(p)


    - instanceof 原理 可以检测数据类型 但是只能检测new的基本类型，引用类型可以，null和undefined不可以
    - instanceof是判断实例对象的__proto__和生成该实例的构造函数的prototype是不是引用的同一个地址
    - 实例在instanceof的时候与原型链上所有的构造函数相比都是true
    - 如果要判断实例是由哪个构造函数生成的，需要用constructor obj.__proto__.constructor


  - 实现继承
     - 原型链继承（思想：一个类的原型对象等于另一个类的实例）
      ```
        function Super() {}
        Super.prototype.getSuperValue = function() {}

        function Sub() {}
        Sub.prototype = new Super()
        Sub.prototype.getSubValue = function() {}
        var sub = new Sub()
      ```
      主要问题：原型对象中的所有属性都是所有实例共享的，如果原型对象中存储一个引用类型的属性如colors:['white','black','pink'] 那么一个实例修改这个属性，其他的实例也会收到影响
      因此我们将属性存放在构造函数中而不是原型对象上，function Super() {this.colors = ['white','black','pink']} 这样实例之间就不会相互影响了
      原型实现继承之后，Sub的原型对象指向Super的实例，因此Sub可以通过__proto__访问Super实例上的colors属性，对于Sub来说即将一个引用属性放在了它的原型对象上，那么Sub的实例之间也会相互影响
      还有个问题就是在创建子类型的实例的时候，没法向超类型的构造函数中传参数，会影响其他实例
    - 借用构造函数（思想：子类型构造函数内部调用超类型构造函数）
      ```
        function Super(name) {this.colors = ['white','black','pink']；this.name = name }
        function Sub(name) {Super.call(this,'huahua')}
        var sub = new Sub()
      ```
      这种方式，每个子类型实例创建的时候都将执行Super并创建自己的属性，这样每个实例之间就不会影响了
      同时还可以实现在子类型构造函数中向超类型函数传参数

      问题：这种方式的话超类型的函数也必须在构造函数中定义，这样就不能实现方法函数的复用了，在超类型原型上定义的方法对于子类型是不可见的
  - 组合继承（思想：组合原型链继承和借用构造函数继承）
    ```
      function Super(name) {this.colors = ['white','black','pink'];this.name = name}
      Super.prototype.getSuperValue = function() {}
      function Sub(name) {Super.call(this,name)}
      Sub.prototype.constructor = Sub // // 第一次调用Super()
      Sub.prototype = new Super()
      var sub = new Sub('huahua')
    ```
    保证了子类型的每个实例拥有自己的属性，也实现了函数复用
    问题：会调用两次构造函数
  - 原型式继承（思想：Object.create）
    ```
      function create(o) {
        var F = function() {}
        F.prototype = o
        return new F()
      }
    ```
    问题：所有的实例共用一套引用属性，实例之间会相互影响
  - 寄生式继承（思想：创建一个仅用于封装继承过程的函数，该函数在不以某种方式来增强对象，最后再像真的是它做了所有工作一样返回对象。）
    ```
      function createAnother(original){
        var clone = Object.create(original)
        clone.say = function() {}
        return clone
      }
    ```
    问题：不能做到函数复用
  
  - 寄生组合式继承（思想：）
    ```
    function inheritProrotype(subType,superType) {
      var prototype = Object.create(superType);
      prototype.constructor = subType;
      subType.prototype = prototype;
    }
    function SuperType(name){
      this.name = name;
      this.colors = ['red', 'blue', 'green'];
    }
    SuperType.prototype.sayName = function() {
        alert(this.name);
    }
    function SubType(name,age) {
        SuperType.call(this, name); // 第二次调用SuperType()
        this.age = age;
    }
    inheritProrotype(subType,superType);
    SuperType.prototype.sayAge = function() {
        alert(this.age);
    }
    ```

9. 浏览器存储方式
  - cookie，localStorage，sessionStorage，indexDVB
  - cookie 一般由服务器生成，可以设置过期时间,如果没有设置时间，浏览器关闭即会过期。前端设置document.cookie,数据存储大小有限制，不同浏览器有差别，一般是4k，每次都会携带进入header中，domain和path两个属性可以限制cookie能被哪些url访问决定了cookie何时被浏览器添加到请求头发送出去，domain的默认值是设置该cookie的网页所在的域名，path默认为设置该cookie的网页所在的目录
  - localstorage  
    1. 基本操作：设置 localStorage.name = '1'/localStorage.setItem('name', '1') 获取：localStorage.getItem('name') / localStorage.name
    2. 除非被清理 否则一直存在
    3. 受同源策略影响 同一浏览器的相同域名和端口的不同页面间可以共享共同的localStorage
  - sessionStorage
    1. 用法同localStorage
    2. 页面关闭就清理
    3. 只有同一个会话的页面才能访问当前会话结束数据也随之销毁，即使同源页面之间也无法共享sessionStorage信息，如果一个页面包含多个iframe且它们属于同源页面则它们之间是可以共享的
  - indexDB除非被清理，否则一直存在

10. 跨域
    - 同源策略 ：协议 域名 端口三者相同 是浏览器的基本的安全功能 如果没有同源策略 浏览器很容易受到XSS，CSBF攻击
    - 跨域限制：1. cookie localStorage indexDB等无法读取 2.DOM无法获得 3. ajax请求发送被拦截
    - 允许跨域标签 1. img 2. link 3， script 表单提交可以跨域
    - 跨域请求到底发出去了没有
      跨域请求能够发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了
    - 跨域解决方案：
      1. JSONP 
          - 原理：利用script标签没有跨域限制，需要服务器支持
          - 兼容性好，但是仅支持get请求
          - script标签src为请求地址，请求地址加一个callback的参数，指定回调函数的名字，服务器会将JSON数据放在回调函数里作为参数传回来。浏览器接收到响应数据，由于发起请求的是script标签，所以相当于直接调用回调并传入了一个参数
      2. cors跨域 （需要浏览器和后端同时支持）
        - 浏览器会自动进行CORS跨域，实现CORS跨域的关键是后端
        - 后端需要设置Access-Control-Allow-Origin该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源
        - CORS跨域在前端请求的时候会出现两种情况
          1. 简单请求
              - 条件1： 请求方法：GET HEAD POST
              - 条件2: 请求头的Content-Type（告诉服务器实际发送的数据类型）的值仅限于下列三者之一
                      - text/plain
                      - multipart/form-data
                      - application/x-www-form-urlencoded
                    - 备注：当发起一次post请求，如果没有指定content-type，则默认content-type为application/x-www-form-urlencoded，则参数会以FormData的形式进行传递，不会出现在请求url中
                    若content-type为application/json则参数会以Request payload的形式传递（数据格式为json）不会出现在请求url中
          2. 复杂请求
            - 如果不符合以上条件的请求就是复杂请求，复杂请求的CORS请求，会在正式通信之前增加一次http查询请求，称之为“预检”请求，该请求方法是option，通过该请求来判断服务端是否允许跨域请求
        3. postMessage window属性
          可以解决以下方面的问题
          - 页面和其打开的新窗口的数据传递
          - 多窗口之间消息传递
          - 页面与嵌套iframe传递
      - websocket跨域
     Websocket是HTML5的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。WebSocket和HTTP都是应用层协议，都基于 TCP 协议。但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。
      - node转发
      - nginx反向代理
        nginx配置
      - window.name + inframe
      - location.hash + iframe
      - document.domain+ inframe

11. http 状态码 请求头 响应头 类型 https://www.jianshu.com/p/52d86558ca57
    - 在http1.0中一个http在传输完成之后就会断开tcp链接，受到tcp慢启动的特点，每次建立http都会消耗大量的时间，所以各个浏览器定义了一个不标准的协议叫keep-alive，当然在http1.1中已经默认开启keep-alive，标识该请求在结束之后不会被断开，也就是下一个请求可以不用进行DNS查询，TCP三次握手，直接利用上一个通道进行传输。
    - http协议属于应用层 交互数据的方式：报文
    - http的报文分为请求报文和响应报文，分别用于发送请求和响应请求
    - http请求方法
      1. GET 请求服务器发送资源
      2. HEAD 请求资源的头部信息，并且这些头部与HTTP GET方法请求时返回的一致，该请求方法的一个使用场景是在下载一个大文件之前先获取其文件大小再决定是否下载，由此可以节约贷款资源
      3. OPTIONS 获取目的资源所支持的通信选项 比如跨域复杂请求的预请求
      4. POST 发送数据给服务器
      5. PUT用于新增资源或者使用请求中的有效负载替换目标资源的表现形式
      6. DELETE用于删除指定资源
      7. PATCH用于对资源进行部分修改
      8. CONNECT: HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器
      9. TRACE: 回显服务器收到的请求，主要用于测试或诊断
    - http报文首部
      - 通用首部 请求首部 响应首部 实体首部（写进请求头和响应头）
    - http状态码
      - 1XX 信息性状态码（接收请求正在处理）
      - 2XX 成功状态码（请求正常处理完毕）
      - 3XX 重定向状态码（需要进行附加操作以完成请求）
      - 4XX 客户端错误状态码（服务器无法处理请求）
      - 5XX 服务器错误状态码（服务器处理请求出错）
      - 200 正常
      - 204 no content 请求成功，没有返回
      - 206 partial content 客户端进行范围请求就是请求资源的一部分，服务端返回请求这部分
      - 301 永久重定向
      - 302 临时重定向
      - 303 资源存在另一url是否按照新的访问
      - 304 客户端发附带条件的请求，服务端允许请求资源，但是没有满足条件 304缓存
      - 307 临时重定向
      - 400 请求报文中存在语法错误
      - 401 需要http认证
      - 403 请求访问的资源被服务器拒绝了
      - 404 服务器上没有找到资源
      - 500 服务器执行请求时候出错
      - 503 服务器处于超负载，正在进行停机维护
    - get和post区别
      - 传输方式：get url传输 post请全体传输
      - post相对更安全一点
      - get请求会被浏览器手动cache post不会
      - get请求多次操作不会有什么影响 post可能会有影响如重复提交表单
    - http请求头
      - Accept 指定客户端能够接受的内容类型 如：text/plain application/json
      - Accept-charset 浏览器可以🉑️的字符编码集
      - cache-control 指定请求和响应遵循的缓存机制
      - cookie http发送请求时会将保存在该请求域名下的所有cookie值一起发送到服务器
      - content-length 请求的内容长度
      - content-type 请求的与实体对应的MIME信息如content-type：application/x-www-form-urlencoded
      - if-modified-since如果请求的部分在指定时间之后被修改则请求成功，未被修改则返回304代码
      - 。。。
    - content-type
      - 在响应中，content-type告诉客户端实际返回的内容和内容类型
      -  在请求中，客户端告诉服务器实际发送的数据类型
      -  get请求时候，参数会以url sting的形式进行传递，即？后的字符串并以&进行分隔 请求参数为 Query Sting Parameters
      -  post请求会出现两种形式的请求体
         -  Form Data 当发起一次post请求，若未指定content-type则默认content-type为application/x-www-form-urlencoded 即参数以Form Data的形式进行传递不会出现在url中
         -  Request Payloaf 当发起一次post请求，若content-type为application/json则参数会以request Payload的形式进行传递（数据格式为json）不会出现在请求url中
         -  服务器为何对表单提交和服务器上传做特殊处理，因为表单提交是名：值键值对的形式，且content-type为application/x-www-form-urlencoded数据格式不固定不一定是键值对的形式，所以服务器无法知道具体的处理方式只能通过原始的数据流的方式进行解析因此文件上传需要使用原生的formData（）进行数据组装，且content-type需要设置为mutipart/formData
12. fetch axios ajax 
    1.  跨站请求伪造（CSRF）欺骗用户浏览器让其以用户的名义进行操作
    2.  ajax核心是xhr（XMLHttpRequest）的封装
        1.  实例化XMLHttpRequest对象 var xhr = new XMLHttpRequest()
        2.  连接服务器 xhr.open(params.type,params.url + '?'+params.data, true// 异步)
        3.  发送请求 xhr.send(params.data)
        4.  监听事件，接收响应数据
            1.  xhr.onreadystatechange = function() {
                1.  if(xhr.readyState === 4) {
                    1.  if(xhr.status > 200 && xhr.status < 300>) {
                    2.  // 执行回调
                    3.  }
                2.  }
            2.  }
    3. axios本质是对原生xhr的封装，是promise的实现版本
       1. 从浏览器创建XMLHttpRequest
       2. 支持promiseAPI
       3. 客户端支持防止CSRF（跨站请求伪造）让每个请求都带一个cookie中拿到的key根据浏览器同源策略，假冒的网站拿不到cookie中的key，这样后台可以轻松辨别这个请求是否是用户在假冒网站上的误导输入，从而采取正确的策略
       4. 拦截请求和响应
       5. 取消请求
       6. 自动转换json数据
    4. fetch 不使用XMLHttpReuest  返回promise 更加底层
       1.  与jquery ajax的主要区别
           1.  当收到一个代表错误的http状态码时，从fetch返回的promise不会标记为reject，即使响应的http状态码为404或500。其Promise状态标记为resolve（但是会将resolve的返回值的ok属性设置为false），仅当网络故障或请求被阻止时，才会标记为reject
           2.  fetch不会接受跨域cookies，也不能使用fetch建立跨域会话，其他网站的Set-cookie头部字段将会被无视 mode：cors可以跨域
           3.  fetch不会发送cookies，除非设置
       2. 封装一个fetch 
13. udp 无连接的 面向字节流  支持多对多 https://zhuanlan.zhihu.com/p/24860273
14. tcp 传输可靠 有序 三次握手建立连接 面向连接 只能点对点
15.  缓存 浏览器缓存 https://github.com/amandakelake/blog/issues/41
     1.   缓存有好多种分为CDN缓存，数据库缓存，代理服务器缓存，和浏览器缓存
     2.   通常浏览器缓存分为强缓存和协商缓存
     3.   基本原理
          1.   浏览器在加载资源时候会根据请求头的 expires 和 canche-control 判断是否命中强缓存，如果是则之间从缓存中读取资源不会发送请求到服务器
          2.   如果没有命中强缓存，浏览器一定会发送一个请求到服务器，通过   last-modified 和  etag 验证资源是否命中协商缓存，如果命中，服务器会将这个请求返回，但是不会返回这个资源的数据，依然是从缓存中读取数据
          3.   如果前两者都没有命中，直接从服务器加载资源
     4. 强缓存
        1. 强缓存通过expires和cache-control响应头实现
        2. expires是http1.0提出的一个表示资源过期时间的header，它描述的是一个绝对时间，由服务器返回，Expires受限于本地时间，如果修改了本地时间，可能会造成缓存失效 Expires: Wed, 11 May 2018 07:20:00 GMT
        3. cache-control 出现于http1.1优先级高于expires，表示的是相对时间 Cache-Control: max-age=315360000
        4. 题外tips  cache-Control: no-cache不会缓存数据到本地的说法是错误的，Cache-Control: no-store才是真正的不缓存数据到本地，Cache-Control: public可以被所有用户缓存（多用户共享），包括终端和CDN等中间代理服务器，Cache-Control: private只能被终端浏览器缓存（而且是私有缓存），不允许中继缓存服务器进行缓存
     5. 协商缓存
        1. 当浏览器对某个资源的请求没有命中强缓存，就会发一个请求到服务器，验证协商缓存是否命中，如果协商缓存命中，请求响应返回的状态码为304并且会显示一个not modified的字符串
        2. 协商缓存利用的是last-modified，if-modified-since 和 ETag和IF-None-match这两对header来管理的
        3. last-modified和if-modified-since
           1. last-modified表示本地文件最后修改日期，浏览器会在request header加上if-modified-since（上次返回的last-modified值），询问服务器在该日期后资源是否有更新，有更新的话会将新的资源发送回来，但是如果在本地打开缓存文件，就会造成last-modified文件被修改
        4. ETag和If-None-Match
           1. ETag就像一个指纹，资源变化都会导致ETag变化，ETag可以保证每一个资源都是唯一的
           2. If-None-Match的header会将上次返回的ETag发送给服务器，询问资源的ETag是否有更新，有变化jiu h 发送新的资源回来
           3. ETag的优先级比last-modified优先级更高
        5. 为什么使用ETag
           1. 一些文件也许会周期性的修改但是它的内容并不改变，仅仅修改时间，这个时候我们并不希望客户端认为这个文件被修改了而重新get
           2. 某些文件修改十分频繁比如秒以下的时间进行修改，If-Modified-Since能检查到的粒度是s级的，这种修改无法判断
           3. 某些服务器不能精确的得到文件的最后修改时间
        6. 几种状态码的区别
           1. 200强缓存Expires和cache-control失效时，返回新的资源文件
           2. 200（form-cache）强缓存Expires和cache-control两者都存在且未过期，Cache-Control优先Expires时，浏览器从本地获取资源成功
           3. 304（not modified）协商缓存last-modified/ETag没有过期，服务端返回304
        7. 协商缓存需要配合强缓存使用，如果不启用强缓存的话，协商缓存根本没有意义 
16.  重绘回流
     1.   回流一定重绘 重绘不一定回流
     2.   回流代价更高
     3.   浏览器使用流式布局模型
     4.   浏览器会把html解析成DOM，把css解析成CSSOM，DOM和CSSOm合并就产生了rendertree
     5.   有了RenderTree我们就知道了所有节点的样式，然后计算它们在页面的大小和位置，最后把节点绘制在页面上
     6.   由于浏览器使用流式布局，对RenderTree的计算通常只需要遍历一次就可以完成，但是table及其内部元素除外，tablle可能需要多次计算，通常需要花3倍于同等元素的时间，这也就是为什么要避免使用table布局的原因
     7.   当RenderTree中部分或全部元素的尺寸，位置等发生变化时，浏览器重新渲染部分或全部文档流的过程称为回流
     8.   会导致回流的操作
          1.   页面首次渲染
          2.   浏览器窗口大小发生改变
          3.   元素尺寸或位置发生改变
          4.   元素内容发生改变（文字数量或图片大小等等）
          5.   元素字体大小变化
          6.   添加或删除可见的DOM元素
          7.   激活css伪类
          8.   查询某些属性或调用某些方法 如：clientWidth offsetWidth
    9.    当页面中的元素样式的改变并不影响它在文档流中的位置时，例如color，background-color visivility等浏览器会将新样式赋予元素并重新绘制它，这个过程叫做重绘
    10.   如何避免
          1.    避免使用table布局
          2.    尽可能在DOM树的最末端改变class
          3.    避免设置多层的内嵌样式
          4.    将动画效果应用到position属性为absolute或fixed的元素上
          5.    避免使用css表达式
          6.    js避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性，避免频繁操作DOM创建一个documentFragment在它上面应用所有的DOM操作然后把它添加到文档中
17.  防抖节流
     1.  函数防抖：当事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
         1.  未防抖，只要按下键盘就会触发ajax操作，不仅是浪费资源，而且实际应用中，用户也是输出完整的字符后才会请求
         2.   防抖处理
              ```
                function debounce(func,delay) {
                  return function(args) {
                    clearTimeout(func.id)
                    let _this = this
                    let _args = args
                    func.id = setTimeout(function(){
                      func.call(_this,_args)
                    },delay)
                  }
                }
              ``` 
          3.  在进行频繁的输入时，并不会发生请求，只有在指定间隔没有输入时才会执行函数，如果停止输入但是在指定间隔内又输入会重新触发计时
      2. 函数节流
         1. 规定在一个单位时间内只触发一次函数，如果在这个单位时间内触发多次函数只有一次生效
              ```
                function throttle(func, delay) {
                  let last,deferTimer;
                  return function () {
                    let _this = this
                    let _args = arguments
                    let now = new Date()
                    if(last && now < last + delay){
                      clearTimeout(deferTimer)
                      deferTimer = setTimeout(function() {
                        last = now
                        func.apply(_this,_args)
                      },delay)
                    }else{
                      last = now
                      func.apply(_this,_args)
                    }
                  }
                }
              ```
        3. 防抖是某一时间段内只执行一次，节流是间隔时间执行
        4. 防抖： 搜索 window触发resize 节流： 鼠标不断点击触发 监听滚轮事件
18.  输入url发生过程 https://zhuanlan.zhihu.com/p/43369093
     1.   进程是cpu资源分配的最小单位，线程是cpu调度的最小单位，一个进程可以有多个线程，单线程和多线程都是指在一个进程内的单和多
     2.   浏览器是多进程的，打开一个网页相当于新起了一个独立的浏览器进程，浏览器内核（浏览器渲染进程）属于浏览器多进程的一种
     3.   浏览器的主要进程 Browser进程 第三方插件进程 GPU进程 浏览器渲染进程（浏览器内核）
     4.   Browser进程 浏览器的主进程（负责协调，主控），只有一个
      ```
         负责浏览器界面显示，与用户交互如前进后退等
         负责各个页面的管理，创建和销毁其他进程
         将renderer进程得到的内存中的Bitmap绘制到用户界面上
         网络资源的管理下载
      ```  
      5. 第三方插件进程
         1. 每种类型的插件对应一个进程，仅当使用该插件时才创建
      6. GPU进程 最多一个用于3D绘制
      7. 浏览器渲染进程（浏览器内核）
         1. renderer进程内部是多线程的
         2. 页面渲染 脚本执行事件处理等
      8. 浏览器渲染进程
         1. GUI渲染线程
            1. 负责渲染浏览器界面，解析html，css构成dom树
            2. 当界面需要重绘或由于某种操作引发回流时候都会调用该线程
            3. GUI渲染线程和js引擎线程是互斥的，因为js可以操作DOM元素，从而影响到GUI的渲染结果，当js引擎执行时，GUI渲染线程会被挂起，GUI渲染更新会被保存在一个队列等待js引擎线程空闲的时候继续执行
         2. js引擎线程
            1. 单线程工作，负责解析js脚本
            2. 一直等待任务队列中的任务到来加以处理
            3. 与GUI渲染进程互斥，js执行时间过长会造成页面阻塞
         3. 事件触发线程
            1. 由于JS引擎这个单线程的家伙自己都忙不过来，所以需要浏览器另开一个线程协助它
            待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）
         4. 定时器触发线程
            1. setInterval与setTimeout所在线程
            JS引擎阻塞状态下计时不准确，所以由浏览器另开线程单独计时
            计时完毕后，添加到事件队列中，等待JS引擎空闲后执行
            W3C规定，setTimeout中低于4ms的时间间隔算为4ms
         5. http请求线程
            1. 如果请求有回调事件，异步线程就产生状态变更事件，将这个回调再放入事件队列中，等JS引擎空闲后执行
      9. js阻塞页面
         1.  js执行时间过长，GUI渲染线程挂起，会出现阻塞
         2.  优化
             1.  js代码放在页面底部，减少js加载对GUIGUI渲染工作的影响
             2.  避免回流（影响布局和大小的css样式），减少重绘
             3.  使用requestAnimationFrame来实现动画视觉优化，setTimeout和setInterval的回调在帧的某个时间点运行，如果刚好在末尾，可能会引发丢帧卡帧
     10. css加载会阻塞页面吗
         1.  css是单独的网络请求线程下载的
         2.  css下载不会阻塞DOM树解析（DOMcontentLoaded），但是会阻塞render树渲染
     11. 普通图层和复合图层
        普通文档流都在一个复合图层内，绝对布局absolute/fixed也不例外，依然在这个普通图层中

      可以通过硬件加速的方式来声明新的复合图层，新的复合图层不会影响默认图层内的回流重绘

         * translate3d、translateZ
     * opacity属性/过渡动画（动画执行过程中才会生成复合图层，其他状态依然在默认图层中）
     * will-chang属性
    GPU会单独分配资源，单独绘制各个复合图层，互不影响
    absolute和硬件加速的区别
    absolute脱离了普通文档流，但没有脱离默认复合图层
    absolute中的信息变化不会影响render树，但依然会影响最终的默认复合图层的绘制，会引起重绘，所以也会消耗资源（对本页面的渲染消耗）

    而硬件加速，则只会影响新的复合图层，改动后可以避免整个页面重绘
      但也不能无节制的使用复合图层，否则也会引起资源消耗过度（对GPU的资源消耗） 

    1. DNS解析
       1. 首先在本地域名服务器中查询ip地址，如果没有则按照如下顺序
       2. 根域名服务器 . -》顶级域名服务器com ->...本地域名服务器.-》com -> google.com -> www.google.com
       3. 优化：DNS缓存
          1. 浏览器缓存 -> 系统缓存 -> 路由器缓存 -> ISP(运营商)DNS缓存 -> 根域名服务器 -> 顶级域名服务器com -> 主域名服务器的顺序
          2. 浏览器缓存可通过在浏览器输入chrome://net-internals/#dns查看
          3. 系统缓存在/etc/hosts文件中（linux系统）
    2. TCP请求（三次握手）+http请求
          1. 客户端：我要请求数据，可以吗
              服务器：可以
              客户端：好的
          2. 客户机与服务器建立连接后就可以通信，浏览器向web服务器发送http请求
    3. 浏览器解析渲染页面
       1. 处理html标记并构建DOM树
       2. 处理css标记并构建cssom树
       3. 将DOM树与CSSOM树合并成一个渲染树
       4. 根据渲染树来布局，以计算每个节点的几何信息
       5. 调用GPU绘制，合成图层，显示在屏幕上
       6. DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载。
      Load 事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕。
    4. 结束连接四次挥手
       1. 客户端：我没要数据要发送了，准备挂了
      服务器：收到，但我还有一些数据没发送完，稍等一哈
      …
      服务端：好了，发送完了，可以断开连接了
      客户端：OK，你断开连接吧（内心独白：我将会在2倍的最大报文段生存时间后关闭连接，如果再收到服务器的消息，那么服务器就是没听到我最后这句话，我就再发送一遍）
19. 浏览器渲染

周六
 1.  es6 
     1.  let和const 不能重复声明，存在块级作用域，没有变量提升
     2.  解构 分解一个对象的解构  let arr = [1,2,3]  let a = arr[0], b= arr[1], c= arr[2] ====> let [a,b,c] = arr // 等号两边结构相似，右边必须是一个真实的值
        let arr2 = [{name: 'hh', age:9},[1,2], 3]
        let [{name, age}, [d,e],f] = arr2

        let obj = {name: 'hh', age: 8}
        let {name: myName, age:myAge} = obj ====> myName: 'hh' myAge: 8
        let obj2 = {name: 'yy'}
        let {name,age = 8} = obj2 // age设置了默认值 如果没有值用默认值

        let arr4 = [1,2,3] let [,,r] = arr4 //省略赋值

     3.  模版字符串
        ```
          var desc = '${name}今年${age}岁了'
          function replaceStr(desc) {
            return desc.replace(/\$\{([^}]+)\}/g, function(matched,key) {
              return eval(key)
            })
          }
        ```
        let str = desc'${name}今年${age}岁了'
        带标签的模版字符串就像一个函数调用 1参数是文本的数组 其他参数是值
        有些时候需要自己的模版字符串拼接逻辑
    4. 其他运算符 ... 只能作最后一个参数
       ```
        function desc(strings, ...values) {

        }
       ```
        
    5. 字符串方法 startWith endWith inludes一个字符串包含另一个字符串 repeat重复字符
    6. 函数 
       1. 默认参数 function ajax(url=new Error('url不能为空',method = 'GET',dataType="json")) {}
       2. 剩余
        ```
          function sum(prefix,...rest){
            // rest = [1,2,3,4]
            // 1.循环
            let result = 0
            rest.forEach(item => {
              result += item
            })
            // 2. reduce 把一个数组中的一堆值 计算成一个值
            // 当前值 每一项 索引 原始数组
            // 上一次的执行结果会成为下一次的初始值
            let result = rest.reduce(function(val, item, index, origin) {
              return val + item
            },0) // 0初始值 如果没有给初始值 则初始值为第一个元素的值 item从第二个元素开始
            return prefix + result
          }
          sum('$', 1,2,3,4)
        ```

        ```
          Array.prototype.reduce = function(reducer,initial) {
            for(let i = 0; i < this.length; i++){
              initial = reducer(initial, this[i])
            } 
            return initial
          }
        ```
        3. 展开运算符 相当于把数组中的每个元素 依次取出放在这
          ```
            let arr1 = [1,2,3]
            let arr2 = [4,5.6]
            let arr3 = [].concat(arr1, arr2)
            let arr3 = [...arr1, ...arr2]
            

            let max = Math.max.apply(Math, arr1) // 3
            let max = Math.max(...arr1) // 3

          ```
          ```
          // 对象解构
          let obj1 = {name:'hh'}
          let obj2 = {age: 3}
          obj3 = {...obj1, ...obj2}

          obj3 = Object.assign(obj3, obj1, obj2)

          ```
          ```
          // 深拷贝
          let obj5 = {name: 'hh', address: {city: 'bj'}}
          let obj6 = JSON.parse(JSON.stringify(obj5))


          function deepClone(origin) {
            let newObj = {}
            if(origin === null) return null
            if(typeOf origin !== Object) return obj
            if(origin instanceOf Function) return new Function(origin)
            for(let key in origin) {
              if(origin.hasOwnProperty(key)) {
                newObj[key] = deepClone(origin[key])
              }
            }
            return newObj

          }
          ```
        4. 箭头函数
           如果只有一个参数可以省略小括号
           如果只有返回值，没有函数体代码可以省略{}

           箭头函数没有自己的this，定义的时候定死了，它会使用上层的this
        5. 数组方法
           1. form Array.form(arguments).forEach() // 类数组转数组
           2. Array.of(3) => [3]
           3. Array[3] => // 长度为3的空数组
           4. some某个item符合返回true
           5. every所有元素符合返回true
    7. 对象
       1. 如果对象属性名和变量名一样可以二合一
          ```
            let name = 'hh'
            let age = 9
            let obj = {name:name,age:age}
            let obj = {name,age}
          ```
        2. Object.setProtoTypeOf(obj3, obj1)  等同于obj3.__proto__ = obj1 // 设置obj3的原型为obj1
        3. super 调用父亲的方法
           ```

           ```
    8. 类 必须通过new调用
      ```
        class Parent() {
          // 构造函数 创建一个类的实例的时候会调用构造函数
          // 私有属性
          constructor(name) {
            this.name = name
          }
          // 静态属性是类的属性
          static hello() {
            console.log('hello')
          }
          // 公有属性相当于原型链上的属性
          getName() {
            console.log(this.name)
          }
        }
        class Child extends Parent{
          constructor(name,age){
            // super表示父类的构造函数
            super(name)
            this.age = age
          }
          getAge() {
            console.log(this.age)
          }
        }
      ```
      ```
      Object.create实现
      function create(prototype){
        function Fn() {}
        Fn.prototype = prototype
        return new Fn
      }
      ```
    9. 生成器generator与迭代器interator
       1.  理解koa基础另外也是现代异步解决方案async await的基础
       2.  生成器函数和普通函数不一样
           1.  加星号 
           2.  执行的时候不一样 可以暂停yield
       3. 生成器函数 实际上内部生成了许多小函数
           ```
            function *read(books) {
              for(let i = 0; i < books.length; i++){
                yield books[i]
              }
            }
            let it = read(['js', 'node'])
            let r1 = it.next()// {value: 'js', done: false} value yield之后的值
            let r2 = it.next() // {value: 'node', done: false}
            let r3 = it.next() // {value: undefined, done: true}
           ```  
        4. set不能有重复内容 类似数组
        5. map
 2.  promise 是一个类，可以创建实例 三种状态pending初始态 fullfilled rejected
      ```
        let p = new Promise(function(resolve,reject) {
          setTimeout(function() {
            let num = Math.random()
            if(num > 0.5) resolve('大')
            reject('小')
          },2000)
        })
        p.then(function(value){
          console.log(value)
        }, function(reason) {
          console.log(reason)
        })
      ```
 3.  ts 五一之前
 4.  设计模式
 5.  事件
 6.  垃圾回收

周日
1.   优化 webpack http vue优化 1
2.   MVVM  //
3.   vue//
4.   ts
5.   ng
6.   小程序
7.   git
8.   vue ssr 
9.   算法



1. 周二 es6整理 异步整理 回顾 ts开始看文档
2. 周三 ts整理面试 webpack视频学习
____________________________________


3. 周四 webpack学习 vue面试视频 ssr
4. 周五 复习 简历准备 面试视频
5. 周六复习 react 小程序 算法 
6. 周日 react 小程序 算法 