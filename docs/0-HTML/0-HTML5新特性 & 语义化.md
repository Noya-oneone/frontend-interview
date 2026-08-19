# HTML5 新特性 & 语义化

## 核心概念

HTML5 是 HTML 的重大版本升级（如今由 WHATWG 以 `HTML Living Standard` 形式持续演进），引入了语义化标签、原生音视频、Canvas、本地存储、多线程等能力，让很多过去依赖插件（Flash）或 hack 的功能有了原生方案。

## 新特性一览

| 特性 | 描述 |
|--|--|
| **语义化元素** | 新增 `<header>`、`<footer>`、`<article>`、`<section>`、`<nav>`、`<aside>`、`<main>` 等，提升文档结构语义性 |
| **音视频** | `<audio>`、`<video>` 原生播放音视频，无需插件 |
| **表单增强** | 新 input 类型：`<input type="email">`、`type="date"`、`type="range"`、`type="number"` 等，原生校验（`required`、`pattern`）与 `placeholder` |
| **Canvas** | `<canvas>` + Canvas API，用 JS 绘制位图图形、动画 |
| **SVG** | 支持在 HTML 中直接内联 SVG 矢量图 |
| **本地存储** | `localStorage` / `sessionStorage`，容量约 5MB，替代 cookie 做客户端存储 |
| **离线与代理** | `ApplicationCache`（已废弃）→ 由 `Service Worker` 接棒实现离线缓存 |
| **Web Workers** | 后台线程执行 JS，主线程不被阻塞（见 [Web Worker](./*%20Web%20Worker.md)） |
| **WebSocket** | 全双工实时通信 |
| **地理位置** | `Geolocation API` 获取用户位置 |
| **拖放** | Drag & Drop API，配合 `draggable` 属性 |
| **History API** | `pushState` / `replaceState`，单页应用路由的基础 |
| **自定义属性** | `data-*` 属性 + `dataset` 读取 |

## 语义化

**一句话**：用正确的标签描述正确的内容结构，而不是一路 `<div>` 到底。

| 价值 | 说明 |
|--|--|
| **结构清晰** | `<header>` / `<main>` / `<footer>` 等标签让文档骨架自解释 |
| **可读可维护** | 开发者不看 class 名也能理解各区块职责 |
| **无障碍（a11y）** | 屏幕阅读器依赖语义标签构建页面大纲，`<nav>`、`<main>` 可被直接跳转 |
| **SEO** | 搜索引擎更准确地理解内容权重与结构 |

### 典型语义化骨架

```html
<body>
  <header>
    <nav>…全站导航…</nav>
  </header>
  <main>
    <article>
      <h1>文章标题</h1>
      <section>…章节…</section>
    </article>
    <aside>…侧边栏 / 相关推荐…</aside>
  </main>
  <footer>…版权信息…</footer>
</body>
```

## 常见考点

* **`<section>` vs `<article>` vs `<div>`**：`<article>` 是可独立分发的完整内容（一篇文章、一条评论）；`<section>` 是有主题的内容分组（通常应带标题）；`<div>` 无语义，纯粹为样式/脚本分组。
* **`localStorage` vs `sessionStorage` vs `cookie`**：前两者容量约 5MB、不随请求发送；`localStorage` 持久存储，`sessionStorage` 随标签页关闭清除；cookie 约 4KB、每次同源请求自动携带。
* **HTML5 之前如何播视频？** 依赖 Flash / Silverlight 插件，`<video>` 让浏览器原生解码。
