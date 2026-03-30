
## `<script>` 标签

| 属性         | 默认值     | 描述                                     |
|--------------|------------|------------------------------------------|
| **src**      | 空         | 指定外部 JavaScript 文件的 URL。          |
| **type**     | `"text/javascript"` | 指定脚本的 MIME 类型。                |
| **defer**    | `false`    | 延迟执行脚本，直到文档解析完成。            |
| **async**    | `false`    | 异步执行脚本，脚本一旦加载完成立即执行。      |
| **charset**  | 文档的默认字符集 | 指定外部脚本文件的字符编码。               |
| **nomodule** | `false`    | 指示脚本在不支持 ES6 模块的浏览器中不执行。   |
| **crossorigin** | 无      | 控制对外部脚本文件的跨域请求。             |
| **integrity** | 无        | 提供用于验证请求资源完整性的哈希值。        |
| **referrerpolicy** | 无  | 设置获取外部脚本时的引用者信息策略。         |

### defer 和 async 属性

| 属性 | 描述 | 执行顺序 | 
|------------|-------|---------|
| **`defer`**| `延迟执行`，脚本在文档解析完成后执行| 脚本按照它们在文档中的出现顺序执行|
| **`async`**| `异步加载`，脚本一旦加载完成立即执行| 脚本的执行顺序不一定与文档中的顺序一致，可能会并行执行 |

* HTML解析 （浏览器一边解析 HTML 文档，一边构建 DOM 树）
* CSS解析 （CSS 解析完成后，浏览器会生成 CSSOM）
* 渲染树构建 （DOM和CSSDOM 树都生成完后，结合生成渲染树）
* JavaScript执行

* `影响 JavaScript`：虽然 CSS 加载不会直接阻塞 JavaScript 执行，但在 CSS 加载完成之前，浏览器会延迟渲染页面内容。这可能会影响到 JavaScript `操作 DOM 的时机`，因为 JavaScript 可能会在 CSS `加载完成之前`对 DOM 进行操作，造成样式不一致。


* `渲染树`：在 DOM 树和 CSSOM 树都生成完成后，浏览器将它们合并生成渲染树。渲染树的构建是顺序进行的，必须在 DOM 和 CSSOM 完成之后才能进行。
* `JavaScript 执行：`
    * `同步脚本`： 如果 JavaScript 脚本在 HTML 的 `<head>` 部分，浏览器会在`解析 HTML 时暂停`，执行脚本。这个过程是阻塞的，可能影响 DOM 和 CSSOM 的解析。
    * `异步脚本`：如果使用 async 或 defer 属性，脚本的下载和执行可以并行进行，但 defer 脚本会在 HTML 解析完成后执行，async 脚本会在下载完成后立即执行。

* 用这两个属性去解决javascript脚本阻塞问题，最稳妥的方法就是将script放到body的底部，没有兼容性问题，也不会因此产生白屏问题，没有执行顺序的问题
* defer 和 async 是 `<script>` 标签的可选属性，而不是必须属性。它们的主要作用是控制外部 JavaScript 文件的加载和执行方式
* defer 适用于需要在 `DOM 完全加载后执行的脚本`，而 async 则适用于独立的脚本，如`第三方分析工具或广告脚本`
*  同时使用 defer 和 async 属性在一个 `<script>` 标签上是无效的，因为这两个属性的行为是`互斥的`。

### nonce 属性
* `nonce（number used once）` 是一个随机生成的唯一字符串，用于确保脚本在安全的内容安全策略（CSP）下执行。它的主要作用是防止跨站脚本攻击（XSS），确保只有被明确允许的脚本才能执行。

在 CSP 中，nonce 的用法如下：
* 在服务器端生成 nonce：每次请求都会生成一个唯一的 nonce。
在 HTTP 响应头中设置 CSP：指定允许带有特定 nonce 的脚本执行，例如：Content-Security-Policy: script-src 'self' 'nonce-<random-value>'。
* 在 HTML 中使用 nonce：在每个需要执行的 `<script>` 标签中添加相应的 nonce 属性，例如：<script nonce="<random-value>">.
* 在 React 应用中，通常会`从服务器端传递 nonce` 并在组件中使用它

'unsafe-inline'：允许执行页面内嵌的&lt;script>标签和事件监听函数
unsafe-eval：允许将字符串当作代码执行，比如使用eval、setTimeout、setInterval和Function等函数。
nonce值：每次HTTP回应给出一个授权token，页面内嵌脚本必须有这个token，才会执行
hash值：列出允许执行的脚本代码的Hash值，页面内嵌脚本的哈希值只有吻合的情况下，才能执行。

### crossorigin 属性
| crossorigin | 描述|
|---------------|---|
| `anonymous`   | 不包含用户凭据（如 cookies 或 HTTP 认证信息）进行跨域请求。|
| `use-credentials` | 包含用户凭据进行跨域请求。|
| 无            | 不启用 CORS 跨域请求，按照浏览器的默认行为处理。|

### 示例

1. **`anonymous`** 
* 用途：适用于需要从不同域加载资源，但不需要发送用户凭据的场景
* 典型应用：加载公共库或 CDN 上的 JavaScript 文件。
```html
<script src="https://example.com/script.js" crossorigin="anonymous"></script>
```

2. **`use-credentials`**
* 用途：适用于需要从不同域加载资源，并且需要发送用户凭据（如 cookies 或 HTTP 认证信息）的场景。
* 典型应用：加载需要用户认证的跨域资源。
```html
<script src="https://example.com/script.js" crossorigin="use-credentials"></script>
```

webpack-subresource-integrity 插件 打包工具生成integrity的值

* 结合 SRI 使用 crossorigin 属性，可以有效防止资源被篡改，确保应用的安全性。
* crossorigin 属性常与 SRI（Subresource Integrity）一起使用，以确保加载的外部脚本的内容未被篡改。
* **SRI 验证**：SRI 使用哈希值验证资源的完整性。当资源加载时，浏览器会计算资源的哈希值并与提供的**哈希值进行对比**。如果哈希值不匹配，资源将不会加载，**避免加载被篡改的脚本**。
* crossorigin 属性：跨域请求需要 CORS 头来**允许资源的跨域加载**。当使用 SRI 时，浏览器**需要通过 CORS 请求来获取资源的哈希值**。这就需要 crossorigin 属性来处理跨域请求。

```html
<script src="https://example.com/script.js" integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux4S+QwnV49e6JARgxVbboE3Q/niyfb" crossorigin="anonymous"></script>
```

