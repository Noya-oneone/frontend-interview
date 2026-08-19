# 动画（transition & animation）

## transition vs animation（高频考点）

| | transition | animation |
|--|--|--|
| 触发 | `需要状态变化触发`（:hover、类切换） | 可`自动播放`，无需触发 |
| 关键帧 | 只有起点和终点两帧 | `@keyframes` 任意多帧 |
| 循环 | 不能循环 | `infinite` / 指定次数、可交替（alternate） |
| 中途控制 | 不可暂停 | `animation-play-state: paused` 可暂停 |
| 适用 | 简单的交互反馈（hover、展开收起） | 复杂/持续动画（loading、轮播） |

```css
/* transition：状态过渡 */
.btn { transition: transform 0.2s ease, opacity 0.2s; }
.btn:hover { transform: translateY(-2px); }

/* animation：关键帧动画 */
.box { animation: moveBox 2s ease-in-out infinite; }
@keyframes moveBox {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(200px); }
  100% { transform: translateX(0); }
}
```

性能要点：动画尽量只动 `transform` 和 `opacity`（合成层处理，不触发重排重绘，详见 [GPU 加速](./*%20GPU加速.md)）。

## requestAnimationFrame（JS 动画）

浏览器 API，在`下一次重绘之前`执行回调，与屏幕刷新率同步（通常 60Hz，高刷屏更高）。

| 优点 | 描述 |
|--|--|
| **与刷新同步** | 每帧执行一次，不掉帧不撕裂，比 `setTimeout(fn, 16)` 精确 |
| **省资源** | 页面不可见时`自动暂停`，省 CPU/GPU 和电量 |
| **时间戳参数** | 回调收到高精度时间戳，可实现`帧率无关`的动画（按时间算位移，而非按帧数） |

```ts
function animate(duration: number, draw: (progress: number) => void) {
  const start = performance.now();
  requestAnimationFrame(function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    draw(progress);                       // 按进度绘制，帧率无关
    if (progress < 1) requestAnimationFrame(frame);
  });
}
animate(1000, (p) => { box.style.transform = `translateX(${p * 200}px)`; });
```

## 页面切到后台，动画还会继续吗？

| 类型 | 后台行为 |
|--|--|
| `requestAnimationFrame` | `完全暂停`，回前台后继续 |
| `setTimeout / setInterval` | 被`节流`（最低约 1 次/秒，各浏览器策略不同） |
| CSS animation / transition | 停止渲染，但`时间轴继续走`，回前台时直接跳到当前时间点的状态 |
| Web Worker 中的计算 | `不受影响`，继续执行 |

需要精确掌控时监听可见性：

```ts
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // 暂停动画 / 停止计时上报
  } else {
    // 恢复
  }
});
```

## 常见考点

* **rAF 和 setTimeout 做动画的区别？** rAF 跟随刷新率、绘制前执行、后台自动暂停；setTimeout 时机不精确（受事件循环影响）、可能一帧执行多次或跳帧。
* **动画卡顿怎么排查？** 是否动了触发重排的属性（width/top）→ 改 transform；长任务阻塞主线程 → Performance 面板看火焰图；层爆炸 → Layers 面板。
* **CSS 动画结束怎么监听？** `transitionend` / `animationend` 事件（注意会冒泡、被打断时 transitionend 不触发，可配 `transitioncancel`）。
