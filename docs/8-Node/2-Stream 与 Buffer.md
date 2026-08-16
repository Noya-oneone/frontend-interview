# Stream 与 Buffer

## 核心概念

**Buffer** 是 Node 用来表示 **二进制数据** 的固定长度字节序列（JS 原生 `String` 无法安全承载二进制）。
**Stream（流）** 则是把大块数据**切成小片、边读边处理**的抽象——它让内存占用与文件大小解耦。

一句话概括价值：**读一个 2GB 文件，`readFile` 需要 2GB 内存，流只需要几十 KB**。

## 详解

### 1. 四种流类型

| 类型 | 说明 | 典型实例 |
|------|------|---------|
| **Readable** | 可读 | `fs.createReadStream`、HTTP `req` |
| **Writable** | 可写 | `fs.createWriteStream`、HTTP `res` |
| **Duplex** | 双向独立 | TCP `net.Socket` |
| **Transform** | 双向且转换 | `zlib.createGzip`、加密流 |

### 2. 背压（Backpressure）

**下游写入速度跟不上上游读取速度**时，数据会在内存里堆积。这是流最重要的考点：

```js
// 反例：忽略 write() 的返回值，内存会持续增长
readable.on('data', (chunk) => {
  writable.write(chunk); // 返回 false 时仍继续读 → 堆积
});
```

`write()` 返回 `false` 表示缓冲区已满，此时应 **暂停读取**，等 `drain` 事件再继续：

```js
readable.on('data', (chunk) => {
  if (!writable.write(chunk)) {
    readable.pause();
    writable.once('drain', () => readable.resume());
  }
});
```

> **实践中不要手写这段逻辑**——`pipe()` 和 `pipeline()` 已内置背压处理。

### 3. `pipe` vs `pipeline`

`pipe()` 的致命问题是 **错误不会向下传播**，中途出错会导致文件描述符泄漏：

```js
// 有隐患：readable 出错时 writable 不会被关闭
readable.pipe(gzip).pipe(writable);
```

`stream.pipeline()` 会在任意环节出错时**清理所有流**，是生产环境的正确写法（见代码示例）。

### 4. Buffer 的常见操作

```js
const buf = Buffer.from('前端', 'utf8');
console.log(buf.length);            // 6（一个中文 3 字节）
console.log('前端'.length);          // 2（字符数）
console.log(buf.toString('base64')); // 5YmN56uv

// 分配未初始化内存，更快但可能含旧数据残留 —— 必须自己填满
const fast = Buffer.allocUnsafe(10);
// 安全版本，自动补零
const safe = Buffer.alloc(10);
```

> `Buffer.allocUnsafe` 的内存来自内部池，**可能残留其他数据**，直接返回给用户会造成信息泄漏。不确定就用 `Buffer.alloc`。

## 常见考点

- 问题 1：为什么大文件要用流？→ 内存占用与文件大小解耦，且 **TTFB 更低**（边读边发）
- 问题 2：什么是背压？怎么处理？→ 下游慢于上游导致堆积；靠 `write()` 返回值 + `drain` 事件，或直接用 `pipeline`
- 问题 3：`pipe` 和 `pipeline` 区别？→ **pipeline 会传播错误并清理所有流**
- 问题 4：`Buffer.alloc` 和 `allocUnsafe` 区别？→ 后者不清零，快但有**数据残留风险**
- 问题 5：`buf.length` 和 `str.length` 为什么不同？→ 字节数 vs 字符数，UTF-8 下中文占 3 字节

## 代码示例

用 `pipeline` 实现带错误处理的文件压缩接口：

```ts
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

async function gzipFile(src: string, dest: string): Promise<void> {
  try {
    // pipeline 会在任一环节出错时自动销毁全部流，避免 fd 泄漏
    await pipeline(
      createReadStream(src),
      createGzip({ level: 6 }),
      createWriteStream(dest),
    );
  } catch (err) {
    // 向上抛出可读错误，同时保留原始堆栈便于定位
    throw new Error(`压缩失败 ${src} → ${dest}：${(err as Error).message}`, {
      cause: err,
    });
  }
}

await gzipFile('./big.log', './big.log.gz');
```

HTTP 场景下直接把文件流接到响应，内存恒定：

```ts
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';

createServer((req, res) => {
  const file = './video.mp4';
  const { size } = statSync(file);

  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': size,
  });

  // 客户端断连时销毁读流，否则会持续占用 fd
  const stream = createReadStream(file);
  stream.pipe(res);
  res.on('close', () => stream.destroy());
}).listen(3000);
```

## 拓展阅读

- [Node.js 官方 — Stream](https://nodejs.org/api/stream.html)
- [Node.js 官方 — Backpressuring in Streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams)
- [Node.js 官方 — Buffer](https://nodejs.org/api/buffer.html)
