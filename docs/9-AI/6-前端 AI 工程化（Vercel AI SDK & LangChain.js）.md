# 前端 AI 工程化（Vercel AI SDK & LangChain.js）

## 核心概念

在业务里落地 AI，不会从零手写 SSE 解析和 Agent Loop，而是用工程框架：**Vercel AI SDK** 是前端/全栈视角的首选（React hooks + 流式 + 多厂商切换），**LangChain.js / LangGraph.js** 偏后端编排（链、Agent、RAG 全家桶）。面试考察点是：**知道每层框架解决什么问题、边界在哪**。

## 详解

### 1. 分层认知

```
UI 层        useChat / useCompletion（React hooks，管理消息状态 + 流式更新）
   ↓
服务层       streamText / generateObject（统一各厂商 API，输出 SSE）
   ↓
编排层       LangChain / LangGraph（RAG pipeline、多步 Agent、状态机）
   ↓
模型层       Anthropic / OpenAI / 本地模型
```

### 2. Vercel AI SDK 核心能力

- **Provider 抽象**：一行换模型厂商（`anthropic('claude-sonnet-5')` ↔ `openai('gpt-5')`），避免 vendor lock-in
- **`useChat`**：自动管理 messages 状态、loading、流式追加、stop/reload，前端胶水代码减少 80%
- **`generateObject`**：传 zod schema，直接拿到 **类型安全的结构化输出**（内部走 tool use + 校验重试）
- **RSC 集成**：可流式返回 React 组件（Generative UI）

### 3. LangChain.js 的定位

- 优势：RAG 组件齐全（loader / splitter / retriever）、LangGraph 状态机编排复杂 Agent
- 争议：抽象层厚、调试黑盒——**简单场景直接用 SDK，别为了用框架而用框架**（面试说出这个判断是加分项）

### 4. 选型口径（高频追问）

| 场景 | 推荐 |
|------|------|
| 聊天框、文案生成等常规功能 | Vercel AI SDK 直连 |
| 结构化抽取 | AI SDK `generateObject` + zod |
| 私有知识问答（RAG） | AI SDK + 自建检索，或 LangChain |
| 复杂多步 Agent / 多 Agent | LangGraph 或 Claude Agent SDK |

## 常见考点

- 问题 1：为什么要用 AI SDK 而不是直接 fetch 厂商 API？→ 流式解析、状态管理、厂商抽象、重试
- 问题 2：`useChat` 帮你做了什么？
- 问题 3：怎么拿到类型安全的 AI 输出？→ zod schema + generateObject
- 问题 4：LangChain 什么时候是过度设计？

## 代码示例

Vercel AI SDK 全栈最小实现（Next.js App Router 可跑）：

```ts
// app/api/chat/route.ts —— 服务端：统一厂商 + 输出流
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: anthropic('claude-sonnet-5'),
    system: '你是简洁的中文助手',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse(); // SSE 流
}
```

```tsx
// app/chat/page.tsx —— 客户端：useChat 全托管
'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, status, stop } = useChat();
  const [input, setInput] = useState('');

  return (
    <div>
      {messages.map((m) => (
        <p key={m.id}>
          <b>{m.role}:</b>
          {m.parts.map((p, i) => (p.type === 'text' ? <span key={i}>{p.text}</span> : null))}
        </p>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => { sendMessage({ text: input }); setInput(''); }}>发送</button>
      {status === 'streaming' && <button onClick={stop}>停止</button>}
    </div>
  );
}
```

结构化输出（类型安全）：

```ts
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const { object } = await generateObject({
  model: anthropic('claude-sonnet-5'),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).max(5),
    sentiment: z.enum(['positive', 'negative', 'neutral']),
  }),
  prompt: '分析这篇评论：物流快，包装差……',
});
// object 是完全类型安全的，无需手动 JSON.parse
```

## 拓展阅读

- [Vercel AI SDK 官方文档](https://ai-sdk.dev/docs/introduction)
- [LangChain.js 文档](https://js.langchain.com/docs/introduction/)
- [LangGraph.js](https://langchain-ai.github.io/langgraphjs/)
