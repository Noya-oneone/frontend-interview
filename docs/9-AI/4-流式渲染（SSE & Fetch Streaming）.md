# 流式渲染（SSE & Fetch Streaming）

## 核心概念

LLM 生成一段完整回答可能要 5~30 秒，**流式（streaming）** 让 token 一产出就推给前端逐字渲染，把「首字延迟（TTFT, Time To First Token）」压到 1 秒内——这是 AI 聊天产品体验的生命线，也是 **前端面试 AI 方向最高频的实战题**。

## 详解

### 1. 三种推送方案对比

| 方案 | 方向 | 协议 | 适用 |
|------|------|------|------|
| **SSE**（Server-Sent Events） | 服务器 → 客户端单向 | HTTP 长连接，`text/event-stream` | LLM 流式输出的事实标准 |
| WebSocket | 双向 | 独立协议（ws://） | 需要双向实时（协作、语音） |
| HTTP 短轮询 | 拉取 | 普通 HTTP | 兜底方案，延迟高 |

LLM 场景选 SSE 的原因：单向就够、自带断线重连（`retry`/`Last-Event-ID`）、走普通 HTTP 基础设施（网关、CDN 友好）。

### 2. 两种前端消费方式

- **原生 `EventSource`**：最简单，但**只支持 GET、不能自定义 header**（带不了 Authorization）
- **`fetch` + `ReadableStream`**：主流方案。POST + 自定义 header，手动解析 SSE 格式

### 3. SSE 报文格式

```
data: {"delta":"你"}

data: {"delta":"好"}

data: [DONE]
```

每条消息以 `data: ` 开头，**空行分隔**。解析时注意：一个网络 chunk 可能包含多条消息，也可能只有半条 → 必须做 **buffer 拼接**。

### 4. 渲染层要点

- **Markdown 流式渲染**：内容不完整时（如代码块只有开头 ```），用容错的渲染策略或增量解析
- **自动滚动**：新内容滚到底部，但用户手动上滚时要停止跟随（判断 `scrollTop` 距底部阈值）
- **性能**：每个 token 触发一次 setState 会卡顿 → 用 `requestAnimationFrame` 或节流合帧渲染
- **中断**：`AbortController` 支持用户点"停止生成"
- **XSS**：模型输出经 markdown 渲染后必须过 sanitize（DOMPurify），不能直接 `innerHTML`

## 常见考点

- 问题 1：SSE 和 WebSocket 的区别？LLM 场景为什么选 SSE？
- 问题 2：EventSource 为什么不够用？→ 不能 POST / 带 header
- 问题 3：chunk 半包/粘包怎么处理？→ buffer + 按空行切分
- 问题 4：打字机效果怎么做到不卡？→ 合帧渲染
- 问题 5：怎么实现"停止生成"？→ AbortController

## 代码示例

fetch + ReadableStream 消费 SSE，含半包处理与中断（浏览器可跑）：

```ts
async function streamChat(
  prompt: string,
  onDelta: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer <token>' },
    body: JSON.stringify({ prompt }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += value;

    const events = buffer.split('\n\n');
    buffer = events.pop() ?? ''; // 最后一段可能是半包，留到下轮

    for (const evt of events) {
      const data = evt.replace(/^data: /, '').trim();
      if (data === '[DONE]') return;
      const { delta } = JSON.parse(data) as { delta: string };
      onDelta(delta);
    }
  }
}

// 使用：合帧渲染 + 可中断
const controller = new AbortController();
let pending = '';
let rafId = 0;

streamChat('讲讲事件循环', (delta) => {
  pending += delta;
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    document.querySelector('#answer')!.textContent += pending; // 实际项目走 sanitize 后的 markdown 渲染
    pending = '';
  });
}, controller.signal);

// 用户点击停止： controller.abort()
```

## 拓展阅读

- [MDN — Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [MDN — Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [Anthropic — Streaming Messages](https://docs.anthropic.com/en/docs/build-with-claude/streaming)
