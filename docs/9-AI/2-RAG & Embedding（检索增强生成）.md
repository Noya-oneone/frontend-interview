# RAG & Embedding（检索增强生成）

## 核心概念

**RAG（Retrieval-Augmented Generation）** = 检索 + 生成：先从私有知识库中**检索**相关内容，拼进 prompt 里让模型**生成**回答。它解决 LLM 两大痛点：**不知道私有/最新数据**、**幻觉**。而检索的基础设施是 **Embedding（向量化）**——把文本映射为高维向量，语义相近的文本向量距离近。

## 详解

### 1. RAG 完整链路

```
文档 → 分块(chunking) → 向量化(embedding) → 存入向量库
                                              ↓
用户提问 → 向量化 → 相似度检索(top-k) → [可选 rerank] → 拼 prompt → LLM 生成
```

### 2. 关键环节

- **分块（Chunking）**：文档切成 200~1000 token 的块。太大→检索不精准；太小→上下文断裂。常带 10~20% overlap
- **Embedding**：调用 embedding 模型（如 `text-embedding-3-small`）得到向量（如 1536 维）
- **相似度**：最常用 **余弦相似度（cosine similarity）**
- **向量数据库**：Pinecone、Milvus、pgvector、Chroma；小数据量前端甚至可以内存里暴力算
- **Rerank**：粗召回 top-50 后用更精的模型重排出 top-5，提升相关性

### 3. RAG vs 微调 vs 长上下文

| 方案 | 优势 | 劣势 |
|------|------|------|
| RAG | 知识可实时更新、可溯源、成本低 | 链路复杂，检索质量决定上限 |
| 微调 | 格式/风格稳定 | 知识更新要重训、贵 |
| 全量塞长上下文 | 实现最简单 | 贵、慢、大海捞针效应（lost in the middle） |

### 4. 前端视角的考察点

- 检索结果要在 UI 上做 **引用溯源**（citation），点击跳原文——这是 RAG 产品的标配交互
- 流式回答 + 引用角标的渲染（见《流式渲染》篇）
- 检索延迟叠加生成延迟，前端要做 **分阶段 loading**（"检索中… → 生成中…"）

## 常见考点

- 问题 1：RAG 解决什么问题？和直接问 LLM 有什么区别？
- 问题 2：什么是 embedding？为什么用余弦相似度？→ 语义向量化；方向比模长更能代表语义
- 问题 3：chunk 大小怎么选？overlap 是干嘛的？
- 问题 4：RAG 和微调怎么选？→ 知识型选 RAG，格式型选微调

## 代码示例

纯 TS 实现语义检索核心（余弦相似度 + top-k，Node 可跑，embedding 可换任意厂商）：

```ts
type Doc = { id: string; text: string; vector: number[] };

function cosineSim(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function topK(query: number[], docs: Doc[], k = 3): Doc[] {
  return docs
    .map((d) => ({ ...d, score: cosineSim(query, d.vector) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k);
}

// 演示用 3 维假向量；真实场景由 embedding API 返回 1536 维
const docs: Doc[] = [
  { id: '1', text: '退货政策：7 天无理由', vector: [0.9, 0.1, 0.0] },
  { id: '2', text: '发票开具流程', vector: [0.1, 0.9, 0.1] },
  { id: '3', text: '退款到账时间 3 个工作日', vector: [0.8, 0.2, 0.1] },
];
const queryVec = [0.85, 0.15, 0.05]; // “怎么退货退款”的向量

console.log(topK(queryVec, docs, 2).map((d) => d.text));
// → ['退货政策：7 天无理由', '退款到账时间 3 个工作日']
```

## 拓展阅读

- [Anthropic — Retrieval Augmented Generation](https://docs.anthropic.com/en/docs/build-with-claude/embeddings)
- [OpenAI — Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [pgvector](https://github.com/pgvector/pgvector)
