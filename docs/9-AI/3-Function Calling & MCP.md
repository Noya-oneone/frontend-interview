# Function Calling & MCP

## 核心概念

**Function Calling（Tool Use）**：让 LLM 不只输出文字，而是输出「我要调用某个函数 + 参数（JSON）」，由你的代码真正执行后把结果喂回模型。这是 AI 从"聊天"走向"干活"（查数据库、下单、操作 UI）的关键机制。
**MCP（Model Context Protocol）**：Anthropic 开源的标准协议，统一"模型 ↔ 外部工具/数据源"的接入方式，可以理解为 **AI 世界的 USB-C**——工具只要实现一次 MCP server，任何支持 MCP 的客户端都能用。

## 详解

### 1. Function Calling 完整流程

```
1. 请求时声明 tools（名称 + 描述 + JSON Schema 参数）
2. 模型判断需要调用 → 返回 tool_use（函数名 + 参数 JSON）
3. 你的代码执行真实函数（模型永远不执行代码！）
4. 把执行结果作为 tool_result 回传
5. 模型基于结果生成最终自然语言回答
（2~5 可能循环多轮 → 这就是 Agent Loop 的雏形）
```

关键认知：**模型只"决定"调用，不"执行"调用**——执行、鉴权、校验都是工程侧责任。

### 2. Tool 定义质量决定效果

- `description` 写清楚**何时该用**这个工具（模型靠它做路由）
- 参数用 **JSON Schema** 严格约束：类型、枚举、required
- 工具数量过多会降低选择准确率 → 分组、按场景动态下发

### 3. MCP 三种能力

| 能力 | 说明 | 类比 |
|------|------|------|
| Tools | 模型可调用的函数 | POST 接口 |
| Resources | 模型可读取的数据 | GET 接口 |
| Prompts | 预置提示词模板 | 快捷指令 |

### 4. 前端安全边界

- 模型返回的参数是**不可信输入**：执行前必须 schema 校验 + 业务鉴权
- 有副作用的工具（支付、删除、发消息）→ **人工确认（human-in-the-loop）**
- 防止"工具结果注入"：外部内容进入 tool_result 也可能携带恶意指令

## 常见考点

- 问题 1：function calling 的完整时序？模型执行函数吗？→ 不执行，只输出意图
- 问题 2：怎么保证模型输出的参数合法？→ JSON Schema + 服务端二次校验
- 问题 3：MCP 解决什么问题？和直接写 function calling 的区别？→ 标准化、复用、生态
- 问题 4：什么场景必须加人工确认？

## 代码示例

最小 function calling 循环（Anthropic SDK，Node 可跑）：

```ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const tools: Anthropic.Tool[] = [{
  name: 'get_weather',
  description: '查询指定城市当前天气，用户问天气时调用',
  input_schema: {
    type: 'object',
    properties: { city: { type: 'string', description: '城市名，如 Taipei' } },
    required: ['city'],
  },
}];

// 真实执行者：前端/服务端代码，不是模型
async function getWeather(city: string) {
  return { city, temp: 31, desc: '晴' }; // 实际场景调天气 API
}

async function ask(question: string) {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: question }];
  const first = await client.messages.create({
    model: 'claude-sonnet-5', max_tokens: 500, tools, messages,
  });

  const toolUse = first.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') return first;

  const { city } = toolUse.input as { city: string };
  if (typeof city !== 'string' || !city.trim()) throw new Error('模型参数校验失败'); // 不可信输入

  const result = await getWeather(city);
  const second = await client.messages.create({
    model: 'claude-sonnet-5', max_tokens: 500, tools,
    messages: [
      ...messages,
      { role: 'assistant', content: first.content },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }] },
    ],
  });
  return second;
}

ask('台北现在天气如何？').then((r) => console.log(JSON.stringify(r.content, null, 2)));
```

## 拓展阅读

- [Anthropic — Tool Use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
- [Model Context Protocol 官方文档](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)
