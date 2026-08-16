# Node 运行机制与事件循环

## 核心概念

Node.js 是 **单线程执行 JavaScript、多线程处理 I/O** 的运行时。它把 V8（执行 JS）和 **libuv**（提供事件循环与线程池）组合起来，用 **非阻塞 I/O + 事件循环** 换取高并发能力。

面试里最常见的误解是"Node 是单线程的所以性能差"——准确说法是：**JS 主线程只有一个，但文件读写、DNS、加密等操作由 libuv 线程池承担**，所以 I/O 密集型场景吞吐很高，**CPU 密集型才是它的短板**。

## 详解

### 1. 事件循环的六个阶段

libuv 的事件循环按固定顺序轮转，每一轮称为一次 **tick**：

| 阶段 | 处理内容 |
|------|---------|
| **timers** | `setTimeout` / `setInterval` 到期回调 |
| **pending callbacks** | 上一轮延迟的系统级回调（如 TCP 错误） |
| **idle, prepare** | 内部使用 |
| **poll** | **检索新 I/O 事件、执行 I/O 回调**（停留时间最长） |
| **check** | `setImmediate` 回调 |
| **close callbacks** | `socket.on('close')` 等关闭回调 |

### 2. 微任务的插队时机

`process.nextTick` 和 Promise 微任务**不属于任何阶段**，它们在**每个阶段切换之间**被清空，且 `nextTick` 优先级高于 Promise：

```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));

// 输出：nextTick → promise → timeout/immediate（主模块中顺序不确定）
```

> **为什么 `timeout` 和 `immediate` 在主模块中顺序不确定？**
> 进入事件循环时若已过了 1ms，timers 阶段就能执行 `setTimeout`；否则先到 check 阶段执行 `setImmediate`。
> 但在 **I/O 回调内部**，一定是 `setImmediate` 先执行（因为 poll 阶段的下一站就是 check）。

### 3. 与浏览器事件循环的区别

| | 浏览器 | Node.js |
|---|--------|---------|
| 微任务清空时机 | **每个宏任务后** | **每个阶段之间** |
| `setImmediate` | 不支持 | 支持（check 阶段） |
| `process.nextTick` | 不支持 | 支持，优先级最高 |
| 渲染 | 有渲染时机 | 无 |

> Node 11 之后，宏任务之间也会清空微任务队列，与浏览器行为趋于一致。

### 4. 阻塞事件循环的代价

主线程被同步代码占住时，**所有请求都会排队**：

```js
// 反例：一个请求卡住整个服务
app.get('/bad', (req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e10; i++) sum += i; // 阻塞数秒
  res.json({ sum });
});
```

CPU 密集任务的正确出路是 **worker_threads**（见下方代码示例）或拆到独立服务。

## 常见考点

- 问题 1：Node 是单线程还是多线程？→ **JS 执行单线程，I/O 由 libuv 线程池（默认 4，`UV_THREADPOOL_SIZE` 可调）承担**
- 问题 2：`setTimeout(fn, 0)` 和 `setImmediate(fn)` 谁先执行？→ 主模块不确定；**I/O 回调内 `setImmediate` 必先**
- 问题 3：`process.nextTick` 和 `Promise.then` 谁先？→ **nextTick 先**，且递归调用 nextTick 会饿死事件循环
- 问题 4：为什么 Node 适合 I/O 密集不适合 CPU 密集？→ 非阻塞 I/O 让单线程能挂起等待；CPU 计算无法挂起，直接堵死主线程

## 代码示例

用 `worker_threads` 把 CPU 密集任务移出主线程：

```ts
// worker.ts —— 子线程
import { parentPort, workerData } from 'node:worker_threads';

function fib(n: number): number {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

parentPort?.postMessage(fib(workerData.n));
```

```ts
// main.ts —— 主线程，事件循环不被阻塞
import { Worker } from 'node:worker_threads';

function runFib(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), {
      workerData: { n },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      // 正常结束 code 为 0；非 0 说明子线程异常退出
      if (code !== 0) reject(new Error(`Worker 退出，code: ${code}`));
    });
  });
}

const result = await runFib(40);
console.log(result); // 主线程期间仍可正常响应其他请求
```

## 拓展阅读

- [Node.js 官方 — The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Node.js 官方 — Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
- [libuv 设计文档](https://docs.libuv.org/en/v1.x/design.html)
