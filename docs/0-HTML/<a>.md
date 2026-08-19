# `<a>` 标签

## 核心属性

| 属性 | 说明 |
|--|--|
| `href` | 目标地址；支持 `https:`、锚点 `#id`、`mailto:`、`tel:` 等 |
| `target` | `_self`（默认）/ `_blank` 新标签页 / `_parent` / `_top` |
| `rel` | 与目标的关系：`noopener`、`noreferrer`、`nofollow` 等 |
| `download` | 提示浏览器下载而非导航，值为建议文件名（仅同源资源生效） |

## target="_blank" 的安全问题（高频考点）

新标签页打开的页面可以通过 `window.opener` 拿到原页面引用，将其重定向到钓鱼页（tabnabbing 攻击）。

```html
<a href="https://external.site" target="_blank" rel="noopener noreferrer">外链</a>
```

* `noopener`：切断新页面的 `window.opener`（现代浏览器已对 `_blank` 默认隐含此行为，显式写更稳妥）。
* `noreferrer`：额外不发送 `Referer` 头。
* `nofollow`：告诉搜索引擎不传递权重，常用于 UGC 外链。

## 禁用链接 / 阻止导航的方式

| 方法 | 描述 | 影响 |
|--|--|--|
| **删除 `href` 属性** | 无 `href` 的 `<a>` 是「占位链接」 | 失去链接语义：不可聚焦、无手型光标（注意 `href=""` ≠ 删除，空值指向当前页） |
| **`event.preventDefault()`** | 在 click 事件中阻止默认行为 | 推荐做法，保留键盘可达性 |
| **`href="javascript:void(0)"`** | 执行空表达式 | 老写法，不利于无障碍与 SEO，不推荐 |
| **`href="#"`** | 指向页面顶部锚点 | 点击会滚动到顶部并改变 hash，需配合 preventDefault |
| **CSS `pointer-events: none`** | 禁用所有鼠标事件 | 仍可被键盘 Tab 聚焦后回车触发，需同时加 `tabindex="-1"` |

## 常见考点

* **`<a>` 能嵌套 `<a>` 吗？** 不能，HTML 解析器会强行拆开；交互元素（`<button>`）也不应嵌套在 `<a>` 内。
* **什么时候用 `<a>`、什么时候用 `<button>`？** 导航去别处用 `<a>`（可右键新开、可复制链接）；触发页面内行为用 `<button>`。用 `<a href="#">` 当按钮是反模式。
* **锚点定位的两种方式**：`<a href="#section-id">` 跳转到 `id="section-id"` 的元素；JS 侧用 `element.scrollIntoView({ behavior: 'smooth' })`。

## 拓展阅读

* [MDN - `<a>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)
* [MDN - rel=noopener](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/rel/noopener)
