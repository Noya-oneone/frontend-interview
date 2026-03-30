# IOS 兼容性问题

## 在 ios 中，meta viewport 是无效的，那么你是如何阻止页面缩放的？

```javascript
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

```css
/* CSS 阻止缩放 */
html, body {
    touch-action: manipulation;
    -ms-touch-action: manipulation; /* for IE */
    overscroll-behavior: none; /* 禁止滚动超出边界 */
}
```

```javascript
// 拦截用户的缩放手势
document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
        event.preventDefault(); // 阻止默认的缩放行为
    }
}, { passive: false }); // passive: false 用来确保 preventDefault 能生效


// 禁用 iOS 的双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    let now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
```



## 单位 pt（Points） - iOS

* 用途：pt 是 iOS 平台上的推荐字体单位，它是一种基于物理尺寸的单位（1 pt = 1/72 英寸）。
* 原因：pt 适用于跨设备的字体大小统一。无论设备的屏幕分辨率如何，使用 pt 可以确保字体在不同设备上有一致的物理大小。

## IOS 刘海屏问题

* 需要确保应用的界面元素不会被设备的“刘海”或“下巴”遮挡，同时要充分利用屏幕空间
* 使用 `Safe Area 进行布局`
* 检测设备并动态调整布局
* 使用 `additionalSafeAreaInsets`：在需要时`手动添加安全区域边距`