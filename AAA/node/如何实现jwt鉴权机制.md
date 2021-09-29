jwt json web token
# 是什么

本质是一个字符串书写规范

作用是用了在用户和服务器之间传递安全可靠的信息

在目前前后端分离的开发过程中，使用token鉴权机制用于身份验证是最常见的方案，流程如下：
- 服务器当验证用户账号和密码正确的时候，给用户颁发一个令牌，这个令牌作为后续用户访问一些接口的凭证
- 后续访问会根据这个令牌判断用户时候有权限进行访问

Token，分成了三部分，头部（Header）、载荷（Payload）、签名（Signature），并以.进行拼接。其中头部和载荷都是以JSON格式存放数据，只是进行了编码

## header
每个JWT都会带有头部信息，这里主要声明使用的算法。声明算法的字段名为alg，同时还有一个typ的字段，默认JWT即可。以下示例中算法为HS256
{  "alg": "HS256",  "typ": "JWT" } 

因为JWT是字符串，所以我们还需要对以上内容进行Base64编码，编码后字符串如下：

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9        

## payload载荷
载荷即消息体，这里会存放实际的内容，也就是Token的数据声明，例如用户的id和name，默认情况下也会携带令牌的签发时间iat，通过还可以设置过期时间，如下：
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
同样进行Base64编码后，字符串如下：

eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ

## Signature
签名是对头部和载荷内容进行签名，一般情况，设置一个secretKey，对前两个的结果进行HMACSHA25算法，公式如下：
Signature = HMACSHA256(base64Url(header)+.+base64Url(payload),secretKey)


一旦前面两部分数据被篡改，只要服务器加密用的密钥没有泄露，得到的签名肯定和之前的签名不一致



# 如何实现
token的使用分成了两部分：
- 生成token：登录成功的时候，颁发token
- 验证token，访问某些资源或接口，验证token

### 生成token
借助第三方库jsonwebtoken，通过jsonwebtoken 的 sign 方法生成一个 token：

# 三、优缺点！！！
优点：

- json具有通用性，所以可以跨语言
- 组成简单，字节占用小，便于传输
- 服务端无需保存会话信息，很容易进行水平扩展
- 一处生成，多处使用，可以在分布式系统中，解决单点登录问题
- 可防护CSRF攻击
缺点：

payload部分仅仅是进行简单编码，所以只能用于存储逻辑必需的非敏感信息
需要保护好加密密钥，一旦泄露后果不堪设想
为避免token被劫持，最好使用https协议
