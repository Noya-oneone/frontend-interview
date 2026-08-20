# 函数 & this

## this 绑定规则（按优先级从低到高）

| 规则 | 场景 | this 指向 |
|--|--|--|
| **默认绑定** | 普通函数直接调用 `fn()` | 非严格模式：全局对象（浏览器 window / Node globalThis）；严格模式：`undefined` |
| **隐式绑定** | 对象方法调用 `obj.fn()` | `谁调用指向谁`（只看调用点前的那个对象） |
| **显式绑定** | `fn.call(ctx)` / `fn.apply(ctx)` / `fn.bind(ctx)` | 指向传入的第一个参数（见 [bind call apply](./5.1-bind%20call%20apply%20.md)） |
| **new 绑定** | `new Fn()` | 指向`新创建的实例对象` |
| **箭头函数** | 任何调用方式 | `没有自己的 this`，沿用`定义时外层作用域`的 this，且永不改变 |

优先级：`new > 显式 > 隐式 > 默认`；箭头函数不参与这套规则（词法确定）。

```javascript
const obj = {
  name: 'obj',
  regular() { console.log(this.name); },
  arrow: () => console.log(this?.name),
};
obj.regular();              // 'obj'   隐式绑定
const f = obj.regular;
f();                        // undefined（隐式丢失：赋值后变默认绑定）
obj.regular.call({ name: 'x' }); // 'x' 显式绑定
```

## 箭头函数和普通函数的区别（高频考点）

* `没有自己的 this`：捕获定义处外层的 this，`call/apply/bind 也改不动`。
* `不能作构造函数`：没有 `[[Construct]]`，`new` 会报错；也`没有 prototype 属性`。
* `没有自己的 arguments`：访问到的是外层函数的 arguments；用剩余参数 `(...args)` 替代。
* `不能作 Generator`：不能使用 `yield`。
* 语法更简洁，适合回调；`不适合`做对象方法（this 不会指向对象）与需要动态 this 的场景（DOM 事件处理器中想用 this 指向元素）。

## 构造函数

```javascript
function Person(name, age) {
  this.name = name;   // new 调用时 this 指向新实例
  this.age = age;
}
const p = new Person('Alice', 30);

// class 是它的语法糖，方法挂在 prototype 上
class PersonClass {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
```

`new` 做了四件事（手写题）：创建空对象 → 对象原型指向 `Fn.prototype` → 以该对象为 this 执行函数 → 函数返回对象则用返回值，否则返回新对象。

```javascript
function myNew(Fn, ...args) {
  const obj = Object.create(Fn.prototype);
  const result = Fn.apply(obj, args);
  return result instanceof Object ? result : obj;
}
```

## 生成器函数

* `function*` 定义，`yield` 产出值并`暂停执行`，`next()` 恢复并返回 `{ value, done }`。
* 适合`惰性求值 / 大数据流 / 状态机`：值按需生成，内存友好。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
const it = gen();
it.next().value; // 1
it.next().value; // 2
[...gen()];      // [1, 2, 3]  生成器本身可迭代
```

## 高阶函数

接受函数作为参数、或返回函数的函数 —— map/filter/reduce、防抖节流、柯里化都是高阶函数的应用（见 [闭包](./1.1-闭包.md)、[防抖节流](./5.2-防抖函数%20&%20节流函数.md)）。

## 常见考点

* **`setTimeout(obj.fn, 0)` 里的 this？** 隐式丢失，指向全局/undefined；用箭头函数包裹或 `obj.fn.bind(obj)`。
* **多层对象调用 `a.b.c.fn()`？** this 只看`最后一层调用者`，指向 `a.b.c`。
* **箭头函数的 this 能被 bind 改吗？** 不能，bind 对箭头函数的 this 无效（只能预置参数）。
