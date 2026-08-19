# GPU 加速（合成层）

## 核心概念

* 浏览器渲染流水线：`布局（Layout/Reflow）→ 绘制（Paint）→ 合成（Composite）`。
* 某些元素会被提升为独立的`合成层（composite layer）`，由 GPU 负责变换与叠加。落在合成层上的 `transform / opacity` 动画`跳过布局和绘制`，只走合成 —— 这就是「GPU 加速」快的原因。
* 因此动画首选 `transform` 和 `opacity`，避免动画 `width / top / margin` 这类必然触发重排的属性。

## 触发层提升的常用方式

| 方法 | 说明 |
|--|--|
| `transform: translateZ(0)` / `translate3d(0,0,0)` | 经典 hack：3D 变换强制提升为合成层 |
| `will-change: transform` | 标准做法：提示浏览器该属性即将变化，提前建层 |
| CSS 动画 / transition 作用于 transform、opacity | 动画执行期间自动提升 |
| `<video>`、`<canvas>`、`<iframe>` | 天然拥有自己的层 |
| `position: fixed`、`backface-visibility: hidden`、`perspective` | 特定场景下触发 |

```css
.card {
  will-change: transform;          /* 只加在真正要动画的元素上 */
  transition: transform 0.3s ease;
}
.card:hover { transform: translateY(-4px); }
```

## 注意事项（高频追问）

* **层不是越多越好**：每个合成层都占用显存（宽 × 高 × 4 字节），移动端滥用会内存暴涨、反而掉帧。
* **`will-change` 不要写在全局**：长期挂着等于强制常驻图层；动画结束后应移除（或只在 hover/动画前临时加）。
* **隐式层提升（layer explosion）**：一个元素提升后，`z-index` 比它高的兄弟元素可能被连带提升，排查时用 DevTools 的 Layers 面板。
* `z-index` 本身只影响堆叠顺序，不直接创建合成层。

## 常见考点

* **为什么 `transform: translateX(100px)` 比 `left: 100px` 动画流畅？** 前者在合成层上由 GPU 处理、不触发重排重绘，且合成发生在合成线程，主线程卡顿也不影响动画；后者每帧都要重新布局。
* **如何确认元素被提升了？** DevTools → More tools → Layers / Rendering 面板勾选 Layer borders。

## 拓展阅读

* [MDN - will-change](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change)
* [web.dev - Stick to Compositor-Only Properties](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count)
