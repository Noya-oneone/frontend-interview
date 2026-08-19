# `<script>` 标签

## 属性一览

| 属性 | 描述 |
|--|--|
| **src** | 外部脚本 URL |
| **type** | 省略或 `text/javascript` 为普通脚本；`module` 为 ES 模块；`importmap` / `application/json` 等为数据块 |
| **defer** | 并行下载，`HTML 解析完成后、DOMContentLoaded 之前`按文档顺序执行 |
| **async** | 并行下载，`下载完立即执行`（可能打断解析），顺序不保证 |
| **nomodule** | 支持 ES 模块的浏览器`跳过`该脚本（老浏览器降级方案） |
| **crossorigin** | 控制跨域请求是否带凭据，配合 SRI 使用 |
| **integrity** | SRI 哈希，校验资源未被篡改 |
| **referrerpolicy** | 请求脚本时的 Referer 策略 |
| **nonce** | CSP 下的一次性执行凭证 |

> `charset` 属性已废弃：外部脚本编码由 HTTP 头决定。

## defer vs async（高频考点）

普通 `<script>`（无属性）：解析到它时`暂停 HTML 解析`，下载 + 执行完才继续 —— 这就是「JS 阻塞解析」。

| | 下载 | 执行时机 | 顺序 |
|--|--|--|--|
| **defer** | 与解析并行 | HTML 解析完成后、`DOMContentLoaded` 事件前 | `按文档顺序` |
| **async** | 与解析并行 | `下载完成立即执行`，可能打断解析 | 谁先下载完谁先执行，`与 DOMContentLoaded 无固定先后` |

* `defer` 适合`依赖 DOM、有相互依赖顺序`的业务脚本。
* `async` 适合`彼此独立`的脚本：统计埋点、广告、监控 SDK。
* 同时写 `async` 和 `defer` 时按 `async` 处理（defer 仅作为不支持 async 的老浏览器降级）。
* `defer / async` 只对`外部脚本`有效，内联脚本上无效（`type="module"` 的内联脚本除外，天然 defer）。
* 不用属性的稳妥老办法：把 `<script>` 放到 `</body>` 前，解析不被阻塞、无顺序问题。

### type="module"

```html
<script type="module" src="main.js"></script>
```

* 默认具有 `defer` 行为；加 `async` 则下载完立即执行。
* 自带严格模式、独立模块作用域，跨域加载必须服务端开 CORS。

## 与渲染流水线的关系

1. HTML 解析 → 构建 `DOM 树`（遇到同步脚本会暂停）。
2. CSS 解析 → 构建 `CSSOM`。
3. DOM + CSSOM 合成`渲染树`，再布局、绘制。
4. CSS 不阻塞 DOM 解析，但`阻塞渲染`，也会`阻塞后续同步脚本的执行`（脚本可能读样式，必须等 CSSOM 就绪）—— 所以「CSS 放头部、JS 放底部或加 defer」。

## nonce 属性与 CSP

`nonce`（number used once）是服务端每次响应`随机生成的一次性令牌`，配合 CSP 白名单内联脚本，防 XSS：

```
Content-Security-Policy: script-src 'self' 'nonce-r4nd0m'
```

```html
<script nonce="r4nd0m">/* 只有 nonce 匹配才允许执行 */</script>
```

CSP `script-src` 相关取值：

| 值 | 含义 |
|--|--|
| `'unsafe-inline'` | 放行所有内联脚本与事件属性（等于放弃防护，避免） |
| `'unsafe-eval'` | 放行 `eval`、`new Function`、字符串版 `setTimeout` |
| `'nonce-xxx'` | 携带匹配 nonce 的脚本才执行 |
| `'sha256-xxx'` | 脚本内容哈希匹配才执行 |

## crossorigin 与 SRI

| crossorigin | 描述 |
|--|--|
| `anonymous` | 跨域请求`不携带`凭据（cookie / HTTP 认证），最常用 |
| `use-credentials` | 跨域请求`携带`凭据 |
| 缺省 | 不启用 CORS；脚本报错信息会被脱敏为 `Script error.`（无法上报详情） |

SRI（Subresource Integrity）确保 CDN 资源`未被篡改`：浏览器下载后计算哈希与 `integrity` 值对比，不匹配则拒绝执行。SRI 校验要求以 CORS 模式请求，所以必须同时写 `crossorigin`：

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux4S+QwnV49e6JARgxVbboE3Q/niyfb"
        crossorigin="anonymous"></script>
```

构建侧可用 `webpack-subresource-integrity` 插件自动生成 integrity 值。

## 常见考点

* **为什么监控 SDK 要加 `crossorigin="anonymous"`？** 否则跨域脚本抛错只能拿到 `Script error.`，无法定位。
* **DOMContentLoaded 和 load 的区别？** 前者在 DOM 树构建完成（defer 脚本执行完）触发；后者等所有资源（图片、iframe）加载完。
* **动态创建的 script 是 defer 还是 async？** `document.createElement('script')` 插入的脚本默认 `async=true`，需要顺序时手动置 `script.async = false`。

## 拓展阅读

* [MDN - `<script>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script)
* [MDN - Subresource Integrity](https://developer.mozilla.org/zh-CN/docs/Web/Security/Subresource_Integrity)
