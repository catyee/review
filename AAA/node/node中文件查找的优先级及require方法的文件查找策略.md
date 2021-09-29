# node中文件查找的优先级以及require方法的文件查找策略
## 模块规范
- node中每个js文件都是一个单独的模块
- 模块中包括commonjs规范的核心变量：exports、module.exports、require
- 通过上述变量进行模块化开发
模块化的核心是导出与导入，module.exports和exports导出，require导入

## 查找策略
require方法接收以下几种参数的传递：
- 原生模块 http，fs，path
- 相对路径的文件模块 ./mod 或 ../mod
- 目录作为模块 ./dirname
- 非原生模块的文件模块：mod

require参数简单，但是内部的加载十分复杂：

首先require
检查是否在文件模块缓存区，如果在则返回exports

如果不在

检查是否为原生模块

如果是原生模块，检查是否在原生模块缓存区，如果在则返回exports，如果不在加载并缓存原生模块，然后返回exports

如果不是原生模块，查找文件模块，根据扩展名载入文件模块，缓存文件模块，返回exports


### 原生模块
优先加载

### 绝对路径、相对路径
require绝对路径，则直接查找对应的路径，速度最快

相对路径则相对于当前require的文件去查找
如果按照确切的文件名没有找到，尝试带上.js,.json或.node的扩展名再加载


### 目录作为模块
{ "name" : "some-library",
  "main" : "main.js" }

默认情况是根据根目录中的package.json文件的main来指定目录模块

如果这是在./some-library node_modules目录中，则 require('./some-library') 会试图加载 ./some-library/main.js

如果目录里没有 package.json文件，或者 main入口不存在或无法解析，则会试图加载目录下的 index.js 或 index.node 文件


### 非原生模块
在每个文件中都存在module.paths，表示模块的搜索路径，require就是根据其来寻找文件




如果在/home/ry/projects/foo.js文件里调用了 require('bar.js')，则 Node.js 会按以下顺序查找：

/home/ry/projects/node_modules/bar.js
/home/ry/node_modules/bar.js
/home/node_modules/bar.js
/node_modules/bar.js
这使得程序本地化它们的依赖，避免它们产生冲突


### 总结
- 缓存的模块优先级最高
- 如果是内置模块，则直接返回，优先级仅次于缓存模块
- 如果是绝对路径/ 开头，从根目录找
- 如果是相对路径./开头，相对当前require（）文件找
- 如果文件没有后缀，从.js,.json,.node按顺序查找
- 如果是目录，根据package.json main.js属性值决定目录下的入口文件，默认情况index.js
- 如果文件是第三方模块，则会引入node_modules文件，如果不在当前仓库文件中，则自动从上级递归查找，直到根目录
