# 前端模块化

* `为什么需要模块化？`： 页面越复杂，开发人员越多，代码越多
    1、首先防止全局代码逻辑混乱，需要根据业务逻辑划分模块；
    2、其次是不同开发人员负责不同的模块，防止命名冲突或者是自己的声明的变量方法被别人误改，需要根据人员划分模块；
* `模块化定义`： 模块化就是对js代码的划分，可以把一个js文件相当于一个模块，文件之间相互引用，就是模块的相互引用。
* `模块化历史`：JavaScript 一直没有模块（module）体系，只用一个文件来写程序代码，对于开发维护大型的、复杂的项目是极不友好的。后来，在社区相继推出了 commonJS、AMD、CMD、UMD、ES module 等模块。


## 各环境的模块支持

* **Node 环境**：原生 CommonJS；`v12+ 也原生支持 ES Module`（`.mjs` 后缀或 package.json 设 `"type": "module"`），无需打包工具。两者互操作有限制：ESM 可以 `import` CJS，CJS 不能同步 `require` ESM（Node 22 起部分放开）。
  * CommonJS 模块`第一次加载后被缓存`，后续 require 返回缓存版本 —— 初始化代码只执行一次。
  * CommonJS 支持循环依赖，但拿到的是`执行到一半的部分导出`，顺序敏感。
* **浏览器环境**：原生支持 ES Module（`<script type="module">`）；`不支持 CommonJS`（无 require/module 对象）；AMD/CMD 正是`为浏览器设计`的方案，但需要加载器库（require.js / sea.js）配合，如今已被 ESM + 打包器取代。

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

## CommonJS VS ES6 Module（核心对比）

| 特性 | CommonJS | ES Module |
|--|--|--|
| **语法** | `require()` / `module.exports` | `import` / `export` |
| **加载时机** | `运行时`同步加载（require 是普通函数调用，可写在任何位置、条件分支里） | `编译期`静态解析（import 必须在顶层）；动态加载用 `import()` 返回 Promise |
| **导出内容** | `值的拷贝`：导出后模块内部变量再变，外部拿到的还是旧值 | `值的引用（live binding）`：内部更新，导入方实时可见，且导入的绑定只读 |
| **this 指向** | `exports` 对象 | `undefined`（模块自动严格模式） |
| **静态分析** | 不可（依赖运行时） | 可以 → 支撑 `tree-shaking`、循环依赖检查 |
| **环境** | Node 原生；浏览器需打包 | 现代浏览器与 Node 12+ 原生 |

「值拷贝 vs 动态绑定」示例（高频追问）：

```js
// counter 模块
let count = 0;
export const inc = () => count++;
export { count };            // ESM 导出绑定

// 使用方
import { count, inc } from './counter.js';
inc();
console.log(count);          // 1  ESM：实时反映

// CommonJS 同样写法拿到的是 require 时刻的拷贝，仍是 0
```

* UMD：通用模块定义，运行时探测环境，兼容 AMD + CommonJS + 全局变量，常作为库的兜底产物格式。