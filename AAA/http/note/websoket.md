 # http瓶颈
 需要轮询操作的请求，无法获知服务器是否更新


 # websocket
 浏览器和服务器之间的全双工通信标准

 一旦web服务器与客户端之间建立起websocket协议的通信连接，之后所有的通信都将依靠这个专用协议进行。通信过程中可以互相发送json，xml，html，图片等任意格式的数据

 由于是建立在http基础上的协议，因此连接的发起方仍是客户，而一旦建立起连接，服务端和客户端都可以发送报文。

 ## websocket特点
 服务器可以向客户端推送数据
 只要建立起websocket连接，就一直保持连接状态，
 

 为了实现websocket通信，需要用到http的upgrade首部字段，告知服务器通信协议发生改变，以达到握手的目的。

## 协议名
 引入ws和wss分别代表明文和密文的websocket协议，且默认端口使用80或443
 ws://www.chrono.com
ws://www.chrono.com:8080/srv
wss://www.chrono.com:445/im?user_id=xxx


## 优点
- 较少的控制开销：数据包头部协议较小，不同于http每次请求需要携带完整的头部
- 更强的实时性：相对于HTTP请求需要等待客户端发起请求服务端才能响应，延迟明显更少
- 保持创连接状态：创建通信后，可省略状态信息，不同于HTTP每次请求需要携带身份验证
- 更好的二进制支持：定义了二进制帧，更好处理二进制内容
- 支持扩展：用户可以扩展websocket协议、实现部分自定义的子协议
- 更好的压缩效果：Websocket在适当的扩展支持下，可以沿用之前内容的上下文，在传递类似的数据时，可以显著地提高压缩率


## 应用场景
- 弹幕
- 媒体聊天
- 协同编辑
- 基于位置的应用
- 体育实况更新
- 股票基金报价实时更新


## API

var socket = new Websocket("ws://");
socket.onpen = function() {
    socket.send()
}
socket.onmessage = function() {}