# `<!DOCTYPE>`

经典问法：Doctype 的作用是什么？严格模式和混杂模式如何区分、有什么意义？

## 定义

* `<!DOCTYPE>` 是文档类型声明，必须位于 HTML 文档`第一行`，`告诉浏览器以什么标准来解析和渲染页面`。
* HTML5 将其简化为一句：`<!DOCTYPE html>` —— 触发标准模式，不再需要引用 DTD。
* 历史版本需要完整 DTD 引用，例如 HTML 4.01 Strict：
  `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`

## 严格模式与混杂模式

| 特性 | 严格模式（Standards Mode） | 混杂模式（Quirks Mode） |
|--|--|--|
| **触发条件** | 有有效的 `<!DOCTYPE>` 声明 | 缺失或无效的 `<!DOCTYPE>` 声明 |
| **渲染规则** | 按 W3C / WHATWG 标准渲染 | 模拟上古浏览器（IE5 时代）的非标准行为 |
| **典型差异** | 标准盒模型（`content-box`） | 盒模型按 IE 盒模型计算；行内元素、表格布局等也有差异 |
| **意义** | 保证现代网页跨浏览器一致 | 兼容存量旧网页，避免其排版崩坏 |

> 检查当前模式：`document.compatMode` 返回 `"CSS1Compat"`（标准模式）或 `"BackCompat"`（混杂模式）。

## HTML vs XHTML

* HTML 是网页结构与内容的基础标记语言；XHTML 是用 `XML 语法重写的 HTML`，语法更严格。
* XHTML 的强制规则：标签必须闭合、小写、属性必须带值且加引号，解析出错即整页失败（XML 的严格性）。
* 现状：XHTML 已被 HTML5 取代，HTML5 保留了宽松的容错解析，`<!DOCTYPE html>` 对两种语法风格都适用。

## 常见考点

* **不写 DOCTYPE 会怎样？** 浏览器进入混杂模式，盒模型等按旧规则计算，页面可能与预期不一致。
* **DOCTYPE 是 HTML 标签吗？** 不是，它是一条给浏览器的`声明指令`，没有闭合标签、不区分大小写。
