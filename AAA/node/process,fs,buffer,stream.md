# 3. process是什么
process对象是一个全局变量，提供了有关当前nodejs进程的信息并对其进行控制

我们都知道，进程是计算机系统进行资源分配和调度的最小单位，是操作系统结构的基础，是线程的容器
当我们启用一个js文件，实际上就是开启了一个服务进程，每个进程都拥有自己的独立空间地址，数据栈，另一个进程无法访问当前进程的变量、数据结构，只有数据通信后，进程之间才可以数据共享

由于js执行是单线程语言的，所以通过node xxx启动一个文件后，只有一条主线程

## 属性与方法
- process.env：环境变量，例如通过process.env.NODE_ENV获取不同环境项目配置信息
- process.nextTick：这个在谈及 EventLoop 时经常为会提到
- process.pid：获取当前进程id
- process.ppid：当前进程对应的父进程
- process.cwd()：获取当前进程工作目录，
- process.platform：获取当前进程运行的操作系统平台
- process.uptime()：当前进程已运行时间，例如：pm2 守护进程的 uptime 值
- 进程事件： process.on(‘uncaughtException’,cb) 捕获异常信息、 process.on(‘exit’,cb）进程推出监听
- 三个标准流： process.stdout 标准输出、 process.stdin 标准输入、 process.stderr 标准错误输出
- process.title 指定进程名称，有的时候需要给进程指定一个名称



# 4. fs模块的理解？有哪些常用的方法？

## 是什么？
提供本地文件的读写能力，对所有文件系统操作，提供异步和同步方式

## 文件知识
- 权限位 mode
- 标识位 flag
- 文件描述fd


## 方法
- 文件读取
// 同步读取
fs.readFileSync(路径或文件描述符，options{
    encoding(编码)，
    flag(标识位，默认为r)
})

// 异步读取
fs.readFile("1.txt", "utf8", (err, data) => {
   if(!err){
       console.log(data); // Hello
   }
});

- 文件写入


//同步写入：
writeFileSync
const fs = require("fs");

fs.writeFileSync("2.txt", "Hello world");
let data = fs.readFileSync("2.txt", "utf8");


// 异步写入
const fs = require("fs");

fs.writeFile("2.txt", "Hello world", err => {
    if (!err) {
        fs.readFile("2.txt", "utf8", (err, data) => {
            console.log(data); // Hello world
        });
    }
});

- 文件追加写入
const fs = require("fs");

fs.appendFileSync("3.txt", " world");
let data = fs.readFileSync("3.txt", "utf8");


const fs = require("fs");

fs.appendFile("3.txt", " world", err => {
    if (!err) {
        fs.readFile("3.txt", "utf8", (err, data) => {
            console.log(data); // Hello world
        });
    }
});


- 文件拷贝

const fs = require("fs");

fs.copyFileSync("3.txt", "4.txt");
let data = fs.readFileSync("4.txt", "utf8");

console.log(data); // Hello world


const fs = require("fs");

fs.copyFile("3.txt", "4.txt", () => {
    fs.readFile("4.txt", "utf8", (err, data) => {
        console.log(data); // Hello world
    });
});

- 创建目录

// 假设已经有了 a 文件夹和 a 下的 b 文件夹
fs.mkdirSync("a/b/c")

fs.mkdir("a/b/c", err => {
    if (!err) console.log("创建成功");
});



# 5. buffer
在node中，需要处理网络协议、操作数据库，处理图片，接收上传文件等，在网络流和文件的操作中要处理大量二进制数据，而buffer就是在内存中开辟一块预取（初次初始化为8kb）用来存放二进制数据
const buffer = Buffer.from("why")


## 使用方法
buffer在全局作用域中，无需require导入
Buffer.from()

Buffer.alloc()

## 应用场景
- I/O操作
- 加密解密
- zlib.js


# 6.stream

## 是什么
stream是一种数据传输手段，是端到端信息交互的一种方式，而且是有顺序的，是逐块读取数据、处理内容，用于顺序读取或写入输出

## 应用场景
- get请求返回文件给客户端
- 文件操作
- 一些打包工具的底层操作