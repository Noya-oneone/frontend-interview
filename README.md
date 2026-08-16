# Frontend Interview - 前端八股文知识库

翻书式阅读的前端面试知识库，**350 篇文档**覆盖前端面试核心知识点。

## 在线访问

打开 `index.html` 即可使用，支持：

- 📚 侧边栏分类导航（16 个分类）
- 🔍 实时搜索
- ← → 键盘翻页 / 按钮翻页
- 📱 移动端适配
- 🔗 URL hash 定位（可分享链接）

## 知识分类

| 分类 | 文档数 | 核心内容 |
|------|--------|----------|
| 🔍 调试与监控 | 2 | WebView 调试、线上监控与排查工具 |
| 🏗️ HTML | 17 | HTML5 新特性、BFC、盒模型、语义化、Canvas/SVG |
| 🎨 CSS | 14 | 选择器优先级、Flex/Grid、动画、响应式布局、GPU 加速 |
| ⚡ JavaScript | 35 | 原型链、闭包、ES6+、Promise、事件循环、深拷贝 |
| 🌐 HTTP & 网络 | 20 | 状态码、缓存策略、跨域、TCP/UDP、HTTPS、HTTP/2 |
| 💚 Vue | 27 | 双向绑定、Composition API、Router、Pinia/Vuex、Vue3 |
| ⚛️ React | 16 | Hooks、Fiber、Redux、生命周期、高阶组件、SSR |
| 🔧 工程化 & CI/CD | 28 | Webpack/Vite、TypeScript、测试、监控、Git |
| 📱 移动端 | 15 | React Native、JSBridge、WebView、PWA、适配 |
| 🟢 Node.js | 1 | BFF 架构 |
| 🤖 AI | 9 | LLM 基础、Prompt、RAG、MCP、流式渲染、Agent、端侧 AI |
| 🧱 数据结构 | 9 | 链表、栈、队列、Hash、堆、树、图 |
| 🧮 算法 | 111 | 排序、查找、DFS/BFS、动态规划、Diff 算法、LeetCode |
| 🏛️ 设计模式 | 19 | 创建型、结构型、行为型 |
| 🎯 面向对象 | 1 | OOP 原则 |
| 📌 综合专题 | 26 | 性能优化、安全、SEO、微前端、SSR、登录鉴权 |

## 使用方式

```bash
# 方式一：本地服务器（推荐）
npx serve .

# 方式二：Python
python3 -m http.server 8080

# 方式三：直接打开（部分浏览器可能跨域限制）
open index.html
```

## 项目结构

```
frontend-interview/
├── docs/                      # 350 篇 Markdown 文档
│   ├── 0-调试与监控/           # WebView 调试、线上监控
│   ├── 0-HTML/                # HTML5、语义化、Canvas/SVG
│   ├── 1-CSS/                 # 布局、动画、响应式
│   ├── 2-JS/                  # 核心语法、异步、设计模式
│   ├── 3-HTTP/                # 网络协议、缓存、安全
│   ├── 4-VUE/                 # Vue 全家桶
│   ├── 5-React/               # React 生态
│   ├── 6-CI&工程化/            # 构建工具、CI/CD、TS
│   ├── 7-移动端/               # RN、小程序、PWA
│   ├── 8-Node/                # Node.js
│   ├── 9-AI/                  # LLM、RAG、Agent、端侧 AI
│   ├── 数据结构/               # 基础数据结构
│   ├── 算法/                   # LeetCode + 算法专题
│   ├── 设计模式/               # 23 种设计模式
│   ├── 面向对象/               # OOP
│   └── *.md                   # 综合专题（性能、安全、SSR 等）
├── catalog.json               # 文档目录索引
├── index.html                 # 单页应用入口
└── README.md
```

## 技术实现

- 纯 HTML/CSS/JS 单文件应用，零构建
- 外部依赖：[marked.js](https://marked.js.org/) 负责 Markdown 渲染（CDN，带 unpkg 兜底源）
- 暖米 / 墨褐 / 古铜鎏金低反差配色，自实现轻量代码高亮
- URL hash 路由 + 键盘快捷键
