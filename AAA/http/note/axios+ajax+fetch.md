# 1. fetch axios ajax的对比

## ajax 兼容ie6+
### ajax 核心是XMLHttpRequest API
var xhr = new XMLHttpRequest()
xhr.open('GET', 'test1.txt', true)
xhr.send()
xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
        return xhr.responseText
    }
}

### XMLHttpRequest 实例 对象方法
- abort()      取消当前请求
- getAllResponseHeaders()  获取所有的响应头信息
- getResponseHeader()  获取特定的响应头
- open(method,url,async,user,psw)   请求方法，文件位置，是否异步，可选的用户名称，可选的密码
- send() 发送get请求到服务器
- send(string) 发送post请求到服务器
- timeout 超时时间
var xhr = new XMLHttpRequest();
xhr.open('GET', '/server', true);

xhr.timeout = 2000; // 超时时间，单位是毫秒

xhr.onload = function () {
  // 请求完成。在此进行处理。
};

xhr.ontimeout = function (e) {
  // XMLHttpRequest 超时。在此做某事。
};

xhr.send(null);


### XMLHttpRequest 实例对象属性
- onreadystatechange 定义当readyState属性变化时被调用的函数
- readyState 保存XMLHttpRequest 的状态 0：请求未初始化  1：服务器连接已建立 2：请求已收到  3：正在处理请求  4：请求已完成且响应已就绪

- responseText 以字符串形式返回响应数据

- responseXML 以XML数据返回响应数据
- status 返回请求的状态码 200 ok  。。。
- statusText 返回状态文本 如OK,Not Found



## fetch 提供了一个全局fetch()方法 提供了一种简单，合理的方式来跨网络异步获取资源

**天生支持Promise**

 当收到一个代表错误的http状态码时，从fetch返回的promise不会标记为reject，即使响应的http状态码为404或500。其Promise状态标记为resolve（但是会将resolve的返回值的ok属性设置为false），仅当网络故障或请求被阻止时，才会标记为reject

### fetch的request属性
url                            第一个参数，必填，代表fetch对象的网址
method                         请求方法，默认GET
headers                        设置相关的Headers内容
mode                           cors no-cors same-origin navigate
referrer                       no-referrer、client 或某个网址( 默认client )
credentials                    omit same-origin include (默认omit)
redirect                       follow、error、manual ( 默认manual )
cache                          default、no-store、reload、no-cache、force-cache ( 默认default )



### fetch的response属性
headers                       包括response相关的headers内容
ok                            是否成功
status                        状态码
statusText                    状态信息
type                          response的类型
url                           response的url


### fetch的response方法
json()                       返回Promise，resolves是JSON对象
text()                       返回Promise，resolves是text string
blob()                       返回Promise，resolve是blob
arrayBuffer()                返回Promise，resolve是ArrayBuffer
formData()                   返回Promise，resolve是formData(表单对应的key或value)
clone()                      创建一个Response对象的克隆
error()                      返回一个Response的错误内容


## axios
### axios特点
1. 可以用在浏览器端和node端
 浏览器端本质：XMLHttpRequest
 node端 node的http模块

2. 支持Promise
3. 可以拦截请求和响应  https://blog.csdn.net/weixin_40970987/article/details/106972539
在请求执行之前执行请求拦截器函数，在请求执行之后执行响应拦截器函数
4. 可以取消  cancelToken 
// 引用CancelToken


const CancelToken = axios.CancelToken;
// 调用CancelToken.source得到一个source实例，此实例包含token和cancel两个属性
const source = CancelToken.source();
// 请求接口时附带cancelToken:source.token,get与post有所区别，具体查看官方文档
axios.get('api/request', { cancelToken: source.token })
  .catch(function (thrown) {
    if (axios.isCancel(thrown)) {
      alert(`Request canceled.${thrown.message}`);
    }
  });
// 通过source.cancel取消请求
source.cancel('Operation canceled by the user.');




axios内部创建一个名为token的Promise，和一个改变Promise状态的方法cancel，当需要取消一个请求时，就把这个Promise与请求绑定在一起，然后通过cancel改变请求上的Promise状态，从而达到取消请求的目的


或

const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
});

// 取消请求
cancel();

5. 自动转换json数据 默认返回json responseType


6. 客户端支持防止CSRF(跨站请求伪造)/XSRF（跨站脚本攻击）

CSRF:
- 用户登录网站A
- 验证通过，产生A的cookie
- 用户没有退出A，访问了危险网站B
- B要求访问网站A，发出一个请求
- 根据B的请求，接收攻击代码，不知情的情况下携带A的cookie访问A

预防：验证http Referer http请求的来源


XSS攻击：
注入恶意脚本在浏览器运行



### 为什么axios既可以当函数调用,也可以当对象使用
axios本质是函数,赋值了一些别名方法,比如get、post方法,可被调用
对象调用是因为获取的是Axios类的实例
最终调用的还是Axios.prototype.request函数。


### axios的取消请求功能是怎么实现的？
config配置cancelToken
在promise链式调用的dispatchRequest抛出错误
在adapter中request.abort()取消请求
使promise走向rejected
用户捕获错误信息



## fetch和XMLHttpRequest
XMLHttpRequest自带超时

### fetch实现超时：
核心就是使用Promise.race()方法, 将Fetch和用Promise包裹的定时器放在数组里传入, 先触发resolve的将触发Promise.race()的resolve

    this.newFetch = (url: string, opts: object): Promise<any> => {
      const fetchPromise: Promise<any> = this.originFetch(url, opts);
      const timeoutPromise: Promise<any> = new Promise(function (resolve, reject) {
        setTimeout(() => {
          reject(new Error(`Fetch Timeout ${timeout}`));
        }, timeout);
      })
      return Promise.race([fetchPromise, timeoutPromise]);
    }


### 拦截器实现
拦截器也是使用Promise实现, 将请求相关拦截器, Fetch请求, 响应相关拦截器堆叠起来, 实现拦截处理



### 取消fetch
AbortController实例

const controller = new AbortController()
const signal = controller.signal

// API 5s 后返回相应
// https://slowmo.glitch.me/5000 5000 代表 5s 后返回相应值

fetch('https://slowmo.glitch.me/5000', { signal })
    .then(r => r.json())
    .then(response => console.log(response))
    .catch(err => {
        if (err.name === 'AbortError') {
        console.log('Fetch was aborted')
    } else {
        console.log('Error', err)
    }
    })

// 在 2s 后中断请求，将触发 'AbortError'
setTimeout(() => controller.abort(), 2000)