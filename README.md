# Frontend Interview - 前端八股文知识库

翻书式阅读的前端面试知识库，258 篇文档覆盖前端面试核心知识点。

## 预览

打开 `index.html` 即可使用，支持：

- 📚 侧边栏分类导航（14 个分类）
- 🔍 实时搜索
- ← → 键盘翻页 / 按钮翻页
- 📱 移动端适配
- 🔗 URL hash 定位（可分享链接）

## 知识分类

| 分类 | 文档数 | 内容 |
|------|--------|------|
| HTML | 17 | HTML5 新特性、BFC、盒模型、语义化、Canvas/SVG |
| CSS | 14 | 选择器优先级、Flex/Grid、动画、响应式布局、GPU 加速 |
| JavaScript | 30+ | 原型链、闭包、ES6、Promise、事件循环、深拷贝 |
| HTTP & 网络 | 17 | 状态码、缓存、跨域、TCP/UDP、HTTPS、RESTful |
| Vue | 25+ | 双向绑定、Composition API、Router、Pinia/Vuex |
| React | 15 | Hooks、Fiber、Redux、生命周期、高阶组件 |
| 工程化 | 20+ | Webpack/Vite、CI/CD、TypeScript、测试、监控 |
| 移动端 | 14 | React Native、JSBridge、WebView、PWA |
| Node.js | 1+ | BFF 架构 |
| 数据结构 | 9 | 链表、栈、队列、Hash、堆、树、图 |
| 算法 | 10+ | 排序、查找、DFS/BFS、动态规划、Diff 算法 |
| 设计模式 | 3+ | 创建型、结构型、行为型 |
| 综合专题 | 20+ | 性能优化、安全、SEO、埋点、微前端、SSR |

## 使用

```bash
# 方式一：直接打开
open index.html

# 方式二：本地服务器（推荐，避免跨域）
npx serve .

# 方式三：Python
python3 -m http.server 8080
```

## 项目结构

```
frontend-interview/
├── docs/                  # 258 篇 Markdown 文档
│   ├── 0-HTML/
│   ├── 1-CSS/
│   ├── 2-JS/
│   ├── 3-HTTP/
│   ├── 4-VUE/
│   ├── 5-React/
│   ├── 6-CI&工程化/
│   ├── 7-移动端/
│   ├── 8-Node/
│   ├── 数据结构/
│   ├── 算法/
│   ├── 设计模式/
│   ├── 面向对象/
│   └── *.md              # 综合专题（根目录）
├── catalog.json           # 文档目录索引
├── index.html             # 单页应用入口
└── README.md
```

## 技术

- 纯 HTML/CSS/JS，唯一外部依赖：[marked.js](https://marked.js.org/)（CDN）
- CSS Grid + backdrop-filter
- marked.js 实时渲染 Markdown
- URL hash 路由
- 键盘快捷键（← → 翻页）
