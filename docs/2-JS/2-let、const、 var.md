# let、const、var 区别

| 关键字 | 作用域 | 重新赋值 | 提升行为 | 重复声明 | 挂到 window |
|--|--|--|--|--|--|
| `var` | 函数作用域 | ✅ | 提升且初始化为 `undefined` | ✅ 允许 | ✅（全局时） |
| `let` | 块级作用域 | ✅ | 提升但`不初始化`（TDZ） | ❌ | ❌ |
| `const` | 块级作用域 | ❌ 且必须初始化 | 同 let（TDZ） | ❌ | ❌ |

## 关键细节

* **暂时性死区（TDZ）**：`let/const` 声明也会被「提升」，但在声明语句执行前处于死区，访问即抛 `ReferenceError`（不像 var 得到 undefined）。
* **const 的不可变是引用不可变**：保存的是内存地址，`对象/数组的内容仍可修改`；要冻结内容用 `Object.freeze()`（浅冻结，深层嵌套需递归冻结）。

```js
const obj = { a: 1 };
obj.a = 2;        // ✅ 修改属性可以
// obj = {};      // ❌ TypeError：不能重新赋值

console.log(x);   // undefined（var 提升）
var x = 1;
console.log(y);   // ReferenceError（TDZ）
let y = 2;
```

## 经典考题：循环 + setTimeout

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 0 1 2
```

`var` 只有一个函数作用域内共享的 `i`；`let` 在每次迭代创建`新的块级绑定`，闭包各捕获各的（详见 [闭包](./1.1-闭包.md)）。

## 常见考点

* **实践准则**：默认 `const`，需要重新赋值才用 `let`，`var` 只出现在老代码里。
* **全局 var 与 let 的区别？** `var a = 1` 会成为 `window.a`；`let` 声明在独立的全局词法环境中，不污染 window。
