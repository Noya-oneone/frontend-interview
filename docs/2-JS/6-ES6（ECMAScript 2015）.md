# ES6+ 各版本新特性

> 面试常问「ES6 新增了什么」，注意 `ES6 特指 ES2015`；async/await、可选链等是后续版本的，别混着答。

## ES6 / ES2015（真正的 ES6）

| 特性 | 描述 |
|--|--|
| `let` / `const` | 块级作用域变量与常量（见 [let、const、var](./2-let、const、%20var.md)） |
| 箭头函数 `=>` | 简化写法，无自己的 this / arguments |
| 模板字符串 | 反引号，多行 + `${}` 插值 |
| 解构赋值 | `const {a} = obj`、`const [x] = arr` |
| 扩展/剩余运算符 `...` | 展开数组、收集参数 |
| 函数默认参数 | `function f(x = 1)` |
| `class` | 原型继承的语法糖，`extends` / `super` |
| ES Module | `import` / `export`（见 [前端模块化](./7-CommonJS%20VS%20ES6.md)） |
| Promise | 标准化异步方案 |
| Generator | `function*` / `yield` |
| `Symbol` | 第七种基本类型，唯一值 |
| `Set` / `Map` / `WeakSet` / `WeakMap` | 新集合类型 |
| `Proxy` / `Reflect` | 元编程（Vue3 响应式的基础） |
| 尾调用优化、`for...of`、字符串/数组/对象新方法 | `includes`（字符串）、`Array.from/of`、`Object.assign` 等 |

## ES2016 ~ ES2017

* `Array.prototype.includes`、指数运算符 `**`（ES2016）
* `async / await`、`Object.entries / values`、`padStart / padEnd`、SharedArrayBuffer 与 Atomics（ES2017）

## ES2018 ~ ES2019

* 对象的 Rest/Spread（`{ ...obj }`）、`for await...of` 异步迭代、`Promise.finally`、正则后行断言（ES2018）
* `Array.flat / flatMap`、`Object.fromEntries`、`trimStart / trimEnd`、可省略 catch 参数（ES2019）

## ES2020

* `可选链 ?.`、`空值合并 ??`（见 [运算符与表达式](./4-表达式.md)）
* `BigInt`、动态 `import()`、`Promise.allSettled`、`globalThis`、`String.matchAll`

## ES2021 ~ ES2022

* `String.replaceAll`、逻辑赋值 `&&= ||= ??=`、数字分隔符 `1_000_000`、`WeakRef` / `FinalizationRegistry`、`Promise.any`（ES2021）
* 顶层 `await`、类字段与 `#私有成员`、`Object.hasOwn`、`Array.at()`、`Error cause`（ES2022）

## ES2023+

* 数组不可变方法 `toSorted / toReversed / toSpliced / with`、`findLast / findLastIndex`（ES2023）
* `Object.groupBy / Map.groupBy`、`Promise.withResolvers`（ES2024）

## 常见考点

* **说几个最常用的 ES6+ 特性及版本**：ES6 —— let/const、箭头函数、解构、Promise、class、模块化；ES2017 —— async/await；ES2020 —— `?.` 与 `??`。
* **`Promise.all / allSettled / race / any` 区别**：全成功才成 / 全部结算返回状态数组 / 第一个结算的 / 第一个成功的（全失败才 AggregateError）。
