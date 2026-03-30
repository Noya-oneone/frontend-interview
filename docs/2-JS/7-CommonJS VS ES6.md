# 前端模块化

* `为什么需要模块化？`： 页面越复杂，开发人员越多，代码越多
    1、首先防止全局代码逻辑混乱，需要根据业务逻辑划分模块；
    2、其次是不同开发人员负责不同的模块，防止命名冲突或者是自己的声明的变量方法被别人误改，需要根据人员划分模块；
* `模块化定义`： 模块化就是对js代码的划分，可以把一个js文件相当于一个模块，文件之间相互引用，就是模块的相互引用。
* `模块化历史`：JavaScript 一直没有模块（module）体系，只用一个文件来写程序代码，对于开发维护大型的、复杂的项目是极不友好的。后来，在社区相继推出了 commonJS、AMD、CMD、UMD、ES module 等模块。


## 执行JS - JavaScript 引擎

### Node 环境 （Common JS） 

* node环境下，Esmodule和commonjs规范下的代码不能互相混用
* ES module在node环境下也能执行，需要wepack打包工具打包文件，将代码转换成node可执行的代码！

CommonJS模块在第一次加载时会被缓存，后续加载同一个模块时会返回缓存的版本。这有助于提高性能，但也意味着模块的初始化代码只会执行一次。
CommonJS模块支持循环依赖，但需要注意的是，循环依赖可能会导致模块加载顺序和结果不确定


### 浏览器环境 (Commonjs 和 ES module) 

* AMD 和 CMD 都不能在浏览器环境中执行

## 2009 CommonJS 主要应用场景是服务器端、同步加载模块 require(自定义模块/系统模块/第三方库模块);

* 在服务器端模块文件都存放在本地磁盘，读取非常快
* 但是，在浏览器端，要从服务器端加载模块，若采用同步加载方式会导致性能、体验等问题
* 无法直接在浏览器中运行，需通过如`Browserify`的工具转换；
* 同步加载可能导致性能问题，特别是处理大型、复杂的依赖树时。
* Node.js 提供了一些核心模块，如 `fs、http、path、os、process `

```javascript
    // math.js文件：自定义方法
    function add(a, b) {
    return a + b;
    }
    module.exports = {
    add: add,
    };

    // index.js文件：引用自定义的模块
    var math = require("./math");
    math.add(1, 2);
```

## 2011 AMD（Asynchronous Module Definition） 主要应用场景是浏览器端，异步加载模块  require.js

* 与 CommonJS 最大的不同在于，AMD 采用异步方式加载模块，模块的加载不影响它后面语句的运行。
* 所有依赖某些模块的语句均放置在回调函数中

```javascript
    // 导入模块
    require(["module1", "module2"], function (module1, module2) {
    //使用导入的模块
    });

    // 定义模块
    define(["dependency"], function (dependency) {
    return moduleName;
    });
```

## 2012 CMD （Common Module Definition） 依赖就近，延迟执行  sea.js

* CMD 相比 AMD 使用的是`依赖就近，延迟执行`等特性，写代码的时候`哪里使用哪里再引入模块`。
* 知名的库有 sea.js （CMD规范和AMD规范类似，非官方标准，需要运行在如`Sea.js`之类的运行库上。）

```javascript

    // 定义导出模块 math.js
    define(function (require, exports, module) {
    var $ = require("jquery.js");
    var add = function (a, b) {
        return a + b;
    };
    exports.add = add;
    });
    // 在需要使用的地方就近导入模块
    seajs.use(["math.js"], function (math) {
    var sum = math.add(1 + 2);
    });
```


## 2013 UMD

* UMD 主要是解决`跨平台模块化方案`的问题，它合并了 CommonJS 和 AMD 规范，能够兼容各种情况的环境，同时运行在``客户端和服务器端`，因此被称为是`通用的模块定义`
* 当使用 Rollup/Webpack 之类的打包器时，UMD 通常用作`备用模块`

```javascript
    (function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["dependency"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("dependency"));
    } else {
        root.returnExports = factory(root.dependency);
    }
    })(this, function (dependency) {
    return {}; //返回值即为定义的模块
    });
```


## 2015 ES6 Module

* ES6 或更高版本在`语言标准层面上`实现了模块功能
* 解决了 JavaScript 文件`无法使用import, export命令`
* 在语法层面上对模块进行了支持，标准化产品，使得 JavaScript 模块化具备了规范性
* 可以`直接运行在现代浏览器中，也可以作为服务器端模块使用`
* 由于ES module的设计思想是尽量的静态化，使得代码可以`静态分析和tree shaking等优化`，是目前最好的模块化方案
* ES Module 到 CommonJS：Webpack 默认将 ES Module 转换成 CommonJS 格式。
* 这是因为 `Webpack 的内部机制使用 CommonJS 来管理模块依赖和运行时加载`

ES模块的文件扩展名通常是 `.js 或 .mjs`，其中 .mjs 明确表示该文件是一个ES模块。
在Node.js中，你需要在` package.json 中设置 "type": "module" 来启用ES模块支持。`

```javascript
// 导出模块
export default SomeObject;
// 导入模块
import moduleName from "./module";
```

## CommonJS VS ES6 Module

* UMD： 通用模块定义，兼容 AMD 和 CommonJS 规范，并且还能在没有模块加载器的环境中使用（如直接在浏览器中使用全局变量）。
* CommonJS ： 是**同步加载**模块，适合在**服务器**端使用 ```const module = require('module')``` ```module.exports = module;``` this 的值是 exports 对象

* ES6 Module： ES6 模块是**异步加载**，适合在**浏览器端**使用  ```import module from 'module';```  ```export default module;``` 在 ES6 模块中，this 的值是 undefined。


| 特性        | `require` (CommonJS)| `import` (ES6 Modules) |
|---|--|-|
| **语法** | `const module = require('module');`    | `import module from 'module';`  |
| **加载方式**  | 同步，动态加载    | 静态，支持异步动态加载（`import()`）|
| **模块系统**  | Node.js 专用，使用 `module.exports` 和 `exports` | 标准化模块系统，支持 `export` 和 `import` |
| **动态加载**  | 支持动态加载模块  | 静态导入，使用 `import()` 实现动态加载   |
| **兼容性**    | Node.js 和部分前端工具（如 Webpack）   | 现代浏览器和 Node.js（从 v12 开始）  |
| **使用场景**  | 服务器端开发和同步模块加载  | 现代前端开发和模块优化|

    * CommonJS: this 的值是 exports 对象
    * ES6 模块中: this 的值是 undefined