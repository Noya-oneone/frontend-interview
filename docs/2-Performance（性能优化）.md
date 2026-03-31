# 前端性能优化

## 一、性能指标

| 指标 | 全称 | 含义 | 目标 |
|------|------|------|------|
| **FP** | First Paint | 首次绘制（白屏结束） | < 1s |
| **FCP** | First Contentful Paint | 首次有内容绘制 | < 1.8s |
| **LCP** | Largest Contentful Paint | 最大内容绘制 | < 2.5s |
| **FID** | First Input Delay | 首次输入延迟 | < 100ms |
| **CLS** | Cumulative Layout Shift | 累计布局偏移 | < 0.1 |
| **TTI** | Time to Interactive | 可交互时间 | < 3.8s |
| **DCL** | DOMContentLoaded | DOM 解析完成 | - |
| **L** | Load | 所有资源加载完成 | - |

> 白屏时间 ≈ FP 时间点。优化目标是缩短 FCP 和 LCP。

---

## 二、白屏原因分析

| 原因 | 说明 | 解决 |
|------|------|------|
| JS 阻塞 | 同步 JS 阻塞 HTML 解析和渲染 | `defer` / `async` / 放 body 底部 |
| CSS 阻塞 | CSSOM 未构建完成，渲染被阻塞 | CSS 放 head、关键 CSS 内联 |
| 资源过大 | JS/CSS/图片体积大，下载慢 | 压缩、Tree-shaking、图片优化 |
| 网络延迟 | 服务器远、DNS 慢、TCP 握手 | CDN、HTTP/2、预连接 |
| 首屏渲染复杂 | DOM 层级深、组件多 | SSR、骨架屏、懒加载 |

---

## 三、资源加载优化

### 3.1 压缩体积

| 手段 | 说明 |
|------|------|
| **Gzip / Brotli** | 服务端开启压缩，体积减少 60-80% |
| **Tree-shaking** | 打包时去除未引用代码（ES Module） |
| **代码分割** | `import()` 动态导入，按需加载 |
| **CSS 压缩** | 原子 CSS（TailwindCSS）、cssnano |
| **图片压缩** | WebP/AVIF 格式、TinyPNG、控制在 200KB 以下 |

### 3.2 图片优化

| 策略 | 说明 |
|------|------|
| 格式选择 | 照片用 JPEG，透明用 PNG，图标用 SVG，通用用 WebP |
| 懒加载 | `loading="lazy"` 或 IntersectionObserver |
| 响应式 | `srcset` + `sizes` 按设备提供合适尺寸 |
| 占位符 | LQIP（低质量模糊图）防止布局抖动 |
| CSS Sprite | 多个小图标合并为一张雪碧图，减少请求数 |

### 3.3 减少请求

| 策略 | 说明 |
|------|------|
| **强缓存** | `Cache-Control: max-age=31536000`，资源不过期不请求 |
| **协商缓存** | `ETag` / `If-Modified-Since`，过期后询问服务器 |
| **合并请求** | 小文件合并、内联关键 CSS/JS |
| **Keep-Alive** | 长连接复用 TCP，减少握手开销 |

### 3.4 加速网络

| 策略 | 说明 |
|------|------|
| **CDN** | 就近分发静态资源 |
| **HTTP/2** | 多路复用、头部压缩、服务器推送 |
| **预连接** | `<link rel="preconnect">` 提前建立连接 |
| **预加载** | `<link rel="preload">` 提前加载关键资源 |
| **DNS 预解析** | `<link rel="dns-prefetch">` |

---

## 四、渲染优化

### 4.1 关键渲染路径

```
HTML → DOM
              → Render Tree → Layout → Paint → Composite
CSS  → CSSOM
```

**优化策略：**
- CSS 放 `<head>`：提前构建 CSSOM，避免无样式闪烁（FOUC）
- JS 放 `<body>` 底部或用 `defer`：避免阻塞 DOM 解析
- 关键 CSS 内联：首屏样式直接写在 HTML 中

### 4.2 defer vs async

| 属性 | 下载 | 执行时机 | 顺序 | 适用 |
|------|------|---------|------|------|
| 无 | 阻塞 | 立即 | 顺序 | 核心脚本 |
| `defer` | 异步 | DOM 解析后、DCL 前 | 保证顺序 | 依赖 DOM 的脚本 |
| `async` | 异步 | 下载完立即执行 | 不保证顺序 | 独立脚本（统计、广告） |

### 4.3 避免重排（Reflow）和重绘（Repaint）

| 概念 | 触发 | 代价 |
|------|------|------|
| **重排** | 改变大小、位置、布局、DOM 结构 | 高（重新计算布局） |
| **重绘** | 改变颜色、背景、阴影（不影响布局） | 中 |

> 重排必然导致重绘，重绘不一定导致重排。

**优化手段：**
- 批量修改样式：用 `classList` 替代逐条 `style.xxx =`
- 读写分离：避免交替读取 `offsetHeight` 和写入样式
- 脱离文档流：`position: absolute/fixed` 减少影响范围
- `transform` + `opacity` 动画：触发 GPU 合成层，不走重排重绘
- 虚拟 DOM：React/Vue 批量 diff 后一次更新

### 4.4 SSR（服务端渲染）

- 服务端直接返回 HTML 字符串，浏览器直接渲染，不需要等 JS 下载执行
- 利于 SEO（搜索引擎可抓取完整内容）
- 缩短 FCP，但 TTI 可能不变（hydration 需要时间）

---

## 五、JS 执行优化

### 5.1 减少 DOM 操作

| 策略 | 说明 |
|------|------|
| 事件委托 | 父元素统一监听，减少事件处理器数量 |
| 虚拟滚动 | 只渲染可见区域 DOM，长列表必备 |
| `innerHTML` | 批量插入比逐个 `appendChild` 快 |
| `DocumentFragment` | 离屏操作，完成后一次插入 |

### 5.2 防抖与节流

```javascript
// 防抖：停止触发后才执行（搜索输入）
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 节流：固定间隔执行一次（滚动、resize）
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}
```

### 5.3 Web Worker

- 在后台线程执行 CPU 密集任务，不阻塞主线程
- 无法访问 DOM，通过 `postMessage` 通信
- **Partytown**：将第三方脚本（统计、广告）移到 Worker 执行

### 5.4 Service Worker

| 能力 | 说明 |
|------|------|
| 离线缓存 | 拦截请求，返回 CacheStorage 中的缓存 |
| 缓存策略 | Cache First / Network First / Stale While Revalidate |
| 预缓存 | 安装时缓存关键资源 |
| 后台同步 | 离线操作上线后自动同步 |
| 推送通知 | 接收服务器推送 |

> **Workbox**：Google 出品的 Service Worker 工具库，简化缓存策略配置。

**Service Worker vs HTTP 缓存：**
- SW 缓存不受浏览器缓存淘汰策略影响
- SW 可以改写默认行为（刷新时强制走缓存）
- SW 支持离线访问和版本控制

---

## 六、用户体验优化

### 6.1 骨架屏

- 页面加载时显示灰色占位块，内容加载后替换
- 减少用户感知的白屏时间
- 实现：手写 CSS 占位 / Puppeteer 自动生成 / 框架插件

### 6.2 渐进式加载

| 策略 | 说明 |
|------|------|
| 组件懒加载 | `React.lazy` + `Suspense`、Vue `defineAsyncComponent` |
| 路由懒加载 | `import()` 动态导入路由组件 |
| 渐进式 JPEG | 图片从模糊逐步变清晰 |
| LQIP | 先显示低质量模糊图，再替换高清图 |

### 6.3 GPU 加速

```css
/* 触发 GPU 合成层，避免重排重绘 */
.animated {
  transform: translateZ(0);  /* 或 will-change: transform */
  opacity: 1;
  transition: transform 0.3s, opacity 0.3s;
}
```

> 只对 `transform` 和 `opacity` 做动画，其他属性（width、height、top）会触发重排。

---

## 七、面试高频总结

### Q: 说说前端性能优化的方案？

**按阶段回答：**

1. **资源加载阶段：**
   - 压缩（Gzip、Tree-shaking、图片 WebP）
   - 缓存（强缓存 + 协商缓存）
   - CDN + HTTP/2
   - 预连接、预加载

2. **解析渲染阶段：**
   - CSS 放 head，JS 放 body 底部或 defer
   - 关键 CSS 内联
   - SSR 服务端渲染
   - 避免重排重绘

3. **JS 执行阶段：**
   - 减少 DOM 操作（事件委托、虚拟滚动）
   - 防抖节流
   - Web Worker 处理耗时任务
   - Service Worker 离线缓存

4. **用户体验：**
   - 骨架屏
   - 懒加载（图片、组件、路由）
   - GPU 加速动画
