# 布局

## 文档流

## 盒模型 (标准盒模型、IE盒模型-怪异盒模型-传统模型)
* 盒模型都是由四个部分组成的,分别是margin、border、padding和content
* 标准盒模型和IE盒模型的区别：在于设置width和height时, 所对应的范围不同 

  * 1、标准盒模型的width和height属性的范围只包含了content
  * 2、IE盒模型的width和height属性的范围包含了border、padding和content
  * 可以通过修改元素的box-sizing属性来改变元素的盒模型； 1、box-sizing：content-box表示标准盒模型（默认值） 2、box-sizing：border-box表示IE盒模型（怪异盒模型）

## BFC

BFC 是块级格式化上下文（Block Formatting Context）的缩写，它是页面中的一个`隔离的独立容器`，`容器内的元素布局不会影响到外部的元素`，反之亦然。形成 BFC 的元素会按照特定的规则渲染内部的子元素，具备以下特性：

* 内部盒子在垂直方向上一个接一个地排列。
* 盒子垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻块级盒子的 margin 会发生重叠。
* BFC 的区域不会与浮动元素的 float 重叠。BFC 可以包含浮动元素，也可以用于清除浮动。
* 计算 BFC 高度时，浮动子元素也会被包含在内。这在处理高度塌陷问题时非常有用。
* BFC 是一个独立的容器，内部元素不会影响外部元素。


## BFC 的作用

* `防止外边距重叠`：当相邻块级元素的 margin 出现重叠时，可以通过创建 BFC 来解决这一问题。
* `清除浮动`：当父元素的高度被子元素的浮动影响时，可以通过让父元素创建 BFC 来清除浮动，解决高度塌陷问题。
* `防止内容环绕浮动元素`：创建一个 BFC 可以防止文本或其他块级元素围绕浮动元素排列。

```javascript
  // overflow 属性:
  overflow: hidden;
  overflow: auto;
  overflow: scroll;
  // float 属性:
  float: left;
  float: right;
  // display 属性:
  display: flow-root;
  // position 属性:
  position: absolute;
  position: fixed;
```

| 特性 | 描述| 影响|
|--------|---------|---|
| **流式布局（Normal Flow）** | 元素按照文档流顺序布局，块级元素垂直排列，行内元素水平排列。| 影响默认布局行为。|
| **浮动布局（Float Layout）** | 元素被浮动到容器的左侧或右侧，允许文本和行内元素围绕它。 | 可用于实现多列布局或环绕文本。|
| **定位布局（Position Layout）** | 通过 `position` 属性（static, relative, absolute, fixed, sticky） 控制元素的位置。 | 控制元素的具体位置，适用于各种布局需求。|
| **弹性布局（Flexbox）** | 使用 `display: flex`，按主轴和交叉轴对齐元素。| 简化元素对齐和分布，适用于一维布局。|
| **网格布局（Grid）** | 使用 `display: grid`，在二维网格中定位元素。 | 处理复杂的布局结构，适用于二维布局。|
| **自适应布局（Responsive Design）** | 使用媒体查询和相对单位（如 %）实现适应不同屏幕尺寸的布局。| 实现适应各种设备的网页设计。|


## 布局模式
* 块格式化上下文（Block Formatting Context）
* 弹性布局（Flexbox）
* 网格布局（Grid）
* 多列布局（Multi-column Layout）
* 表格布局（Table Layout）
* 绝对定位布局（Absolute Positioning）
* 固定定位布局（Fixed Positioning）
* 粘性定位布局（Sticky Positioning）
* 双飞燕布局
* 两栏布局
* 三栏布局
* 品字布局
* 圣杯布局
* felxbox 布局
* grid 布局


### 双飞燕布局
```html
<div class="container">
  <aside class="left">Left Sidebar</aside>
  <main>Main Content</main>
  <aside class="right">Right Sidebar</aside>
</div>

```
```css
body {
  margin: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  height: 100vh;
}

main {
  flex: 1;
  background-color: #eaeaea;
  padding: 20px;
}

.left, .right {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
  box-sizing: border-box;
}

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

```


```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top {
  width: 60%;
  height: 100px;
  background-color: #ccc;
}

.bottom {
  display: flex;
  justify-content: space-between;
  width: 60%;
  margin-top: 10px;
}

.left, .right {
  width: 48%;
  height: 100px;
  background-color: #aaa;
}
```

### 圣杯布局

```html
<div class="container">
  <header>Header</header>
  <div class="content">
    <main>Main Content</main>
    <aside class="left">Left Sidebar</aside>
    <aside class="right">Right Sidebar</aside>
  </div>
  <footer>Footer</footer>
</div>

```


```css
body {
  margin: 0;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header, footer {
  background-color: #ccc;
  padding: 10px;
  text-align: center;
}

.content {
  flex: 1;
  display: flex;
  padding: 0 200px; /* 两侧预留侧边栏的宽度 */
  box-sizing: border-box;
}

main {
  flex: 1;
  background-color: #eaeaea;
}

.left {
  width: 200px;
  margin-left: -100%; /* 使左侧栏出现在左边 */
  background-color: #f4f4f4;
  position: relative;
  left: -200px;
}

.right {
  width: 200px;
  margin-right: -100%; /* 使右侧栏出现在右边 */
  background-color: #f4f4f4;
  position: relative;
  right: -200px;
}
```
