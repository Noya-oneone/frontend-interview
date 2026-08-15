# 端侧 AI（WebLLM & Transformers.js & WebGPU）

## 核心概念

**端侧 AI（On-device AI）** 指模型直接在浏览器/设备本地运行推理，不经过服务器。三大支柱：**WebGPU**（浏览器 GPU 计算标准）、**Transformers.js**（HuggingFace 模型跑在 JS 里）、**WebLLM**（浏览器跑量化 LLM）。加上 Chrome 内置的 **Gemini Nano（Prompt API）**，"前端 + AI" 不再必须依赖云端。

## 详解

### 1. 为什么要端侧推理

| 维度 | 端侧 | 云端 |
|------|------|------|
| 隐私 | 数据不出设备 ✅ | 需上传 |
| 成本 | 零 API 费用 ✅ | 按 token 付费 |
| 延迟 | 无网络往返 ✅ | 受网络影响 |
| 离线 | 可用 ✅ | 不可用 |
| 能力 | 小模型（1B~8B 量化） | 旗舰模型 |
| 首次加载 | 要下载几百 MB~几 GB 权重 ❌ | 无 |

### 2. 技术栈

- **WebGPU**：取代 WebGL 的通用 GPU 计算 API，有 compute shader，是浏览器端推理的算力基础
- **WebAssembly（WASM）**：无 GPU 时的 CPU 兜底，配合 SIMD
- **Transformers.js**：`pipeline('sentiment-analysis')` 一行跑 BERT/Whisper/CLIP 类小模型，模型转成 ONNX 格式
- **WebLLM**：MLC 编译的量化 LLM（Llama、Qwen 等）跑在 WebGPU 上，兼容 OpenAI API 格式
- **Chrome Prompt API**：`LanguageModel.create()` 直接调用内置 Gemini Nano，零下载

### 3. 工程要点

- **模型权重缓存**：首次下载后存 Cache Storage / IndexedDB / OPFS，二次访问秒开
- **量化（Quantization）**：FP16 → INT4 让模型体积缩到 1/4~1/8，精度小幅损失
- **推理放 Web Worker**：避免阻塞主线程（模型加载和推理都是重计算）
- **能力检测降级**：`navigator.gpu` 不存在 → WASM → 云端 API 三级降级

## 常见考点

- 问题 1：什么场景适合端侧推理？→ 隐私敏感、高频低难度任务（分类、抽取、翻译）、离线
- 问题 2：WebGPU 和 WebGL 的区别？→ 通用计算 vs 图形渲染，compute shader
- 问题 3：几 GB 的模型怎么在浏览器里用？→ 量化 + 分片下载 + OPFS 缓存
- 问题 4：端侧推理怎么不卡页面？→ Web Worker + WebGPU 异步

## 代码示例

Transformers.js 浏览器端情感分析（无需服务器、无 API key，可直接跑）：

```ts
import { pipeline } from '@huggingface/transformers';

// 首次运行自动下载模型（约 60MB）并缓存到浏览器
const classify = await pipeline('sentiment-analysis');

const results = await classify([
  'This product is amazing!',
  'Worst purchase ever.',
]);
console.log(results);
// [{ label: 'POSITIVE', score: 0.9998 }, { label: 'NEGATIVE', score: 0.9991 }]
```

WebLLM 在浏览器跑对话模型（OpenAI 兼容接口）：

```ts
import { CreateMLCEngine } from '@mlc-ai/web-llm';

const engine = await CreateMLCEngine('Qwen2.5-1.5B-Instruct-q4f16_1-MLC', {
  initProgressCallback: (p) => console.log(`加载中 ${(p.progress * 100).toFixed(0)}%`),
});

const reply = await engine.chat.completions.create({
  messages: [{ role: 'user', content: '用一句话解释闭包' }],
  stream: false,
});
console.log(reply.choices[0].message.content);
```

能力检测三级降级：

```ts
async function pickBackend(): Promise<'webgpu' | 'wasm' | 'cloud'> {
  if ('gpu' in navigator && (await (navigator as any).gpu.requestAdapter())) return 'webgpu';
  if (typeof WebAssembly === 'object') return 'wasm';
  return 'cloud';
}
```

## 拓展阅读

- [Transformers.js](https://huggingface.co/docs/transformers.js/index)
- [WebLLM](https://webllm.mlc.ai/)
- [MDN — WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- [Chrome Built-in AI（Prompt API）](https://developer.chrome.com/docs/ai/built-in)
