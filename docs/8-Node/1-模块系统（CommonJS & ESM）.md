# 模块系统（CommonJS & ESM）

## 核心概念

Node 同时支持两套模块系统：**CommonJS（CJS）** 是 Node 早期自研的规范，**ES Modules（ESM）** 是 ECMAScript 标准。两者最本质的区别是 **CJS 运行时同步加载、导出值的拷贝；ESM 编译期静态分析、导出值的动态引用**。

这个区别直接决定了 **Tree Shaking 能否生效**——这也是前端面试真正关心它的原因。

> 关于两者的语法差异与循环依赖表现，JS 分类下的 [CommonJS VS ES6](../2-JS/7-CommonJS%20VS%20ES6.md) 已有覆盖，本文侧重 **Node 侧的加载机制与实际配置**。

## 详解

### 1. 模块解析：Node 怎么找到一个包

`require('lodash')` 时，Node 从当前目录开始逐级向上查找 `node_modules`：

```
/app/src/node_modules/lodash
/app/node_modules/lodash      ← 通常命中这里
/node_modules/lodash
```

找到目录后，按 `package.json` 的 `exports` → `main` → `index.js` 顺序确定入口文件。

### 2. `exports` 字段：条件导出

现代包用 `exports` 同时提供 CJS 和 ESM 两份产物，并**封闭内部路径**（外部无法再 `require('pkg/src/internal.js')`）：

```json
{
  "name": "my-lib",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": "./dist/utils.mjs"
  }
}
```

> **顺序敏感**：`types` 必须排在最前，`require`/`import` 之后才是 `default`。条件是**从上到下第一个匹配即用**。

### 3. 文件扩展名与 `type` 字段

| `package.json` 的 `type` | `.js` 被视为 | `.mjs` | `.cjs` |
|---|---|---|---|
| 缺省 或 `"commonjs"` | CommonJS | ESM | CommonJS |
| `"module"` | **ESM** | ESM | CommonJS |

### 4. 互操作的坑

```js
// ESM 中引入 CJS：可以，但只能拿默认导出
import pkg from 'cjs-lib';
const { helper } = pkg;        // 具名导入常常失败

// CJS 中引入 ESM：不能用 require，只能动态 import
const mod = await import('esm-lib');
```

ESM 里没有 `__dirname` / `__filename`，需要自己构造：

```js
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

> Node 20.11+ 起可直接用 `import.meta.dirname` 和 `import.meta.filename`。

### 5. 为什么 ESM 能 Tree Shaking

CJS 的 `require` 可以出现在任意位置、路径可以是变量，**打包器无法在编译期静态确定依赖**：

```js
const name = condition ? 'a' : 'b';
const mod = require(`./${name}`);   // 静态分析放弃
```

ESM 的 `import` 必须在顶层、路径必须是字符串字面量，所以打包器能在**不执行代码**的前提下画出依赖图，删掉未被引用的导出。

## 常见考点

- 问题 1：CJS 和 ESM 最本质的区别？→ **同步运行时加载 + 值拷贝** vs **静态编译期分析 + 动态绑定**
- 问题 2：为什么 ESM 支持 Tree Shaking 而 CJS 不行？→ 静态可分析性
- 问题 3：ESM 里怎么拿 `__dirname`？→ `import.meta.url` 转换，或 Node 20.11+ 的 `import.meta.dirname`
- 问题 4：`exports` 和 `main` 什么关系？→ `exports` 优先级更高，且会**封闭**未声明的子路径
- 问题 5：CJS 能 `require` 一个 ESM 包吗？→ 不能，需 `await import()`

## 代码示例

同一个包同时产出双格式，并让类型正确解析：

```ts
// src/index.ts
export interface FetchOptions {
  timeout?: number;
}

export async function fetchWithTimeout(
  url: string,
  { timeout = 5000 }: FetchOptions = {},
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (err) {
    // 区分超时与网络错误，给调用方明确信息
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`请求超时（${timeout}ms）：${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timer); // 无论成功失败都要清，否则进程无法退出
  }
}
```

## 拓展阅读

- [Node.js 官方 — Modules: Packages](https://nodejs.org/api/packages.html)
- [Node.js 官方 — Determining module system](https://nodejs.org/api/packages.html#determining-module-system)
- [webpack — Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
