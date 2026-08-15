# AI Agent（智能体）

## 核心概念

**Agent** = LLM + 工具 + 循环。普通对话是"一问一答"，Agent 是让模型在一个 **感知 → 思考 → 行动 → 观察** 的循环里自主拆解并完成多步任务（订机票、改代码、做调研）。2025 年后 AI 面试的重心已从"会调 API"转向"理解 Agent 工程"。

## 详解

### 1. Agent Loop（核心循环）

```
用户目标
  ↓
┌─→ LLM 思考：下一步做什么？
│     ↓
│   调用工具（tool_use）
│     ↓
│   拿到结果（tool_result）
│     ↓
└── 结果喂回模型 ——→ 判断任务完成？→ 输出最终答案
```

与单次 function calling 的区别：**循环由程序驱动，直到模型不再请求工具**（或达到步数/预算上限）。

### 2. 经典模式

| 模式 | 思路 | 适用 |
|------|------|------|
| **ReAct** | Reason（推理）+ Act（行动）交替，边想边做 | 通用，最主流 |
| Plan-and-Execute | 先产出完整计划，再逐步执行 | 步骤可预知的长任务 |
| Reflection | 产出后自我批判、重做 | 质量优先场景 |
| Multi-Agent | 多个专职 agent 协作（编排者 + 工人） | 复杂任务拆分、并行 |

### 3. 工程要素（面试深挖点）

- **记忆**：短期记忆 = 对话上下文；长期记忆 = 向量库/数据库存档再检索
- **护栏（Guardrails）**：最大迭代次数、token 预算、敏感操作人工确认，防止死循环和失控成本
- **可观测性**：每一步 thought/action/observation 都要落日志，否则线上没法排查
- **错误恢复**：工具调用失败要把错误信息喂回模型让它自我修正，而不是直接崩

### 4. 前端视角

- Agent 执行过程的 **过程可视化**（步骤流、工具调用卡片、思考折叠面板）是新的前端命题
- 长任务需要 **进度流式推送**（复用 SSE）+ 中断按钮
- Claude Code、Cursor 本质都是"编码 Agent + 终端/编辑器 UI"

## 常见考点

- 问题 1：Agent 和普通 LLM 调用的本质区别？→ 循环 + 自主决策
- 问题 2：什么是 ReAct？
- 问题 3：怎么防止 Agent 死循环 / 烧钱？→ 步数上限、预算护栏
- 问题 4：多轮工具调用的上下文怎么管理？→ 完整消息历史 + 必要时压缩

## 代码示例

30 行实现一个带护栏的最小 Agent Loop（Anthropic SDK，Node 可跑）：

```ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const MAX_STEPS = 8; // 护栏：防死循环

const tools: Anthropic.Tool[] = [{
  name: 'calculator',
  description: '计算数学表达式，遇到任何算术都必须调用',
  input_schema: {
    type: 'object',
    properties: { expr: { type: 'string' } },
    required: ['expr'],
  },
}];

function runTool(name: string, input: unknown): string {
  if (name !== 'calculator') return 'unknown tool';
  const { expr } = input as { expr: string };
  if (!/^[\d+\-*/(). ]+$/.test(expr)) return 'invalid expression'; // 不可信输入过滤
  return String(Function(`"use strict"; return (${expr})`)());
}

async function agent(goal: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: goal }];

  for (let step = 0; step < MAX_STEPS; step++) {
    const res = await client.messages.create({
      model: 'claude-sonnet-5', max_tokens: 1000, tools, messages,
    });
    messages.push({ role: 'assistant', content: res.content });

    const calls = res.content.filter((b) => b.type === 'tool_use');
    if (calls.length === 0) {
      return res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    }
    messages.push({
      role: 'user',
      content: calls.map((c) => ({
        type: 'tool_result' as const,
        tool_use_id: c.id,
        content: runTool(c.name, c.input),
      })),
    });
  }
  throw new Error('达到最大步数，任务中止');
}

agent('先算 (37+5)*3，再把结果开平方，保留两位小数').then(console.log);
```

## 拓展阅读

- [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [ReAct: Synergizing Reasoning and Acting](https://arxiv.org/abs/2210.03629)
- [Claude Agent SDK](https://docs.anthropic.com/en/api/agent-sdk/overview)
