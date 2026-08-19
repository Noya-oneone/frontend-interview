# src VS href

## 核心区别

* `src`（source）：**嵌入**资源 —— 资源会被下载并`替换 / 填充到元素内部`，成为文档的一部分。
* `href`（hypertext reference）：**引用**资源 —— 在文档与资源之间`建立关联关系`，资源不替换元素本身。

```html
<!-- src：内容被嵌进来 -->
<img src="image.png" alt="An image" />
<script src="script.js"></script>
<iframe src="page.html"></iframe>
<video src="movie.mp4"></video>

<!-- href：建立引用 -->
<a href="https://example.com">Visit Example</a>
<link href="styles.css" rel="stylesheet" />
```

## 对加载行为的影响（面试深入点）

* `<script src>`：不带 defer/async 时，浏览器解析到它会`暂停 HTML 解析`，下载并执行完才继续 —— src 嵌入的内容是文档逻辑的一部分，必须就位（详见 [script](../0-HTML/<script>.md)）。
* `<link href>`：CSS `并行下载，不阻塞 HTML 解析`（但阻塞渲染），因为它只是关联关系，浏览器可以边下边解析后续 HTML。
* `<img src>`：异步下载，不阻塞解析，加载完触发重绘。

## 记忆口径

「src 是`拿来用`（元素没有它就没有内容），href 是`指过去`（元素本身仍是完整的）。」

## 常见考点

* **为什么 CSS 用 link（href）引入而不是内联？** 外部样式可`并行下载、被缓存、多页复用`，改一处全站生效。
* **`<link>` 只用来引 CSS 吗？** 不是：`rel="icon"`（favicon）、`rel="preload"`（资源预加载）、`rel="dns-prefetch"` / `preconnect`（提前建连）都靠它。
* **现代 JS 还提倡写内联吗？** 主体逻辑用外部文件 + `defer`（可缓存、可并行）；只有首屏关键小脚本或注入配置才内联。
