# 1. http请求头
- Accept指定客户端能够接受的内容类型 如：text/plain application/json
- Accept-charset 浏览器可以接受的字符编码集
- cache-control 指定请求和响应遵循的缓存机制
- cookie http发送请求时会将保存在该请求域名下的所有cookie值一起发送到服务器
- content-length 请求的内容长度
- content-type 请求的与实体对应的MIME信息，如content-type:application/x-www-form-urlencoded
- if-modified-since协商缓存

## content-type
- 在响应中，告诉客户端实际返回的内容和内容类型
- 在请求中，客户端告诉服务器实际发送的数据类型


- 在get请求的时候，参数会以url string的形式进行传递，即？后的字符串，并用&分割，请求参数为query string Parameters

- post请求会出现两种形式的请求体
1. Form Data       当发起一次post请求，若未指定content-type则默认为application/x-www-form-urlencoded  即参数是以Form Data的形式进行传递

2. Request Payload      当发起一次post请求，若content-type为application/json，则参数会以request payload 的形式进行传递（数据格式为json）


3. 服务器为何对表单提交和服务器上传做特殊处理，因为表单提交是 名：键值对的形式，且content-type为application/x-www-form-urlencoded，数据格式不固定，所以服务器无法知道具体的处理方式们只能通过原始数据流的方式进行解析

因此文件上传需要使用原生的formData()进行数据组装，且content-type为mutipart/formData


## postman body格式的选择
1. form-data 即为 mutipart/formdata 可以上传表单键值对，或者文件
2. x-www-form-urlencoded 即为 application/x-www-form-urlencoded 将表单内的数据转换成键值对，模拟表单上传用此选项，只能上传键值对

3. raw 任意格式的文本，可以上传text，json，xml，html

4. binary 上传二进制数据，通常用来上传文件，没有键值，只能上传一个文件


# 2.POST一般可以发送什么类型的文件，数据处理的问题
json、图片、表单数据，文件，文本，视频，音频，二进制都可以

# 3. websoket是什么及应用场景

## 是什么？
websoket是一种网络传输协议，位于OSI模型的应用层。可在单个TCP连接上进行全双工通信，能更好的节省服务器资源和带宽并达到实时通讯。

客户端和服务端只需要完成一次握手，两者之间就可以创建持久化的连接，并进行双向数据传输

而在websocket出现之前，开发实时web应用的方式为轮询

不停地向服务器发送 HTTP 请求，问有没有数据，有数据的话服务器就用响应报文回应。如果轮询的频率比较高，那么就可以近似地实现“实时通信”的效果

轮询的缺点也很明显，反复发送无效查询请求耗费了大量的带宽和 CPU资源



## 特点
通信允许数据在两个方向上同时传输，它在能力上相当于两个单工通信方式的结合
