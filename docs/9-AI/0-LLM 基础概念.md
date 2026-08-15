# LLM 基础概念

## 核心概念

**LLM（Large Language Model，大语言模型）** 是基于 **Transformer** 架构、在海量文本上预训练的生成式模型，核心能力是 **next-token prediction（预测下一个 token）**。前端面试中考察 LLM 基础，重点不是让你推导数学，而是确认你理解 **token、上下文窗口、采样参数、幻觉** 这些直接影响 AI 产品前端实现的概念。

## 详解

### 1. Token：模型的最小处理单位

- 模型不直接处理字符，而是把文本切成 **token**（子词单位）。英文约 4 字符 ≈ 1 token，中文约 1~2 字 ≈ 1 token
- **计费、限流、上下文长度全部按 token 计算**——这就是前端要关心它的原因
- 前端可用 tokenizer 库在浏览器端估算 token 数，做输入截断和费用提示

### 2. 上下文窗口（Context Window）

- 模型单次请求能"看到"的最大 token 数（输入 + 输出共享），如 200K
- 超出窗口的历史会被截断 → 聊天应用前端/服务端需要做 **历史消息裁剪或摘要压缩**
- 上下文越长，**延迟和成本越高**，并非无脑塞满

### 3. 采样参数

| 参数 | 作用 | 取值建议 |
|------|------|---------|
| `temperature` | 随机性。越低越确定，越高越发散 | 代码/抽取类 0~0.3；创意写作 0.7~1 |
| `top_p` | 核采样，只从累计概率前 p 的 token 中选 | 一般与 temperature 二选一调整 |
| `max_tokens` | 限制输出长度 | 防止失控输出、控制成本 |
| `stop` | 停止序列 | 结构化输出时截断 |

### 4. 幻觉（Hallucination）

- 模型会**一本正经地编造**不存在的事实、API、链接
- 缓解手段：RAG（给模型喂真实资料）、要求引用来源、降低 temperature、结构化输出 + 校验
- 前端责任：对 AI 输出做 **展示层免责声明**、对可执行内容（代码/链接/命令）做二次确认

### 5. 预训练 vs 微调 vs 提示工程

| 手段 | 成本 | 适用场景 |
|------|------|---------|
| Prompt Engineering | 最低 | 绝大多数业务场景首选 |
| RAG | 中 | 需要私有知识 / 实时数据 |
| Fine-tuning（微调） | 高 | 固定格式、风格化输出、领域语言 |
| Pre-training（预训练） | 极高 | 基本只有模型厂商做 |

## 常见考点

- 问题 1：为什么同一个 prompt 每次输出不一样？如何让它稳定？→ 采样随机性；调低 `temperature`、固定 seed（部分 API 支持）
- 问题 2：聊天记录很长时怎么办？→ 滑动窗口裁剪 / 摘要压缩 / RAG 化历史
- 问题 3：token 和字符是什么关系？前端为什么要数 token？→ 计费与截断
- 问题 4：什么是幻觉？前端能做什么？→ 展示层校验与免责、RAG

## 代码示例

浏览器端估算 token 并截断输入（以 `gpt-tokenizer` 为例，可直接在 Node/浏览器运行）：

```ts
import { encode } from 'gpt-tokenizer';

const MAX_INPUT_TOKENS = 4000;

function clampByTokens(text: string, limit = MAX_INPUT_TOKENS): string {
  const tokens = encode(text);
  if (tokens.length <= limit) return text;
  // 粗略按比例截断，再留 buffer 防止边界误差
  const ratio = limit / tokens.length;
  return text.slice(0, Math.floor(text.length * ratio * 0.98));
}

const userInput = '很长很长的用户输入...';
console.log(`token 数：${encode(userInput).length}`);
console.log(clampByTokens(userInput));
```

## 拓展阅读

- [Anthropic — Glossary](https://docs.anthropic.com/en/docs/resources/glossary)
- [OpenAI — What are tokens?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)
- [Attention Is All You Need（Transformer 原论文）](https://arxiv.org/abs/1706.03762)
