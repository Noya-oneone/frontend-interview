# flex-grow & flex-shrink

## 定义

* `flex-grow`：`放大比例`，默认 **0** —— 有剩余空间也不放大。全部设 1 时等分剩余空间。
* `flex-shrink`：`缩小比例`，默认 **1** —— 空间不足时按比例缩小；设 0 表示`拒绝压缩`。

## 分配算法（面试深入点）

### grow：按比例分剩余空间

```
剩余空间 = 容器主轴尺寸 − Σ(各项目 flex-basis)
某项目增量 = 剩余空间 × 自身 grow / Σ(所有 grow)
```

例：容器 600px，三个项目 basis 各 100px，grow 分别为 `1 : 2 : 1`。剩余 300px → 分得 75 / 150 / 75，最终宽度 `175 / 250 / 175`。

### shrink：按「shrink × basis」加权收缩

收缩不是简单按 shrink 比例，还要`乘以自身基准尺寸加权`（大项目多让一点，避免小项目被压没）：

```
溢出量 = Σ(basis) − 容器尺寸
某项目收缩量 = 溢出量 × (自身 shrink × basis) / Σ(shrink × basis)
```

例：容器 400px，两个项目 basis `200px / 300px`，shrink 都是 1。溢出 100px → 收缩量 = 100×200/500 = 40 和 100×300/500 = 60，最终 `160 / 240`。

## 示例

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
<style>
  .container { display: flex; }
  .item { flex-basis: 100px; height: 100px; background: #f00; color: #fff; }

  .item:nth-child(1) { flex-grow: 1; flex-shrink: 1; }
  .item:nth-child(2) { flex-grow: 2; flex-shrink: 0; } /* 多吃剩余空间，且不许压缩 */
  .item:nth-child(3) { flex-grow: 1; flex-shrink: 1; }
</style>
```

## 常见考点

* **定宽侧栏被挤扁了怎么办？** 加 `flex-shrink: 0`（或直接 `flex: none`），否则默认 shrink:1 参与收缩。
* **grow 设 1 和 0.5 有区别吗？** 只有一个项目时有：grow 总和 < 1 时`只分配对应比例的剩余空间`（0.5 → 只吃掉一半剩余空间）。
* **收缩有下限吗？** 有，收缩到 `min-width`（默认 `auto` ≈ 内容最小宽度）为止 —— 这也是文本溢出省略号要配 `min-width: 0` 的原因。
* 简写与更多属性见 [Flex 布局](../0-HTML/1.1-Flex.md)。
