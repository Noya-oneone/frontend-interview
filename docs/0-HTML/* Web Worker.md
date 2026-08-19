# Web Worker

## 核心概念

* JavaScript 主线程是`单线程`的，长任务会阻塞渲染与交互。
* Web Worker（HTML5）允许把一段脚本放到`主线程之外的 Worker 线程`中运行，为 JS 创造多线程环境。
* 好处：`计算密集型或高延迟的任务`由 Worker 线程承担，主线程保持流畅，`不会被阻塞或拖慢`。

### 进程和线程

* `餐厅（进程）`是独立的商业实体，有自己的厨房、菜单和员工 —— 进程拥有独立内存空间和系统资源。
* `厨师（线程）`在餐厅里工作，共享厨房资源 —— 线程是`进程内部的执行单元`，`共享同一进程的资源`。
* 进程是操作系统`资源分配`的基本单位，线程是`任务调度`的基本单位；不同进程之间相互隔离。

| 项目 | 进程（餐厅） | 线程（厨师） |
|--|--|--|
| `定义` | 资源分配的最小单位 | 任务调度的最小单位 |
| `内存` | 独立的内存空间 | 共享进程的内存空间 |
| `创建` | 开销较大，速度较慢 | 开销较小，速度较快 |
| `通信` | 需要进程间通信机制（IPC） | 同进程内线程可直接共享数据 |
| `崩溃` | 一个进程崩溃不影响其他进程 | 线程崩溃可能导致所在进程崩溃 |

## Worker 的种类

| 类型 | 说明 |
|--|--|
| `Dedicated Worker` | 专用线程，只能被创建它的脚本访问 |
| `Shared Worker` | 共享线程，可被同源的多个页面/脚本访问 |
| `Service Worker` | 独立于页面的代理线程，拦截网络请求，做离线缓存 / 推送（属于 PWA 范畴，不用于计算） |

## 使用限制（高频考点）

* `同源限制`：Worker 加载的脚本必须与主线程脚本同源。
* `文件限制`：无法通过 `file://` 协议创建 Worker，脚本必须来自网络（本地调试需起 HTTP 服务）。
* `DOM 操作限制`：Worker 的全局对象是 `self`（DedicatedWorkerGlobalScope），无法访问 `DOM、document、window、parent`。
* `通信限制`：与主线程不共享上下文，只能通过 `postMessage / onmessage` 消息通信；数据默认按`结构化克隆（拷贝）`传递。
* `脚本限制`：不能执行 `alert()`、`confirm()`；但可以使用 `fetch / XMLHttpRequest`、`setTimeout / setInterval`、`importScripts()`。

## 基本用法

```js
// ---- 主线程 ----
const worker = new Worker('./worker.js');
worker.postMessage({ list: [1, 2, 3] });        // 向 Worker 发消息
worker.onmessage = (e) => {
  console.log('主线程收到：', e.data);
  worker.terminate();                            // 立即终止 Worker（不等待剩余操作）
};
worker.addEventListener('error', (e) => {
  console.log(e.message, e.filename, e.lineno);  // 错误消息 / 脚本文件名 / 行号
});

// ---- worker.js ----
importScripts('constants.js');                   // Worker 内导入其他脚本
self.onmessage = (e) => {
  const sum = e.data.list.reduce((a, b) => a + b, 0);
  self.postMessage(sum);
};
```

### 用 Blob 内联创建 Worker

* Blob 是`不可变的原始数据类文件对象`；`URL.createObjectURL(blob)` 生成 `blob:<origin>/<uuid>` 形式的 Blob URL，仅在当前文档存活期间有效（保存在内存中，文档关闭后失效）。
* 借此可以不写独立的 worker.js 文件：

```js
function createWorker(fn) {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'text/javascript' });
  return new Worker(URL.createObjectURL(blob));
}
```

### 大数据传输：Transferable Objects

* `postMessage` 默认`结构化克隆`（深拷贝），大数据（如 ArrayBuffer）拷贝开销大。
* 可转移对象（Transferable）把内存`所有权移交`给 Worker，零拷贝，原线程中该对象不再可用：

```js
const buf = new ArrayBuffer(1024 * 1024 * 32);
worker.postMessage(buf, [buf]);   // 第二个参数声明转移
console.log(buf.byteLength);      // 0，所有权已移交
```

## 典型应用场景

* 大量 CPU 耗时计算（大 JSON 解析、加解密、diff 计算）
* 音视频 / canvas 帧处理、录屏（配合 `OffscreenCanvas` 可在 Worker 中直接绘制）
* 前端导出生成 Excel、图片批量压缩
* `Partytown`：把`第三方脚本`（GA、GTM、广告、埋点等）搬进 Web Worker 运行，通过代理机制转发其对 DOM 的访问，避免第三方脚本抢占主线程。

## 拓展阅读

* [MDN - Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
* [梳理 Web Worker 及实战场景](https://github.com/Jacky-Summer/personal-blog/blob/master/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/%E6%A2%B3%E7%90%86%20Web%20Worker%20%E5%8F%8A%E5%AE%9E%E6%88%98%E5%9C%BA%E6%99%AF.md)
* [Partytown 官方文档](https://partytown.qwik.dev/)
