# Less & SCSS

## 核心概念

两者都是 `CSS 预处理器`：在 CSS 之上扩展变量、嵌套、混入（mixin）、函数等能力，`编译成普通 CSS` 后交给浏览器。SCSS 是 Sass 的花括号语法（另有缩进式的 `.sass` 旧语法），生态与功能比 Less 更强，是当前主流。

## Less vs SCSS 对比

| 维度 | Less | SCSS (Sass) |
|--|--|--|
| 变量符号 | `@primary: #333;` | `$primary: #333;` |
| 实现语言 | JavaScript（可跑在浏览器/Node） | Dart（dart-sass，官方维护） |
| 混入 | `.mixin()` 类名即混入 | `@mixin` / `@include` 显式定义 |
| 逻辑能力 | guard 守卫、递归模拟循环 | `@if / @each / @for / @function` 完整控制流 |
| 模块化 | `@import` | `@use / @forward`（命名空间、私有成员） |
| 典型用户 | Ant Design（4.x 及以前） | Element Plus、Bootstrap（5+） |

## 共同核心能力

```scss
// 变量与嵌套
$primary: #4a6cf7;
.nav {
  background: $primary;
  &:hover { opacity: 0.8; }      // & 引用父选择器
  .item { padding: 8px; }
}

// 混入：可复用的样式块（带参数）
@mixin ellipsis($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
.title { @include ellipsis(2); }
```

## 常见考点

* **预处理器变量 vs CSS 原生变量（`--var`）？** 预处理器变量`编译期`求值、产物中消失；`var(--x)` 是`运行时`的，可被 JS 修改、可随级联作用域变化（做主题切换必须用原生变量）。
* **Sass 和 SCSS 什么关系？** 同一预处理器的两种语法：`.sass` 缩进式（无花括号分号）、`.scss` 花括号式（完全兼容 CSS 语法），现在默认写 SCSS。
* **`@use` 为什么取代 `@import`？** `@import` 全局命名空间易冲突、重复编译；`@use` 一次加载、带命名空间（Sass 官方已废弃 `@import`）。
* **预处理器 vs PostCSS？** 前者是「CSS 之上的新语言」；PostCSS 是 CSS 的 AST 插件管道（autoprefixer、cssnano），两者常同时使用。

## 拓展阅读

* [Sass 官方文档](https://sass-lang.com/documentation/)
* [Less 官方文档](https://lesscss.org/)
