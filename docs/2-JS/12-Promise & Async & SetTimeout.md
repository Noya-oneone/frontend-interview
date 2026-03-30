# Promise & Async & SetTimeout

## 三者区别

### setTimeout & Promise & async/await
| 特性 | `setTimeout`| `Promise`| `async/await`|
|--|-|-|--|
| **描述**| 延迟执行代码 | 表示异步操作的结果或失败的占位符 | 基于 `Promise` 的语法糖，简化异步代码的写法|
| **返回值**| `Timeout` 对象 | `Promise` 对象| `Promise` 对象 |
| **控制流**| 不会阻塞代码执行| 通过 `then` 和 `catch` 方法链接回调函数  | 使异步代码看起来像同步代码，通过 `try/catch` 进行错误处理 |
| **错误处理** | 需要在`回调函数中手动处理`| 使用 `catch` 方法处理| 使用 `try/catch` 块处理  |
| **典型场景** | 延迟执行某个操作，如`定时任务或动画` | 处理异步操作，如网络请求、文件读取 | 处理复杂的异步流程，简化 `Promise` 链式调用 |
| **执行顺序** | 在 `delay` 时间后将回调函数放入`事件队列`中等待执行  | 在异步操作完成后将回调函数放入`微任务队列`中等待执行 | 使异步函数按顺序执行，等待 `await` 的操作完成后继续  |

### Promise & async/await

| 特性  | Promise | async/await |
|-|-|-|
| **可读性**| 代码较冗长，链式调用较多   | `代码更简洁，类似于同步代码 , 适用于条件判断语句中` |
| **错误处理**  | `.catch()` 统一处理| `try/catch` 块处理更直观   |
| **兼容性**| ES6 引入，浏览器和 Node.js 支持较好 | ES2017 引入，需要较新环境或 Babel 转译  |
| **调试**  | 调试相对复杂，异步调用栈不易追踪   | 调试方便，调用栈更易跟踪   |

## Promise*
 `Promise `: 一旦 `Promise` 从 `Pending` 变为 `Fulfilled` 或 `Rejected`，状态不可再更改，确保结果的一致性。 

  | 状态   | 描述 | 行为 |
|-----|------|-----|
| **Pending** | 初始状态，等待中| 异步操作尚未完成，`Promise` 可能会变为 `Fulfilled` 或 `Rejected` 状态。 |
| **Fulfilled** | 已完成状态，操作成功 | 异步操作成功完成，`Promise` 进入 `Fulfilled` 状态。`then()` 方法中的回调函数将被调用。 |
| **Rejected** | 已拒绝状态，操作失败| 异步操作失败，`Promise` 进入 `Rejected` 状态。`catch()` 方法中的回调函数将被调用。|



## async/await 

* 它是基于 Promise 实现的，可以让异步代码看起来像同步代码，使得代码更加清晰易读

## 手写Promise.all、Promise.race

```javascript
// 等待多个 API 请求都返回 
// 包含所有 Promise 结果的数组 
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then((value) => {
        results[index] = value;
        count += 1;
        if (count === promises.length) {
          resolve(results);
        }
      }, reject);
    });
  });
}

// 请求多个资源，使用第一个返回的资源 
// 可以通过创建一个新的 Promise，然后迭代输入的所有 Promise
// 一旦任何一个 Promise 解决或拒绝，这个新的 Promise 也会立即解决或拒绝
// 第一个完成的 Promise 结果或拒绝原因
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    // 遍历所有的 promise
    promises.forEach(promise => {
      // 对每个 promise 调用 then 和 catch
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
}

function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    let errors = []; // 用于收集所有 promise 的错误
    let pendingCount = promises.length; // 追踪未完成的 promise 数量

    if (pendingCount === 0) {
      // 如果传入的 promise 列表为空，立即 reject 一个 AggregateError(多个错误)
      return reject(new AggregateError([], 'All promises were rejected'));
    }

    promises.forEach((promise, index) => {
      // 使用 Promise.resolve 确保即使非 promise 也能被处理
      Promise.resolve(promise)
        .then(resolve)
        .catch(error => {
          errors[index] = error; // 记录每个失败的 promise 的错误
          pendingCount--; // 未完成的 promise 数量减少

          // 如果所有 promise 都失败，reject 一个 AggregateError
          if (pendingCount === 0) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
    });
  });
}

```


## 手写Promise

```javascript

class MyPromise {
  constructor(executor) {
    this.state = 'pending'; // Promise 状态: 'pending', 'fulfilled', 'rejected'
    this.value = undefined; // 存储 resolved 的值
    this.reason = undefined; // 存储 rejected 的原因
    this.onFulfilledCallbacks = []; // 存储 fulfilled 状态的回调
    this.onRejectedCallbacks = []; // 存储 rejected 状态的回调

    // 成功回调
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn(value));
      }
    };

    // 失败回调
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn(reason));
      }
    };

    // 执行 executor
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // 添加成功的回调
  then(onFulfilled, onRejected) {
    // 为了支持链式调用，返回一个新的 Promise
    return new MyPromise((resolve, reject) => {
      // 处理 onFulfilled 回调
      const fulfilledCallback = () => {
        try {
          if (typeof onFulfilled === 'function') {
            const result = onFulfilled(this.value);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else {
            resolve(this.value);
          }
        } catch (error) {
          reject(error);
        }
      };

      // 处理 onRejected 回调
      const rejectedCallback = () => {
        try {
          if (typeof onRejected === 'function') {
            const result = onRejected(this.reason);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else {
            reject(this.reason);
          }
        } catch (error) {
          reject(error);
        }
      };

      // 根据状态执行相应的回调
      if (this.state === 'fulfilled') {
        fulfilledCallback();
      } else if (this.state === 'rejected') {
        rejectedCallback();
      } else {
        this.onFulfilledCallbacks.push(fulfilledCallback);
        this.onRejectedCallbacks.push(rejectedCallback);
      }
    });
  }

  // 静态方法: Promise.resolve
  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  // 静态方法: Promise.reject
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  // 静态方法: Promise.all
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then((value) => {
          results[index] = value;
          count += 1;
          if (count === promises.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }

  // 静态方法: Promise.race
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }
}
```