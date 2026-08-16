# 多进程与集群（cluster & child_process）

## 核心概念

Node 的 JS 主线程只有一个，**默认只能用满一颗 CPU 核心**。要吃满多核机器，就要靠多进程：

- **`cluster`**：一主多从，**多个进程监听同一端口**，由主进程做负载均衡——扩展 HTTP 服务的标准方案
- **`child_process`**：派生任意子进程（可以是别的语言、别的可执行文件）——适合执行外部命令
- **`worker_threads`**：同进程内多线程，**共享内存**——适合 CPU 密集计算

选型口诀：**扩服务用 cluster，跑命令用 child_process，做计算用 worker_threads**。

## 详解

### 1. cluster 为什么能共用端口

主进程创建监听 socket 后，把 **文件描述符传递给子进程**。子进程并非各自 bind 端口，而是共享同一个 socket。

Node 提供两种调度策略：

| 策略 | 说明 |
|------|------|
| `SCHED_RR`（默认，Windows 外） | **主进程轮询分发**连接，负载更均匀 |
| `SCHED_NONE` | 由操作系统决定，可能出现**惊群**和分配不均 |

### 2. child_process 的四个 API

| API | 是否创建新进程 | 特点 |
|-----|--------------|------|
| `exec` | 是 | 走 shell，**结果缓冲在内存**，有 `maxBuffer` 上限 |
| `execFile` | 是 | 不走 shell，**更安全**（避免命令注入） |
| `spawn` | 是 | 流式输出，适合**大量输出**或长时间运行 |
| `fork` | 是 | 专门派生 Node 脚本，**内置 IPC 通道** |

> **安全提醒**：`exec` 会把参数拼进 shell 命令。若参数来自用户输入，**必须改用 `execFile` 或 `spawn`**，否则存在命令注入风险。

```js
// 危险：filename 若为 "a.txt; rm -rf /" 会被执行
exec(`cat ${filename}`);

// 安全：参数作为数组传入，不经 shell 解析
execFile('cat', [filename]);
```

### 3. 进程间通信（IPC）

`fork` 出的子进程自带 IPC，可直接收发**可序列化的对象**：

```js
// 父进程
const child = fork('./worker.js');
child.send({ type: 'task', payload: 42 });
child.on('message', (msg) => console.log('收到', msg));

// 子进程 worker.js
process.on('message', (msg) => {
  process.send({ type: 'done', result: msg.payload * 2 });
});
```

> IPC 传输会经过 **JSON 序列化**，无法传函数，且大对象传输开销明显。

### 4. 进程守护与优雅退出

生产环境要保证 **子进程崩溃后自动重启**，且退出时**不切断正在处理的请求**：

- 监听 `exit` 事件重新 `fork`
- 收到 `SIGTERM` 时先 `server.close()` 停止接收新连接，处理完存量请求再退出
- 加**重启频率限制**，避免启动即崩溃时陷入无限重启

实际项目多数直接用 **PM2** 而非手写这套逻辑。

## 常见考点

- 问题 1：cluster 多个进程为什么能监听同一端口？→ 主进程传递 **socket 文件描述符**，子进程共享
- 问题 2：cluster 和 worker_threads 怎么选？→ **扩 I/O 服务用 cluster（进程隔离，一个崩不影响其他）；CPU 计算用 worker_threads（共享内存，开销小）**
- 问题 3：`exec` 和 `execFile` 区别？→ 前者走 shell 有**注入风险**且结果有 `maxBuffer` 上限
- 问题 4：多进程之间怎么共享状态？→ **不能直接共享**，需借助 Redis 等外部存储；session 尤其要注意
- 问题 5：什么是优雅退出？→ 停止接收新连接 → 处理完存量请求 → 关闭资源 → 退出

## 代码示例

带自动重启与优雅退出的 cluster 服务：

```ts
import cluster from 'node:cluster';
import { createServer } from 'node:http';
import { availableParallelism } from 'node:os';

const WORKERS = availableParallelism(); // Node 18.14+ 推荐用法
const MAX_RESTARTS = 10;

if (cluster.isPrimary) {
  let restarts = 0;

  for (let i = 0; i < WORKERS; i++) cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    // 主动退出（优雅关闭）不触发重启
    if (worker.exitedAfterDisconnect) return;

    if (restarts >= MAX_RESTARTS) {
      console.error('重启次数超限，停止拉起子进程');
      return;
    }

    restarts++;
    console.warn(`worker ${worker.process.pid} 退出（${signal ?? code}），重启中`);
    cluster.fork();
  });
} else {
  const server = createServer((req, res) => {
    res.end(`handled by ${process.pid}\n`);
  });

  server.listen(3000);

  // 优雅退出：停止接收新连接，等存量请求处理完
  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
    // 兜底：10s 后强制退出，避免长连接吊死进程
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
```

## 拓展阅读

- [Node.js 官方 — Cluster](https://nodejs.org/api/cluster.html)
- [Node.js 官方 — Child process](https://nodejs.org/api/child_process.html)
- [Node.js 官方 — Worker threads](https://nodejs.org/api/worker_threads.html)
- [PM2 — Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
