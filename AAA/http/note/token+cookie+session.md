http是无状态的，请求和响应方都无法维护状态，但是很多情况下是需要维护状态的，比如登录

解决：
# 前端存储
前端存储到cookie或localStorage里，每次请求的时候拼接到参数里，发送给接口

# cookie
前端无感知，接口通过http返回头的Set-Cookie字段，直接写入到浏览器cookie，浏览器发起请求时，会自动把cookie通过http请求头的cookie字段，带给接口


# 服务端session
- 浏览器端发送账号密码，服务端查询用户库，校验
- 服务端把用户状态存为session，生成一个sessionId
- 通过登录接口返回，把sessionId set到cookie上
- 此后浏览器再请求，sessionId随cookie带上
- 服务端查sesssionId校验session
- 校验成功返回

服务端需要存储sessionId
存在问题：

如果存在负载均衡，可能访问的服务器没有存储session
解决方式：
集中存储，但是存储服务器宕机后有风险


# token
令牌，是用户身份的验证方式。
最简单的token组成:uid(用户唯一的身份标识)、time（当前时间的时间戳）、sign（签名）。

- 用户登录，服务端校验账号密码，获得用户信息
- 将用户信息，token配置，编码成token，通过cookie set到浏览器
- 此后用户请求接口，通过cookie携带token
- 接口校验token的有效性，进行正常业务接口处理

token可以存储在cookie里发送，也可以请求返回，前端放在header里发送

# JSWT JSON Web Token
是一个开放标准，定义了一种传递json信息的方式，这些信息通过数字签名确保可信

是一种成熟的token字符串生成方案


# 单点登录
## 虚假的单点登录
同一个主域名下，比如wenku.baidu.com tieba.baidu.com，就好办了。可以直接把 cookie domain 设置为主域名 baidu.com，百度也就是这么干的。

## 真实的单点登录
比如滴滴这么潮的公司，同时拥有didichuxing.com xiaojukeji.com didiglobal.com等域名，种 cookie 是完全绕不开的。

这要能实现「一次登录，全线通用」，才是真正的单点登录。

这种场景下，我们需要独立的认证服务，通常被称为 SSO。

- 用户进入A系统，没有登录凭证ticket，A系统给它跳到SSO
- SSO没有登录过，也就是SSO系统下没有凭证（这个凭证和A ticket是两回事），输入账号密码登录
- SSO账号密码验证成功，通过接口返回做两件事：一个是种下SSO系统下凭证（记录用户SSO登录状态），二是下发一个ticket
- 客户端拿到ticket，保存起来，带着请求系统A接口
- 系统A校验ticket，成功后正常处理
- 用户第一次进入B系统，没有登录凭证ticket，B系统跳到SSO
- SSO登录过，系统有凭证，不用再次登录，只需要下发ticket
- 客户端拿到ticket，保存起来，带着请求系统B接口


上面的过程在APP上足够了，但是在浏览器端会有问题

浏览器端，SSO域下返回的数据怎么存，才能在访问A的时候带上，浏览器对跨域有严格显示，cookie，localStorage等方式都有跨域限制

这就需要也只能由A提供A域下存储凭证的能力

- 在SSO域下，SSO不是通过接口把ticket直接返回，而是通过一个带code的url重定向到A的接口上，这个接口通常在A向SSO注册时约定
- 浏览器被重定向到A下，带着code访问了A的callback接口，callback接口通过code换取ticket
- 这个code不同于ticket，code是一次性的，暴露在url中，只为了传一下换ticket，换完就失效。
- callback接口拿到ticket后，在自己的域下set cookie成功
- 在后续的请求中，只需要把cookie中的ticket解析出来去SSO验证即可。