# 动画

## 当我这个页面在后台执行的时候，动画还会继续吗？

`JavaScript 动画`：通常在页面后台时会被暂停或节流，直到页面重新变为前台。
`CSS 动画`：可能会继续运行，但性能和渲染效果可能会受到影响。
`Web Workers`：不会受页面可见性影响，可以在后台线程中继续执行。

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
// 页面在后台，暂停动画
  } else {
// 页面在前台，继续动画
  }
});
```
 
## requestAnimationFrame
* 是一个浏览器提供的 API，
* 用于在浏览器的`下一次重绘之前`执行 JavaScript 代码。它特别适用于`创建平滑的动画效果`

| 优点  | 描述 |
|--|------|
| **平滑的动画效果** | 与浏览器的重绘周期同步，避免动画跳跃和撕裂现象，使动画更平滑和自然。   |
| **节省资源**   | 当页面不在视图中时自动暂停动画，节省 CPU 和 GPU 资源，减少电池消耗。   |
| **自动优化**   | 浏览器自动优化调用频率，以适应设备的刷新率（通常是 60Hz），提供一致的视觉体验。|
| **避免重绘冲突**   | 避免由于多个 `setTimeout` 调用导致的重绘冲突，减少图形伪影和闪烁。|
| **更好的性能** | 在执行时机上更具准确性，提供比 `setTimeout` 或 `setInterval` 更好的动画性能。   |
| **时间戳** | 提供时间戳参数，可用于计算动画持续时间和实现帧速率独立的动画效果。   |

## CSS 动画
```css
    <style>
        .box {
            width: 100px;
            height: 100px;
            background-color: red;
            animation: moveBox 2s infinite;
        }

        @keyframes moveBox {
            0% { transform: translateX(0); }
            50% { transform: translateX(200px); }
            100% { transform: translateX(0); }
        }
    </style>
```