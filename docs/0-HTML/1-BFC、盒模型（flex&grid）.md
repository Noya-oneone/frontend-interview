# 布局

## 盒模型（标准盒模型 vs IE 盒模型）

* 盒模型由四部分组成：`margin、border、padding、content`。
* 标准盒模型和 IE 盒模型（怪异盒模型）的区别：设置 `width / height` 时`所对应的范围不同`：
  * 标准盒模型：`width / height` 只包含 **content**
  * IE 盒模型：`width / height` 包含 **content + padding + border**
* 通过 `box-sizing` 切换：
  * `box-sizing: content-box` → 标准盒模型（默认值）
  * `box-sizing: border-box` → IE 盒模型（写宽高更符合直觉，组件库普遍全局启用）

## BFC

BFC（Block Formatting Context，块级格式化上下文）是页面中的一个`隔离的独立容器`，`容器内的元素布局不会影响到外部的元素`，反之亦然。BFC 内部遵循以下规则：

* 内部盒子在垂直方向上一个接一个地排列。
* 盒子垂直方向的距离由 margin 决定；`属于同一个 BFC 的两个相邻块级盒子的 margin 会发生重叠`。
* BFC 的区域`不会与浮动元素重叠`。
* 计算 BFC 高度时，`浮动子元素也会被包含在内`（可解决高度塌陷）。

### 如何触发 BFC

```css
/* 根元素 <html> 本身就是一个 BFC */
overflow: hidden | auto | scroll;   /* 即 overflow 非 visible */
float: left | right;                /* 即 float 非 none */
position: absolute | fixed;
display: flow-root;                 /* 专为创建 BFC 而生，无副作用，首选 */
display: inline-block | table-cell | flex | grid;  /* 后两者创建的是 FFC/GFC，效果类似 */
```

### BFC 的作用（高频考点）

* `防止外边距重叠`：相邻块级元素 margin 重叠时，把其中一个放进新的 BFC 即可隔离。
* `清除浮动`：父元素触发 BFC 后会包含浮动子元素，解决高度塌陷。
* `防止内容环绕浮动元素`：给被环绕的元素创建 BFC，实现两栏自适应布局。

```html
<!-- 两栏自适应：左侧浮动定宽，右侧 BFC 自适应 -->
<div class="left">左栏 200px</div>
<div class="right">右栏自适应，不会环绕到左栏下方</div>
<style>
  .left  { float: left; width: 200px; }
  .right { display: flow-root; } /* 或 overflow: hidden */
</style>
```

## 常见布局模式

| 布局 | 描述 | 适用 |
|--|--|--|
| **流式布局（Normal Flow）** | 块级元素垂直排列，行内元素水平排列 | 默认文档流 |
| **浮动布局（Float）** | 元素浮动到容器左/右侧，文本环绕 | 传统多栏布局（现已少用） |
| **定位布局（Position）** | `static / relative / absolute / fixed / sticky` | 精确定位、吸顶、弹层 |
| **弹性布局（Flexbox）** | 主轴 + 交叉轴的一维布局 | 组件内部对齐分布，见 [Flex](./1.1-Flex.md) |
| **网格布局（Grid）** | 行 + 列的二维布局 | 页面整体骨架，见 [Grid](./1.2-Grid.md) |
| **多列布局（Multi-column）** | `column-count / column-width` | 报刊式分栏文本 |
| **响应式布局** | 媒体查询 + 相对单位 | 适配不同屏幕 |

## 经典布局手写题

### 三栏布局（两侧定宽，中间自适应）

现代写法一行 flex 解决：

```html
<div class="container">
  <aside class="left">Left 200px</aside>
  <main>Main 自适应</main>
  <aside class="right">Right 200px</aside>
</div>
<style>
  .container { display: flex; }
  .left, .right { width: 200px; flex-shrink: 0; }
  main { flex: 1; }
</style>
```

### 圣杯布局 / 双飞翼布局（float 时代的经典题）

两者目标相同：三栏、`中间栏在 DOM 中靠前以优先渲染`、两侧定宽中间自适应。区别在「给中间内容让出两侧空间」的手法：

* **圣杯布局**：容器 `padding` 留出两侧宽度，左右栏用 `负 margin + relative 定位` 拉到两侧。
* **双飞翼布局**：中间栏外面`多套一层 wrapper`，由内层的 `margin` 让出空间，不需要 relative 定位。

```html
<!-- 双飞翼：main 在最前 -->
<div class="main-wrap">
  <div class="main">Main</div>
</div>
<div class="left">Left</div>
<div class="right">Right</div>
<style>
  .main-wrap { float: left; width: 100%; }
  .main  { margin: 0 200px; }              /* 内层让出两侧 */
  .left  { float: left; width: 200px; margin-left: -100%; }
  .right { float: left; width: 200px; margin-left: -200px; }
</style>
```

面试口径：说明原理后补一句「现代项目用 flex 的 `order` 或 grid 的 `grid-template-areas` 即可同时满足 DOM 顺序与视觉顺序」。

```css
/* flex 版：main 写在 DOM 第一位，用 order 调整视觉顺序 */
.container { display: flex; }
.main  { flex: 1; order: 2; }
.left  { width: 200px; order: 1; }
.right { width: 200px; order: 3; }
```

### 品字布局

```html
<div class="container">
  <div class="top"></div>
  <div class="bottom">
    <div class="left"></div>
    <div class="right"></div>
  </div>
</div>
<style>
  .container { display: flex; flex-direction: column; align-items: center; }
  .top { width: 60%; height: 100px; background: #ccc; }
  .bottom { display: flex; justify-content: space-between; width: 60%; margin-top: 10px; }
  .left, .right { width: 48%; height: 100px; background: #aaa; }
</style>
```

## 拓展阅读

* [MDN - 块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context)
* [MDN - box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing)
