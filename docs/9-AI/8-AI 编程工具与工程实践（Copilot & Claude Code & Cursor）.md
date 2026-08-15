# AI 编程工具与工程实践（Copilot & Claude Code & Cursor）

## 核心概念

AI 编程工具已从"补全下一行"（Copilot 早期）进化到"自主完成整个任务"（Claude Code、Cursor Agent 模式）。面试官问这类问题，考察的不是你会不会用工具，而是：**你如何在保证质量的前提下用 AI 提效，以及你对"AI 时代前端工程师价值"的思考**。

## 详解

### 1. 工具形态演进

| 代际 | 形态 | 代表 | 人机关系 |
|------|------|------|---------|
| 1 | 行内补全 | Copilot（2021） | 人写，AI 补 |
| 2 | 对话式改码 | ChatGPT / Copilot Chat | 人问，AI 答 |
| 3 | 编辑器 Agent | Cursor、Windsurf | 人指挥，AI 改多文件 |
| 4 | 自主 Agent | Claude Code、Codex | 人定目标，AI 全流程（读码→改→跑测试→提 PR） |

### 2. 高效使用的工程实践（面试答题框架）

- **上下文管理**：给 AI 的上下文质量决定输出质量——项目规范写进 `CLAUDE.md` / `.cursorrules`，让每次会话自带团队约定
- **小步验证**：让 AI 一次做一件事，跑测试确认再继续；大 diff 一次生成 = 审查地狱
- **测试先行**：AI 时代 TDD 反而更重要——测试是人类对 AI 输出的验收标准
- **Code Review 不可省**：AI 代码的典型问题：过度封装、幻觉 API、忽略边界 case、安全漏洞（如拼接 SQL）
- **提示词即工程资产**：可复用的 prompt / 自定义命令应当像代码一样入库沉淀

### 3. 安全与合规红线

- 私有代码贴给外部 AI 前确认公司政策（数据出境、许可证）
- AI 生成代码的许可证风险：可能"复现"了开源代码片段
- 凭证绝不进 prompt；`.env` 加入工具的 ignore 配置

### 4. 高频软问题：「AI 会取代前端吗？」答题思路

1. **被压缩的**：模板代码、简单 CRUD 页面、切图还原——纯执行层价值下降
2. **升值的**：需求拆解、架构决策、体验判断、AI 输出的验收能力（你得比 AI 懂才能审它）
3. **新增的**：AI 产品前端（流式 UI、Agent 可视化）、提示词工程、端侧推理——都是前端新阵地
4. 落点：工程师从"写代码的人"变成"定义问题 + 验收结果的人"，**杠杆变大而不是岗位消失**

## 常见考点

- 问题 1：你平时怎么用 AI 编程工具？有什么最佳实践？→ 用上面第 2 节回答，突出"验证闭环"
- 问题 2：AI 生成的代码你怎么保证质量？→ 测试 + review + 小步提交
- 问题 3：AI 幻觉在编程场景怎么体现？→ 编造不存在的 API/包名（供应链攻击风险：slopsquatting）
- 问题 4：AI 会取代前端吗？→ 见上文框架

## 代码示例

把团队规范沉淀为 AI 可消费的项目配置（`CLAUDE.md` 示例）：

```markdown
# 项目约定（AI 必读）

## 技术栈
- Vue 3 Composition API + TypeScript strict，禁用 Options API
- 样式只用项目 design tokens，禁止硬编码色值

## 强制规则
- 所有新组件必须带单元测试（Vitest），覆盖率 ≥ 80%
- API 调用统一走 src/api/ 封装层，禁止组件内裸 fetch
- 提交信息用 conventional commits（feat/fix/docs/...）

## 验证命令
- pnpm test        # 单测
- pnpm typecheck   # 类型检查
- pnpm lint        # ESLint
```

配套的验收习惯（伪代码流程）：

```ts
// AI 协作的最小验证闭环
const workflow = [
  '1. 人：写清楚需求 + 约束（输入输出、边界 case）',
  '2. AI：生成实现 + 测试',
  '3. 机器：跑 test / typecheck / lint 三件套',
  '4. 人：review diff（重点看边界、安全、API 真实性）',
  '5. 小步 commit，下一轮',
];
```

## 拓展阅读

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/overview)
- [GitHub Copilot 文档](https://docs.github.com/en/copilot)
- [Anthropic — Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
